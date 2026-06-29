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

  // 1. Buat Store menggunakan upsert
  const store = await prisma.store.upsert({
    where: { sellerId: seller.id },
    update: { name: 'SeaFood Store' },
    create: {
      name: 'SeaFood Store',
      sellerId: seller.id,
    },
  });
  console.log('✅ Store ready:', store.name);

  // 2. Buat 10 Produk Seafood
  const products = [
    {
      name: "Ikan Kakap Merah Segar",
      description: "Ikan kakap merah segar tangkapan harian dari perairan Natuna. Daging padat, cocok untuk digoreng, dibakar, atau dibuat sup.",
      price: 85000,
      stock: 50,
      image: "https://images.unsplash.com/photo-1635474434045-f99c366e02ee?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      name: "Udang Windu Segar",
      description: "Udang windu segar ukuran besar dari tambak bersertifikat. Cocok untuk udang bakar, saus tiram, atau campuran pasta.",
      price: 120000,
      stock: 30,
      image: "https://kaltimkita.com/po-content/uploads/aw4.jpg"
    },
    {
      name: "Cumi-cumi Segar",
      description: "Cumi segar hasil tangkapan nelayan lokal. Tekstur kenyal dan rasa gurih alami, cocok untuk cumi bakar kecap atau tumis hitam.",
      price: 75000,
      stock: 40,
      image: "https://media.istockphoto.com/id/2190253251/id/foto/cumi-cumi-segar-di-atas-nampan-es-di-pasar-makanan-laut-segar.jpg?s=612x612&w=0&k=20&c=_f-e4PItLWPZ02UvK7YgMyBApvo9e_1Guhx3B16LRT4="
    },
    {
      name: "Kepiting Bakau",
      description: "Kepiting bakau jantan berukuran besar dengan daging padat. Cocok untuk sajian saus padang atau lada hitam.",
      price: 175000,
      stock: 20,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhmTsOT32Cqa2zXxb0gk3Dd3eBJXW0h5zyao7cyBUCMw&s=10"
    },
    {
      name: "Kerang Hijau",
      description: "Kerang hijau segar yang sudah dibersihkan. Daging lembut dan manis, cocok direbus dengan jahe dan serai.",
      price: 45000,
      stock: 60,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNQEzqxMCA570AY-gcH_cEnIsK_v4WsQ0Zf5BbjWdqlWnb2v6Z1xOQZlA&s=10"
    },
    {
      name: "Ikan Kerapu Segar",
      description: "Ikan kerapu segar kualitas premium. Daging putih lembut dan minim duri, cocok untuk sup atau dikukus ala hongkong.",
      price: 150000,
      stock: 25,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiD6Z41g1PeZIYtQgv8j4TXM7fdmOGoaozs5Xv7BPw6g&s=10"
    },
    {
      name: "Lobster Mutiara",
      description: "Lobster mutiara segar ukuran sedang. Daging manis dan lembut, cocok untuk dibakar dengan mentega bawang putih.",
      price: 350000,
      stock: 15,
      image: "https://thesuburbansoapbox.com/wp-content/uploads/2021/02/How-To-cook-Lobster-6-copy.jpg"
    },
    {
      name: "Ikan Tenggiri Fillet",
      description: "Fillet ikan tenggiri segar tanpa tulang dan kulit. Praktis langsung diolah, cocok untuk pesmol atau digoreng tepung.",
      price: 95000,
      stock: 35,
      image: "https://images.pexels.com/photos/20121102/pexels-photo-20121102.jpeg"
    },
    {
      name: "Udang Vaname",
      description: "Udang vaname segar ukuran medium dari tambak lokal. Rasa manis alami, cocok untuk berbagai masakan tumis dan gorengan.",
      price: 90000,
      stock: 45,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQISw8UjQVoO0_K69a1QPfgumWWpfwrMFDVG2y2YLHqEA&s=10"
    },
    {
      name: "Sotong Segar",
      description: "Sotong segar berukuran sedang hasil tangkapan harian. Cocok untuk sotong goreng tepung, bakar, atau campuran nasi goreng seafood.",
      price: 80000,
      stock: 30,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVz3iaMZ9BPJFY-77NoiYBduaz94_Qr57WnHlYj9oug&s=10"
    }
  ];

  for (const p of products) {
    const exists = await prisma.product.findFirst({
      where: { name: p.name, storeId: store.id },
    });
    if (!exists) {
      await prisma.product.create({
        data: { ...p, storeId: store.id },
      });
    }
  }
  console.log('✅ 10 Seafood products ready in store!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
