// // components/ProtectedRoute.jsx
// import { useContext } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';

// const ProtectedRoute = () => {
//   const { isAuthenticated, loading } = useContext(AuthContext);

//   // Show loading state while checking auth
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // If not authenticated, redirect to login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // If authenticated, render the child routes
//   return <Outlet />;
// };

// export default ProtectedRoute;


import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
