import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load authentication state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to login and update state
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  // Function to logout and update state
  const logout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", { withCredentials: true });

      // Clear authentication state
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");

      // Optionally, redirect user to login page
      window.location.href = "/"; // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
