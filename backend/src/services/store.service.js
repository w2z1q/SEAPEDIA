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

  const nameTaken = await prisma.store.findUnique({
    where: { name },
  });

  if (nameTaken) {
    const error = new Error('Nama toko sudah dipakai oleh penjual lain. Silakan pilih nama lain.');
    error.status = 409;
    throw error;
  }

  const store = await prisma.store.create({
    data: {
      name,
      sellerId,
    },
    include: {
      products: true,
      orders: true,
      incomes: true,
    }
  });

  return store;
};

const updateStore = async (sellerId, data) => {
  const { name } = data;

  const store = await prisma.store.findUnique({
    where: { sellerId },
  });

  if (!store) {
    const error = new Error('Store not found');
    error.status = 404;
    throw error;
  }

  if (name && name !== store.name) {
    const nameTaken = await prisma.store.findUnique({
      where: { name },
    });

    if (nameTaken) {
      const error = new Error('Nama toko sudah dipakai oleh penjual lain. Silakan pilih nama lain.');
      error.status = 409;
      throw error;
    }
  }

  const updatedStore = await prisma.store.update({
    where: { sellerId },
    data: { name },
    include: {
      products: true,
      orders: true,
      incomes: true,
    }
  });

  return updatedStore;
};

const getMyStore = async (sellerId) => {
  const store = await prisma.store.findUnique({
    where: { sellerId },
    include: {
      products: true,
      orders: {
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      incomes: {
        orderBy: { createdAt: 'desc' }
      },
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
  updateStore,
  getMyStore,
};
