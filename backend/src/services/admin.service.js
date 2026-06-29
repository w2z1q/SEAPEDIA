const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getStats = async () => {
  const [
    totalUsers,
    totalStores,
    totalProducts,
    totalOrders,
    totalVouchers,
    totalPromos,
    totalDriverJobs,
    orderGroup,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.voucher.count(),
    prisma.promo.count(),
    prisma.driverJob.count(),
    prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
  ]);

  const byStatus = {};
  for (const group of orderGroup) {
    byStatus[group.status] = group._count.status;
  }

  return {
    users: { total: totalUsers },
    stores: { total: totalStores },
    products: { total: totalProducts },
    orders: { total: totalOrders, byStatus },
    vouchers: { total: totalVouchers },
    promos: { total: totalPromos },
    driverJobs: { total: totalDriverJobs },
  };
};

const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      activeRole: true,
      createdAt: true,
      updatedAt: true,
      roles: {
        select: {
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
};

const getStores = async () => {
  const stores = await prisma.store.findMany({
    include: {
      seller: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return stores;
};

const getOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      store: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

const getDriverJobs = async () => {
  const jobs = await prisma.driverJob.findMany({
    include: {
      driver: {
        select: {
          name: true,
          email: true,
        },
      },
      order: {
        include: {
          store: true,
          address: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return jobs;
};

const getProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      store: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return products;
};

const getVouchers = async () => {
  const vouchers = await prisma.voucher.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return vouchers;
};

const getPromos = async () => {
  const promos = await prisma.promo.findMany({
    include: {
      store: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return promos;
};

const getOverdueOrders = async () => {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: ['DIKEMBALIKAN', 'DIBATALKAN', 'REFUND'],
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      store: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

const createVoucher = async (data) => {
  const { code, discount, expiry, usageLimit } = data;

  const existing = await prisma.voucher.findUnique({
    where: { code },
  });

  if (existing) {
    const error = new Error('Voucher code already exists');
    error.status = 400;
    throw error;
  }

  const voucher = await prisma.voucher.create({
    data: {
      code,
      discount: parseFloat(discount),
      expiry: new Date(expiry),
      usageLimit: parseInt(usageLimit, 10),
      usedCount: 0,
    },
  });

  return voucher;
};

const createPromo = async (data) => {
  const { storeId, name, discount, expiry } = data;

  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    const error = new Error('Store not found');
    error.status = 404;
    throw error;
  }

  const promo = await prisma.promo.create({
    data: {
      storeId,
      name,
      discount: parseFloat(discount),
      expiry: new Date(expiry),
    },
  });

  return promo;
};

module.exports = {
  getStats,
  getUsers,
  getStores,
  getOrders,
  getDriverJobs,
  getProducts,
  getVouchers,
  getPromos,
  getOverdueOrders,
  createVoucher,
  createPromo,
};
