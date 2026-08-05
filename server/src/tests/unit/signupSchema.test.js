const { signupSchema } = require("../../validations/auth.validation");

describe("signupSchema", () => {
  const validPayload = {
    name: "Abdullahi Imam",
    email: "abdal@example.com",
    password: "Waterjuice123$#",
    confirmPassword: "Waterjuice123$#",
    phone: "08033373457",
  };

  it("passes a valid payload", () => {
    const { error } = signupSchema.validate(validPayload);
    expect(error).toBeUndefined();
  });

  it("rejects empty email", () => {
    const { error } = signupSchema.validate({ ...validPayload, email: "" });
    expect(error).toBeDefined();
  });

  it("rejects invalid email format", () => {
    const { error } = signupSchema.validate({
      ...validPayload,
      email: "abdallahimam2939",
    });
    expect(error).toBeDefined();
  });

  it("rejects empty name", () => {
    const { error } = signupSchema.validate({
      ...validPayload,
      name: "",
    });
    expect(error).toBeDefined();
  });

  it("rejects a name with less than 2 characters", () => {
    const { error } = signupSchema.validate({
      ...validPayload,
      name: "a",
    });
    expect(error).toBeDefined();
  });

  it("rejects a name with more than 50 characters", () => {
    const { error } = signupSchema.validate({
      ...validPayload,
      name: "Christopher-Alexander Maximilian von Hohenzollern-S",
    });
    expect(error).toBeDefined();
  });

  it("rejects an empty password", () => {
    const { error } = signupSchema.validate({
      ...validPayload,
      password: "",
    });
    expect(error).toBeDefined();
  });

  it("rejects a weak password", () => {
    const { error } = signupSchema.validate({
      ...validPayload,
      password: "waterjuice",
    });
    expect(error).toBeDefined();
  });
  it("rejects mismatched passwords", () => {
    const { error } = signupSchema.validate({
      ...validPayload,
      password: "Waterjuice123$#",
      confirmPassword: "Mangojuice123$#",
    });
    expect(error).toBeDefined();
  });
  it("rejects invalid phone number", () => {
    const { error } = signupSchema.validate({
      ...validPayload,
      phone: "098098625",
    });
    expect(error).toBeDefined();
  });
  it("rejects empty phone number", () => {
    const { error } = signupSchema.validate({
      ...validPayload,
      phone: "",
    });
    expect(error).toBeDefined();
  });
});
