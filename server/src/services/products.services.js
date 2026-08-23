const { prisma } = require("../config/prisma");

const categoryProductsService = async (categoryId) => {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });
  return products;
};

const getProductsService = async (page, limit, search, categoryId) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const where = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const products = await prisma.product.findMany({ skip, take, where });
  const count = await prisma.product.count({ where });
  const totalPages = Math.ceil(count / take);
  return { products, count, totalPages };
};

const getNewArrivalsService = async () => {
  const newArrivals = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });
  return newArrivals;
};

module.exports = {
  categoryProductsService,
  getProductsService,
  getNewArrivalsService,
};
