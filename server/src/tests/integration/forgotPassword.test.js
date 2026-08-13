const { app } = require("../../app");
const { prisma } = require("../../config/prisma");
const request = require("supertest");
const { hashPassword } = require("../../utils/hashPassword");
const { generateCryptoToken } = require("../../utils/generateCryptoToken");

let hashedPassword;
let user;

beforeAll(async () => {
  hashedPassword = await hashPassword("Waterjuice123$#");
  user = await prisma.user.create({
    data: {
      name: "Test user",
      email: "forgotpassword@icloud.com",
      phone: "08299238321",
      password: hashedPassword,
      isVerified: false,
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: "forgotpassword@icloud.com",
    },
  });
  await prisma.$disconnect();
});

describe("POST /api/v1/auth/forgot-password", () => {
  test("passes valid email", async () => {
    const res = await request(app).post("/api/v1/auth/forgot-password").send({
      email: "forgotpassword@icloud.com",
    });
    user = await prisma.user.findFirst({
      where: {
        email: "forgotpassword@icloud.com",
      },
      select: {
        resetPasswordTokenExpiresAt: true,
        resetPasswordTokenHash: true,
      },
    });
    expect(res.statusCode).toBe(200);
    expect(
      user.resetPasswordTokenExpiresAt && user.resetPasswordTokenHash,
    ).not.toBeNull();
  });
  test("rejects missing email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "" });
    expect(res.statusCode).toBe(200);
  });
  test("rejects non existing user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "nonexisting@gmail.com" });
    expect(res.statusCode).toBe(200);
  });
});
