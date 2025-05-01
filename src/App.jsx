import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import UserAccounts from "./pages/admin/UserAccounts";
import AdminLayout from "./pages/admin/AdminLayout";
import Parcels from "./pages/admin/Parcels";
import Shipments from "./pages/admin/Shipments";
import AdminLogin from "./pages/admin/AdminLogin";
import Home from "./pages/Home";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoutes";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminVerifyCode from "./pages/admin/AdminVerifyCode";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import Branches from "./pages/admin/Branches";
import AdminProfile from "./pages/admin/AdminProfile";



import ParcelTablePage from "./pages/staff/ParcelTablePage/parcelTablePage";
import ManualShipmentPage from "./pages/staff/ManualShipmentPage/manualShipmentPage";
import LeftBar from "./components/staff/LeftBar";
 // You'll need to create this

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgotPassword" element={<AdminForgotPassword />} />
        <Route path="/admin/verify-OTP" element={<AdminVerifyCode />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="userAccounts" element={<UserAccounts />} />
            <Route path="parcels" element={<Parcels />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="branches" element={<Branches />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>

        {/* Staff routes */}
        <Route path="/staff" element={<LeftBar />}>
          <Route path="shipment-management/parcel-table-page" element={<ParcelTablePage />} />
          <Route path="shipment-management/manual-shipment-page" element={<ManualShipmentPage />} />
          {/* Add other staff routes here */}
          {/* <Route path="shipment-management/create-shipment" element={<CreateShipment />} /> */}
          {/* <Route path="shipment-management/view-shipments" element={<ViewShipments />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;