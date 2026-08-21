const Joi = require("joi");

const checkoutSchema = Joi.object({
  firstName: Joi.string().min(3).max(20).required(),
  lastName: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  streetAddress: Joi.string().min(5).required(),
  phone: Joi.string()
    .pattern(/^(\+234|0)[789][01]\d{8}$/)
    .required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
});

module.exports = { checkoutSchema };
