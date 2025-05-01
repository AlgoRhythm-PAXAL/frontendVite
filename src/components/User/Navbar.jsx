import { useState, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
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

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      text: 'Your parcel has been delivered',
      time: '2 hours ago',
      read: false,
    },
    { id: 2, text: 'New feature available', time: '1 day ago', read: true },
    {
      id: 3,
      text: 'System maintenance scheduled',
      time: '3 days ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
                onClick={() => setNotificationsOpen(!notificationsOpen)}
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
                    <button
                      className="text-xs text-[#1f818c] hover:underline"
                      onClick={() => {
                        // Mark all as read functionality would go here
                        setNotificationsOpen(false);
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className={`border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="p-3 hover:bg-gray-50 cursor-pointer">
                            <p className="text-sm">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
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
