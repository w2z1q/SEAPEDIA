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

const getAllProducts = async (filters) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 12;
  const skip = (page - 1) * limit;

  // Search filter if provided
  const where = {};

  if (filters.search) {
    where.name = {
      contains: filters.search,
      mode: 'insensitive'
    };
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getProductDetail = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      store: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  return product;
};

module.exports = {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductDetail,
};
