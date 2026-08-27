import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const AdminRoutes = ({ children }) => {
  const navigate = useNavigate();
  const { meQuery } = useAuth();
  const { data: response, isLoading } = meQuery;
  const user = response?.data?.user;

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      navigate("/");
      toast.error("Only admin allowed");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
      </div>
    );
  }
  if (!user || user.role !== "admin") {
    return null;
  }

  return children;
};
