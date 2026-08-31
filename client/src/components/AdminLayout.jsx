import { Outlet } from "react-router-dom";
import { AdminSideBar } from "./AdminSideBar";
import { useRef } from "react";
import { useAuth } from "../hooks/useAuth";

export const AdminLayout = () => {
  const { logoutMutation } = useAuth();
  const logoutRef = useRef();
  return (
    <div className="min-vh-100 d-flex">
      <div className="sidebar d-none d-md-block">
        <AdminSideBar
          onLogoutClick={() => logoutRef.current.showModal()}
        ></AdminSideBar>
      </div>
      <div className="outlet flex-grow-1">
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
