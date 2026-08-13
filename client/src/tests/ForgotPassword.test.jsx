import { vi, test, expect, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { render, screen } from "@testing-library/react";
import { ForgotPassword } from "../pages/auth pages/ForgotPassword";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

vi.mock("../hooks/useAuth", () => {
  return {
    useAuth: () => ({
      forgotPasswordMutation: {
        isPending: pending,
        error: error,
        mutate: mutate,
      },
    }),
  };
});
vi.mock("react-hot-toast", () => {
  return {
    default: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});
let pending = false;
let error = null;
let mutate = vi.fn();

beforeEach(() => {
  pending = false;
  error = null;
  mutate = vi.fn();
});

test("render email field on form", () => {
  render(
    <MemoryRouter>
      <ForgotPassword></ForgotPassword>
    </MemoryRouter>,
  );

  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
});

test("check if email form is submitted correctly", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <ForgotPassword></ForgotPassword>
    </MemoryRouter>,
  );

  await user.type(screen.getByPlaceholderText("Email"), "testemail@gmail.com");
  await user.click(screen.getByRole("button", { name: "Submit" }));
  expect(mutate).toHaveBeenCalledOnce();
  expect(mutate).toHaveBeenCalledWith(
    { email: "testemail@gmail.com" },
    expect.objectContaining({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    }),
  );
});

test("check if submitting missing email triggers a validation error", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <ForgotPassword></ForgotPassword>
    </MemoryRouter>,
  );

  await user.click(screen.getByRole("button", { name: "Submit" }));
  expect(screen.getByText("Email is required")).toBeInTheDocument();
});

test("check if while pending button is diabled and shows signing in....", () => {
  pending = true;
  render(
    <MemoryRouter>
      <ForgotPassword></ForgotPassword>
    </MemoryRouter>,
  );

  expect(screen.getByText("Sending email....")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Sending email...." }),
  ).toBeDisabled();
});
