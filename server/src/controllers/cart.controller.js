const cartServices = require("../services/cart.service");

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

const addToCart = async (req, res) => {};
const increaseItem = async (req, res) => {};
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
