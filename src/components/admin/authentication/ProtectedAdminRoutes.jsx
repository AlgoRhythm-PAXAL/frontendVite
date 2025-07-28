import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
import LoadingAnimation from "../../../utils/LoadingAnimation";

const ProtectedAdminRoute = () => {
  const { isAuthenticated, loading } = useAdminAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
       <LoadingAnimation message="Checking admin authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render protected content if authenticated
  return <Outlet />;
};

export default ProtectedAdminRoute;
