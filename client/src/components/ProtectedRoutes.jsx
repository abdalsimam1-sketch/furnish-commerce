import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const ProtectedRoutes = ({ children }) => {
  const { meQuery } = useAuth();
  const { data: response, isLoading, isError } = meQuery;
  const navigate = useNavigate();

  const user = response?.data?.user;
  console.log(user);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please login in to view this page");
      navigate("/");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
      </div>
    );
  }
  if (!user) {
    return null;
  }

  return children;
};
