const { BadRequestError } = require("../errors");
const categoryServices = require("../services/categories.service");
const {
  addNewCategorySchema,
} = require("../validations/categories.validation");

const getCategories = async (req, res) => {
  const categories = await categoryServices.getCategoriesService();
  res.status(200).json({
    success: true,
    message: "Categories found",
    data: { categories },
  });
};
const addNewCategory = async (req, res) => {
  const categoryImage = req.file;
  const { error, value } = addNewCategorySchema.validate(req.body);
  if (!categoryImage) {
    throw new BadRequestError("Category Image is required");
  }
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  const category = await categoryServices.addNewCategoryService(
    value.name,
    categoryImage,
  );
  res.status(200).json({
    success: true,
    message: "Category added successfully",
    data: { category },
  });
};

module.exports = {
  getCategories,
  addNewCategory,
};
