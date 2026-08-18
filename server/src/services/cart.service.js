const { prisma } = require("../config/prisma");
const { BadRequestError } = require("../errors");

const getCartService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cart: {
        include: {
          cartItems: {
            include: { product: true },
            orderBy: { createdAt: "asc" },
          },
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

const removeItemService = async (userId, productId) => {
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
  const cartItems = user.cart?.cartItems;
  const existingItem = cartItems?.find((item) => item.productId === productId);
  if (!existingItem) {
    throw new BadRequestError("Item doesnt exist in the cart");
  }
  await prisma.cartItem.delete({
    where: {
      id: existingItem.id,
    },
  });
  return await getCartService(userId);
};

const decreaseItemService = async (userId, productId) => {
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
  const cartItems = user.cart?.cartItems;
  const existingItem = cartItems?.find((item) => item.productId === productId);
  if (!existingItem) {
    throw new BadRequestError("Item doesnt exist in the cart");
  }
  if (existingItem.quantity === 1) {
    await removeItemService(userId, productId);
  } else {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: existingItem.quantity - 1,
      },
    });
  }
  return await getCartService(userId);
};

const clearCartService = async (userId) => {
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
  if (!user.cart) {
    throw new BadRequestError("Cart is empty already");
  }
  await prisma.cartItem.deleteMany({
    where: {
      cartId: user.cart?.id,
    },
  });
  return await getCartService(userId);
};

module.exports = {
  getCartService,
  addToCartService,
  increaseItemService,
  removeItemService,
  decreaseItemService,
  clearCartService,
};
