const { BadRequestError } = require("../errors");
const productsService = require("../services/products.services");

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
const getNewArrivals = async (req, res) => {};

module.exports = {
  getCategoryProducts,
  getProducts,
  getNewArrivals,
};
