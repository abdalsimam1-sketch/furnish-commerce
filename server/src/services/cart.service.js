const { prisma } = require("../config/prisma");
const { BadRequestError } = require("../errors");

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

const addToCartService = async (userId, productId, quantity) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      inStock: true,
    },
  });
  if (!product || product.inStock < quantity) {
    throw new BadRequestError("Not enough stock available");
  }
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
      data: {
        customerId: userId,
      },
      include: { cartItems: true },
    });
  }
  const existingCartItem = cart.cartItems.find(
    (item) => item.productId === productId,
  );
  if (existingCartItem) {
    if (existingCartItem.quantity + quantity > product.inStock) {
      throw new BadRequestError("Not enough stock available");
    }
    await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: existingCartItem.quantity + quantity,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        productId,
        quantity,
        cartId: cart.id,
      },
    });
  }
  return await getCartService(userId);
};

const increaseItemService = async (userId, productId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      cart: {
        include: { cartItems: true },
      },
    },
  });
  const cartItems = user.cart?.cartItems;
  const exsitingItem = cartItems?.find((item) => item.productId === productId);
  if (!exsitingItem) {
    throw new BadRequestError("Item doesnt exist in cart");
  }
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      inStock: true,
    },
  });
  if (exsitingItem.quantity + 1 > product.inStock) {
    throw new BadRequestError("Not enough stock available");
  }
  await prisma.cartItem.update({
    where: {
      id: exsitingItem.id,
    },
    data: {
      quantity: exsitingItem.quantity + 1,
    },
  });

  return await getCartService(userId);
};

module.exports = {
  getCartService,
  addToCartService,
  increaseItemService,
};
