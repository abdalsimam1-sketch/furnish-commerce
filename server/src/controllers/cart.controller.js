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
const decreaseItem = async (req, res) => {};
const removeFromCart = async (req, res) => {};
const clearCart = async (req, res) => {};

module.exports = {
  getCart,
  checkout,
  addToCart,
  decreaseItem,
  increaseItem,
  removeFromCart,
  clearCart,
};
