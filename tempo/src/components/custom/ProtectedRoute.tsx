import { API_URL } from "@/config/api";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  console.log("ProtectedRoute rendered");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, {
          credentials: "include",
        });
        setIsAuthenticated(res.ok);
      } catch (err) {
        console.error("Error checking me:", err);
        console.log(err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default ProtectedRoute;
