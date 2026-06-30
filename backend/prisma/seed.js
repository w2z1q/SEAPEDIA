const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Clear existing products and stores to prevent duplicates
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.store.deleteMany({});
  
  const adminEmail = 'admin@seapedia.com';
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      name: 'Super Admin',
      password: hashedPassword,
      activeRole: 'ADMIN',
      roles: { create: [{ role: 'ADMIN' }] },
    },
  });

  const driver = await prisma.user.upsert({
    where: { email: 'driver@seapedia.com' },
    update: { password: hashedPassword },
    create: {
      email: 'driver@seapedia.com',
      name: 'Driver',
      password: hashedPassword,
      activeRole: 'DRIVER',
      roles: { create: [{ role: 'DRIVER' }] }
    }
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@seapedia.com' },
    update: { password: hashedPassword },
    create: {
      email: 'buyer@seapedia.com',
      name: 'Buyer',
      password: hashedPassword,
      activeRole: 'BUYER',
      roles: { create: [{ role: 'BUYER' }] }
    }
  });

  // --- Main Seller (Toko Seller - Beauty) ---
  const seller = await prisma.user.upsert({
    where: { email: 'seller@seapedia.com' },
    update: { password: hashedPassword },
    create: {
      email: 'seller@seapedia.com',
      name: 'Seller Utama',
      password: hashedPassword,
      activeRole: 'SELLER',
      roles: { create: [{ role: 'SELLER' }] }
    }
  });
  
  const storeSeller = await prisma.store.create({
    data: { name: 'Seapedia Beauty', sellerId: seller.id },
  });

  const beautyProducts = [
    { name: "Sabun Cuci Muka Facial Wash", description: "Membersihkan kotoran dan minyak berlebih, cocok semua jenis kulit", price: 35000, stock: 100 },
    { name: "Serum Vitamin C", description: "Mencerahkan kulit dan membantu meratakan warna kulit", price: 65000, stock: 100 },
    { name: "Masker Wajah Sheet Mask", description: "Melembapkan kulit, sekali pakai, berbagai varian", price: 8000, stock: 100 },
    { name: "Lip Tint Cair", description: "Warna tahan lama, tekstur ringan tidak lengket", price: 45000, stock: 100 },
    { name: "Sunscreen SPF 50", description: "Melindungi kulit dari sinar UV, tekstur ringan tidak lengket", price: 55000, stock: 100 },
    { name: "Bedak Tabur Compact Powder", description: "Hasil akhir matte, menyamarkan pori-pori", price: 60000, stock: 100 },
    { name: "Maskara Waterproof", description: "Membuat bulu mata lentik tahan lama, tidak mudah luntur", price: 50000, stock: 100 },
    { name: "Hand & Body Lotion", description: "Melembapkan kulit, aroma lembut, cepat menyerap", price: 32000, stock: 100 },
    { name: "Eyeliner Pen Tahan Air", description: "Ujung presisi, warna pekat, tahan lama", price: 28000, stock: 100 },
    { name: "Sampo Anti Ketombe", description: "Membersihkan kulit kepala, membuat rambut lembut", price: 38000, stock: 100 },
  ];
  await prisma.product.createMany({ data: beautyProducts.map(p => ({ ...p, storeId: storeSeller.id })) });

  // --- Toko 1: Elektronik Jaya ---
  const seller1 = await prisma.user.upsert({
    where: { email: 'toko1@seapedia.com' },
    update: { password: hashedPassword },
    create: { email: 'toko1@seapedia.com', name: 'Elektronik Jaya', password: hashedPassword, activeRole: 'SELLER', roles: { create: [{ role: 'SELLER' }] } }
  });
  const store1 = await prisma.store.create({ data: { name: 'Elektronik Jaya', sellerId: seller1.id } });
  const products1 = [
    { name: "Mouse Wireless", description: "Sensor presisi, baterai tahan lama, desain ergonomis", price: 75000, stock: 50 },
    { name: "Keyboard Mekanikal", description: "Switch responsif, lampu LED RGB, build kokoh", price: 350000, stock: 50 },
    { name: "Speaker Bluetooth Mini", description: "Suara jernih, portable, baterai 10 jam", price: 120000, stock: 50 },
    { name: "Charger Fast Charging 25W", description: "Kompatibel banyak device, kabel terpisah dijual", price: 89000, stock: 50 },
    { name: "Earphone Kabel", description: "Suara jernih, mic built-in, nyaman di telinga", price: 45000, stock: 50 },
    { name: "Webcam HD", description: "Resolusi 1080p, cocok untuk meeting online", price: 199000, stock: 50 },
    { name: "Hub USB Type-C", description: "5 port, mendukung transfer data cepat", price: 110000, stock: 50 },
    { name: "Stand Laptop Aluminium", description: "Mengurangi panas laptop, bisa dilipat", price: 95000, stock: 50 },
    { name: "Mousepad Gaming", description: "Permukaan halus, ukuran XL, anti slip", price: 35000, stock: 50 },
    { name: "Lampu Meja LED", description: "3 mode cahaya, hemat energi, dimmable", price: 130000, stock: 50 },
  ];
  await prisma.product.createMany({ data: products1.map(p => ({ ...p, storeId: store1.id })) });

  // --- Toko 2: Fashion Hub ---
  const seller2 = await prisma.user.upsert({
    where: { email: 'toko2@seapedia.com' },
    update: { password: hashedPassword },
    create: { email: 'toko2@seapedia.com', name: 'Fashion Hub', password: hashedPassword, activeRole: 'SELLER', roles: { create: [{ role: 'SELLER' }] } }
  });
  const store2 = await prisma.store.create({ data: { name: 'Fashion Hub', sellerId: seller2.id } });
  const products2 = [
    { name: "Kaos Polos Cotton Combed", description: "Bahan adem, nyaman dipakai sehari-hari", price: 55000, stock: 50 },
    { name: "Celana Jeans Slim Fit", description: "Bahan stretch, nyaman dan tidak mudah pudar", price: 175000, stock: 50 },
    { name: "Jaket Hoodie Unisex", description: "Bahan fleece tebal, hangat, cocok untuk cuaca dingin", price: 160000, stock: 50 },
    { name: "Topi Baseball Cap", description: "Bahan kanvas, ukuran adjustable", price: 40000, stock: 50 },
    { name: "Sandal Jepit Karet", description: "Ringan, anti slip, tahan air", price: 25000, stock: 50 },
    { name: "Ikat Pinggang Kulit", description: "Bahan kulit asli, gesper stainless", price: 85000, stock: 50 },
    { name: "Kaos Kaki Pack 3", description: "Bahan katun, menyerap keringat", price: 30000, stock: 50 },
    { name: "Dompet Lipat Pria", description: "Banyak slot kartu, bahan kulit sintetis", price: 65000, stock: 50 },
    { name: "Syal Rajut", description: "Hangat, motif polos, cocok segala outfit", price: 50000, stock: 50 },
    { name: "Sarung Tangan Rajut", description: "Elastis, menjaga tangan tetap hangat", price: 28000, stock: 50 },
  ];
  await prisma.product.createMany({ data: products2.map(p => ({ ...p, storeId: store2.id })) });

  // --- Toko 3: Rumah & Dapur ---
  const seller3 = await prisma.user.upsert({
    where: { email: 'toko3@seapedia.com' },
    update: { password: hashedPassword },
    create: { email: 'toko3@seapedia.com', name: 'Rumah & Dapur', password: hashedPassword, activeRole: 'SELLER', roles: { create: [{ role: 'SELLER' }] } }
  });
  const store3 = await prisma.store.create({ data: { name: 'Rumah & Dapur', sellerId: seller3.id } });
  const products3 = [
    { name: "Panci Set Anti Lengket", description: "3 ukuran, mudah dibersihkan, awet", price: 250000, stock: 50 },
    { name: "Toples Kedap Udara Set", description: "Menjaga makanan tetap segar, bahan plastik food grade", price: 75000, stock: 50 },
    { name: "Talenan Kayu", description: "Bahan kayu solid, tahan lama, anti bau", price: 45000, stock: 50 },
    { name: "Rak Penyimpanan Serbaguna", description: "Bisa dibongkar pasang, muat banyak barang", price: 150000, stock: 50 },
    { name: "Pisau Dapur Set", description: "Stainless steel, tajam dan tahan karat", price: 95000, stock: 50 },
    { name: "Gelas Kaca Set 6pcs", description: "Desain simpel, cocok untuk sehari-hari", price: 60000, stock: 50 },
    { name: "Keranjang Laundry Lipat", description: "Hemat tempat, bahan kain kuat", price: 55000, stock: 50 },
    { name: "Termos Air Panas", description: "Kapasitas 1.5L, menjaga suhu lama", price: 110000, stock: 50 },
    { name: "Sapu & Pengki Set", description: "Bahan plastik kuat, gagang panjang", price: 40000, stock: 50 },
    { name: "Tempat Sampah Pedal", description: "Kapasitas 10L, tutup otomatis", price: 85000, stock: 50 },
  ];
  await prisma.product.createMany({ data: products3.map(p => ({ ...p, storeId: store3.id })) });

  // --- Toko 4: FitZone Sports ---
  const seller4 = await prisma.user.upsert({
    where: { email: 'toko4@seapedia.com' },
    update: { password: hashedPassword },
    create: { email: 'toko4@seapedia.com', name: 'FitZone Sports', password: hashedPassword, activeRole: 'SELLER', roles: { create: [{ role: 'SELLER' }] } }
  });
  const store4 = await prisma.store.create({ data: { name: 'FitZone Sports', sellerId: seller4.id } });
  const products4 = [
    { name: "Matras Yoga", description: "Anti slip, tebal 6mm, mudah digulung", price: 95000, stock: 50 },
    { name: "Botol Minum Olahraga", description: "Bahan BPA free, kapasitas 750ml", price: 45000, stock: 50 },
    { name: "Dumbbell Set 2kg", description: "Bahan vinyl, cocok untuk latihan rumahan", price: 130000, stock: 50 },
    { name: "Tas Olahraga Gym", description: "Muat banyak, ada kompartemen sepatu", price: 110000, stock: 50 },
    { name: "Resistance Band Set", description: "5 level tahanan, cocok untuk latihan otot", price: 65000, stock: 50 },
    { name: "Sepeda Lipat Mini", description: "Roda 16 inci, mudah disimpan", price: 1250000, stock: 50 },
    { name: "Raket Badminton", description: "Frame ringan, cocok pemula hingga menengah", price: 175000, stock: 50 },
    { name: "Jump Rope Skipping", description: "Tali tahan lama, gagang anti slip", price: 25000, stock: 50 },
    { name: "Sarung Tangan Gym", description: "Melindungi tangan, bahan breathable", price: 35000, stock: 50 },
    { name: "Sepatu Lari Pria", description: "Sol empuk, ringan, cocok untuk lari jarak jauh", price: 245000, stock: 50 },
  ];
  await prisma.product.createMany({ data: products4.map(p => ({ ...p, storeId: store4.id })) });

  console.log('✅ Seeding completed! Database is packed with products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
