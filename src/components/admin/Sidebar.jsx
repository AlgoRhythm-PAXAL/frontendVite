import { Link, useLocation,useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import LOGO from "../../assets/Velox-Logo.png"
import { faTachometerAlt, faUser, faBox, faTruck, faDollarSign, faQuestionCircle, faBuilding, faCar, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useState,useEffect } from "react";
import axios from 'axios'
import { toast } from 'sonner'


export default function Sidebar() {
  const location = useLocation(); // Get the current route
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [data,setData]=useState([]);

  useEffect(()=>{
    const fetchMyData=async()=>{
      try{
        const response=await axios.get(`${backendURL}/admin/get/mydata`,{withCredentials:true});
        const myData=response.data.myData;
        const filteredData={
          name:myData.name,
          avatar:myData.profilePicLink,
        }
        
        setData(filteredData);
      }
      catch(error){
        console.log("Error",error)
      }
    }

    fetchMyData();
  },[])

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/admin/logout`,
        {},
        { withCredentials: true }
      );

      // Success handling
      toast.success(data.message || "Logged out successfully");
      console.log("Logout success:", data.message);
      navigate("/admin/login");

    } catch (error) {
      // Error handling
      const errorMessage = error.response?.data?.message || "Logout failed";
      const statusCode = error.response?.status;

      // Show appropriate toast
      if (statusCode === 401) {
        toast.warning("Session expired, please login again");
      } else {
        toast.error(errorMessage);
      }

      console.error("Logout error:", errorMessage);

      // Redirect if unauthorized
      if (statusCode === 401) {
        navigate("/admin/login");
      }
    }
  };
  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center py-6 rounded-xl">
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
        {/* <Link to="/admin/rates">
          <NavItem title="Rates" icon={faDollarSign} active={location.pathname === "/admin/rates"} />
        </Link>
        <Link to="/admin/inquiries">
          <NavItem title="Inquiries" icon={faQuestionCircle} active={location.pathname === "/admin/inquiries"} />
        </Link> */}
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
          <NavItem title={data.name}  avatar={data.avatar} active={location.pathname === "/admin/profile"} />
        </Link>
      </div>
      <NavItem title="Logout" onClick={handleLogout} icon={faSignOutAlt} active={location.pathname === "/logout"} />
    </div>
  );
}
