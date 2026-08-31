const dashboardServices = require("../services/dashboard.service");

const getDashboard = async (req, res) => {
  const {
    totalRevenue,
    orderCount,
    productCount,
    userCount,
    orderTrend,
    formattedOrderByStatus,
    latestOrders,
  } = await dashboardServices.getDashboard();

  res.status(200).json({
    success: true,
    message: "Dashboard found",
    data: {
      totalRevenue,
      orderCount,
      productCount,
      userCount,
      orderTrend,
      formattedOrderByStatus,
      latestOrders,
    },
  });
};

module.exports = {
  getDashboard,
};
