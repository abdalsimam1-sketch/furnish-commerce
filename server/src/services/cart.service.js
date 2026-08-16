const { prisma } = require("../config/prisma");

const getCartService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cart: {
        include: {
          cartItems: true,
        },
      },
    },
  });
  return user.cart?.cartItems ?? [];
};
module.exports = {
  getCartService,
};
