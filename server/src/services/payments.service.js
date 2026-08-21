const { prisma } = require("../config/prisma");
const { BadRequestError } = require("../errors/index");

const initializePaymentService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      cart: {
        include: {
          cartItems: {
            include: { product: true },
          },
        },
      },
    },
  });
  const email = user?.email;
  const cartItems = user?.cart?.cartItems;
  if (!cartItems || cartItems.length === 0) {
    throw new BadRequestError("Cart is currently empty");
  }
  const amount = cartItems?.reduce(
    (sum, item) => sum + Number(item?.product?.price) * item.quantity,
    0,
  );

  return { email, amount };
};

const getUserPayments = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      orders: {
        include: {
          payment: true,
        },
      },
    },
  });
  const payments = user?.orders?.map((item) => item.payment);
  return payments;
};

const getSpecificPaymentService = async (paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      order: true,
    },
  });
  return payment;
};

module.exports = {
  initializePaymentService,
  getUserPayments,
  getSpecificPaymentService,
};
