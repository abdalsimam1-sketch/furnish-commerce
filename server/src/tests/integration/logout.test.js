const request = require("supertest");
const { app } = require("../../app");
const { prisma } = require("../../config/prisma");
const { hashPassword } = require("../../utils/hashPassword");

beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});

  const unverifiedHash = await hashPassword("Waterjuice123$#");
  unverifiedUser = await prisma.user.create({
    data: {
      name: "Unverified Test",
      email: "logout@icloud.com",
      phone: "08099988875",
      password: unverifiedHash,
      isVerified: true,
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [{ email: "logout@icloud.com" }],
    },
  });
  await prisma.$disconnect();
});

describe("POST /api/v1/auth/logout", () => {
  test("passes login and logout", async () => {
    const agent = request.agent(app);
    await agent
      .post("/api/v1/auth/login")
      .send({ email: unverifiedUser.email, password: "Waterjuice123$#" });
    const res = await agent.post("/api/v1/auth/logout").send();
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
