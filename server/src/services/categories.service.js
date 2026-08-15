const { prisma } = require("../config/prisma");

const categoryService = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

module.exports = {
  categoryService,
};
