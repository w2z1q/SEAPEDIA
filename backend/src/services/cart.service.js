const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

const getOrCreateCart = async (userId, tx = prisma) => {
  const cart = await tx.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
  return cart;
};

const findProduct = async (productId, { requiredQty, tx = prisma } = {}) => {
  const product = await tx.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true },
  });

  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  if (product.stock === 0) {
    const error = new Error('Insufficient stock');
    error.status = 400;
    throw error;
  }

  if (requiredQty !== undefined && requiredQty > product.stock) {
    const error = new Error('Insufficient stock');
    error.status = 400;
    throw error;
  }

  return product;
};

const findCartItem = async (userId, cartItemId) => {
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cart: { userId } },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          image: true,
          storeId: true,
        },
      },
    },
  });

  if (!item) {
    const error = new Error('Cart item not found');
    error.status = 404;
    throw error;
  }

  return item;
};

const formatCartItem = (item) => {
  return Object.freeze({
    id: item.id,
    quantity: item.quantity,
    subtotal: item.quantity * item.product.price,
    product: Object.freeze({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.image,
      storeId: item.product.storeId,
    }),
  });
};

const calculateCartSummary = (items) => {
  return items.reduce((acc, item) => {
    acc.totalItems += 1;
    acc.totalQuantity += item.quantity;
    acc.totalPrice += Number(item.subtotal);
    return acc;
  }, { totalItems: 0, totalQuantity: 0, totalPrice: 0 });
};

const addToCart = async (userId, data) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await prisma.$transaction(async (tx) => {
        const cart = await getOrCreateCart(userId, tx);

        const existingItems = await tx.cartItem.findMany({
          where: { cartId: cart.id },
          include: {
            product: {
              select: { storeId: true },
            },
          },
        });

        if (existingItems.length > 0) {
          const firstItemStoreId = existingItems[0].product.storeId;
          const targetProduct = await tx.product.findUnique({
            where: { id: data.productId },
            select: { storeId: true },
          });

          if (targetProduct && firstItemStoreId !== targetProduct.storeId) {
            const error = new Error('Cart already contains products from another store. Please clear your cart first.');
            error.status = 409;
            throw error;
          }
        }

        const existing = await tx.cartItem.findFirst({
          where: { cartId: cart.id, productId: data.productId },
        });

        const totalQty = existing ? existing.quantity + data.quantity : data.quantity;

        await findProduct(data.productId, { requiredQty: totalQty, tx });

        if (existing) {
          const updated = await tx.cartItem.update({
            where: { id: existing.id },
            data: { quantity: totalQty },
            include: {
              product: {
                select: { id: true, name: true, price: true, image: true, storeId: true },
              },
            },
          });
          return { item: formatCartItem(updated), isNew: false };
        } else {
          const created = await tx.cartItem.create({
            data: {
              cartId: cart.id,
              productId: data.productId,
              quantity: data.quantity,
            },
            include: {
              product: {
                select: { id: true, name: true, price: true, image: true, storeId: true },
              },
            },
          });
          return { item: formatCartItem(created), isNew: true };
        }
      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      if (error.code === 'P2034' && attempt < maxRetries - 1) {
        attempt++;
        continue;
      }
      throw error;
    }
  }
};

const getMyCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        orderBy: { updatedAt: 'desc' },
        include: {
          product: {
            select: { id: true, name: true, price: true, image: true, storeId: true },
          },
        },
      },
    },
  });

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return {
      items: [],
      summary: { totalItems: 0, totalQuantity: 0, totalPrice: 0 },
    };
  }

  const items = cart.cartItems.map(formatCartItem);
  const summary = calculateCartSummary(items);

  return { items, summary };
};

const updateCartItem = async (userId, id, quantity) => {
  const existingItem = await findCartItem(userId, id);

  if (quantity > existingItem.product.stock) {
    const error = new Error('Insufficient stock');
    error.status = 400;
    throw error;
  }

  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
    include: {
      product: {
        select: { id: true, name: true, price: true, image: true, storeId: true },
      },
    },
  });

  return formatCartItem(updated);
};

const deleteCartItem = async (userId, id) => {
  await findCartItem(userId, id);

  await prisma.cartItem.delete({
    where: { id },
  });

  return { success: true, message: 'Cart item deleted successfully' };
};

module.exports = {
  getOrCreateCart,
  findProduct,
  findCartItem,
  formatCartItem,
  calculateCartSummary,
  addToCart,
  getMyCart,
  updateCartItem,
  deleteCartItem,
};
