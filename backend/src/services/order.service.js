const { PrismaClient } = require('@prisma/client');

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

const checkout = async (userId) => {
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

    // 6. Hitung subtotal dan total
    const subtotal = calculateOrderTotal(cart.cartItems);

    // 7. Buat Order & 8. Buat seluruh OrderItem
    const order = await tx.order.create({
      data: {
        userId,
        storeId,
        addressId: address.id,
        status: 'SEDANG_DIKEMAS',
        subtotal,
        shippingCost: 0,
        tax: 0,
        discount: 0,
        total: subtotal,
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

    // 9. Kurangi stock setiap produk
    for (const item of cart.cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: item.product.stock - item.quantity,
        },
      });
    }

    // 10. Hapus seluruh CartItem
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // 11. Return Order beserta OrderItems
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

module.exports = {
  getCartWithItems,
  calculateOrderTotal,
  checkout,
};
