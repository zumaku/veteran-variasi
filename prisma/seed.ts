import 'dotenv/config'
import { PrismaClient, Role, ProductType, OrderStatus } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const dbUrl = new URL(process.env.DATABASE_URL || 'mysql://localhost:3306/veteran_variasi')
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Start seeding...')
  
  // 1. Create Users
  console.log('Seeding dummy users...')

  const adminUser = await prisma.user.upsert({
    where: { slug: 'admin-user' },
    update: {},
    create: {
      name: 'Admin Veteran',
      slug: 'admin-user',
      email: 'admin@veteranvariasi.com',
      password_hash: 'hashed_password_placeholder',
      role: Role.ADMIN,
      phone: '081234567890',
    },
  })

  const customerUser = await prisma.user.upsert({
    where: { slug: 'nuaim-mujmir' },
    update: {},
    create: {
      name: 'Nuaim Mujmir',
      slug: 'nuaim-mujmir',
      email: 'nuaim@example.com',
      password_hash: 'hashed_password_placeholder',
      role: Role.CUSTOMER,
      phone: '089876543210',
    },
  })


  // 2. Create Car for Customer
  console.log('Seeding dummy cars...')

  const customerCar = await prisma.car.upsert({
      where: { slug: 'nuaim-civic-2020' },
      update: {},
      create: {
          userId: customerUser.id,
          brand: 'Honda',
          model: 'Civic',
          slug: 'nuaim-civic-2020',
          year: 2020,
          licensePlate: 'B 1234 ABC',
          image: 'https://di-uploads-pod11.dealerinspire.com/hondaofkirkland/uploads/2020/06/2020-Civic-Sedan-LX.jpeg',
        },
    })
    

  // 3. Create Products (Accessories)
  console.log('Seeding dummy products...')

  const servisAc = await prisma.product.upsert({
    where: { slug: 'servis-ac-mobil-flat' },
    update: {},
    create: {
      name: 'Servis Cuci AC Mobil (All Type)',
      slug: 'servis-ac-mobil-flat',
      type: ProductType.SERVICE,
      description: 'Layanan pembersihan dan perawatan AC mobil secara menyeluruh. Harga flat untuk semua jenis mobil.',
      price: 250000,
      stock: null, // Service tidak memiliki stok fisik
      image: 'https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=800&q=80',
    },
  })

  // Aksesoris: Head Unit
  const headUnit = await prisma.product.upsert({
    where: { slug: 'head-unit-android-10-inch' },
    update: {},
    create: {
      name: 'Head Unit Android 10 Inch',
      slug: 'head-unit-android-10-inch',
      type: ProductType.ACCESSORY,
      description: 'Head unit layar sentuh 10 inch berbasis Android. Mendukung Apple CarPlay dan Android Auto.',
      price: 2500000,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=800&q=80',
    },
  })

  // Aksesoris: Kaca Film
  const kacaFilm = await prisma.product.upsert({
    where: { slug: 'kaca-film-3m-black-beauty' },
    update: {},
    create: {
      name: 'Kaca Film 3M Black Beauty (Full Body)',
      slug: 'kaca-film-3m-black-beauty',
      type: ProductType.ACCESSORY,
      description: 'Kaca film original 3M tahan panas UV hingga 99%. Tersedia tingkat kegelapan 40%, 60%, dan 80%.',
      price: 1800000,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=800&q=80',
    },
  })

  // Aksesoris: Karpet Mobil
  const karpetMobil = await prisma.product.upsert({
    where: { slug: 'karpet-mobil-5d-premium' },
    update: {},
    create: {
      name: 'Karpet Mobil 5D Premium',
      slug: 'karpet-mobil-5d-premium',
      type: ProductType.ACCESSORY,
      description: 'Karpet dasar mobil 5D presisi, anti air, mudah dibersihkan, dan membuat kabin lebih kedap suara.',
      price: 850000,
      stock: 35,
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
    },
  })

  // Aksesoris: Lampu LED
  const lampuLed = await prisma.product.upsert({
    where: { slug: 'lampu-led-projie-h4' },
    update: {},
    create: {
      name: 'Lampu LED Projector H4 Super Bright',
      slug: 'lampu-led-projie-h4',
      type: ProductType.ACCESSORY,
      description: 'Lampu utama LED H4 dengan lensa projector mini. Cahaya putih terang dan cut-off rapi.',
      price: 550000,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1601362840468-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
    },
  })

  // Aksesoris: Roof Rack
  const roofRack = await prisma.product.upsert({
    where: { slug: 'roof-rack-cross-bar-universal' },
    update: {},
    create: {
      name: 'Roof Rack Cross Bar Universal',
      slug: 'roof-rack-cross-bar-universal',
      type: ProductType.ACCESSORY,
      description: 'Rak atap mobil berbahan aluminium solid. Cocok untuk membawa barang ekstra saat perjalanan jauh.',
      price: 750000,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1533558701576-23c65e0272fb?auto=format&fit=crop&w=800&q=80',
    },
  })

  // Aksesoris: Cover Jok
  const coverJok = await prisma.product.upsert({
    where: { slug: 'cover-jok-kulit-sintetis' },
    update: {},
    create: {
      name: 'Cover Jok Kulit Sintetis MBtech',
      slug: 'cover-jok-kulit-sintetis',
      type: ProductType.ACCESSORY,
      description: 'Sarung pelindung jok mobil dari bahan kulit sintetis premium MBtech. Tahan air dan anti gores.',
      price: 1500000,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=800&q=80',
    },
  })

  // Aksesoris: Kamera Mundur
  const kameraMundur = await prisma.product.upsert({
    where: { slug: 'kamera-mundur-night-vision' },
    update: {},
    create: {
      name: 'Kamera Mundur Night Vision HD',
      slug: 'kamera-mundur-night-vision',
      type: ProductType.ACCESSORY,
      description: 'Kamera parkir belakang dengan fitur night vision. Tampilan sangat jelas meski di kondisi gelap.',
      price: 250000,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=800&q=80',
    },
  })

  // Aksesoris: Bumper Guard
  const bumperGuard = await prisma.product.upsert({
    where: { slug: 'bumper-guard-depan-sporty' },
    update: {},
    create: {
      name: 'Bumper Guard Depan Sporty',
      slug: 'bumper-guard-depan-sporty',
      type: ProductType.ACCESSORY,
      description: 'Pelindung bumper depan mobil dari benturan ringan. Menambah kesan gagah dan sporty pada kendaraan.',
      price: 600000,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    },
  })

  // Aksesoris: Spoiler
  const spoilerWing = await prisma.product.upsert({
    where: { slug: 'spoiler-wing-belakang-carbon' },
    update: {},
    create: {
      name: 'Spoiler Wing Belakang Motif Carbon',
      slug: 'spoiler-wing-belakang-carbon',
      type: ProductType.ACCESSORY,
      description: 'Sayap belakang mobil dengan lapisan motif carbon fiber. Meningkatkan aerodinamis kendaraan.',
      price: 450000,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1533558701576-23c65e0272fb?auto=format&fit=crop&w=800&q=80',
    },
  })


  // 4. Create Order & Order Items
  console.log('Seeding dummy orders...')

  const order = await prisma.order.upsert({
    where: { orderNumber: 'ORD-20260228-001' },
    update: {},
    create: {
      orderNumber: 'ORD-20260228-001',
      userId: customerUser.id,
      carId: customerCar.id,
      bookingDate: new Date('2026-03-01T00:00:00Z'),
      timeSlot: 1, // 09:00 - 12:00
      totalAmount: 2850000, // Tune Up + Spoiler Carbon
      status: OrderStatus.COMPLETED,
      items: {
        create: [
          {
            productId: servisAc.id,
            quantity: 1,
            priceAtBooking: 350000,
          },
          {
            productId: spoilerWing.id,
            quantity: 1,
            priceAtBooking: 2500000,
          }
        ]
      },
      review: {
        create: {
          rating: 5,
          comment: 'Pelayanan sangat cepat dan memuaskan. Mekanik sangat ahli!',
        }
      }
    },
  })


  // 5. Create Site Settings
  // Using findFirst because Settings shouldn't have multiple rows typically
  console.log('Seeding dummy settings...')

  const existingSetting = await prisma.setting.findFirst()
  if (!existingSetting) {
    await prisma.setting.create({
      data: {
        topProducts: [servisAc.id, headUnit.id, spoilerWing.id], // Array of product ids stored as JSON
        whyChooseUs: [
          {
            title: "Bebas Antre dengan Booking Pasti",
            description: "Pesan jadwal online, langsung dikerjakan tanpa antre."
          },
          {
            title: "Harga Transparan & Pasti",
            description: "Harga tertera sudah termasuk semua biaya pemasangan."
          },
          {
            title: "Variasi & Servis AC Terpadu",
            description: "Pasang aksesoris dan servis AC dalam satu kunjungan."
          }
        ],
        alamat: "Jl. Veteran Selatan No.354, Mamajang Dalam, Kec. Mamajang, Kota Makassar, Sulawesi Selatan 90132",
        jamBuka: "09:00",
        jamTutup: "18:00",
        kontak: "(0411)0871660",
        whatsapp: "6281234567890",
        socialMedia: [
          {
            platform: "instagram",
            url: "https://instagram.com/veteran_variasi"
          },
          {
            platform: "facebook",
            url: "https://facebook.com/veteranvariasi"
          }
        ]
      }
    })
  }

  // 6. Create Faqs
  console.log('Seeding dummy faqs...')

  const faqs = await prisma.faqs.createMany({
    data: [
      {
        question: "Apakah saya perlu antre untuk memesan layanan?",
        answer: "Tidak, Anda hanya perlu memesan jadwal online dan layanan akan langsung dikerjakan tanpa antre."
      },
      {
        question: "Apakah harga sudah termasuk semua biaya pemasangan?",
        answer: "Ya, harga yang tertera sudah termasuk semua biaya pemasangan."
      },
      {
        question: "Apakah saya perlu antre untuk memesan layanan?",
        answer: "Tidak, Anda hanya perlu memesan jadwal online dan layanan akan langsung dikerjakan tanpa antre."
      },
      {
        question: "Apakah harga sudah termasuk semua biaya pemasangan?",
        answer: "Ya, harga yang tertera sudah termasuk semua biaya pemasangan."
      },
      {
        question: "Apakah saya perlu antre untuk memesan layanan?",
        answer: "Tidak, Anda hanya perlu memesan jadwal online dan layanan akan langsung dikerjakan tanpa antre."
      },
      {
        question: "Apakah harga sudah termasuk semua biaya pemasangan?",
        answer: "Ya, harga yang tertera sudah termasuk semua biaya pemasangan."
      },
    ]
  })


  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
