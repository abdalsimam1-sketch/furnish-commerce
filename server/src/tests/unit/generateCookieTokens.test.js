require("dotenv/config");
const { generateCookieTokens } = require("../../utils/generateCookieTokens");

describe("generateCookieTokens", () => {
  test("check if both tokens are returned", () => {
    const { accessToken, refreshToken } = generateCookieTokens({
      id: 1,
      role: "customer",
    });
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });
});
