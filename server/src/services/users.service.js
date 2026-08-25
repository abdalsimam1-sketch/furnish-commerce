const { prisma } = require("../config/prisma");
const { BadRequestError } = require("../errors");

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

module.exports = {
  updateUserInfoService,
};
