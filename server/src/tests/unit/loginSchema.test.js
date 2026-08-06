const { loginSchema } = require("../../validations/auth.validation");

describe("loginSchema", () => {
  const validPayload = {
    email: "abdallahimam75@gmail.com",
    password: "Waterjuice123$#",
  };

  test("passes valid payload", () => {
    const { error } = loginSchema.validate(validPayload);
    expect(error).toBeUndefined();
  });

  test("rejects missing email", () => {
    const { error } = loginSchema.validate({ ...validPayload, email: "" });
    expect(error).toBeDefined();
  });

  test("rejects missing password", () => {
    const { error } = loginSchema.validate({
      ...validPayload,
      password: "",
    });
    expect(error).toBeDefined();
  });

  test("rejects invalid email", () => {
    const { error } = loginSchema.validate({
      ...validPayload,
      email: "abdallahimam123",
    });
    expect(error).toBeDefined();
  });
});
