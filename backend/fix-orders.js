const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Mencari pesanan dengan total negatif atau diskon tidak wajar...');
  const badOrders = await prisma.order.findMany({
    where: {
      OR: [
        { total: { lt: 0 } },
        { discount: { gt: 1000000 } }
      ]
    },
    include: {
      voucher: true,
      promo: true,
    }
  });

  console.log(`Ditemukan ${badOrders.length} pesanan yang terkena dampak bug...`);

  for (const order of badOrders) {
    const subtotal = order.subtotal;
    const voucher = order.voucher;
    const promo = order.promo;

    const voucherDiscount = voucher ? (voucher.discount <= 100 ? subtotal * (voucher.discount / 100) : voucher.discount) : (order.discount > subtotal ? 20000 : order.discount);
    const promoDiscount = promo ? (promo.discount <= 100 ? subtotal * (promo.discount / 100) : promo.discount) : 0;
    
    const discount = Math.min(subtotal, voucherDiscount + promoDiscount);
    const shippingCost = order.shippingCost;
    const tax = (subtotal - discount + shippingCost) * 0.12;
    const total = subtotal - discount + shippingCost + tax;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        discount,
        tax,
        total,
      }
    });
    console.log(`✅ Pesanan ${order.id} berhasil dikoreksi: Diskon = Rp ${discount}, PPN = Rp ${tax}, Total Baru = Rp ${total}`);
  }
}

main()
  .catch((e) => {
    console.error('Gagal mengoreksi pesanan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
