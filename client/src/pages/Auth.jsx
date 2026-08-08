import { useState } from "react";
import { Input } from "../components/Input";

const AUTH_MODES = {
  SIGNUP: "signup",
  LOGIN: "login",
};

export const Auth = () => {
  const [authMode, setAuthMode] = useState(AUTH_MODES.LOGIN);
  return (
    <div className="auth-page d-flex flex-column flex-md-row">
      <section className="auth-image"></section>
      <section className="auth-form-section d-flex justify-content-center align-items-center p-3">
        <form className="auth-form d-flex flex-column gap-3">
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
                    onClick={() => setAuthMode(AUTH_MODES.SIGNUP)}
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-success fw-bold text-decoration-underline ps-2 cursor-pointer"
                    onClick={() => setAuthMode(AUTH_MODES.LOGIN)}
                  >
                    Sign In
                  </span>
                </>
              )}
            </span>
          </header>

          <div className="d-flex flex-column gap-4">
            {authMode !== AUTH_MODES.LOGIN && (
              <Input placeholder="Name" type="text"></Input>
            )}
            {authMode !== AUTH_MODES.LOGIN && (
              <Input placeholder="Phone" type="tel"></Input>
            )}
            <Input type="email" placeholder="Email"></Input>
            <Input type="password" placeholder="Password"></Input>
            {authMode !== AUTH_MODES.LOGIN && (
              <Input type="password" placeholder="Confirm Password"></Input>
            )}
            <div className="d-flex gap-3 flex-md-column flex-lg-row">
              <button className="btn auth-btn w-100">Submit</button>
              <button type="button" className="btn google-btn w-100">
                <i className="bi bi-google  p-0"></i> Continue with Google
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
