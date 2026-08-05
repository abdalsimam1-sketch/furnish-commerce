const authRouter = require("express").Router();
const {
  signup,
  login,
  logout,
  roatateTokens,
  getMe,
  googleLogin,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth.controller");

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/logout", logout);
authRouter.post("/rotate-tokens", roatateTokens);
authRouter.get("/me", getMe);
authRouter.post("/google-login", googleLogin);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/resend-verification-email", resendVerificationEmail);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/reset-password/:token", resetPassword);

module.exports = {
  authRouter,
};
