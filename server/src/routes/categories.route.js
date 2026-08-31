const categoriesRouter = require("express").Router();
const categoriesController = require("../controllers/categories.controller");
const { authentication } = require("../middleware/authentication");
const { authorization } = require("../middleware/authorization");
const { fileUpload } = require("../middleware/fileUpload");

categoriesRouter.get("/", categoriesController.getCategories);
categoriesRouter.post(
  "/",
  authentication,
  authorization("admin"),
  fileUpload.single("categoryImage"),
  categoriesController.addNewCategory,
);

module.exports = {
  categoriesRouter,
};
