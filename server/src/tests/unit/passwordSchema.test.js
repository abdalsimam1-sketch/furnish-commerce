const { passwordSchema } = require("../../validations/auth.validation");

const validPayload = {
  password: "Waterjuice123$#",
  confirmPassword: "Waterjuice123$#",
};

describe("passwordSchema", () => {
  test("passes valid payload", async () => {
    const { error } = passwordSchema.validate(validPayload);
    expect(error).toBeUndefined();
  });
  test("rejects missing password", async () => {
    const { error } = passwordSchema.validate({
      ...validPayload,
      password: "",
    });
    expect(error).toBeDefined();
  });
  test("rejects unmatching passwords", async () => {
    const { error } = passwordSchema.validate({
      ...validPayload,
      password: "WaterJuice321$#",
    });
    expect(error).toBeDefined();
  });
});
