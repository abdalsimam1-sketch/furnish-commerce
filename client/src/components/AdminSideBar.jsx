import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const AdminSideBar = ({ onLogoutClick }) => {
  const { pathname } = useLocation();
  const activeLink = (link) => {
    return pathname === link ? "active-link" : "inactive-link";
  };
  return (
    <div className="border-end  h-100  m-0 admin-side-bar text-center pt-4 d-flex flex-column gap-5">
      <h1>Furnish</h1>
      <div
        style={{ height: "80vh" }}
        className="d-flex flex-column justify-content-between px-5 "
      >
        <div className="d-flex flex-column gap-4 text-start">
          <Link
            className={`btn text-start btn-sm ${activeLink("/admin/dashboard")}`}
            to="/admin/dashboard"
          >
            <i className="bi bi-grid me-3"></i>
            Dashboard
          </Link>
          <Link
            className={`btn text-start btn-sm  ${activeLink("/admin/orders")}`}
            to="/admin/orders"
          >
            <i className="bi-receipt me-3"></i>Orders
          </Link>
          <Link
            className={`btn text-start btn-sm ${activeLink("/admin/products")}`}
            to="/admin/products"
          >
            <i className="bi-box-seam me-3"></i>Products
          </Link>
          <Link
            className={`btn text-start btn-sm ${activeLink("/admin/users")}`}
            to="/admin/users"
          >
            <i className="bi-people me-3"> </i>Users
          </Link>
          <Link className="btn bg-dark btn-sm text-start text-light" to="/">
            <i className="bi-house me-3"> </i>Back to Store
          </Link>
        </div>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={onLogoutClick}
        >
          <i className="bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </div>
  );
};
