import { beforeAll, vi, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { verifyEmail } from "../services/auth.service";
import { VerifyEmail } from "../pages/auth pages/VerifyEmail";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

vi.mock("../services/auth.service", () => ({
  verifyEmail: vi.fn(),
}));

test("check if verify email service resolves", async () => {
  const queryClient = new QueryClient();
  verifyEmail.mockResolvedValue({
    message: "User verified successfully",
  });
  render(
    <MemoryRouter initialEntries={["/verify-email/abdallah"]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path="/verify-email/:token"
            element={<VerifyEmail></VerifyEmail>}
          ></Route>
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  );

  expect(
    await screen.findByText(
      "User verified successfully. You can close this tab now!",
    ),
  ).toBeInTheDocument();
});

test("check if verify email service fails", async () => {
  const queryClient = new QueryClient();

  verifyEmail.mockRejectedValue({
    response: {
      data: {
        message: "Invalid or expired token",
      },
    },
  });

  render(
    <MemoryRouter initialEntries={["/verify-email/abdallah"]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path="/verify-email/:token"
            element={<VerifyEmail></VerifyEmail>}
          ></Route>
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  );

  expect(
    await screen.findByText(/Invalid or expired token/),
  ).toBeInTheDocument();
});

test("check if verify email service id pending", async () => {
  const queryClient = new QueryClient();

  verifyEmail.mockImplementation(() => new Promise(() => {}));

  render(
    <MemoryRouter initialEntries={["/verify-email/abdallah"]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path="/verify-email/:token"
            element={<VerifyEmail></VerifyEmail>}
          ></Route>
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  );

  expect(await screen.findByText("Verifying email...")).toBeInTheDocument();
});
