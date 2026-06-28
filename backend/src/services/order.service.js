const { PrismaClient } = require('@prisma/client');
const discountService = require('./discount.service');

const prisma = new PrismaClient();

const getCartWithItems = async (userId, tx = prisma) => {
  const cart = await tx.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    const error = new Error('Cart is empty');
    error.status = 400;
    throw error;
  }

  return cart;
};

const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.quantity * item.product.price);
  }, 0);
};

const checkout = async (userId, data = {}) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Ambil cart beserta item & 2. Validasi cart tidak kosong
    const cart = await getCartWithItems(userId, tx);

    // 3. Validasi seluruh stock mencukupi
    for (const item of cart.cartItems) {
      if (item.quantity > item.product.stock) {
        const error = new Error(`Insufficient stock for product: ${item.product.name}`);
        error.status = 400;
        throw error;
      }
    }

    // 4. Sistem akan menggunakan alamat default milik user agar proses checkout dapat berjalan sesuai skema database
    let address = await tx.address.findFirst({
      where: { userId },
    });

    if (!address) {
      address = await tx.address.create({
        data: {
          userId,
          address: 'Alamat Utama',
          city: 'Jakarta',
          zipCode: '10000',
        },
      });
    }

    // 5. Ambil storeId dari produk pertama
    const storeId = cart.cartItems[0].product.storeId;

    // 5b. Validasi voucherId dan promoId jika ada
    let voucher = null;
    let promo = null;

    if (data.voucherId) {
      voucher = await discountService.validateVoucher(data.voucherId, tx);
    }

    if (data.promoId) {
      promo = await discountService.validatePromo(data.promoId, storeId, tx);
    }

    // 6. Hitung subtotal, discount, deliveryFee, tax, total
    const subtotal = calculateOrderTotal(cart.cartItems);
    const discountPercent = (voucher ? voucher.discount : 0) + (promo ? promo.discount : 0);
    const discount = subtotal * (discountPercent / 100);
    const deliveryFee = data.deliveryMethod === 'INSTANT' ? 25000 : data.deliveryMethod === 'NEXT_DAY' ? 15000 : 10000;
    const tax = (subtotal - discount + deliveryFee) * 0.12;
    const total = subtotal - discount + deliveryFee + tax;

    // 7. Cek wallet buyer cukup -> throw 400 Insufficient wallet balance kalau kurang
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance < total) {
      const error = new Error('Insufficient wallet balance');
      error.status = 400;
      throw error;
    }

    // 8. Buat Order & 9. Buat seluruh OrderItem
    const order = await tx.order.create({
      data: {
        userId,
        storeId,
        addressId: address.id,
        voucherId: voucher ? voucher.id : null,
        promoId: promo ? promo.id : null,
        deliveryMethod: data.deliveryMethod || 'REGULAR',
        status: 'SEDANG_DIKEMAS',
        subtotal,
        shippingCost: deliveryFee,
        tax,
        discount,
        total,
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                storeId: true,
              },
            },
          },
        },
      },
    });

    // 10. Kurangi stock setiap produk
    for (const item of cart.cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: item.product.stock - item.quantity,
        },
      });
    }

    // 11. Kurangi wallet buyer + catat WalletTransaction type PAYMENT + increment usedCount voucher
    await tx.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: total,
        },
      },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: total,
        type: 'PAYMENT',
        description: `Payment for order ${order.id}`,
      },
    });

    if (voucher) {
      await tx.voucher.update({
        where: { id: voucher.id },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
    }

    // 12. Hapus seluruh CartItem
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // 13. Return Order beserta OrderItems
    // Menyesuaikan format image -> imageUrl pada relasi product di orderItems agar konsisten
    const formattedOrder = {
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.image,
          storeId: item.product.storeId,
        },
      })),
    };

    return formattedOrder;
  });
};

const findSellerOrder = async (userId, orderId) => {
  const store = await prisma.store.findUnique({
    where: { sellerId: userId },
  });

  if (!store) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      storeId: store.id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  return { order, store };
};

const getSellerOrders = async (userId) => {
  const store = await prisma.store.findUnique({
    where: { sellerId: userId },
  });

  if (!store) {
    return [];
  }

  const orders = await prisma.order.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    customer: order.user ? order.user.name : 'Guest',
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
  }));
};

const updateOrderStatus = async (userId, id, status) => {
  await findSellerOrder(userId, id);

  const mappedStatus = status === 'DIKIRIM' ? 'SEDANG_DIKIRIM' : status;

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: mappedStatus },
  });

  return updatedOrder;
};

const findBuyerOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              storeId: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  return order;
};

const getMyOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
    },
  });

  return orders;
};

const getOrderDetail = async (userId, orderId) => {
  const order = await findBuyerOrder(userId, orderId);

  const formattedOrder = {
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.image,
        storeId: item.product.storeId,
      },
    })),
  };

  return formattedOrder;
};

module.exports = {
  getCartWithItems,
  calculateOrderTotal,
  checkout,
  findSellerOrder,
  getSellerOrders,
  updateOrderStatus,
  findBuyerOrder,
  getMyOrders,
  getOrderDetail,
};
