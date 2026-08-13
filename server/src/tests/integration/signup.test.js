const request = require("supertest");
const { app } = require("../../app");

const { prisma } = require("../../config/prisma");

jest.setTimeout(15000);

const validPayload = {
  name: "Abdullahi Imam",
  email: "abdallahimam75@gmail.com",
  password: "Waterjuice123$#",
  confirmPassword: "Waterjuice123$#",
  phone: "08033373457",
};

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: validPayload.email },
        { phone: validPayload.phone },
        { email: "abdallahimam@icloud.com" },
        { phone: "09033015663" },
        { email: "abdallahmusa@icloud.com" },
        { email: "abdallahkabir@icloud.com" },
        { phone: "09033379529" },
        { email: "leaktest@icloud.com" },
        { phone: "08011122233" },
      ],
    },
  });
  await prisma.$disconnect();
});

describe("POST /api/v1/auth/signup", () => {
  test("should successfully register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send(validPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success", true);
  });

  test("duplicate email", async () => {
    await request(app)
      .post("/api/v1/auth/signup")
      .send({
        ...validPayload,
        email: "abdallahimam@icloud.com",
        phone: "09033015663",
      });

    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        ...validPayload,
        email: "abdallahimam@icloud.com",
        phone: "09033015663",
      });
    expect(res.statusCode).toBe(409);
  });

  test("duplicate phone number", async () => {
    await request(app)
      .post("/api/v1/auth/signup")
      .send({
        ...validPayload,
        email: "abdallahmusa@icloud.com",
        phone: "09033379529",
      });

    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        ...validPayload,
        email: "abdallahkabir@icloud.com",
        phone: "09033379529",
      });
    expect(res.statusCode).toBe(409);
  });

  test("missing email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        ...validPayload,
        email: "",
      });
    expect(res.statusCode).toBe(400);
  });

  test("response does not leak password or password hash", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        ...validPayload,
        email: "leaktest@icloud.com",
        phone: "08011122233",
      });

    expect(res.body.user?.password).toBeUndefined();
  });
});
