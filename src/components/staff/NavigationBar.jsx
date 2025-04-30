import { BellIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../assets/userAssets/staffProfile.png";
import Logo from "../../assets/userAssets/logo.jpg";

const NavigationBar = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get the logged in staff memeber information
  const getStaffInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/ui/get-staff-information",
        { withCredentials: true }
      );
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff info:", error);
    } finally {
      setLoading(false);
    }
  };

  // logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/staff/logout",
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/staff/login");
    } catch (error) {
      console.error("Logout error:", error);
      const errorMessage =
        error.response?.data?.message || "Logout failed. Please try again.";

      toast.error("Logout Failed", {
        description: errorMessage,
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    getStaffInfo();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <nav className="p-4">Loading…</nav>;
  }

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side -  PAXAL Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img className="w-20 h-auto ml-10" src={Logo} alt="Company Logo" />
          </div>

          {/* Right Side - Info and Profile */}
          <div className="flex items-center space-x-6">
            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-Primary"
            >
              <BellIcon className="h-6 w-6" />
              <span
                className={
                  notifications
                    ? "absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"
                    : "absolute top-0 right-0 inline-block w-2 h-2  rounded-full"
                }
              ></span>
            </button>

            {/* Logged in Staff Information */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-700">
                {staff?.branchId?.location} Branch
              </p>
              <p className="text-xs text-gray-500">EMP-ID: {staff?.staffId}</p>
            </div>

            {/* Profile Section */}
            <div className="relative flex items-center space-x-2" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center focus:outline-none"
              >
                <img
                  className="h-10 w-10 rounded-full object-cover border-2 border-Primary"
                  src={Profile}
                  alt="Profile"
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-32 w-40 bg-white/90  rounded-md shadow-lg py-1 border border-gray-200 z-50">
                  <button
                    onClick={() => {
                      navigate("/staff/profile");
                      setIsProfileOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    Log Out
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
