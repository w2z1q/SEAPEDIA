const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@seapedia.com';
  const hashedPassword = await bcrypt.hash('AdminSecure123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Super Admin Seapedia',
      password: hashedPassword,
      activeRole: 'ADMIN',
      roles: {
        create: [
          { role: 'ADMIN' },
        ],
      },
    },
  });
  console.log('✅ Admin user ready:', admin.email);

  const seller = await prisma.user.upsert({
    where: { email: 'seller@seapedia.com' },
    update: {},
    create: {
      email: 'seller@seapedia.com',
      name: 'Seller Seapedia',
      password: await bcrypt.hash('SellerSecure123!', 10),
      activeRole: 'SELLER',
      roles: { create: [{ role: 'SELLER' }] }
    }
  });
  console.log('✅ Seller user ready:', seller.email);

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@seapedia.com' },
    update: {},
    create: {
      email: 'buyer@seapedia.com',
      name: 'Buyer Seapedia',
      password: await bcrypt.hash('BuyerSecure123!', 10),
      activeRole: 'BUYER',
      roles: { create: [{ role: 'BUYER' }] }
    }
  });
  console.log('✅ Buyer user ready:', buyer.email);

  const driver = await prisma.user.upsert({
    where: { email: 'driver@seapedia.com' },
    update: {},
    create: {
      email: 'driver@seapedia.com',
      name: 'Driver Seapedia',
      password: await bcrypt.hash('DriverSecure123!', 10),
      activeRole: 'DRIVER',
      roles: { create: [{ role: 'DRIVER' }] }
    }
  });
  console.log('✅ Driver user ready:', driver.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
