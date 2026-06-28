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
        create: {
          role: 'ADMIN',
        },
      },
    },
  });

  console.log('✅ Admin user ready:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
