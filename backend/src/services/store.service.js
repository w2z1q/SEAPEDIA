const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createStore = async (sellerId, data) => {
  const { name } = data;

  const existingStore = await prisma.store.findUnique({
    where: { sellerId },
  });

  if (existingStore) {
    const error = new Error('Store already exists for this user');
    error.status = 409;
    throw error;
  }

  const store = await prisma.store.create({
    data: {
      name,
      sellerId,
    },
    select: {
      id: true,
      name: true,
    }
  });

  return store;
};

const getMyStore = async (sellerId) => {
  const store = await prisma.store.findUnique({
    where: { sellerId },
    select: {
      id: true,
      name: true,
    }
  });

  if (!store) {
    const error = new Error('Store not found');
    error.status = 404;
    throw error;
  }

  return store;
};

module.exports = {
  createStore,
  getMyStore,
};
