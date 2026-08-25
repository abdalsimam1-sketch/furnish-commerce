const usersRouter = require("express").Router();
const userController = require("../controllers/users.controller");
const { authentication } = require("../middleware/authentication");
const rateLimit = require("express-rate-limit");

usersRouter.use(authentication);
usersRouter.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.user.id,
    message: "Too many update attempts, please try again later.",
  }),
);

usersRouter.patch("/update-user-info", userController.updateUserInfo);
usersRouter.patch("/reset-password", userController.resetPassword);
usersRouter.post("/update-avatar", userController.updateAvatar);

module.exports = {
  usersRouter,
};
