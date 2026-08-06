const authRouter = require("express").Router();
const {
  signup,
  login,
  logout,
  rotateTokens,
  getMe,
  googleLogin,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth.controller");

const { authentication } = require("../middleware/authentication");

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/logout", logout);
authRouter.post("/rotate-tokens", rotateTokens);
authRouter.get("/me", authentication, getMe);
authRouter.post("/google-login", googleLogin);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/resend-verification-email", resendVerificationEmail);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/reset-password/:token", resetPassword);

module.exports = {
  authRouter,
};
