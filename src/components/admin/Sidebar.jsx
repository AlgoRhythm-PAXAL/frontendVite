
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import NavItem from "./NavItem";
import LOGO from "../../assets/Velox-Logo.png";
import {
  faTachometerAlt,
  faUser,
  faBox,
  faTruck,
  faBuilding,
  faCar,
  faSignOutAlt,
  faUserCircle,
  faSync,
  faChartBar,
  faCalendarWeek
} from "@fortawesome/free-solid-svg-icons";

/**
 * Professional Admin Sidebar Component
 * Provides navigation for the admin panel with proper error handling and loading states
 */
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  
  // Use admin auth context
  const { admin, logout } = useAdminAuth();
  
  // State management
  const [userData, setUserData] = useState({
    name: admin?.name || "",
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Navigation menu items configuration (memoized for performance)
  const navigationItems = useMemo(() => [
    {
      title: "Dashboard",
      icon: faTachometerAlt,
      path: "/admin",
      exact: true,
    },
    {
      title: "User Accounts",
      icon: faUser,
      path: "/admin/userAccounts",
    },
    {
      title: "Parcels",
      icon: faBox,
      path: "/admin/parcels",
    },
    {
      title: "Vehicle Schedules",
      icon: faCalendarWeek,
      path: "/admin/vehicleSchedules",
    },
    {
      title: "B2B Shipments",
      icon: faTruck,
      path: "/admin/b2b-shipments",
    },
    {
      title: "Shipments",
      icon: faTruck,
      path: "/admin/shipments",
    },
    {
      title: "Branches",
      icon: faBuilding,
      path: "/admin/branches",
    },
    {
      title: "Vehicles",
      icon: faCar,
      path: "/admin/vehicles",
    },
    {
      title: "Reports",
      icon: faChartBar,
      path: "/admin/reports",
    },
  ], []);

  /**
   * Fetch user profile data from backend with retry mechanism
   * This fetches additional profile data like avatar that's not in the JWT context
   */
  const fetchUserProfile = useCallback(async (retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendURL}/api/admin/profile`, {
        withCredentials: true,
        timeout: 10000,
      });
      const { myData } = response.data;
      
      if (myData) {
        setUserData({
          name: admin?.name || myData.name || "Admin User",
          avatar: myData.profilePicLink || null,
        });
        setLastFetchTime(Date.now());
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/admin/login", { replace: true });
      } else if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
        if (retryCount < maxRetries) {
          toast.warning(`Connection timeout. Retrying... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => fetchUserProfile(retryCount + 1), 2000 * (retryCount + 1));
          return;
        } else {
          toast.error("Failed to load user profile after multiple attempts");
        }
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to load user profile");
      }
      
      // Set fallback data but keep the name from context if available
      setUserData({
        name: admin?.name || "Admin User",
        avatar: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, [admin?.name, backendURL, navigate]);

  // Update userData when admin context changes
  useEffect(() => {
    if (admin) {
      setUserData(prev => {
        const newData = {
          name: admin.name || "Admin User",
          avatar: prev.avatar, // Keep existing avatar if we have one
        };
        return newData;
      });
      setIsLoading(false);
      
      // Fetch additional profile data (like avatar) from the profile endpoint
      fetchUserProfile();
    }
  }, [admin, fetchUserProfile]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Refetch user data when coming back online
      if (lastFetchTime && Date.now() - lastFetchTime > 300000) { // 5 minutes
        fetchUserProfile();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You are offline. Some features may not work properly.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lastFetchTime, fetchUserProfile]);

  /**
   * Initial profile fetch - only run once on component mount
   */
  useEffect(() => {
    // Only fetch if admin is available to avoid unnecessary API calls
    if (admin) {
      fetchUserProfile();
    }
  }, []); // Empty dependency array for initial fetch only

  /**
   * Handle user logout with proper error handling and confirmation
   */
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    // Show confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    
    try {
      setIsLoggingOut(true);
      
      // Use context logout function
      await logout("Logged out successfully");
      
      // Clear any cached data
      setUserData({ name: "", avatar: null });
      
      // Navigate to login
      navigate("/admin/login", { replace: true });
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, navigate, isLoggingOut]);

  /**
   * Check if current path is active (memoized for performance)
   */
  const isPathActive = useCallback((path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  /**
   * Handle navigation item click with analytics
   */
  // const handleNavItemClick = useCallback((path) => {
   
  //   console.log(`Navigation: ${path}`);
  // }, []);

  /**
   * Refresh user data
   */
  const refreshUserData = useCallback(() => {
    if (!isLoading && isOnline) {
      fetchUserProfile();
    }
  }, [isLoading, isOnline, fetchUserProfile]);

  return (
    <div className="w-full h-screen bg-white flex flex-col py-6 rounded-xl shadow-lg border border-gray-200 relative">
      {/* Online/Offline Status Indicator */}
      {!isOnline && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" 
             title="Offline" />
      )}
      
      {/* Header Section */}
      <header className="flex flex-col items-center mb-8 px-4">
        <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center shadow-md">
          <img 
            src={LOGO} 
            alt="Paxal Logo" 
            className="w-full h-full object-contain transition-opacity duration-300"
            onError={(e) => {
              e.target.style.opacity = '0';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="hidden text-gray-400 text-2xl font-bold">P</div>
        </div>
        <h1 className="text-xl font-semibold text-gray-800 font-mulish">
          Admin Panel
        </h1>
        <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
          isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </header>

      {/* Navigation Section */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {navigationItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className="block"
            onClick={() => handleNavItemClick(item.path)}
          >
            <NavItem
              title={item.title}
              icon={item.icon}
              active={isPathActive(item.path, item.exact)}
              disabled={!isOnline}
            />
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <footer className="px-2 pt-4 border-t border-gray-200 mt-4">
        <div className="space-y-2">
          {/* Refresh Button */}
          <button
            onClick={refreshUserData}
            disabled={isLoading || !isOnline}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh user data"
          >
            <FontAwesomeIcon 
              icon={faSync} 
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
            />
            <span className="font-mulish font-medium text-sm">
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>

          {/* User Profile */}
          <Link to="/admin/profile" className="block">
            <NavItem
              title={isLoading ? "Loading..." : (userData.name || "Admin User")}
              avatar={userData.avatar}
              icon={!userData.avatar ? faUserCircle : undefined}
              active={isPathActive("/admin/profile")}
              disabled={isLoading || !isOnline}
            />
            {/* Debug info - remove in production */}
            {/* {import.meta.env.DEV && (
              <div className="text-xs text-gray-500 px-4 py-1">
                Avatar: {userData.avatar ? userData.avatar : 'null'}
              </div>
            )} */}
          </Link>

          {/* Logout Button */}
          <NavItem
            title={isLoggingOut ? "Logging out..." : "Logout"}
            onClick={handleLogout}
            icon={faSignOutAlt}
            disabled={isLoggingOut || !isOnline}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
          />
        </div>
      </footer>
    </div>
  );
}