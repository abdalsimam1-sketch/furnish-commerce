const { app } = require("../../app");
const request = require("supertest");
const { prisma } = require("../../config/prisma");
const { hashPassword } = require("../../utils/hashPassword");
const jwt = require("jsonwebtoken");

const expiredToken = jwt.sign(
  {
    id: "123",
    role: "customer",
  },
  process.env.REFRESH_SECRET,
  {
    expiresIn: "1ms",
  },
);

beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});

  const unverifiedHash = await hashPassword("Waterjuice123$#");
  unverifiedUser = await prisma.user.create({
    data: {
      name: "Unverified Test",
      email: "rotatetoken@icloud.com",
      phone: "08099988870",
      password: unverifiedHash,
      isVerified: true,
    },
  });
});
afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [{ email: "rotatetoken@icloud.com" }],
    },
  });
  await prisma.$disconnect();
});

describe("POST /api/v1/auth/rotate-tokens", () => {
  test("should rotate tokens successfully with a valid refresh token", async () => {
    const agent = request.agent(app);
    const loginRes = await agent
      .post("/api/v1/auth/login")
      .send({ email: unverifiedUser.email, password: "Waterjuice123$#" });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const rotateRes = await agent.post("/api/v1/auth/rotate-tokens").send();
    const oldtokens = loginRes.headers["set-cookie"];

    const newTokens = rotateRes.headers["set-cookie"];

    expect(rotateRes.statusCode).toBe(200);
    expect(oldtokens).not.toEqual(newTokens);
  });

  test("missing refresh token", async () => {
    const res = await request(app).post("/api/v1/auth/rotate-tokens").send();

    expect(res.statusCode).toBe(401);
  });

  test("invalid or expired tokens", async () => {
    const res = await request(app)
      .post("/api/v1/auth/rotate-tokens")
      .set("Cookie", `refreshToken=${expiredToken}`);
    expect(res.statusCode).toBe(401);
  });
});
