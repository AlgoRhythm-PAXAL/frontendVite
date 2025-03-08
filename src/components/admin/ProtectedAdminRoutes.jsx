import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const ProtectedAdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:8000/admin/status", { withCredentials: true });
        console.log("Token Verified!",response);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  isAuthenticated?console.log("Authenticated!"):console.log("Not verified");

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedAdminRoute;
