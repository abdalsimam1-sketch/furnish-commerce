const { app } = require("../../app");
const { prisma } = require("../../config/prisma");
const request = require("supertest");

describe("GET /api/v1/products/:categoryId", () => {
  test("check if valid categoryId returns the products", async () => {
    res = await request(app).get(
      "/api/v1/products/4a34f49c-b2bc-4edf-9076-cdaf6a05e2b1",
    );
    expect(res.statusCode).toBe(200);
    expect(res.body?.data?.products).toBeDefined();
  });
  test("check if invalid or missing categoryId is rejected", async () => {
    res = await request(app).get("/api/v1/products/waterjuice");
    expect(res.statusCode).toBe(200);
    expect(res.body?.data?.products).toEqual([]);
  });
  test("check if missing categoryId returns 404", async () => {
    res = await request(app).get("/api/v1/products/");
    expect(res.statusCode).toBe(404);
  });
});
