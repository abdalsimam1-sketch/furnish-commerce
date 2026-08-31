const { prisma } = require("../config/prisma");
const { BadRequestError } = require("../errors");

const getDashboard = async () => {
  const [
    revenue,
    orderCount,
    productCount,
    userCount,
    orderTrend,
    orderByStatus,
    latestOrders,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.$queryRaw`
      select date_trunc('day',"createdAt") as date ,sum(total) as total from "Order"
      where "createdAt">=now()- interval '30 days'
        group by date
        order by date asc
      `,
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenue = revenue?._sum?.total ?? 0;
  const formattedOrderByStatus = orderByStatus.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  return {
    totalRevenue,
    orderCount,
    productCount,
    userCount,
    orderTrend,
    formattedOrderByStatus,
    latestOrders,
  };
};

module.exports = {
  getDashboard,
};
