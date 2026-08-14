const { prisma } = require("../src/config/prisma");
const { categories } = require("./seeds/categories.seed");
const { products } = require("./seeds/products.seed");

const seed = async () => {
  const categoryMap = {};
  for (const category of categories) {
    const created = await prisma.category.create({
      data: category,
    });
    categoryMap[created.name] = created.id;
  }

  for (const product of products) {
    const { category, ...rest } = product;
    await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoryMap[category],
      },
    });
  }
};

const run = async () => {
  try {
    await seed();
    console.log("Seeding complete.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
};

run();
