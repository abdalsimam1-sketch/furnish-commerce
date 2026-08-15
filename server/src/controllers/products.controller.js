const { BadRequestError } = require("../errors");
const { categoryProductsService } = require("../services/products.services");

const getCategoryProducts = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    throw new BadRequestError("Category ID is required");
  }
  const products = await categoryProductsService(categoryId);
  res.status(200).json({
    success: true,
    message: "Products found",
    data: {
      products,
    },
  });
};

module.exports = {
  getCategoryProducts,
};
