const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const processOverdueOrder = async (orderId) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status !== 'SEDANG_DIKIRIM') {
      throw new Error(`Order ${orderId} is not in SEDANG_DIKIRIM status`);
    }

    // 1. Update status order -> DIKEMBALIKAN
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: 'DIKEMBALIKAN' },
    });

    // 2. Refund ke wallet buyer + catat WalletTransaction type REFUND
    const wallet = await tx.wallet.findUnique({
      where: { userId: order.userId },
    });

    if (wallet) {
      await tx.wallet.update({
        where: { userId: order.userId },
        data: {
          balance: {
            increment: order.total,
          },
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: order.total,
          type: 'REFUND',
          description: `Auto refund for overdue order ${order.id}`,
        },
      });
    }

    // 3. Restore stock setiap produk
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    // 3b. Reverse Seller Income (Level 6: Jika overdue — Seller income yang sudah tercatat harus di-reverse)
    const existingReversal = await tx.sellerIncome.findFirst({
      where: { storeId: order.storeId, amount: -order.total },
    });
    if (!existingReversal) {
      await tx.sellerIncome.create({
        data: {
          storeId: order.storeId,
          amount: -order.total,
        },
      });
    }

    // 4. Return hasil
    return updatedOrder;
  });
};

const checkOverdueOrders = async (simulatedDays = 0) => {
  // Ambil semua order dengan status SEDANG_DIKIRIM
  const activeOrders = await prisma.order.findMany({
    where: {
      status: 'SEDANG_DIKIRIM',
    },
    include: {
      orderItems: true,
    },
  });

  const processedOrders = [];
  const now = Date.now() + (simulatedDays * 24 * 60 * 60 * 1000);

  for (const order of activeOrders) {
    // SLA Rules: INSTANT -> 1 hari, NEXT_DAY -> 2 hari, REGULAR -> 3 hari
    const slaDays = order.deliveryMethod === 'INSTANT' ? 1 : order.deliveryMethod === 'NEXT_DAY' ? 2 : 3;
    const slaLimit = new Date(order.createdAt).getTime() + (slaDays * 24 * 60 * 60 * 1000);

    if (now > slaLimit) {
      try {
        const result = await processOverdueOrder(order.id);
        processedOrders.push(result);
      } catch (error) {
        console.error(`Error processing overdue order ${order.id}:`, error);
      }
    }
  }

  return {
    totalProcessed: processedOrders.length,
    simulatedDays,
    processedOrders,
  };
};

module.exports = {
  checkOverdueOrders,
  processOverdueOrder,
};
