const { prisma } = require("../config/prisma");
const { ConflictError } = require("../errors");
const { cloudinary } = require("../config/cloudinary");

const getCategoriesService = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

const addNewCategoryService = async (categoryName, categoryImage) => {
  let category = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });
  if (category) {
    throw new ConflictError("Category already exists");
  }
  const base64 = `data:${categoryImage.mimetype};base64,${categoryImage.buffer.toString("base64")}`;
  const { secure_url } = await cloudinary.uploader.upload(base64);
  category = await prisma.category.create({
    data: {
      image: secure_url,
      name: categoryName,
    },
  });
  return category;
};

module.exports = {
  getCategoriesService,
  addNewCategoryService,
};
