import prisma from '../src/lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const userPasswordHash = await bcrypt.hash('User@123456', 10);

  // 1. Upsert Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const johnUser = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPasswordHash,
      role: 'USER',
    },
  });

  const janeUser = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPasswordHash,
      role: 'USER',
    },
  });

  console.log('✅ Users seeded');

  // 2. Upsert Categories
  const electronicsCat = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics' },
  });

  const fashionCat = await prisma.category.upsert({
    where: { name: 'Fashion & Apparel' },
    update: {},
    create: { name: 'Fashion & Apparel' },
  });

  const homeCat = await prisma.category.upsert({
    where: { name: 'Home & Living' },
    update: {},
    create: { name: 'Home & Living' },
  });

  const booksCat = await prisma.category.upsert({
    where: { name: 'Books & Stationery' },
    update: {},
    create: { name: 'Books & Stationery' },
  });

  console.log('✅ Categories seeded');

  // 3. Create Products if not exist
  const existingProducts = await prisma.product.findMany();
  let headphones, keyboard, chair, tshirt, book;

  if (existingProducts.length === 0) {
    headphones = await prisma.product.create({
      data: {
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Premium over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.',
        price: 199.99,
        stock: 50,
        status: 'ACTIVE',
        categoryId: electronicsCat.id,
      },
    });

    keyboard = await prisma.product.create({
      data: {
        name: 'Mechanical RGB Gaming Keyboard',
        description: 'Hot-swappable mechanical keyboard with custom RGB backlighting and tactile brown switches.',
        price: 129.50,
        stock: 30,
        status: 'ACTIVE',
        categoryId: electronicsCat.id,
      },
    });

    chair = await prisma.product.create({
      data: {
        name: 'Ergonomic Mesh Work Chair',
        description: 'High-back ergonomic desk chair with lumbar support and adjustable armrests.',
        price: 299.00,
        stock: 15,
        status: 'ACTIVE',
        categoryId: homeCat.id,
      },
    });

    tshirt = await prisma.product.create({
      data: {
        name: 'Organic Cotton Crewneck T-Shirt',
        description: 'Ultra-soft, 100% organic cotton breathable unisex t-shirt.',
        price: 29.99,
        stock: 100,
        status: 'ACTIVE',
        categoryId: fashionCat.id,
      },
    });

    book = await prisma.product.create({
      data: {
        name: 'Clean Code & System Architecture',
        description: 'A handbook of agile software craftsmanship and modern backend design principles.',
        price: 45.00,
        stock: 25,
        status: 'ACTIVE',
        categoryId: booksCat.id,
      },
    });

    console.log('✅ Products seeded');
  } else {
    headphones = existingProducts.find(p => p.name.includes('Headphones')) || existingProducts[0]!;
    keyboard = existingProducts.find(p => p.name.includes('Keyboard')) || existingProducts[1] || existingProducts[0]!;
  }

  // 4. Create Orders if not exist
  const existingOrders = await prisma.order.findMany();
  if (existingOrders.length === 0 && headphones && keyboard) {
    await prisma.order.create({
      data: {
        userId: johnUser.id,
        productId: headphones.id,
        quantity: 1,
        totalPrice: headphones.price * 1,
        status: 'COMPLETED',
      },
    });

    await prisma.order.create({
      data: {
        userId: janeUser.id,
        productId: keyboard.id,
        quantity: 2,
        totalPrice: keyboard.price * 2,
        status: 'CONFIRMED',
      },
    });

    console.log('✅ Orders seeded');
  }

  // 5. Create Reviews if not exist
  const existingReviews = await prisma.review.findMany();
  if (existingReviews.length === 0 && headphones && keyboard) {
    await prisma.review.create({
      data: {
        userId: johnUser.id,
        productId: headphones.id,
        rating: 5,
        comment: 'Outstanding sound clarity and exceptional noise isolation. Best headphones I have owned!',
      },
    });

    await prisma.review.create({
      data: {
        userId: janeUser.id,
        productId: keyboard.id,
        rating: 4,
        comment: 'Great typing feedback and solid build quality. RGB lighting is customizable and vibrant.',
      },
    });

    console.log('✅ Reviews seeded');
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
