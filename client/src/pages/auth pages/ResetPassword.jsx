import { useState } from "react";
import { Input } from "../../components/Input";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export const ResetPassword = () => {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm();
  const { resetPasswordMutation } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();

  const onSubmit = async (authForm) => {
    resetPasswordMutation.mutate(
      {
        token,
        payload: {
          password: authForm.password,
          confirmPassword: authForm.confirmPassword,
        },
      },
      {
        onSuccess: () => {
          toast.success("Password reset successful");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
        },
      },
    );
  };

  if (resetPasswordMutation.data) {
    return (
      <div className="auth-page d-flex flex-column flex-md-row mb-5 mb-md-0">
        <section className="auth-image"></section>
        <section className="auth-form-section d-flex justify-content-center align-items-center p-3">
          <div className="alert alert-success mt-5 mt-md-0">
            {resetPasswordMutation.data?.message}. You can close this tab now!
          </div>
        </section>
      </div>
    );
  }
  return (
    <div className="auth-page d-flex flex-column flex-md-row mb-5 mb-md-0">
      <section className="auth-image"></section>
      <section className="auth-form-section d-flex justify-content-center align-items-center p-3">
        <form
          className="auth-form d-flex flex-column gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <header>
            <h2 className=""></h2>
            <h2>Reset password</h2>
            <span className="text-muted">
              Please enter new password to reset password
            </span>
          </header>

          <div className="d-flex flex-column gap-4">
            <Input
              type="password"
              placeholder="New Password"
              {...register("password", {
                required: "New password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,30}$/,
                  message: "New password doesn't meet requirements",
                },
              })}
              error={errors.password?.message}
            ></Input>

            <Input
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPassword", {
                required: "Confirm new password is required",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              })}
              error={errors.confirmPassword?.message}
            ></Input>

            <div className="d-flex gap-3 flex-md-column flex-lg-row pb-5 pb-md-0">
              <button
                disabled={resetPasswordMutation.isPending}
                className={`btn auth-btn w-100 ${resetPasswordMutation.isPending ? "bg-secondary text-light" : ""}`}
              >
                {resetPasswordMutation.isPending
                  ? "Resetting password...."
                  : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
