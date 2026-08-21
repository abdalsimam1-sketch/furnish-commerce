const paymentServices = require("../services/payments.service");
const axios = require("axios");
const { checkoutSchema } = require("../validations/payment.validation");
const { BadRequestError, ForbiddenError } = require("../errors");
const { createOrderService } = require("../services/orders.service");
const crypto = require("crypto");

const initializePayment = async (req, res) => {
  const userId = req.user.id;
  const { error, value } = checkoutSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const { email, amount } =
    await paymentServices.initializePaymentService(userId);
  const url = "https://api.paystack.co/transaction/initialize";
  const response = await axios.post(
    url,
    {
      email,
      amount: amount * 100,
      metadata: { ...value, userId },
    },
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    },
  );
  res.status(200).json({
    success: true,
    message: "Payment initialized",
    data: {
      authorization_url: response.data.data.authorization_url,
    },
  });
};
const webhook = async (req, res) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.body)
    .digest("hex");

  const signature = req.headers["x-paystack-signature"];
  if (hash !== signature) {
    throw new BadRequestError();
  }
  req.body = JSON.parse(req.body.toString());
  if (req.body.event !== "charge.success") {
    throw new BadRequestError();
  }
  const userId = req.body.data.metadata.userId;
  const checkoutData = req.body.data.metadata;
  await createOrderService(userId, checkoutData);
  res.status(200).json({
    success: true,
    message: "Order created successfully",
    data: {},
  });
};
const getSpecificPayment = async (req, res) => {
  const { paymentId } = req.params;
  const { id, role } = req.user;
  const payment = await paymentServices.getSpecificPaymentService(paymentId);
  if (role !== "admin") {
    if (payment.order.customerId !== id) {
      throw new ForbiddenError();
    }
  }
  res.status(200).json({
    success: true,
    message: "Payment found",
    data: { payment },
  });
};
const getPayments = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const { count, totalPages, payments } =
    await paymentServices.getPaymentsService(page, limit, search);
  res.status(200).json({
    success: true,
    message: "Payments found",
    data: { count, totalPages, payments, page, limit },
  });
};

const getUserPayments = async (req, res) => {
  const userId = req.user.id;
  const payments = await paymentServices.getUserPayments(userId);
  res.status(200).json({
    success: true,
    message: "Payments found",
    data: {
      payments,
    },
  });
};
module.exports = {
  initializePayment,
  webhook,
  getSpecificPayment,
  getPayments,
  getUserPayments,
};
