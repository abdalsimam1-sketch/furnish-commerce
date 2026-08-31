import { Outlet } from "react-router-dom";
import { AdminSideBar } from "./AdminSideBar";
import { useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { logoutMutation } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const logoutRef = useRef();
  const toggleMenu = () => {
    setMenuOpen((current) => !current);
  };
  return (
    <div className="min-vh-100 d-flex" onClick={() => setMenuOpen(false)}>
      <div className="sidebar d-none d-md-block">
        <AdminSideBar
          onLogoutClick={() => logoutRef.current.showModal()}
        ></AdminSideBar>
      </div>
      <div className="outlet flex-grow-1">
        <div className="d-flex  d-md-none justify-content-between align-items-center border-bottom   position-relative">
          <h1
            className="ms-2 cursor-pointer"
            onClick={() => navigate("/admin/dashboard")}
          >
            Furnish
          </h1>
          <i
            className={`bi-${menuOpen ? "x" : "list"} fs-2 btn btn-sm me-2 `}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          ></i>
          {menuOpen && (
            <div className="admin-menu d-flex flex-column  bg-light  text-center border-bottom border-top border-dark">
              <span
                className="border-bottom p-2 cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/");
                }}
              >
                Home
              </span>
              <span
                className="border-bottom p-2 cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin/dashboard");
                }}
              >
                Dashboard
              </span>
              <span
                className="border-bottom p-2 cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin/products");
                }}
              >
                Products
              </span>
              <span
                className="border-bottom p-2 cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin/orders");
                }}
              >
                Orders
              </span>
              <span
                className="border-bottom p-2 cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin/users");
                }}
              >
                Users
              </span>
              <button
                className="btn btn-outline-danger my-3"
                onClick={() => {
                  logoutRef.current.showModal();
                }}
              >
                <i className="bi-box-arrow-right me-2"></i>Logout
              </button>
            </div>
          )}
        </div>

        <Outlet></Outlet>
      </div>
      <dialog ref={logoutRef} className="rounded logout-modal">
        <div className="text-center d-flex flex-column gap-3 p-3">
          <span>Are you sure you want to logout ?</span>
          <div className="d-flex gap-3">
            <button
              className="btn btn-sm w-100 bg-dark text-light"
              onClick={() => {
                logoutMutation.mutate();
                logoutRef.current.close();
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-sm w-100 btn-outline-danger"
              onClick={() => {
                logoutRef.current.close();
              }}
            >
              No
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};
