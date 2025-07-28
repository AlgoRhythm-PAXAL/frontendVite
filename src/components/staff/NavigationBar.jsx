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

const backendURL = import.meta.env.VITE_BACKEND_URL;


const NavigationBar = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isProfilePage = location.pathname === "/staff/profile"; // Check if on profile page.

  const getStaffInfo = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/staff/ui/get-staff-information`,
        { withCredentials: true }
      );
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff info:", error);
    } finally {
      setLoading(false);
    }
  };

  {
    /* Logout button */
  }
  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendURL}/staff/logout`,
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
            <button
              type="button"
              className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <BellIcon className="h-6 w-6" />
              <span
                className={`absolute top-0 right-0 inline-block w-2 h-2 rounded-full ${
                  notifications ? "bg-red-500" : ""
                }`}
              ></span>
            </button>

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
