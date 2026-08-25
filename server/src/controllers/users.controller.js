const { BadRequestError } = require("../errors");
const usersServices = require("../services/users.service");
const {
  updateUserInfoSchema,
  resetPasswordSchema,
} = require("../validations/users.validation");

const updateUserInfo = async (req, res) => {
  const userId = req.user.id;
  const { value, error } = updateUserInfoSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  const user = await usersServices.updateUserInfoService(userId, value);
  res.status(200).json({
    success: true,
    message: "User info updated",
    data: {
      user,
    },
  });
};
const resetPassword = async (req, res) => {
  const userId = req.user.id;
  const { value, error } = resetPasswordSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  const user = await usersServices.resetPasswordService(userId, value);
  res.status(200).json({
    success: true,
    message: "User info updated",
    data: {
      user,
    },
  });
};
const updateAvatar = async (req, res) => {};

module.exports = {
  updateAvatar,
  updateUserInfo,
  resetPassword,
};
