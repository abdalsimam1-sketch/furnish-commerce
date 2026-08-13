const request = require("supertest");
const { app } = require("../../app");
const { prisma } = require("../../config/prisma");
const { hashPassword } = require("../../utils/hashPassword");
const { generateCryptoToken } = require("../../utils/generateCryptoToken");

const { cryptoToken, cryptoTokenHash } = generateCryptoToken();
beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});

  unverifiedHash = await hashPassword("Waterjuice123$#");
  unverifiedUser = await prisma.user.create({
    data: {
      name: "Unverified Test",
      email: "resendverification@icloud.com",
      phone: "08099988321",
      password: unverifiedHash,
      isVerified: false,
    },
  });

  unverifiedUser1 = await prisma.user.create({
    data: {
      name: "Unverified Test",
      email: "resendverification1@icloud.com",
      phone: "08099987865",
      password: unverifiedHash,
      isVerified: false,
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: "resendverification@icloud.com" },
        { email: "resendverification1@icloud.com" },
      ],
    },
  });
  await prisma.$disconnect();
});

describe("POST /api/v1/auth/resend-verification-email", () => {
  test("resends an email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/resend-verification-email")
      .send({ email: unverifiedUser.email });

    const user = await prisma.user.findUnique({
      where: {
        email: unverifiedUser.email,
      },
      select: {
        verificationTokenExpiresAt: true,
        verificationTokenHash: true,
      },
    });
    expect(res.statusCode).toBe(200);
    expect(
      user.verificationTokenExpiresAt && user.verificationTokenHash,
    ).not.toBeNull();
  });

  test("rejects missing email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/resend-verification-email")
      .send({ email: "" });
    expect(res.statusCode).toBe(200);
  });
  test("rejects non existent user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/resend-verification-email")
      .send({ email: "nonexistentuser@gmail.com" });

    expect(res.statusCode).toBe(200);
  });

  test("reject verified user", async () => {
    const before = await prisma.user.update({
      where: {
        email: unverifiedUser1.email,
      },
      data: {
        isVerified: true,
      },
      select: {
        isVerified: true,
      },
    });
    const res = await request(app)
      .post("/api/v1/auth/resend-verification-email")
      .send({ email: unverifiedUser1.email });

    const after = await prisma.user.findUnique({
      where: {
        email: unverifiedUser1.email,
      },
      select: {
        verificationTokenExpiresAt: true,
        verificationTokenHash: true,
      },
    });
    expect(res.statusCode).toBe(200);
    expect(before.isVerified).toBe(true);
    expect(
      after.verificationTokenExpiresAt && after.verificationTokenHash,
    ).toBeNull();
  });
});
