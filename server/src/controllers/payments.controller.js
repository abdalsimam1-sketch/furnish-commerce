const paymentServices = require("../services/payments.service");
const axios = require("axios");
const { checkoutSchema } = require("../validations/payment.validation");
const { BadRequestError } = require("../errors");
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
  const userId = req.body.data.metadata.userId;
  const checkoutData = req.body.data.metadata;

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  const signature = req.headers["x-paystack-signature"];
  if (hash !== signature) {
    throw new BadRequestError();
  }
  if (req.body.event !== "charge.success") {
    throw new BadRequestError();
  }
  await createOrderService(userId, checkoutData);
  res.status(200).json({
    success: true,
    message: "Order created successfully",
    data: {},
  });
};
const getSpecificPayment = async (req, res) => {};
const getPayments = async (req, res) => {};
const getUserPayments = async (req, res) => {};
module.exports = {
  initializePayment,
  webhook,
  getSpecificPayment,
  getPayments,
  getUserPayments,
};
