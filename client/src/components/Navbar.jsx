import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserModal } from "../components/UserModal";
import { useAuth } from "../hooks/useAuth";

export const Navbar = ({ onCartClick, onLogoutClick }) => {
  const { meQuery, logoutMutation } = useAuth();
  const { data: response } = meQuery;
  const user = response?.data?.user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const toggleUserModal = () => {
    setUserModalOpen((current) => !current);
  };
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuOpen((current) => !current);
  };
  const { pathname } = useLocation();
  const activeLink = (link) => {
    return pathname === link ? "text-dark" : "";
  };
  const navigateToContactUs = () => {
    if (pathname === "/") {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#contact");
      setUserModalOpen(false);
    }
  };
  return (
    <nav className="d-flex align-items-center justify-content-between px-2 border-bottom position-relative">
      <div>
        <h1 onClick={() => navigate("/")} className="cursor-pointer">
          Furnish
        </h1>
      </div>
      <div className="d-none d-md-flex gap-3 fw-bold text-muted">
        <span
          className={`cursor-pointer ${activeLink("/")}`}
          onClick={() => {
            navigate("/");
            setUserModalOpen(false);
          }}
        >
          Home
        </span>
        <span
          className={`cursor-pointer ${activeLink("/shop")}`}
          onClick={() => {
            navigate("/shop");
            setUserModalOpen(false);
          }}
        >
          Shop
        </span>
        <span
          className={`cursor-pointer ${activeLink("/orders")}`}
          onClick={() => {
            navigate("/orders");
            setUserModalOpen(false);
          }}
        >
          Orders
        </span>
        <span className="cursor-pointer" onClick={navigateToContactUs}>
          Contact Us
        </span>
      </div>
      <div className="d-flex gap-3 fs-4 align-items-center">
        <div className="position-relative">
          <i className="bi bi-person-circle btn" onClick={toggleUserModal}></i>
          {userModalOpen && (
            <UserModal
              onClose={() => setUserModalOpen(false)}
              user={user}
              onLogoutClick={() => {
                logoutMutation.mutate();
                setUserModalOpen(false);
              }}
              onLoginClick={() => {
                navigate("/auth");
                setUserModalOpen(false);
              }}
            ></UserModal>
          )}
        </div>
        <i
          className="bi bi-bag btn"
          onClick={() => {
            onCartClick();
            setUserModalOpen(false);
          }}
        ></i>
      </div>
      <i
        className={`bi bi-${menuOpen ? "x" : "list"} fs-2 btn d-md-none`}
        onClick={toggleMenu}
      ></i>
      {menuOpen && (
        <div className="d-md-none mobile-menu z-1 d-flex flex-column text-center bg-light">
          <span
            className="cursor-pointer border-bottom border-top py-2"
            onClick={() => {
              toggleMenu();
              navigate("/");
              setUserModalOpen(false);
            }}
          >
            Home
          </span>
          <span
            className="cursor-pointer border-bottom border-top py-2"
            onClick={() => {
              toggleMenu();
              navigate("/shop");
              setUserModalOpen(false);
            }}
          >
            Shop
          </span>

          <span
            className="cursor-pointer border-bottom py-2"
            onClick={() => {
              toggleMenu();
              navigate("/orders");
              setUserModalOpen(false);
            }}
          >
            Orders
          </span>
          <span
            className="cursor-pointer border-bottom py-2"
            onClick={navigateToContactUs}
          >
            Contact Us
          </span>
        </div>
      )}
    </nav>
  );
};
