import userImage from "../assets/userImage.png";
import { useUsers } from "../hooks/useUsers";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export const UserSettings = () => {
  const { meQuery } = useAuth();
  const { data: response } = meQuery;
  const user = response?.data?.user;

  const {
    updateAvatarMutation,
    updateUserInfoMutation,
    resetPasswordMutation,
  } = useUsers();

  const {
    register: userInfoRegister,
    formState: { errors: userInfoErrors },
    handleSubmit: handleUserInfo,
  } = useForm({
    values: { name: user?.name, email: user?.email, phone: user?.phone },
  });

  const {
    register: passwordRegister,
    formState: { errors: passwordErrors },
    handleSubmit: hanldePassword,
    getValues,
    reset,
  } = useForm();

  const handleUpdateUserInfo = (userInfoForm) => {
    updateUserInfoMutation.mutate(userInfoForm, {
      onSuccess: () => {
        toast.success("User info updated");
      },
    });
  };

  const handleResetPassword = (passwordForm) => {
    resetPasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        toast.success("Password updated");
        reset();
      },
    });
  };

  return (
    <div className="d-flex flex-column gap-3 mb-5">
      <div>
        <h3 className="my-4 text-center">User Settings</h3>
      </div>
      {updateAvatarMutation.isPending && (
        <span className="spinner-border mx-auto"></span>
      )}
      <div className="avatar-section text-center my-4">
        <img
          src={user?.image || userImage}
          alt="person"
          className="user-image"
          loading="lazy"
        />
        <label htmlFor="avatar" className="cursor-pointer">
          <i className="bi bi-camera ms-2"></i>
        </label>
        <input
          type="file"
          className="d-none"
          id="avatar"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            updateAvatarMutation.mutate(file, {
              onSuccess: () => {
                toast.success("Avatar updated successfully");
              },
              onError: (error) => {
                toast.error(
                  error?.status === 429
                    ? "Too many requests, try again later"
                    : error?.message,
                );
              },
            });
          }}
        />
      </div>

      <div className="user-info-section mx-auto card p-3">
        <h5>Account Details</h5>
        <form
          className="w-100 d-flex flex-column gap-3"
          onSubmit={handleUserInfo(handleUpdateUserInfo)}
        >
          {updateUserInfoMutation.isError && (
            <div className="alert alert-danger">
              <span>
                {updateUserInfoMutation.error?.response?.status === 429
                  ? "Too many requests. Please wait a moment and try again."
                  : updateUserInfoMutation.error?.response?.data?.message}
              </span>
            </div>
          )}

          <div>
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="name" className="fw-bold text-secondary">
                Name
              </label>
              {userInfoErrors?.name && (
                <span className="user-settings-input-error">
                  {userInfoErrors.name.message}
                </span>
              )}
            </div>
            <input
              type="text"
              id="name"
              className={`form-control`}
              {...userInfoRegister("name", {
                required: "Name is required",
              })}
            />
          </div>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="email" className="fw-bold text-secondary">
                Email
              </label>
              {userInfoErrors?.email && (
                <span className="user-settings-input-error">
                  {userInfoErrors.email.message}
                </span>
              )}
            </div>
            <input
              type="email"
              id="email"
              className={`form-control`}
              {...userInfoRegister("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
          </div>
          <div>
            {" "}
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="phone" className="fw-bold text-secondary">
                Phone
              </label>
              {userInfoErrors?.phone && (
                <span className="user-settings-input-error">
                  {userInfoErrors.phone.message}
                </span>
              )}
            </div>
            <input
              type="text"
              id="phone"
              className={`form-control`}
              {...userInfoRegister("phone", {
                required: "Phone is required",
              })}
            />
          </div>
          <button
            disabled={updateUserInfoMutation.isPending}
            className={`w-100 btn  text-light ${updateUserInfoMutation.isPending ? "bg-secondary" : "bg-dark"}`}
          >
            {updateUserInfoMutation.isPending
              ? "Updating user info..."
              : "Submit"}
          </button>
        </form>
      </div>
      <div className="password-section mx-auto card p-3">
        <h5>Password</h5>
        <form
          className="w-100  d-flex flex-column gap-3"
          onSubmit={hanldePassword(handleResetPassword)}
        >
          {resetPasswordMutation.isError && (
            <div className="alert alert-danger">
              <span>
                {resetPasswordMutation.error?.response?.data?.message}
              </span>
            </div>
          )}
          {user?.hasPassword && (
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center">
                <label
                  htmlFor="old-password"
                  className="fw-bold text-secondary"
                >
                  Old Password
                </label>
                {passwordErrors?.oldPassword && (
                  <span className="user-settings-input-error">
                    {passwordErrors.oldPassword.message}
                  </span>
                )}
              </div>
              <input
                type="password"
                id="old-password"
                className={`form-control`}
                {...passwordRegister("oldPassword", {
                  required: "Old password is required",
                })}
              />
            </div>
          )}

          <div>
            <div className="d-flex justify-content-between align-items-center">
              {" "}
              <label htmlFor="new-password" className="fw-bold text-secondary">
                New Password
              </label>
              {passwordErrors?.newPassword && (
                <span className="user-settings-input-error">
                  {passwordErrors.newPassword.message}
                </span>
              )}
            </div>
            <input
              type="password"
              id="new-password"
              className={`form-control`}
              {...passwordRegister("newPassword", {
                required: "New is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,30}$/,
                  message: "Set a stronger password",
                },
              })}
            />
          </div>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              {" "}
              <label
                htmlFor="confirm-new-password"
                className="fw-bold text-secondary"
              >
                Confirm New Password
              </label>
              {passwordErrors?.confirmNewPassword && (
                <span className="user-settings-input-error text-nowrap">
                  {passwordErrors.confirmNewPassword.message}
                </span>
              )}
            </div>
            <input
              type="password"
              id="confirm-new-password"
              className={`form-control`}
              {...passwordRegister("confirmNewPassword", {
                required: "Confirm new password is required",
                validate: (value) => {
                  return value === getValues("newPassword")
                    ? true
                    : "Passwords do not match";
                },
              })}
            />
          </div>
          <button
            disabled={resetPasswordMutation.isPending}
            className={`w-100 btn  text-light ${resetPasswordMutation.isPending ? "bg-secondary " : "bg-dark"}`}
          >
            {resetPasswordMutation.isPending
              ? "Resetting password..."
              : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};
