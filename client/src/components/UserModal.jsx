import { useNavigate } from "react-router-dom";

export const UserModal = ({ user, onLogoutClick, onLoginClick, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="user-modal p-3 rounded d-flex flex-column gap-3 text-nowrap">
      {user && (
        <button
          className="rounded px-2 py-1 "
          onClick={() => {
            navigate("/settings");
            onClose();
          }}
        >
          <i className="bi bi-gear me-2"></i>
          User Settings
        </button>
      )}
      {user ? (
        <button
          className="rounded px-2 py-1  text-danger border-danger"
          onClick={onLogoutClick}
        >
          <i className="bi-box-arrow-right me-2"></i>Logout
        </button>
      ) : (
        <button className="rounded px-2 py-1" onClick={onLoginClick}>
          <i className="bi-box-arrow-in-right me-2"></i>Login
        </button>
      )}
    </div>
  );
};
