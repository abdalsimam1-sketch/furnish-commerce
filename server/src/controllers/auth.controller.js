const {
  BadRequestError,
  ConflictError,
  UnauthenticatedError,
} = require("../errors");
const bcrypt = require("bcryptjs");
const { prisma } = require("../config/prisma");
const jwt = require("jsonwebtoken");

const { signupSchema, loginSchema } = require("../validations/auth.validation");
const { hashPassword } = require("../utils/hashPassword");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const { generateCryptoToken } = require("../utils/generateCryptoToken");
const { generateCookieTokens } = require("../utils/generateCookieTokens");
const { cookieOptions } = require("../utils/cookieOptions");

const signup = async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  let user = await prisma.user.findFirst({
    where: {
      OR: [{ email: value.email }, { phone: value.phone }],
    },
  });
  if (user) {
    throw new ConflictError("User already exists");
  }
  const hashedPassword = await hashPassword(value.password);
  const { cryptoToken, cryptoTokenHash } = generateCryptoToken();
  user = await prisma.user.create({
    data: {
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: hashedPassword,
      verificationTokenHash: cryptoTokenHash,
      verificationTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
    },
  });

  try {
    await sendVerificationEmail(user.email, cryptoToken);
  } catch (emailError) {
    console.log("Email error: ", emailError);
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user,
    },
  });
};

const login = async (req, res) => {
  const { value, error } = loginSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  let user = await prisma.user.findUnique({
    where: {
      email: value.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      isVerified: true,
      role: true,
      password: true,
    },
  });
  if (!user) {
    throw new UnauthenticatedError("Invalid email or password");
  }
  const comparePassword = await bcrypt.compare(value.password, user.password);
  if (!comparePassword) {
    throw new UnauthenticatedError("Invalid email or password");
  }
  if (user.isVerified === false) {
    throw new UnauthenticatedError("Verify Account");
  }
  const { password, ...safeUser } = user;

  const { accessToken, refreshToken } = generateCookieTokens(safeUser);
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: { user: safeUser },
  });
};

const logout = async (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
    data: {},
  });
};

const rotateTokens = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new UnauthenticatedError("Invalid or expired tokens");
  }
  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (error) {
    throw new UnauthenticatedError("Invalid or expired tokens");
  }

  const { accessToken, refreshToken: newRefreshToken } = generateCookieTokens({
    id: payload.id,
    role: payload.role,
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", newRefreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Tokens rotated successfully",
    data: {},
  });
};

const getMe = async (req, res) => {};
const verifyEmail = async (req, res) => {};

const googleLogin = async (req, res) => {};
const resendVerificationEmail = async (req, res) => {};
const forgotPassword = async (req, res) => {};
const resetPassword = async (req, res) => {};

module.exports = {
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
};
