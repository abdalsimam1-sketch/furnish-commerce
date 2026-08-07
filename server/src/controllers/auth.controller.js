const {
  BadRequestError,
  ConflictError,
  UnauthenticatedError,
} = require("../errors");
const bcrypt = require("bcryptjs");
const { prisma } = require("../config/prisma");
const jwt = require("jsonwebtoken");

const {
  signupSchema,
  loginSchema,
  passwordSchema,
  emailSchema,
} = require("../validations/auth.validation");

const { hashPassword } = require("../utils/hashPassword");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const { generateCryptoToken } = require("../utils/generateCryptoToken");
const { generateCookieTokens } = require("../utils/generateCookieTokens");
const { cookieOptions } = require("../utils/cookieOptions");
const { hashCryptoToken } = require("../utils/hashCryptoToken");
const { sendPasswordResetEmail } = require("../utils/sendPasswordResetEmail");

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

const getMe = async (req, res) => {
  const { id } = req.user;
  let user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
    },
  });
  if (!user) {
    throw new UnauthenticatedError();
  }

  res.status(200).json({
    success: true,
    message: "User found",
    data: {
      user,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const cryptoTokenHash = hashCryptoToken(token);
  let user = await prisma.user.findFirst({
    where: {
      verificationTokenHash: cryptoTokenHash,
    },
  });
  if (!user) {
    throw new BadRequestError("Invalid or expired verification token");
  }
  if (user.verificationTokenExpiresAt < new Date()) {
    throw new BadRequestError("Invalid or expired verification token");
  }

  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
      verificationTokenHash: null,
      verificationTokenExpiresAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isVerified: true,
    },
  });
  res.status(200).json({
    success: true,
    message: "User verified successfully",
    data: {
      user,
    },
  });
};

const googleLogin = async (req, res) => {};

const resendVerificationEmail = async (req, res) => {
  const { value, error } = emailSchema.validate(req.body);
  const { cryptoToken, cryptoTokenHash } = generateCryptoToken();
  let user = await prisma.user.findUnique({
    where: {
      email: value.email,
    },
    select: {
      email: true,
      isVerified: true,
    },
  });

  if (user && !user.isVerified) {
    user = await prisma.user.update({
      where: {
        email: value.email,
      },
      data: {
        verificationTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        verificationTokenHash: cryptoTokenHash,
      },
    });
    try {
      await sendVerificationEmail(user.email, cryptoToken);
    } catch (error) {
      console.log("Email error: ", error);
    }
  }
  res.status(200).json({
    success: true,
    message: "If user exists a verification email will be resent",
    data: {},
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { error, value } = emailSchema.validate(req.body);
  let user = await prisma.user.findUnique({
    where: {
      email,
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
  if (user) {
    const { cryptoToken, cryptoTokenHash } = generateCryptoToken();
    user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetPasswordTokenHash: cryptoTokenHash,
        resetPasswordTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
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
      await sendPasswordResetEmail(user.email, cryptoToken);
    } catch (error) {
      console.log("Email error: ", error);
    }
  }
  res.status(200).json({
    success: true,
    message: "If user exists, a reset link will sent",
    data: {
      user,
    },
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { error, value } = passwordSchema.validate(req.body);

  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  const hashedCryptoToken = hashCryptoToken(token);
  let user = await prisma.user.findFirst({
    where: {
      resetPasswordTokenHash: hashedCryptoToken,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      isVerified: true,
      resetPasswordTokenExpiresAt: true,
    },
  });
  if (!user) {
    throw new BadRequestError("Invalid or expired token");
  }
  if (user.resetPasswordTokenExpiresAt < new Date()) {
    throw new BadRequestError("Invalid or expired token");
  }
  const newPassword = await hashPassword(value.password);
  user = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: newPassword,
      resetPasswordTokenExpiresAt: null,
      resetPasswordTokenHash: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      isVerified: true,
    },
  });

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
    data: { user },
  });
};

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
