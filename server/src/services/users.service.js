const { prisma } = require("../config/prisma");
const { BadRequestError } = require("../errors");
const bcrypt = require("bcryptjs");
const { hashPassword } = require("../utils/hashPassword");
const { cloudinary } = require("../config/cloudinary");

const updateUserInfoService = async (userId, userForm) => {
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new BadRequestError("User does not exist");
  }
  user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
    },
    select: {
      name: true,
      email: true,
      phone: true,
    },
  });
  return user;
};

const resetPasswordService = async (userId, passwordForm) => {
  let user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });
  if (!user) {
    throw new BadRequestError("User does not exist");
  }
  const comparePasswords = await bcrypt.compare(
    passwordForm.oldPassword,
    user.password,
  );
  const hash = await hashPassword(passwordForm.newPassword);

  if (!comparePasswords) {
    throw new BadRequestError("Wrong old password");
  }

  user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hash,
    },
    select: {
      id: true,
      email: true,
      role: true,
      phone: true,
      name: true,
    },
  });
  return user;
};

const updateAvatarService = async (userId, file) => {
  let user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new BadRequestError("User does not exist");
  }
  const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const { secure_url } = await cloudinary.uploader.upload(base64);
  user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      image: secure_url,
    },
    select: {
      image: true,
    },
  });
  return user;
};

module.exports = {
  updateUserInfoService,
  resetPasswordService,
  updateAvatarService,
};
