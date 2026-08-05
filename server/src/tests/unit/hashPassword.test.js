const { hashPassword } = require("../../utils/hashPassword");

describe("hashPassword", () => {
  const validPassword = "Waterjuice123$#";
  it("password returns hash", async () => {
    const hash = await hashPassword(validPassword);
    expect(hash).toBeDefined();
  });

  it("rejects unhashed password", async () => {
    const hash = await hashPassword(validPassword);
    expect(hash).not.toEqual(validPassword);
  });
});
