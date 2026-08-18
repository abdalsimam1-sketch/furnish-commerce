import { useNavigate } from "react-router-dom";
export const LoginRequired = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div
      className="overlay d-flex justify-content-center align-items-center text-center"
      onClick={onClose}
    >
      <div className="login-required card position-absolute p-4 ">
        <div className="d-flex flex-column gap-3">
          <h6> Login is required to perform this action</h6>
          <div className="d-flex  gap-3">
            {" "}
            <button
              onClick={onClose}
              className="btn btn-outline-danger  w-100 btn-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="btn bg-dark text-light w-100 btn-sm"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
