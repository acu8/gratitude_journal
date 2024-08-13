import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useUser();

  console.log("ProtectedRoute: isAuthenticated =", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
