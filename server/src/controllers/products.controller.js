const { BadRequestError } = require("../errors");
const productsService = require("../services/products.services");
const { addProductSchema } = require("../validations/products.validation");

const getCategoryProducts = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    throw new BadRequestError("Category ID is required");
  }
  const products = await productsService.categoryProductsService(categoryId);
  res.status(200).json({
    success: true,
    message: "Products found",
    data: {
      products,
    },
  });
};
const getProducts = async (req, res) => {
  const { page = 1, limit = 9, categoryId, search } = req.query;
  const { count, products, totalPages } =
    await productsService.getProductsService(page, limit, search, categoryId);

  res.status(200).json({
    success: true,
    message: "Products found",
    data: {
      count,
      totalPages,
      products,
      page,
      limit,
    },
  });
};
const getNewArrivals = async (req, res) => {
  const newArrivals = await productsService.getNewArrivalsService();
  res.status(200).json({
    success: true,
    message: "Products found",
    data: {
      newArrivals,
    },
  });
};
const addProduct = async (req, res) => {
  const { error, value } = addProductSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  const product = await productsService.addProductService(value);
  res.status(201).json({
    success: true,
    message: "Product added successfully",
    data: {
      product,
    },
  });
};
const editProduct = async () => {};
const deleteProduct = async () => {};
module.exports = {
  getCategoryProducts,
  getProducts,
  getNewArrivals,
  addProduct,
  editProduct,
  deleteProduct,
};
