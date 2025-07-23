import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

const ProtectedAdminRoute = () => {
  const { isAuthenticated, loading } = useAdminAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Authenticating...</p>
        </div>
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
