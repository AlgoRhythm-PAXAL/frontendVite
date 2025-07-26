import { ArrowLeftIcon, BellIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/userAssets/logo.jpg";
import ProfilePicture from "../admin/ImageUpload/ProfilePicture";
import {
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const NavigationBar = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isProfilePage = location.pathname === "/staff/profile"; // Check if on profile page.

  const getStaffInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/staff/ui/get-staff-information`,
        { withCredentials: true }
      );
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff info:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
    
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/staff/notifications`,
        { withCredentials: true }
      );
      
    
      
      if (response.data.success) {
        const notificationData = response.data.data;
        setNotifications(notificationData);
        const unreadTotal = notificationData.filter(n => !n.isRead).length;
        setUnreadCount(unreadTotal);
        
        
      }
    } catch (error) {
      console.error("❌ [FRONTEND] Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/staff/notifications/mark-as-read/${notificationId}`,
        {},
        { withCredentials: true }

      );
      // Refresh notifications after marking as read
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      console.log('Marking all notifications as read...');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/staff/notifications/mark-all-read`,
        {},
        { withCredentials: true }
      );
      console.log('All notifications marked as read:', response.data);
      // Refresh notifications after marking all as read
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  {
    /* Logout button */
  }
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/staff/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/staff/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    
    getStaffInfo();
    fetchNotifications();
    
    // Set up periodic notification fetching
   
    const notificationInterval = setInterval(() => {
     
      fetchNotifications();
    }, 30000); // Every 30 seconds
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
    
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(notificationInterval);
    };
  }, []);

  if (loading) {
    return (
      <nav className="w-full bg-white shadow-sm border-b border-gray-200 fixed top-0 z-50 h-16">
        <div className="mx-auto px-4 md:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-20 h-10 bg-gray-200 rounded animate-pulse ml-10"></div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>

              <div className="hidden md:block space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 fixed top-0 z-50 h-16">
      {" "}
      <div className="mx-auto px-4 md:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left Side - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => {
                navigate("/staff/main-menu");
              }}
            >
              <img
                className="w-20 h-auto ml-10"
                src={Logo}
                alt="Company Logo"
              />
            </button>
          </div>

          {/* Right Side - Info and Profile */}
          <div className="flex items-center space-x-6">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markAsRead(notification._id)}
                      >
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()} {' '}
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Staff Information */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-700">
                Welcome, {staff?.name}
              </p>
              <p className="text-xs text-gray-500">
                {staff?.branchId?.location} Branch • EMP-ID: {staff?.staffId}
              </p>
            </div>
            <div
              className="relative flex items-center h-full px-2"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                onClick={() => navigate("/staff/profile")}
                className="flex items-center focus:outline-none "
              >
                {staff.profilePicLink ? (
                  <ProfilePicture
                    publicId={staff.profilePicLink}
                    width="40"
                    className="rounded-full w-12 h-12 object-cover border-2 border-Primary"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center border-2 border-Primary">
                    <UserCircleIcon className="h-8 w-8 text-gray-500" />
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {isProfilePage ? (
                    <button
                      onClick={() => navigate("/staff/main-menu")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowLeftIcon className="h-5 w-5 mr-2" />
                      Main Menu
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/staff/profile")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserCircleIcon className="h-5 w-5 mr-2" />
                      View Profile
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
