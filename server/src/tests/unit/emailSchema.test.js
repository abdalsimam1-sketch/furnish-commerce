const { emailSchema } = require("../../validations/auth.validation");

describe("emailSchema", () => {
  test("passes valid email", async () => {
    const { error } = emailSchema.validate({
      email: "verifyemailschema@gmail.com",
    });
    expect(error).toBeUndefined();
  });
  test("rejects missing email", async () => {
    const { error } = emailSchema.validate({
      email: "",
    });
    expect(error).toBeDefined();
  });
  test("invalid email", async () => {
    const { error } = emailSchema.validate({
      email: "invalidemail",
    });
    expect(error).toBeDefined();
  });
});
