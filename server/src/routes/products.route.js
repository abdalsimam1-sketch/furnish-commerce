const productsRouter = require("express").Router();
const productsController = require("../controllers/products.controller");
const { authentication } = require("../middleware/authentication");
const { authorization } = require("../middleware/authorization");

const { fileUpload } = require("../middleware/fileUpload");

productsRouter.get("/", productsController.getProducts);
productsRouter.post(
  "/add-product",
  authentication,
  authorization("admin"),
  fileUpload.single("productImage"),
  productsController.addProduct,
);
productsRouter.get("/new-arrivals", productsController.getNewArrivals);
productsRouter.patch(
  "/edit-product/:productId",
  authentication,
  authorization("admin"),
  fileUpload.single("productImage"),
  productsController.editProduct,
);
productsRouter.delete(
  "/delete-product/:productId",
  authentication,
  authorization("admin"),
  productsController.deleteProduct,
);
productsRouter.get("/:categoryId", productsController.getCategoryProducts);

module.exports = {
  productsRouter,
};
