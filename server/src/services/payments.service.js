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

module.exports = {
  initializePaymentService,
};
