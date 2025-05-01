import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const inactivityTimer = useRef(null);
  const INACTIVITY_TIMEOUT = 15 *60* 1000; // 15 minutes

  // Handle logout - clear session and redirect
  const handleLogout = useCallback(
    async (message) => {
      // Clear inactivity timer
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = null;
      }
      
      try {
        // Call logout endpoint to invalidate server-side tokens
        await axios.post(`${backendURL}/admin/logout`, {}, { 
          withCredentials: true,
        });
      } catch (error) {
        console.error("Logout error:", error);
        // Continue with logout even if server request fails
      } finally {
        toast.warning(message);
        setIsAuthenticated(false);
        navigate("/admin/login", { replace: true });
      }
    },
    [backendURL, navigate]
  );

  // Reset inactivity timer on user activity
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    
    inactivityTimer.current = setTimeout(() => {
      console.log("Inactivity timeout reached, logging out");
      handleLogout("You have been logged out due to inactivity");
    }, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  // Attempt to refresh access token
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(
        `${backendURL}/admin/refresh`,
        {},
        { withCredentials: true }
      );
      console.log("Token refreshed successfully");
      return response.data.expiresAt;
    } catch (err) {
      console.error("Token refresh failed:", err.response?.status);
      
      // Status 401/403 typically means refresh token has expired or is invalid
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("Refresh token expired or invalid, logging out");
        handleLogout("Session expired. Please log in again.");
      }
      return null;
    }
  }, [backendURL, handleLogout]);

  // Schedule token refresh near expiration
  const scheduleTokenRefresh = useCallback(
    (expiresAt) => {
      const now = Date.now();
      const timeout = expiresAt - now - 0; // 5-second buffer
      
      if (timeout <= 0) {
        // Token already expired, refresh immediately
        refreshAccessToken();
        return;
      }
      
      console.log(`Scheduling token refresh in ${Math.round(timeout/1000)} seconds`);
      
      // Set timer for refresh
      setTimeout(async () => {
        console.log("Executing scheduled token refresh");
        const newExpiresAt = await refreshAccessToken();
        if (newExpiresAt) {
          scheduleTokenRefresh(newExpiresAt);
        }
        // If refresh fails, handleLogout will be called from refreshAccessToken
      }, timeout);
    },
    [refreshAccessToken]
  );

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (isAuthenticated) {
      // Reset inactivity timer on activity
      resetInactivityTimer();
    }
  }, [isAuthenticated, resetInactivityTimer]);

  // Verify session status
  const verifySession = useCallback(
    async (initialCheck = true) => {
      try {
        if (initialCheck) {
          setIsLoading(true);
        }
        
        // Check admin status on backend
        const response = await axios.get(`${backendURL}/admin/status`, {
          withCredentials: true,
          timeout: 8000,
        });

        // Update authentication state and schedule refresh
        setIsAuthenticated(true);
        scheduleTokenRefresh(response.data.expiresAt);
        
        // Reset inactivity timer on successful verification
        resetInactivityTimer();
        
      } catch (error) {
        console.error("Session verification failed:", error.response?.status);
        
        // Try silent refresh if initial check fails due to expired access token
        if (initialCheck && (error.response?.status === 401 || error.response?.status === 403)) {
          console.log("Access token expired, attempting refresh");
          const newExpiresAt = await refreshAccessToken();
          
          if (newExpiresAt) {
            // Successful refresh, retry verification
            setIsAuthenticated(true);
            scheduleTokenRefresh(newExpiresAt);
            resetInactivityTimer();
            setIsLoading(false);
            return;
          }
        }
        
        // If we reach here, verification failed completely
        handleLogout("Session expired. Please log in again.");
      } finally {
        if (initialCheck) {
          setIsLoading(false);
        }
      }
    },
    [
      backendURL,
      refreshAccessToken,
      scheduleTokenRefresh,
      resetInactivityTimer,
      handleLogout,
    ]
  );

  // Set up event listeners and initialize session
  useEffect(() => {
    // Start with session verification
    verifySession();
    
    // Set up activity listeners for inactivity detection
    const activityEvents = ["mousedown", "mousemove", "keydown", "touchstart", "scroll", "click"];
    
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });
    
    // Cleanup on unmount
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [handleActivity, verifySession]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-gray-700">Verifying session...</div>
      </div>
    );
  }

  // Return outlet or redirect
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;






// import { Navigate, Outlet } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// const ProtectedAdminRoute = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const navigate = useNavigate();
//   const inactivityTimer = useRef(null);
//   const INACTIVITY_TIMEOUT = 15*60*1000; // 15 minutes

//   // Logout handler
//   const handleLogout = useCallback(
//     async () => {
//       try {await axios.post( `${backendURL}/admin/logout`, {}, { withCredentials: true, } );
//       } catch (error) {
//         console.error("Logout error:", error);
//       } finally {
//         toast.warning("Session expired due to inactivity");
//         setIsAuthenticated(false);
//         navigate("/admin/login", { replace: true });
//       }
//     },
//     [backendURL, navigate]
//   );

//   // Reset inactivity timer on user activity
//   const resetInactivityTimer = useCallback(() => {
//     if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
//     inactivityTimer.current = setTimeout(() => {
//       handleLogout();
//     }, INACTIVITY_TIMEOUT);
//   }, [handleLogout]);

//   // Activity detection handler
//   const handleActivity = useCallback(() => {
//     if (isAuthenticated) {
//       resetInactivityTimer();
//       verifySession(false);
//     }
//   }, [isAuthenticated, resetInactivityTimer]);

//   const adminRefreshAccessToken = useCallback(async () => {
//     try {
//       const response = await axios.post(
//         `${backendURL}/admin/refresh`,
//         {},
//         { withCredentials: true }
//       );
//       return response.data.expiresAt;
//     } catch (err) {
//       if (err.response?.status === 401) {
//         handleLogout("Session expired. Please log in again.");
//       }
//       return null;
//     }
//   }, [backendURL, handleLogout]);

//   const scheduleTokenRefresh = useCallback(
//     (expiresAt) => {
//       const timeout = expiresAt - Date.now() - 5000; // 5-second buffer
//       if (timeout > 0) {
//         setTimeout(async () => {
//           const newExpiresAt = await adminRefreshAccessToken();
//           if (newExpiresAt) scheduleTokenRefresh(newExpiresAt);
//         }, timeout);
//       }
//     },
//     [adminRefreshAccessToken]
//   );

//   const verifySession = useCallback(
//     async (initialCheck = true) => {
//       try {
//         const response = await axios.get(`${backendURL}/admin/status`, {
//           withCredentials: true,
//           timeout: 5000,
//         });

//         if (!isAuthenticated) setIsAuthenticated(true);
//         scheduleTokenRefresh(response.data.expiresAt);
//       } catch (error) {
//         if (initialCheck) {
//           const newExpiresAt = await adminRefreshAccessToken();
//           if (newExpiresAt) return verifySession(false);
//         }
//         handleLogout();
//       }
//     },
//     [
//       backendURL,
//       adminRefreshAccessToken,
//       scheduleTokenRefresh,
//       isAuthenticated,
//       handleLogout,
//     ]
//   );

//   useEffect(() => {
//     // Set up activity listeners
//     const events = ["mousemove", "keydown", "scroll", "click"];
//     events.forEach((event) => window.addEventListener(event, handleActivity));

//     // Initial verification
//     verifySession();
//     resetInactivityTimer();

//     // Cleanup
//     return () => {
//       events.forEach((event) =>
//         window.removeEventListener(event, handleActivity)
//       );
//       if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
//     };
//   }, [handleActivity, verifySession, resetInactivityTimer]);

//   if (isAuthenticated === null) {
//     return <div className="m-auto">Loading...</div>;
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
// };

// export default ProtectedAdminRoute;
