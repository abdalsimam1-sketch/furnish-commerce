const productsRouter = require("express").Router();
const { getCategoryProducts } = require("../controllers/products.controller");

productsRouter.get("/:categoryId", getCategoryProducts);

module.exports = {
  productsRouter,
};
