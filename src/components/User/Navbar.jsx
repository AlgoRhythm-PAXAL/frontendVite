import { useState, useContext,useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaHome,
  FaBox,
  FaSearch,
  FaEnvelope,
  FaInfoCircle,
} from 'react-icons/fa';
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  //
    const [loading, setLoading] = useState(false);
     const [notifications, setNotifications] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  //
    useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

 const fetchNotifications = async () => {
  setLoading(true);
  try {
    console.log('Fetching notifications...'); // Debug log
    const response = await axios.get(`${backendURL}/api/notifications`,
       { withCredentials: true }
    );
    console.log('Notifications response:', response); // Debug log
    setNotifications(response.data);
    console.log('Notifications state set:', response.data); // Debug log
  } catch (error) {
    console.error('Error fetching notifications:', error);
  } finally {
    setLoading(false);
  }
};
 const markAsRead = async (id) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/notifications/mark-as-read/${id}`,
      {},
      { withCredentials: true }
    );
    
    // Use the response data to update state
    setNotifications(notifications.map(n => 
      n._id === id ? response.data.notification : n
    ));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const markAllAsRead = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8000/api/notifications/mark-all-read',
      {},
      { withCredentials: true }
    );
    
    // Use the response data to update state
    setNotifications(response.data.notifications);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md border-teal-700">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/logo.jpg" alt="Logo" className="h-10 mr-2" />
        <span className="text-xl font-bold text-teal-700 hidden md:block">
          Paxal
        </span>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-4 md:space-x-6 text-gray-800">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-[#1f818c] text-white' : 'hover:bg-teal-50 hover:text-teal-700'}`
            }
          >
            <FaHome className="mr-2" />
            <span className="hidden md:inline">Home</span>
          </NavLink>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <NavLink
                to="/parcel"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-[#1f818c] text-white' : 'hover:bg-teal-50 hover:text-teal-700'}`
                }
              >
                <FaBox className="mr-2" />
                <span className="hidden md:inline">Parcel</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/track"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-[#1f818c] text-white' : 'hover:bg-teal-50 hover:text-teal-700'}`
                }
              >
                <FaSearch className="mr-2" />
                <span className="hidden md:inline">Track</span>
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink
            to="/contactus"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-[#1f818c] text-white' : 'hover:bg-teal-50 hover:text-teal-700'}`
            }
          >
            <FaEnvelope className="mr-2" />
            <span className="hidden md:inline">Contact Us</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/aboutus"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-[#1f818c] text-white' : 'hover:bg-teal-50 hover:text-teal-700'}`
            }
          >
            <FaInfoCircle className="mr-2" />
            <span className="hidden md:inline">About Us</span>
          </NavLink>
        </li>
      </ul>

      {/* Right Section: Auth Buttons OR Avatar + Notifications */}
        <div className="flex items-center space-x-4">
        {isAuthenticated && (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (notificationsOpen && unreadCount > 0) {
                    markAllAsRead();
                  }
                }}
                className="p-2 text-gray-600 hover:text-teal-700 relative"
              >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        className="text-xs text-[#1f818c] hover:underline"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {loading ? (
                      <li className="p-4 text-center text-gray-500 text-sm">
                        Loading...
                      </li>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li
                          key={notification._id}
                          className={`border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            if (!notification.isRead) markAsRead(notification._id);
                          }}
                        >
                          <div className="p-3 hover:bg-gray-50 cursor-pointer">
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="p-4 text-center text-gray-500 text-sm">
                        No new notifications
                      </li>
                    )}
                  </ul>
                  <div className="p-2 border-t border-gray-200 text-center">
                    <Link
                      to="/notifications"
                      className="text-sm text-teal-700 hover:underline"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
              >
                {user && user.fName && user.lName ? (
                  <div className="h-10 w-10 rounded-full bg-[#1f818e] flex items-center justify-center text-white font-bold text-lg border-2 border-gray-300 cursor-pointer hover:border-teal-500">
                    {user.fName.charAt(0)}
                    {user.lName.charAt(0)}
                  </div>
                ) : (
                  <img
                    src="/avatar.png"
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-gray-300 cursor-pointer hover:border-teal-500"
                  />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 hover:bg-teal-50 text-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaUser className="mr-3 text-gray-600" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 hover:bg-teal-50 text-gray-700 text-left"
                      >
                        <FaSignOutAlt className="mr-3 text-gray-600" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

        {!isAuthenticated && (
          <div className="flex space-x-3">
            <Link to="/login">
              <button className="px-4 py-2 border border-teal-700 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors flex items-center">
                Log in
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex items-center">
                Sign up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
