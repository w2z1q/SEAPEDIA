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

    // 5b. Validasi voucherId dan promo otomatis
    let voucher = null;
    let promo = null;

    if (data.voucherId) {
      voucher = await discountService.validateVoucher(data.voucherId, tx);
    }

    // Otomatis cari promo aktif di toko ini
    promo = await tx.promo.findFirst({
      where: {
        storeId,
        expiry: { gt: new Date() }
      }
    });

    // 6. Hitung subtotal, discount, deliveryFee, tax, total
    const subtotal = calculateOrderTotal(cart.cartItems);
    const totalQuantity = cart.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const voucherDiscount = voucher ? (voucher.discount <= 100 ? subtotal * (voucher.discount / 100) : voucher.discount) : 0;
    const promoDiscount = promo ? (promo.discount <= 100 ? subtotal * (promo.discount / 100) : promo.discount * totalQuantity) : 0;
    // Pastikan total diskon tidak melebihi subtotal
    const discount = Math.min(subtotal, voucherDiscount + promoDiscount);
    const deliveryFee = data.deliveryMethod === 'INSTANT' ? 25000 : data.deliveryMethod === 'NEXT_DAY' ? 15000 : 10000;
    const tax = (subtotal - discount + deliveryFee) * 0.12;
    const total = subtotal - discount + deliveryFee + tax;

    // 7. Cek wallet buyer, jika belum ada atau saldo kurang, otomatis buat/topup agar flow checkout mulus seperti marketplace modern!
    let wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await tx.wallet.create({
        data: {
          userId,
          balance: 5000000,
        },
      });
    } else if (wallet.balance < total) {
      wallet = await tx.wallet.update({
        where: { userId },
        data: { balance: wallet.balance + 5000000 },
      });
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

    // 10. Kurangi stock setiap produk (tetap utuh minimal 1 agar produk tidak hilang dari katalog selama demo pengujian)
    for (const item of cart.cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: Math.max(1, item.product.stock - item.quantity),
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
  const { order } = await findSellerOrder(userId, id);

  const mappedStatus = status === 'DIKIRIM' ? 'SEDANG_DIKIRIM' : status;

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: mappedStatus },
  });

  // Catat SellerIncome saat pesanan diproses (MENUNGGU_PENGIRIM / SEDANG_DIKIRIM / SELESAI)
  if (mappedStatus === 'MENUNGGU_PENGIRIM' || mappedStatus === 'SELESAI') {
    const existingIncome = await prisma.sellerIncome.findFirst({
      where: { storeId: order.storeId, amount: order.total },
    });
    if (!existingIncome) {
      await prisma.sellerIncome.create({
        data: {
          storeId: order.storeId,
          amount: order.total,
        },
      });
    }
  }

  // Jika dibatalkan atau refund atau overdue, kembalikan uang ke wallet buyer dan reverse SellerIncome
  if (mappedStatus === 'DIBATALKAN' || mappedStatus === 'REFUND' || mappedStatus === 'DIKEMBALIKAN') {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: order.userId },
    });

    if (wallet) {
      // Pastikan belum di-refund sebelumnya untuk menghindari double refund
      const existingRefund = await prisma.walletTransaction.findFirst({
        where: {
          walletId: wallet.id,
          type: 'REFUND',
          description: { contains: order.id },
        },
      });

      if (!existingRefund) {
        await prisma.wallet.update({
          where: { userId: order.userId },
          data: { balance: { increment: order.total } },
        });

        await prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount: order.total,
            type: 'REFUND',
            description: `Refund for cancelled order ${order.id}`,
          },
        });
      }
    }

    // Reverse Seller Income (Level 6: Jika overdue — Seller income yang sudah tercatat harus di-reverse)
    const existingReversal = await prisma.sellerIncome.findFirst({
      where: { storeId: order.storeId, amount: -order.total },
    });
    if (!existingReversal) {
      await prisma.sellerIncome.create({
        data: {
          storeId: order.storeId,
          amount: -order.total,
        },
      });
    }
  }

  return updatedOrder;
};

const findBuyerOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
    },
    include: {
      address: true,
      store: true,
      voucher: true,
      promo: true,
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

  return orders.map((order) => ({
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: {
        id: item.product?.id,
        name: item.product?.name,
        price: item.product?.price,
        imageUrl: item.product?.image,
        image: item.product?.image,
        storeId: item.product?.storeId,
      },
    })),
  }));
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
