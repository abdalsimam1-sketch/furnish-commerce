const Joi = require("joi");

const addNewCategorySchema = Joi.object({
  name: Joi.string().trim().lowercase().required().min(3).max(30),
});

module.exports = {
  addNewCategorySchema,
};
