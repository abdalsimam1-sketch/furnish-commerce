const { BadRequestError, ConflictError } = require("../errors");
const { prisma } = require("../config/prisma");
const { signupSchema } = require("../validations/auth.validation");
const { hashPassword } = require("../utils/hashPassword");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const { generateCryptoToken } = require("../utils/generateCryptoToken");

const signup = async (req, res) => {
  const { email, name, password, phone, confirmPassword } = req.body;
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

const login = async (req, res) => {};

const logout = async (req, res) => {};

const roatateTokens = async (req, res) => {};

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
  roatateTokens,
  getMe,
  googleLogin,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
