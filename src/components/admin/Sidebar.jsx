import { Link, useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import LOGO from "../../assets/Velox-Logo.png"
import { faTachometerAlt, faUser, faBox, faTruck, faDollarSign, faQuestionCircle, faBuilding, faCar, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from 'axios'


export default function Sidebar() {
  const location = useLocation(); // Get the current route
  const navigate = useNavigate();
  const handleLogout = () => {
    try{
      const response = axios.post("http://localhost:8000/admin/logout",{},{withCredentials:true});
      console.log(response);
      if(response.status !== 200){
        console.log("Logged out successfully");
        navigate("/admin/login");
      }
      else{
        console.error("Logout failed")
      }
    }
    catch(error){
      console.error("Error logging out:", error);
    }
    
};
  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center py-6">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-3">
        <img src={LOGO} alt="Logo" width={80} height={80} />
        <h1 className="my-5 text-lg font-semibold font-mulish">Admin Panel</h1>
      </div>

      <div className="w-full">
        {/* Navigation Items */}
        <Link to="/admin">
          <NavItem title="Dashboard" icon={faTachometerAlt} active={location.pathname === "/admin"} />
        </Link>
        <Link to="/admin/userAccounts">
          <NavItem title="User Accounts" icon={faUser} active={location.pathname === "/admin/userAccounts"} />
        </Link>
        <Link to="/admin/parcels">
          <NavItem title="Parcels" icon={faBox} active={location.pathname === "/admin/parcels"} />
        </Link>
        <Link to="/admin/shipments">
          <NavItem title="Shipments" icon={faTruck} active={location.pathname === "/admin/shipments"} />
        </Link>
        <Link to="/admin/rates">
          <NavItem title="Rates" icon={faDollarSign} active={location.pathname === "/admin/rates"} />
        </Link>
        <Link to="/admin/inquiries">
          <NavItem title="Inquiries" icon={faQuestionCircle} active={location.pathname === "/admin/inquiries"} />
        </Link>
        <Link to="/admin/branches">
          <NavItem title="Branches" icon={faBuilding} active={location.pathname === "/admin/branches"} />
        </Link>
        <Link to="/admin/vehicles">
          <NavItem title="Vehicles" icon={faCar} active={location.pathname === "/admin/vehicles"} />
        </Link>
      </div>

      {/* Profile & Logout */}
      <div className="w-full my-5">
        <Link to="/admin/profile">
          <NavItem title="Thanuka Perera" icon={faUserCircle} active={location.pathname === "/admin/profile"} />
        </Link>
      </div>
      <NavItem title="Logout" onClick={handleLogout} icon={faSignOutAlt} active={location.pathname === "/logout"} />
    </div>
  );
}
