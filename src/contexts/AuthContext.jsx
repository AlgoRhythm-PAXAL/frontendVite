import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load authentication state from localStorage
  // useEffect(() => {
  //   const storedAuth = localStorage.getItem("isAuthenticated");
  //   if (storedAuth === "true") {
  //     setIsAuthenticated(true);
  //     fetchUser(); // Fetch user profile
  //   }
  // }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      if (storedAuth === 'true') {
        try {
          await fetchUser(); // Validate token
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Session expired:', error);
          logout(); // Clear invalid session
        }
      }
      setLoading(false); // Auth check complete
    };

    checkAuth();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/auth/profile',
        {
          withCredentials: true,
        }
      );

      console.log('Fetched user:', response.data);
      setUser(response.data.data.user); // ✅ Corrected here
    } catch (error) {
      console.error('Fetch user failed:', error.message);
    }
  };

  // Function to login and update state
  const login = async () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    await fetchUser(); // Fetch user after login
  };

  // Function to logout and update state
  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/logout', {
        withCredentials: true,
      });

      // Clear authentication state
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');

      // Optionally, redirect user to login page
      window.location.href = '/'; // Redirect to login after logout
    } catch (error) {
      console.error(
        'Logout failed:',
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
