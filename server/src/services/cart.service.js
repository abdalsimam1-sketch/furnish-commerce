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

const addToCartService = async (userId, productId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      cart: {
        include: {
          cartItems: true,
        },
      },
    },
  });
  let cart = user.cart;
  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerId: userId },
      include: { cartItems: true },
    });
  }
  const existingItem = cart.cartItems.find(
    (item) => item.productId === productId,
  );
  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: existingItem.quantity + 1,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        productId,
        cartId: cart.id,
        quantity: 1,
      },
    });
  }

  return await getCartService(userId);
};
module.exports = {
  getCartService,
  addToCartService,
};
