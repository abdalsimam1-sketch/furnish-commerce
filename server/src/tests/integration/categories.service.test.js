const { app } = require("../../app");
const { prisma } = require("../../config/prisma");
const request = require("supertest");

describe("GET /api/v1/categories/", () => {
  test("passes a valid route", async () => {
    const res = await request(app).get("/api/v1/categories/");
    expect(res.statusCode).toBe(200);
    expect(res.body.data?.categories).toBeDefined();
  });
});
