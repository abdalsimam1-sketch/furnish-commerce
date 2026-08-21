const { ForbiddenError } = require("../errors");
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

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await orderServices.updateOrderStatusService(orderId, status);
  res.status(200).json({
    success: true,
    message: "Order status updated",
    data: {
      order,
    },
  });
};
const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  const orders = await orderServices.getUsersOrderService(userId);
  res.status(200).json({
    success: true,
    message: "Orders found",
    data: {
      orders,
    },
  });
};
const cancelOrder = async (req, res) => {};
const getSpecificOrder = async (req, res) => {
  const { orderId } = req.params;
  const { id, role } = req.user;

  const order = await orderServices.getSpecificOrderService(orderId);
  if (role !== "admin") {
    if (order.customerId !== id) {
      throw new ForbiddenError(
        "You are not allowed access to another user's data",
      );
    }
  }
  res.status(200).json({
    success: true,
    message: "Order found",
    data: {
      order,
    },
  });
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  getUserOrders,
  cancelOrder,
  getSpecificOrder,
};
