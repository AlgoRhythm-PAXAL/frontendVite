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

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 fixed top-0 z-50 h-16">
      <div className="mx-auto px-4 md:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left Side - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img className="w-20 h-auto ml-10" src={Logo} alt="Company Logo" 
            onClick={() => {
                      navigate("/staff/main-menu");}}/>
          </div>

          {/* Right Side - Info and Profile */}
          <div className="flex items-center space-x-6">
            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <BellIcon className="h-6 w-6" />
              <span className={`absolute top-0 right-0 inline-block w-2 h-2 rounded-full ${notifications ? 'bg-red-500' : ''}`}></span>
            </button>

            {/* Staff Information */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-700">
                {staff?.branchId?.location} Branch
              </p>
              <p className="text-xs text-gray-500">EMP-ID: {staff?.staffId}</p>
            </div>

            {/* Profile Section */}
            <div className="relative flex items-center space-x-2" >
              <button
                onClick={() => {
                      navigate("/staff/profile");}}
                className="flex items-center focus:outline-none"
              >
                <img
                  className="h-10 w-10 rounded-full object-cover border-2 border-Primary"
                  src={Profile}
                  alt="Profile"
                />
              </button>

              
              
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;