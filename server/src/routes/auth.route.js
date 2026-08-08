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
const passport = require("passport");
const { rateLimit } = require("express-rate-limit");

authRouter.post(
  "/login",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
  }),
  login,
);
authRouter.post(
  "/signup",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
  }),
  signup,
);
authRouter.post("/logout", logout);
authRouter.post("/rotate-tokens", rotateTokens);
authRouter.get("/me", authentication, getMe);
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth`,
  }),
  googleLogin,
);
authRouter.post(
  "/forgot-password",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
  }),
  forgotPassword,
);
authRouter.post(
  "/resend-verification-email",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
  }),
  resendVerificationEmail,
);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/reset-password/:token", resetPassword);

module.exports = {
  authRouter,
};
