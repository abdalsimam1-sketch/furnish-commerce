const { prisma } = require("../config/prisma");

const getOrdersService = async (page, limit, search, status) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const where = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    include: {
      orderItems: true,
    },
    skip,
    take,
    where,
  });
  const count = await prisma.order.count({ where });
  const totalPages = Math.ceil(count / take);
  return { orders, count, totalPages };
};

module.exports = {
  getOrdersService,
};
