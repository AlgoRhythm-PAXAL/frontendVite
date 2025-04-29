import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const inactivityTimer = useRef(null);
  const INACTIVITY_TIMEOUT = 15*60*1000; // 15 minutes

  // Logout handler
  const handleLogout = useCallback(async (message = "Session expired due to inactivity") => {
    try {
      await axios.post(`${backendURL}/admin/logout`, {}, { 
        withCredentials: true 
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      toast.warning(message);
      setIsAuthenticated(false);
      navigate("/admin/login", { replace: true });
    }
  }, [backendURL, navigate]);

  // Reset inactivity timer on user activity
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  // Activity detection handler
  const handleActivity = useCallback(() => {
    if (isAuthenticated) {
      resetInactivityTimer();
      verifySession(false);
    }
  }, [isAuthenticated, resetInactivityTimer]);

  const adminRefreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(
        `${backendURL}/admin/refresh`,
        {},
        { withCredentials: true }
      );
      return response.data.expiresAt;
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout("Session expired. Please log in again.");
      }
      return null;
    }
  }, [backendURL, handleLogout]);

  const scheduleTokenRefresh = useCallback((expiresAt) => {
    const timeout = expiresAt - Date.now() - 5000; // 5-second buffer
    if (timeout > 0) {
      setTimeout(async () => {
        const newExpiresAt = await adminRefreshAccessToken();
        if (newExpiresAt) scheduleTokenRefresh(newExpiresAt);
      }, timeout);
    }
  }, [adminRefreshAccessToken]);

  const verifySession = useCallback(async (initialCheck = true) => {
    try {
      const response = await axios.get(`${backendURL}/admin/status`, {
        withCredentials: true,
        timeout: 5000
      });
      
      if (!isAuthenticated) setIsAuthenticated(true);
      scheduleTokenRefresh(response.data.expiresAt);
      
    } catch (error) {
      if (initialCheck) {
        const newExpiresAt = await adminRefreshAccessToken();
        if (newExpiresAt) return verifySession(false);
      }
      handleLogout();
    }
  }, [backendURL, adminRefreshAccessToken, scheduleTokenRefresh, isAuthenticated, handleLogout]);

  useEffect(() => {
    // Set up activity listeners
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => 
      window.addEventListener(event, handleActivity)
    );

    // Initial verification
    verifySession();
    resetInactivityTimer();

    // Cleanup
    return () => {
      events.forEach(event => 
        window.removeEventListener(event, handleActivity)
      );
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [handleActivity, verifySession, resetInactivityTimer]);

  if (isAuthenticated === null) {
    return <div className="m-auto">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;





// import { Navigate, Outlet } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { Link, useLocation,useNavigate } from "react-router-dom";

// const ProtectedAdminRoute = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const refreshBuffer = 0;//5 * 60 * 1000;  5 minutes
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const { data } = await axios.post(
//         `${backendURL}/admin/logout`,
//         {},
//         { withCredentials: true }
//       );

//       // Success handling
//       toast.success(data.message || "Logged out successfully");
//       console.log("Logout success:", data.message);
//       navigate("/admin/login");

//     } catch (error) {
//       // Error handling
//       const errorMessage = error.response?.data?.message || "Logout failed";
//       const statusCode = error.response?.status;

//       // Show appropriate toast
//       if (statusCode === 401) {
//         toast.warning("Session expired, please login again");
//       } else {
//         toast.error(errorMessage);
//       }

//       console.error("Logout error:", errorMessage);

//       // Redirect if unauthorized
//       if (statusCode === 401) {
//         navigate("/admin/login");
//       }
//     }
//   };
//   const adminRefreshAccessToken = async () => {
//     try {
//       const response = await axios.post(`${backendURL}/admin/refresh`,{},{ withCredentials: true});
//       return response.data.expiresAt;
//     } catch (err) {
//       if (err.response?.status === 401) {
//         toast.warning("Session expired. Please log in again.");
//       }
//       return null;
//     }
//   };

//   const scheduleTokenRefresh = (expiresAt) => {
//     const timeout = expiresAt - Date.now() - refreshBuffer;
    
//     if (timeout > 0) {
//       setTimeout(async () => {
//         const newExpiresAt = await adminRefreshAccessToken();
//         if (newExpiresAt) {
//           scheduleTokenRefresh(newExpiresAt); // Recursive scheduling
//           console.log("Token refreshed successfully. New expiry:", new Date(newExpiresAt));
//         } else {
//           setIsAuthenticated(false);
//         }
//       }, timeout);
//     } else {
//       // Immediate refresh needed
//       adminRefreshAccessToken().then(newExpiresAt => {
//         if (newExpiresAt) scheduleTokenRefresh(newExpiresAt);
//         else setIsAuthenticated(false);
//       });
//     }
//   };

//   const verifySession = async (initialCheck = true) => {
//     try {
//       const response = await axios.get(`${backendURL}/admin/status`, {
//         withCredentials: true,
//         timeout: 5000
//       });
      
//       setIsAuthenticated(true);
//       scheduleTokenRefresh(response.data.expiresAt);
      
//     } catch (error) {
//       if (initialCheck) {
//         // Attempt silent refresh on initial load
//         const newExpiresAt = await adminRefreshAccessToken();
//         if (newExpiresAt) {
//           verifySession(false);
//           return;
//         }
//       }
//       setIsAuthenticated(false);
//     }
//   };

//   useEffect(() => {
//     verifySession();
    
//     // Activity-based refresh
//     const activityHandler = () => {
//       if (isAuthenticated) verifySession(false);
//     };

//     window.addEventListener('mousemove', activityHandler);
//     window.addEventListener('keydown', activityHandler);

//     return () => {
//       window.removeEventListener('mousemove', activityHandler);
//       window.removeEventListener('keydown', activityHandler);
//     };
//   }, []);

//   if (isAuthenticated === null) {
//     return <div className="m-auto">Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/admin/login" />;
//   }
  
//   return <Outlet />;
  
// };

// export default ProtectedAdminRoute;





// import { Navigate, Outlet } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// const ProtectedAdminRoute = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   const backendURL = import.meta.env.VITE_BACKEND_URL;

//   const adminRefreshAccessToken = async () => {
//     try {
//       const response = await axios.post(`${backendURL}/admin/refresh`,{},{ withCredentials: true });
//       return response.data.expiresAt;
//     } catch (err) {
//       console.error("Refresh error:", err);
//       toast.error("Session expired. Please log in again.");
//       return null;
//     }
//   };
//   const timeOutSession = (expiresAt) => {
//     const bufferTime = 3000;
//     const timeout = expiresAt - Date.now() - bufferTime;
//     if (timeout > 0) {
//       setTimeout(async () => {
//         const newExpiresAt = await adminRefreshAccessToken();
//         if (newExpiresAt) {
//           console.log("Token refreshed successfully");
//           // Reschedule for new token
//         } else {
//           toast.warning("Session expired. Please log in again."); //  show warning toast
//           setIsAuthenticated(false); //  logout the user
//         }
//       }, timeout);
//     }
//   };
//   const verifySession = async () => {
//     try {
//       const response = await axios.get(`${backendURL}/admin/status`, {
//         withCredentials: true,
//       });
//       const expiresAt = response.data.expiresAt;
//       setIsAuthenticated(true);
//       timeOutSession(expiresAt);
//     } catch (error) {
//       console.error("Token verification failed:", error);
//       setIsAuthenticated(false);
//     }
//   };

//   useEffect(() => {
//     // const verifyToken = async () => {
//     //   try {
//     //     const response = await axios.get(`${backendURL}/admin/status`, { withCredentials: true});
//     //     console.log("Token Verified!");
//     //     setIsAuthenticated(true);
//     //     // Set logout timer based on token expiration
//     //     const expiresAt = response.data.expiresAt;
//     //     const timeout = expiresAt - Date.now();
//     //     if (timeout > 0) {
//     //       setTimeout(() => {
//     //         toast.warning("Session expired. Please log in again."); //  show warning toast
//     //         setIsAuthenticated(false); //  logout the user
//     //       }, timeout);
//     //     }
//     //   } catch (error) {
//     //     console.error("Token verification failed:", error);
//     //     setIsAuthenticated(false);
//     //   }
//     // };

//     // verifyToken();
//     verifySession();
//   }, []);

//   if (isAuthenticated === null) return <div className="m-auto">Loading...</div>;
//   isAuthenticated ? console.log("Authenticated!") : console.log("Not verified");

//   return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
// };

// export default ProtectedAdminRoute;
