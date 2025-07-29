import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const backendURL = import.meta.env.VITE_BACKEND_URL;


const ProtectedStaffRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${backendURL}/staff/status`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) return <LoadingSpinner/>;
  isAuthenticated ? console.log('Authenticated!') : console.log('Not verified');

  return isAuthenticated ? <Outlet /> : <Navigate to="/staff/login" />;
};

export default ProtectedStaffRoute;
