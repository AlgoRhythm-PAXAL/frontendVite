// import { Link, useLocation, useNavigate } from "react-router-dom";
// import NavItem from "./NavItem";
// import LOGO from "../../assets/Velox-Logo.png";
// import {
//   faTachometerAlt,
//   faUser,
//   faBox,
//   faTruck,
//   faDollarSign,
//   faQuestionCircle,
//   faBuilding,
//   faCar,
//   faSignOutAlt,
//   faUserCircle,
// } from "@fortawesome/free-solid-svg-icons";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "sonner";

// export default function Sidebar() {
//   const location = useLocation(); // Get the current route
//   const navigate = useNavigate();
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchMyData = async () => {
//       try {
//         const response = await axios.get(`${backendURL}/api/admin/profile`, {
//           withCredentials: true,
//         });
//         const myData = response.data.myData;
//         const filteredData = {
//           name: myData.name,
//           avatar: myData.profilePicLink,
//         };

//         setData(filteredData);
//       } catch (error) {
//         console.log("Error", error);
//       }
//     };

//     fetchMyData();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const { data } = await axios.post(
//         `${backendURL}/api/admin/auth/logout`,
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
//   return (
//     <div className="w-full h-screen bg-white flex flex-col py-6 rounded-xl">
//       {/* Logo and Title - Top */}
//       <div className="flex flex-col items-center mb-8">
//         <img src={LOGO} alt="Logo" width={80} height={80} />
//         <h1 className="my-5 text-lg font-semibold font-mulish">Admin Panel</h1>
//       </div>

//       {/* Navigation Items - Middle (grows to fill space) */}
//       <div className="w-full flex-1">
//         <Link to="/admin">
//           <NavItem
//             title="Dashboard"
//             icon={faTachometerAlt}
//             active={location.pathname === "/admin"}
//           />
//         </Link>
//         <Link to="/admin/userAccounts">
//           <NavItem
//             title="User Accounts"
//             icon={faUser}
//             active={location.pathname === "/admin/userAccounts"}
//           />
//         </Link>
//         <Link to="/admin/parcels">
//           <NavItem
//             title="Parcels"
//             icon={faBox}
//             active={location.pathname === "/admin/parcels"}
//           />
//         </Link>
//         <Link to="/admin/shipments">
//           <NavItem
//             title="Shipments"
//             icon={faTruck}
//             active={location.pathname === "/admin/shipments"}
//           />
//         </Link>
//         <Link to="/admin/branches">
//           <NavItem
//             title="Branches"
//             icon={faBuilding}
//             active={location.pathname === "/admin/branches"}
//           />
//         </Link>
//         <Link to="/admin/vehicles">
//           <NavItem
//             title="Vehicles"
//             icon={faCar}
//             active={location.pathname === "/admin/vehicles"}
//           />
//         </Link>
//       </div>

//       {/* Profile & Logout - Bottom */}
//       <div className="w-full mt-auto">
//         <Link to="/admin/profile">
//           <NavItem
//             title={data.name}
//             avatar={data.avatar}
//             active={location.pathname === "/admin/profile"}
//           />
//         </Link>
//         <NavItem
//           title="Logout"
//           onClick={handleLogout}
//           icon={faSignOutAlt}
//           active={location.pathname === "/logout"}
//         />
//       </div>
//     </div>
//   );
// }



import { Link, useLocation, useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import LOGO from "../../assets/Velox-Logo.png";
import {
  faTachometerAlt,
  faUser,
  faBox,
  faTruck,
  faDollarSign,
  faQuestionCircle,
  faBuilding,
  faCar,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

/**
 * Professional Admin Sidebar Component
 * Provides navigation for the admin panel with proper error handling and loading states
 */
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  
  // State management
  const [userData, setUserData] = useState({
    name: "",
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Navigation menu items configuration
  const navigationItems = [
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
  ];

  /**
   * Fetch user profile data from backend
   */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendURL}/api/admin/profile`, {
          withCredentials: true,
          timeout: 10000,
        });

        const { myData } = response.data;
        
        if (myData) {
          setUserData({
            name: myData.name || "Admin User",
            avatar: myData.profilePicLink || null,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        
        // Handle different error scenarios
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/admin/login");
        } else {
          toast.error("Failed to load user profile");
          // Set fallback data
          setUserData({
            name: "Admin User",
            avatar: null,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [backendURL, navigate]);

  /**
   * Handle user logout with proper error handling
   */
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    try {
      setIsLoggingOut(true);
      
      const response = await axios.post(
        `${backendURL}/api/admin/auth/logout`,
        {},
        { 
          withCredentials: true,
          timeout: 10000,
        }
      );

      // Success handling
      toast.success(response.data.message || "Logged out successfully");
      navigate("/admin/login");
      
    } catch (error) {
      console.error("Logout error:", error);
      
      // Error handling with specific messages
      const errorMessage = error.response?.data?.message || "Logout failed";
      const statusCode = error.response?.status;

      if (statusCode === 401) {
        toast.warning("Session expired");
        navigate("/admin/login");
      } else if (statusCode >= 500) {
        toast.error("Server error. Please try again.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * Check if current path is active
   */
  const isPathActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col py-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header Section */}
      <header className="flex flex-col items-center mb-8 px-4">
        <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
          <img 
            src={LOGO} 
            alt="Velox Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-800 font-mulish">
          Admin Panel
        </h1>
      </header>

      {/* Navigation Section */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className="block"
          >
            <NavItem
              title={item.title}
              icon={item.icon}
              active={isPathActive(item.path, item.exact)}
            />
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <footer className="px-2 pt-4 border-t border-gray-100 mt-4">
        <div className="space-y-2">
          {/* User Profile */}
          <Link to="/admin/profile" className="block">
            <NavItem
              title={isLoading ? "Loading..." : userData.name}
              avatar={userData.avatar}
              icon={!userData.avatar ? faUserCircle : undefined}
              active={isPathActive("/admin/profile")}
              disabled={isLoading}
            />
          </Link>

          {/* Logout Button */}
          <NavItem
            title={isLoggingOut ? "Logging out..." : "Logout"}
            onClick={handleLogout}
            icon={faSignOutAlt}
            disabled={isLoggingOut}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        </div>
      </footer>
    </div>
  );
}
