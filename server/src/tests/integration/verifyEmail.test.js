const request = require("supertest");
const { app } = require("../../app");
const { prisma } = require("../../config/prisma");
const { hashPassword } = require("../../utils/hashPassword");
const { generateCryptoToken } = require("../../utils/generateCryptoToken");

const { cryptoToken, cryptoTokenHash } = generateCryptoToken();

const { cryptoToken: cryptoToken1, cryptoTokenHash: cryptoTokenHash1 } =
  generateCryptoToken();

beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  let unverifiedHash = await hashPassword("Waterjuice123$#");
  const unverifiedUser = await prisma.user.create({
    data: {
      name: "Unverified Test",
      email: "verifyaccount@icloud.com",
      phone: "08099988898",
      password: unverifiedHash,
      isVerified: false,
      verificationTokenHash: cryptoTokenHash,
      verificationTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const unverifiedUser1 = await prisma.user.create({
    data: {
      name: "Unverified Test",
      email: "verifyaccount1@icloud.com",
      phone: "08099988856",
      password: unverifiedHash,
      isVerified: false,
      verificationTokenHash: cryptoTokenHash1,
      verificationTokenExpiresAt: new Date(Date.now() - 10 * 60 * 1000),
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: "verifyaccount@icloud.com" },
        { email: "verifyaccount1@icloud.com" },
      ],
    },
  });
  await prisma.$disconnect();
});

describe("GET /api/v1/auth/verify-email/:token", () => {
  test("valid verification verifies user", async () => {
    const res = await request(app).get(
      `/api/v1/auth/verify-email/${cryptoToken}`,
    );

    expect(res.body?.data?.user).toBeDefined();
    expect(res.statusCode).toBe(200);
    expect(res.body?.data?.user?.isVerified).toBe(true);
    const user = await prisma.user.findUnique({
      where: {
        id: res.body?.data?.user?.id,
      },
      select: {
        verificationTokenExpiresAt: true,
        verificationTokenHash: true,
      },
    });
    expect(user.verificationTokenExpiresAt).toBe(null);
    expect(user.verificationTokenHash).toBe(null);
  });

  test("rejects invalid token", async () => {
    const res = await request(app).get(`/api/v1/auth/verify-email/1738`);
    console.log(res.body);
    expect(res.statusCode).toBe(400);
  });

  test("reject reused token", async () => {
    const res = await request(app).get(
      `/api/v1/auth/verify-email/${cryptoToken}`,
    );
    expect(res.statusCode).toBe(400);
  });

  test("reject missing token", async () => {
    const res = await request(app).get(`/api/v1/auth/verify-email`);
    expect(res.statusCode).toBe(404);
  });

  test("reject expired token", async () => {
    const res = await request(app).get(
      `/api/v1/auth/verify-email/${cryptoToken1}`,
    );
    expect(res.statusCode).toBe(400);
  });
});
