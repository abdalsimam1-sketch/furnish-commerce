const { categoryService } = require("../services/categories.service");

const getCategories = async (req, res) => {
  const categories = await categoryService();
  res.status(200).json({
    success: true,
    message: "Categories found",
    data: { categories },
  });
};

module.exports = {
  getCategories,
};
