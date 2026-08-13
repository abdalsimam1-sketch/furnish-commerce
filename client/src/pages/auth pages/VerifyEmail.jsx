import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../../services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const VerifyEmail = () => {
  const { token } = useParams();

  const verifyQuery = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: () => verifyEmail(token),
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (verifyQuery.isPending) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center p-3">
        <span className="alert alert-secondary ">
          <span>Verifying email...</span>
        </span>
      </div>
    );
  }
  if (verifyQuery.error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center p-3">
        <span className="alert alert-danger">
          <span>{verifyQuery.error?.response?.data?.message}!</span>
        </span>
      </div>
    );
  }
  if (verifyQuery.data) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center p-3">
        <span className="alert alert-success">
          <span>{verifyQuery.data?.message}. You can close this tab now!</span>
        </span>
      </div>
    );
  }
  return null;
};
