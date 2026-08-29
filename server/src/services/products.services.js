const { prisma } = require("../config/prisma");
const { BadRequestError } = require("../errors");
const { cloudinary } = require("../config/cloudinary");

const categoryProductsService = async (categoryId) => {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });
  return products;
};

const getProductsService = async (page, limit, search, categoryId) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const where = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const products = await prisma.product.findMany({
    skip,
    take,
    where,
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });
  const count = await prisma.product.count({ where });
  const totalPages = Math.ceil(count / take);
  return { products, count, totalPages };
};

const getNewArrivalsService = async () => {
  const newArrivals = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });
  return newArrivals;
};

const addProductService = async (productForm, image) => {
  const base64 = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
  const { secure_url } = await cloudinary.uploader.upload(base64);
  const product = await prisma.product.create({
    data: {
      name: productForm.name,
      inStock: productForm.inStock,
      description: productForm.description,
      image: secure_url,
      price: productForm.price,
      categoryId: productForm.categoryId,
    },
  });
  return product;
};
const editProductService = async (productId, productForm, image) => {
  let product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    throw new BadRequestError("Product does not exist");
  }
  let imageUrl = product.image;
  if (image) {
    const base64 = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64);
    imageUrl = secure_url;
  }
  product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: productForm.name,
      inStock: productForm.inStock,
      description: productForm.description,
      image: imageUrl,
      price: productForm.price,
      categoryId: productForm.categoryId,
    },
  });
  return product;
};
const deleteProductService = async (productId) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    throw new BadRequestError("Product does not exist");
  }
  await prisma.product.delete({
    where: {
      id: productId,
    },
  });
};

module.exports = {
  categoryProductsService,
  getProductsService,
  getNewArrivalsService,
  addProductService,
  editProductService,
  deleteProductService,
};
