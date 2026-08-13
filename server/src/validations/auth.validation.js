const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string().required().trim().lowercase().email(),
  password: Joi.string()
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,30}$/,
    )
    .messages({
      "string.pattern.base": "Password is too weak.",
    })
    .trim(),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match.",
  }),
  phone: Joi.string().min(10).max(15).trim(),
  name: Joi.string().required().min(2).max(50).trim(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const passwordSchema = Joi.object({
  password: Joi.string()
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,30}$/,
    )
    .messages({
      "string.pattern.base": "Password is too weak.",
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match.",
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().required().email(),
});

module.exports = {
  signupSchema,
  loginSchema,
  passwordSchema,
  emailSchema,
};
