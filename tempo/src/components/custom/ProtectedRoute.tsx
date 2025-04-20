import React from "react";
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
  return <div></div>;
}

export default ProtectedRoute;
