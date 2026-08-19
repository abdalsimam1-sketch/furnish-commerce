const orderServices = require("../services/orders.service");

const getOrders = async (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;
  const { orders, count, totalPages } = await orderServices.getOrdersService(
    page,
    limit,
    search,
    status,
  );
  res.status(200).json({
    success: true,
    message: "Orders found",
    data: {
      page,
      limit,
      orders,
      count,
      totalPages,
    },
  });
};
const createOrder = async (req, res) => {};
const updateOrderStatus = async (req, res) => {};
const getUserOrders = async (req, res) => {};
const cancelOrder = async (req, res) => {};
const getSpecificOrder = async (req, res) => {};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  getUserOrders,
  cancelOrder,
  getSpecificOrder,
};
