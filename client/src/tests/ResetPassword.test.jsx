import { expect, vi, beforeEach, test } from "vitest";
import { screen, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ResetPassword } from "../pages/auth pages/ResetPassword";

vi.mock("../hooks/useAuth", () => {
  return {
    useAuth: () => ({
      resetPasswordMutation: {
        isPending: pending,
        error,
        mutate,
      },
    }),
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

test("check if 2 password fields and a submit button are rendered", () => {
  render(
    <MemoryRouter initialEntries={["/auth/reset-password/abdallah"]}>
      <Routes>
        <Route
          path="/auth/reset-password/:token"
          element={<ResetPassword></ResetPassword>}
        ></Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText("Confirm New Password"),
  ).toBeInTheDocument();

  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
});
