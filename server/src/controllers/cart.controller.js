const cartServices = require("../services/cart.service");
const { BadRequestError } = require("../errors/index");

const getCart = async (req, res) => {
  const userId = req.user.id;
  const cart = await cartServices.getCartService(userId);
  res.status(200).json({
    success: true,
    message: "Cart found",
    data: {
      cart,
    },
  });
};

const checkout = async (req, res) => {};

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { quantity = 1 } = req.body;
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new BadRequestError("Invalid quantity");
  }
  const cart = await cartServices.addToCartService(userId, productId, quantity);
  res.status(200).json({
    success: true,
    message: "Item added successfully",
    data: {
      cart,
    },
  });
};
const increaseItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const cart = await cartServices.increaseItemService(userId, productId);
  res.status(200).json({
    success: true,
    message: "Item incrmeneted succesfully",
    data: {
      cart,
    },
  });
};
const decreaseItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const cart = await cartServices.decreaseItemService(userId, productId);
  res.status(200).json({
    success: true,
    message: "Item decrmeneted succesfully",
    data: {
      cart,
    },
  });
};
const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const cart = await cartServices.removeItemService(userId, productId);
  res.status(200).json({
    success: true,
    message: "Item removed succesfully",
    data: {
      cart,
    },
  });
};
const clearCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await cartServices.clearCartService(userId);
  res.status(200).json({
    success: true,
    message: "Cart cleared",
    data: {
      cart,
    },
  });
};

module.exports = {
  getCart,
  checkout,
  addToCart,
  decreaseItem,
  increaseItem,
  removeFromCart,
  clearCart,
};
