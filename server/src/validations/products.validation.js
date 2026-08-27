const Joi = require("joi");

const addProductSchema = Joi.object({
  name: Joi.string().required(),
  inStock: Joi.number().min(0).required(),
  description: Joi.string().required(),
  image: Joi.string().uri().required(),
  price: Joi.number().positive().precision(2).required(),
  categoryId: Joi.string().required(),
});

module.exports = {
  addProductSchema,
};
