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

module.exports = {
  categoryProductsService,
};
