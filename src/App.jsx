import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import UserAccounts from "./pages/admin/UserAccounts";
import AdminLayout from "./pages/admin/AdminLayout";
import Parcels from "./pages/admin/Parcels";
import Shipments from "./pages/admin/Shipments";
import AdminLogin from "./pages/admin/AdminLogin";
import Home from "./pages/Home";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoutes"; // Import the protected route
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminVerifyCode from "./pages/admin/AdminVerifyCode";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import Branches from "./pages/admin/Branches";
import AdminProfile from "./pages/admin/AdminProfile";
{/* Staff login */}
import StaffLogin from "./pages/staff/StaffLogin";
import ForgotPasswordEmail from "./pages/staff/ForgotPasswordEmail";
import ForgotPasswordCode from "./pages/staff/ForgotPasswordCode";
import ResetPassword from "./pages/staff/ResetPassword";
{/* Staff pages */}
import ProtectedStaffRoute from "./components/staff/ProtectedStaffRoutes";
import StaffMainMenu from "./pages/staff/StaffMainMenu";
import StaffLayout from "./pages/staff/StaffLayout";
import ViewParcels from "./pages/staff/ViewParcels";
import PickupRequests from "./pages/staff/PickupRequests";
import DropOffRequests from "./pages/staff/DropOffRequests";
import ViewOneParcel from "./pages/staff/ViewOneParcel";
import ViewOnePickup from "./pages/staff/ViewOnePickup";
import ViewOneDropOff from "./pages/staff/ViewOneDropOff";
import ParcelInvoice from "./pages/staff/ParcelInvoice";





const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgotPassword" element={<AdminForgotPassword />} />
        <Route path="/admin/verify-OTP" element={<AdminVerifyCode />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword/>}/>
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route path="/admin"  element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="userAccounts" element={<UserAccounts />} />
            <Route path="parcels" element={<Parcels />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="branches" element={<Branches/>}/>
            <Route path="profile" element={<AdminProfile/>}/>
          </Route>
        </Route>

        {/* Staff Routes */}
        <Route path="staff/login" element={<StaffLogin/>}/>
        <Route path="staff/forgot-password" element={<ForgotPasswordEmail/>}/>
        <Route path="staff/forgot-password-code" element={<ForgotPasswordCode/>}/>
        <Route path="staff/reset-password" element={<ResetPassword/>}/>

        {/* Protected Staff Routes */}
        <Route path="/staff" element={<ProtectedStaffRoute/>}>
          <Route path="/staff/main-menu" element={<StaffMainMenu/>}/>
          <Route path="/staff" element={<StaffLayout/>}>
            <Route path="lodging-management/view-parcels" element={<ViewParcels/>}/>
            <Route path="lodging-management/view-pickups" element={<PickupRequests/>}/>
            <Route path="lodging-management/view-dropOffs" element={<DropOffRequests/>}/>
            <Route path="lodging-management/view-parcels/:parcelId" element={<ViewOneParcel/>}/>
            <Route path="lodging-management/view-parcels/invoice/:parcelId" element={<ParcelInvoice/>}/>
            <Route path="lodging-management/view-pickups/:parcelId" element={<ViewOnePickup/>}/>
            <Route path="lodging-management/view-dropOffs/:parcelId" element={<ViewOneDropOff/>}/>


          </Route>

        </Route>

      </Routes>
    </Router>
  );
};

export default App;
