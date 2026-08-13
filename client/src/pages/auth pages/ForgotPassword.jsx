import { useState } from "react";
import { Input } from "../../components/Input";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm();

  const navigate = useNavigate();
  const { forgotPasswordMutation } = useAuth();

  const onSubmit = async (authForm) => {
    forgotPasswordMutation.mutate(
      {
        email: authForm.email,
      },
      {
        onSuccess: () => {
          toast.success("If an account exists, a reset link has been sent.");
          reset();
          navigate("/auth");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
        },
      },
    );
  };

  return (
    <div className="auth-page d-flex flex-column flex-md-row mb-5 mb-md-0">
      <section className="auth-image"></section>
      <section className="auth-form-section d-flex justify-content-center align-items-center p-3">
        <form
          className="auth-form d-flex flex-column gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <header>
            <h2>Forgot password</h2>
            <span className="text-muted">
              Please enter email to recieve a password reset link
            </span>
          </header>

          <div className="d-flex flex-column gap-4">
            <Input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              error={errors.email?.message}
            ></Input>
          </div>
          <button
            disabled={forgotPasswordMutation.isPending}
            className={`btn auth-btn w-100 ${forgotPasswordMutation.isPending ? "bg-secondary text-light" : ""}`}
          >
            {forgotPasswordMutation.isPending ? "Sending email...." : "Submit"}
          </button>
        </form>
      </section>
    </div>
  );
};
