const request = require("supertest");
const { app } = require("../../app");
const { prisma } = require("../../config/prisma");
const { hashPassword } = require("../../utils/hashPassword");

const validPayload = {
  email: "logintest@icloud.com",
  password: "Waterjuice123$#",
};

beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});

  const hashed = await hashPassword(validPayload.password);
  await prisma.user.create({
    data: {
      name: "Login Test",
      email: validPayload.email,
      phone: "08099988877",
      password: hashed,
      isVerified: true,
    },
  });

  const unverifiedHash = await hashPassword(validPayload.password);
  unverifiedUser = await prisma.user.create({
    data: {
      name: "Unverified Test",
      email: "unverifiedtest@icloud.com",
      phone: "08099988878",
      password: unverifiedHash,
      isVerified: false,
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: validPayload.email },
        { email: "unverifiedtest@icloud.com" },
      ],
    },
  });
  await prisma.$disconnect();
});

describe("POST /api/v1/auth/login", () => {
  test("successful login", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(validPayload);
    expect(res.statusCode).toBe(200);
  });

  test("rejects wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ ...validPayload, password: "WaterJuice123$#" });
    expect(res.statusCode).toBe(401);
  });

  test("rejects non existent email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ ...validPayload, email: "mosessama@gmail.com" });
    expect(res.statusCode).toBe(401);
  });

  test("rejects unverfied email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: unverifiedUser.email, password: unverifiedUser.password });
    expect(res.statusCode).toBe(401);
  });

  test("checks if cookies are assigned", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(validPayload);
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
