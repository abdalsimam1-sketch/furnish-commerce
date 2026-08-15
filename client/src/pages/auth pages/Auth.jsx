import { useState } from "react";
import { Input } from "../../components/Input";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const AUTH_MODES = {
  SIGNUP: "signup",
  LOGIN: "login",
};

export const Auth = () => {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm();
  const { loginMutation, signupMutation, resendVerificationEmailMutation } =
    useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState(AUTH_MODES.LOGIN);

  const onSubmit = async (authForm) => {
    if (authMode === AUTH_MODES.LOGIN) {
      loginMutation.mutate(
        {
          email: authForm.email,
          password: authForm.password,
        },
        {
          onSuccess: () => {
            navigate("/");
          },
        },
      );
    } else {
      signupMutation.mutate(authForm, {
        onSuccess: () => {
          setAuthMode(AUTH_MODES.LOGIN);
          reset();
        },
      });
    }
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
            {" "}
            <h2 className="">
              {authMode === AUTH_MODES.LOGIN ? <>Sign In</> : <>Sign Up</>}
            </h2>
            <span className="text-muted">
              {authMode === AUTH_MODES.LOGIN ? (
                <>
                  Don't have an account yet?
                  <span
                    className="text-success fw-bold text-decoration-underline ps-2 cursor-pointer"
                    onClick={() => {
                      setAuthMode(AUTH_MODES.SIGNUP);
                      reset();
                    }}
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-success fw-bold text-decoration-underline ps-2 cursor-pointer"
                    onClick={() => {
                      setAuthMode(AUTH_MODES.LOGIN);
                      reset();
                    }}
                  >
                    Sign In
                  </span>
                </>
              )}
            </span>
          </header>

          <div className="errors-section">
            {authMode === AUTH_MODES.LOGIN && loginMutation.error && (
              <div className="alert alert-danger w-100 d-flex justify-content-between align-items-center">
                <span>
                  {loginMutation.error?.response?.status === 429 ? (
                    <>Too many requests, try again later</>
                  ) : (
                    <>{loginMutation.error?.response?.data?.message}</>
                  )}
                </span>

                {loginMutation.error?.response?.status === 401 &&
                  loginMutation.error?.response?.data?.message !==
                    "Invalid email or password" && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      type="button"
                      onClick={() =>
                        resendVerificationEmailMutation.mutate(
                          {
                            email: getValues("email"),
                          },
                          {
                            onSuccess: () => {
                              toast.success("Verification email resent");
                            },
                            onError: () => {
                              toast.error("Verification email resend failed");
                            },
                          },
                        )
                      }
                    >
                      Resend verification email
                    </button>
                  )}
              </div>
            )}
            {authMode === AUTH_MODES.SIGNUP && signupMutation.error && (
              <div className="alert alert-danger w-100 ">
                <span>
                  {signupMutation.error?.response?.status === 429 ? (
                    <>Too many requests, try again later</>
                  ) : (
                    <>{signupMutation.error?.response?.data?.message}</>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="d-flex flex-column gap-4">
            {authMode !== AUTH_MODES.LOGIN && (
              <Input
                placeholder="Name"
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: 3,
                })}
                error={errors.name?.message}
              ></Input>
            )}
            {authMode !== AUTH_MODES.LOGIN && (
              <Input
                placeholder="Phone"
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  maxLength: "11",
                  minLength: "11",
                })}
                error={errors.phone?.message}
              ></Input>
            )}
            <div className="position-relative">
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
              {authMode === AUTH_MODES.LOGIN && (
                <span className="forgot-password-link text-muted">
                  <Link to="/forgot-password">Forgot password</Link>
                </span>
              )}
            </div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,30}$/,
                  message: "Password doesn't meet requirements",
                },
              })}
              error={errors.password?.message}
            ></Input>
            {authMode !== AUTH_MODES.LOGIN && (
              <Input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === getValues("password") || "Password do not match",
                })}
                error={errors.confirmPassword?.message}
              ></Input>
            )}
            <div className="d-flex gap-3 flex-md-column flex-lg-row pb-5 pb-md-0">
              <button
                className={`btn auth-btn w-100 ${loginMutation.isPending || signupMutation.isPending ? "text-light bg-secondary" : ""}`}
                disabled={loginMutation.isPending || signupMutation.isPending}
              >
                {loginMutation.isPending
                  ? "Signing in....."
                  : signupMutation.isPending
                    ? "Signing up...."
                    : "Submit"}
              </button>
              <button
                type="button"
                className="btn google-btn w-100 text-nowrap "
                onClick={() =>
                  (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
                }
              >
                <i className="bi bi-google  p-0"></i> Continue with Google
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
