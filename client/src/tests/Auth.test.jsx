import { render, screen } from "@testing-library/react";
import { beforeEach, expect, vi, test } from "vitest";
import userEvent from "@testing-library/user-event";
import { Auth } from "../pages/auth pages/Auth";
import { MemoryRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    loginMutation: {
      error: loginError,
      isPending: loginIsPending,
      mutate: mockLogin,
    },
    signupMutation: {
      error: null,
      isPending: false,
      mutate: mockSignup,
    },
    resendVerificationEmailMutation: {
      error: null,
      isPending: false,
      mutate: mockResendEmail,
    },
  }),
}));
let loginError = null;
let mockLogin = vi.fn();
let mockSignup = vi.fn();
let mockResendEmail = vi.fn();
let loginIsPending = false;

beforeEach(() => {
  mockLogin.mockReset();
  mockSignup.mockClear();
  mockResendEmail.mockClear();
  loginError = null;
  loginIsPending = false;
});

test("renders login form", () => {
  render(
    <MemoryRouter>
      <Auth></Auth>
    </MemoryRouter>,
  );

  expect(screen.getByText("Sign In")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Continue with google/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Forgot password" }),
  ).toBeInTheDocument();
});

test("renders signup form", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Auth></Auth>
    </MemoryRouter>,
  );

  await user.click(screen.getByText("Sign Up"));
  expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
});

test("shows validation errors", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Auth></Auth>
    </MemoryRouter>,
  );

  await user.click(screen.getByRole("button", { name: "Submit" }));
  expect(screen.getByText("Email is required")).toBeInTheDocument();
  expect(screen.getByText("Password is required")).toBeInTheDocument();
});

test("submits login form", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Auth></Auth>
    </MemoryRouter>,
  );
  await user.type(screen.getByPlaceholderText("Email"), "testemail@gmail.com");
  await user.type(screen.getByPlaceholderText("Password"), "Waterjuice123$#");

  await user.click(screen.getByRole("button", { name: "Submit" }));
  expect(mockLogin).toHaveBeenCalledWith(
    {
      email: "testemail@gmail.com",
      password: "Waterjuice123$#",
    },
    expect.anything(),
  );
});

test("checks naviagtion to home after succesful login form submission", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Auth></Auth>
      <LocationDisplay></LocationDisplay>
    </MemoryRouter>,
  );
  mockLogin.mockImplementation((data, options) => {
    options.onSuccess();
  });

  await user.type(screen.getByPlaceholderText("Email"), "testemail@gmail.com");
  await user.type(screen.getByPlaceholderText("Password"), "Waterjuice123$#");

  await user.click(screen.getByRole("button", { name: "Submit" }));
  expect(screen.getByTestId("location")).toHaveTextContent("/");
});

test("submits signup form", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Auth></Auth>
    </MemoryRouter>,
  );
  await user.click(screen.getByText("Sign Up"));
  await user.type(screen.getByPlaceholderText("Email"), "testemail@gmail.com");
  await user.type(screen.getByPlaceholderText("Password"), "Waterjuice123$#");
  await user.type(screen.getByPlaceholderText("Phone"), "09033015663");
  await user.type(screen.getByPlaceholderText("Name"), "Abdullahi Imam");
  await user.type(
    screen.getByPlaceholderText("Confirm Password"),
    "Waterjuice123$#",
  );

  await user.click(screen.getByRole("button", { name: "Submit" }));
  expect(mockSignup).toHaveBeenCalledWith(
    {
      email: "testemail@gmail.com",
      password: "Waterjuice123$#",
      confirmPassword: "Waterjuice123$#",
      phone: "09033015663",
      name: "Abdullahi Imam",
    },
    expect.anything(),
  );
});

test("shows resend verification email button on error status 401", async () => {
  const user = userEvent.setup();
  loginError = {
    response: {
      status: 401,
      data: {
        message: "Verify Account",
      },
    },
  };
  render(
    <MemoryRouter>
      <Auth></Auth>
    </MemoryRouter>,
  );
  await user.type(screen.getByPlaceholderText("Email"), "testemail@gmail.com");
  await user.type(screen.getByPlaceholderText("Password"), "Waterjuice123$#");
  await user.click(screen.getByRole("button", { name: "Submit" }));

  expect(
    screen.getByRole("button", { name: /resend verification email/i }),
  ).toBeInTheDocument();
  expect(screen.getByText("Verify Account")).toBeInTheDocument();
});

test("check button disabled on login is pending", async () => {
  loginIsPending = true;
  render(
    <MemoryRouter>
      <Auth></Auth>
    </MemoryRouter>,
  );
  const button = screen.getByRole("button", { name: "Signing in....." });
  expect(button).toBeDisabled();
});

test("error message shows up when error status = 429", () => {
  loginError = {
    response: {
      data: {
        message: "Too many requests, try again later",
      },
      status: 429,
    },
  };
  render(
    <MemoryRouter>
      <Auth></Auth>
    </MemoryRouter>,
  );

  expect(
    screen.getByText("Too many requests, try again later"),
  ).toBeInTheDocument();
});
