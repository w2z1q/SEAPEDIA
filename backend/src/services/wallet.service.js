const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getOrCreateWallet = async (userId, tx = prisma) => {
  const wallet = await tx.wallet.upsert({
    where: { userId },
    create: {
      userId,
      balance: 0,
    },
    update: {},
  });
  return wallet;
};

const getWallet = async (userId) => {
  await getOrCreateWallet(userId);

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return wallet;
};

const topUp = async (userId, amount) => {
  return await prisma.$transaction(async (tx) => {
    const wallet = await getOrCreateWallet(userId, tx);

    const updatedWallet = await tx.wallet.update({
      where: { userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    const transaction = await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'TOPUP',
        description: 'Top up saldo wallet',
      },
    });

    return {
      wallet: updatedWallet,
      transaction,
    };
  });
};

module.exports = {
  getOrCreateWallet,
  getWallet,
  topUp,
};
