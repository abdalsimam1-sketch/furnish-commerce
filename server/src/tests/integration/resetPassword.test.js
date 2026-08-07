const { app } = require("../../app");
const { prisma } = require("../../config/prisma");
const request = require("supertest");
const { hashPassword } = require("../../utils/hashPassword");
const { generateCryptoToken } = require("../../utils/generateCryptoToken");
const bcrypt = require("bcryptjs");

let hashedPassword;
let user;
let user1;

const validPayload = {
  password: "Waterjuice123$#",
  confirmPassword: "Waterjuice123$#",
};
const { cryptoToken, cryptoTokenHash } = generateCryptoToken();
const { cryptoToken: cryptoToken1, cryptoTokenHash: cryptoTokenHash1 } =
  generateCryptoToken();

beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  hashedPassword = await hashPassword("Waterjuice123$#");
  user = await prisma.user.create({
    data: {
      name: "Test user",
      email: "resetpassword@icloud.com",
      phone: "08099337865",
      password: hashedPassword,
      resetPasswordTokenHash: cryptoTokenHash,
      resetPasswordTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: true,
    },
  });
  user1 = await prisma.user.create({
    data: {
      name: "Test user",
      email: "resetpassword1@icloud.com",
      phone: "08095637865",
      password: hashedPassword,
      isVerified: true,
      resetPasswordTokenExpiresAt: new Date(Date.now() - 10 * 60 * 1000),
      resetPasswordTokenHash: cryptoTokenHash1,
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: "resetpassword@icloud.com" },
        { email: "resetpassword1@icloud.com" },
      ],
    },
  });
  await prisma.$disconnect();
});

describe("POST /api/v1/auth/reset-password/:token", () => {
  test("passes valid payload", async () => {
    const res = await request(app)
      .post(`/api/v1/auth/reset-password/${cryptoToken}`)
      .send(validPayload);
    const user = await prisma.user.findFirst({
      where: {
        email: "resetpassword@icloud.com",
      },
      select: {
        password: true,
      },
    });
    const isMatch = await bcrypt.compare(validPayload.password, user.password);
    expect(res.statusCode).toBe(200);
    expect(isMatch).toBe(true);
  });
  test("rejects invalid token", async () => {
    const res = await request(app)
      .post(`/api/v1/auth/reset-password/5`)
      .send(validPayload);
    expect(res.statusCode).toBe(400);
  });
  test("reject expired token", async () => {
    const res = await request(app)
      .post(`/api/v1/auth/reset-password/${cryptoToken1}`)
      .send(validPayload);
    expect(res.statusCode).toBe(400);
  });
  test("reject missing password", async () => {
    const res = await request(app)
      .post(`/api/v1/auth/reset-password/${cryptoToken}`)
      .send({ ...validPayload, password: "" });
    expect(res.statusCode).toBe(400);
  });
  test("reject mismatched passwords", async () => {
    const res = await request(app)
      .post(`/api/v1/auth/reset-password/${cryptoToken}`)
      .send({ ...validPayload, password: "WaterJuice321$#" });
    expect(res.statusCode).toBe(400);
  });
});
