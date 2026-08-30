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

const updateAvatar = async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new BadRequestError("No image file provided");
  }
  const userId = req.user.id;

  const user = await usersServices.updateAvatarService(userId, file);
  res.status(200).json({
    success: true,
    message: "User image updated",
    data: {
      user,
    },
  });
};

const getUsers = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const { users, count, totalPages } = await usersServices.getUsersService(
    page,
    limit,
    search,
  );
  res.status(200).json({
    success: true,
    message: "Users found",
    data: {
      users,
      count,
      totalPages,
    },
  });
};
module.exports = {
  updateAvatar,
  updateUserInfo,
  resetPassword,
  getUsers,
};
