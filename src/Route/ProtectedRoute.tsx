import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
