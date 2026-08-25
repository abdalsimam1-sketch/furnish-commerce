const Joi = require("joi");

const updateUserInfoSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  phone: Joi.string().min(10).max(15).trim().optional().allow(null, ""),
  name: Joi.string().min(2).max(50).trim().required(),
});

const resetPasswordSchema = Joi.object({
  oldPassword: Joi.string().optional(),
  newPassword: Joi.string()
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,30}$/,
    )
    .messages({
      "string.pattern.base": "Password is too weak.",
    })
    .trim(),
  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.only": "Passwords do not match.",
    }),
});

module.exports = {
  updateUserInfoSchema,
  resetPasswordSchema,
};
