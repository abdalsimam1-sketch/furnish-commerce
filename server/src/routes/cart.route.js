const cartRouter = require("express").Router();
const { authentication } = require("../middleware/authentication");
const cartController = require("../controllers/cart.controller");

cartRouter.use(authentication);

//get cart
cartRouter.get("/", cartController.getCart);
//checkout
cartRouter.post("/checkout", cartController.checkout);
//add to cart
cartRouter.post("/add-to-cart/:productId", cartController.addToCart);
//increase
cartRouter.post("/increase/:productId", cartController.increaseItem);
//decrease
cartRouter.post("/decrease/:productId", cartController.decreaseItem);
//remove from cart
cartRouter.delete("/remove/:productId", cartController.removeFromCart);
//clear cart
cartRouter.delete("/clear-cart", cartController.clearCart);

module.exports = {
  cartRouter,
};
