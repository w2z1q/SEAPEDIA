const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSellerStore = async (sellerId) => {
  const store = await prisma.store.findUnique({
    where: { sellerId },
  });

  if (!store) {
    const error = new Error('Store not found');
    error.status = 404;
    throw error;
  }

  return store;
};

const findOwnedProduct = async (storeId, productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.storeId !== storeId) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  return product;
};

const createProduct = async (sellerId, data) => {
  const store = await getSellerStore(sellerId);

  const product = await prisma.product.create({
    data: {
      ...data,
      storeId: store.id,
    }
  });

  return product;
};

const getMyProducts = async (sellerId) => {
  const store = await getSellerStore(sellerId);

  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' },
  });

  return products;
};

const getProductById = async (sellerId, productId) => {
  const store = await getSellerStore(sellerId);
  const product = await findOwnedProduct(store.id, productId);
  
  return product;
};

const updateProduct = async (sellerId, productId, data) => {
  const store = await getSellerStore(sellerId);
  await findOwnedProduct(store.id, productId);

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data,
  });

  return updatedProduct;
};

const deleteProduct = async (sellerId, productId) => {
  const store = await getSellerStore(sellerId);
  await findOwnedProduct(store.id, productId);

  await prisma.product.delete({
    where: { id: productId },
  });

  return { success: true };
};

module.exports = {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
