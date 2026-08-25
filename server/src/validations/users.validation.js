const Joi = require("joi");

const updateUserInfoSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  phone: Joi.string().min(10).max(15).trim().required(),
  name: Joi.string().min(2).max(50).trim().required(),
});

module.exports = {
  updateUserInfoSchema,
};
