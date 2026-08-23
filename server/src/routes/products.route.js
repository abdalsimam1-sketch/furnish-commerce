const productsRouter = require("express").Router();
const productsController = require("../controllers/products.controller");

productsRouter.get("/", productsController.getProducts);
productsRouter.get("/new-arrivals", productsController.getNewArrivals);
productsRouter.get("/:categoryId", productsController.getCategoryProducts);

module.exports = {
  productsRouter,
};
