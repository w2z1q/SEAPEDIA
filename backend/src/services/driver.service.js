const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAvailableJobs = async () => {
  const jobs = await prisma.order.findMany({
    where: {
      status: 'MENUNGGU_PENGIRIM',
      driverJob: null,
    },
    include: {
      store: true,
      address: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return jobs;
};

const getMyJobs = async (driverId) => {
  const jobs = await prisma.driverJob.findMany({
    where: { driverId },
    include: {
      order: {
        include: {
          store: true,
          address: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return jobs;
};

const takeJob = async (driverId, orderId) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { driverJob: true },
    });

    if (!order) {
      const error = new Error('Order not found');
      error.status = 404;
      throw error;
    }

    if (order.status !== 'MENUNGGU_PENGIRIM') {
      const error = new Error('Order is not waiting for a driver');
      error.status = 400;
      throw error;
    }

    if (order.driverJob) {
      const error = new Error('Job has already been taken by another driver');
      error.status = 400;
      throw error;
    }

    const driverJob = await tx.driverJob.create({
      data: {
        orderId,
        driverId,
      },
    });

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: 'SEDANG_DIKIRIM' },
    });

    return { driverJob, order: updatedOrder };
  });
};

const completeJob = async (driverId, jobId) => {
  return await prisma.$transaction(async (tx) => {
    const job = await tx.driverJob.findUnique({
      where: { id: jobId },
      include: { order: true },
    });

    if (!job) {
      const error = new Error('Job not found');
      error.status = 404;
      throw error;
    }

    if (job.driverId !== driverId) {
      const error = new Error('Unauthorized to complete this job');
      error.status = 403;
      throw error;
    }

    if (job.order.status === 'SELESAI') {
      const error = new Error('Job is already completed');
      error.status = 400;
      throw error;
    }

    const updatedOrder = await tx.order.update({
      where: { id: job.orderId },
      data: { status: 'SELESAI' },
    });

    const earning = await tx.driverEarning.create({
      data: {
        driverId,
        orderId: job.orderId,
        amount: job.order.shippingCost,
      },
    });

    return { job, order: updatedOrder, earning };
  });
};

const getMyEarnings = async (driverId) => {
  const earnings = await prisma.driverEarning.findMany({
    where: { driverId },
    include: {
      order: {
        select: {
          id: true,
          shippingCost: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = earnings.reduce((sum, e) => sum + e.amount, 0);

  return { total, history: earnings };
};

module.exports = {
  getAvailableJobs,
  getMyJobs,
  takeJob,
  completeJob,
  getMyEarnings,
};
