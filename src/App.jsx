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



import ParcelTablePage from "./pages/staff/ShipmentManagement/ParcelTablePage/parcelTablePage";
import ManualShipmentPage from "./pages/staff/ShipmentManagement/ManualShipmentPage/manualShipmentPage";
import CreatedShipmentsPage from "./pages/staff/ShipmentManagement/CreatedShipmentsPage/createdShipmentsPage";
import ViewShipmentsPage from "./pages/staff/ShipmentManagement/ViewShipmentsPage/viewShipmentsPage";
import ManifestPage from "./pages/staff/ShipmentManagement/ManifestPage/manifestPage";
import DashboardPage from "./pages/staff/CollectionManagement/Dashboard/dashboardPage";
import TrackingPage from "./pages/staff/CollectionManagement/Tracking/trackingPage";
import LeftBar from "./components/staff/LeftBar";

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
          {/* Collection Management routes */}
          <Route path="collection-management/dashboard" element={<DashboardPage />} />
          <Route path="collection-management/tracking" element={<TrackingPage />} />
          
          {/* Shipment Management routes */}
          <Route path="shipment-management/parcel-table-page" element={<ParcelTablePage />} />
          <Route path="shipment-management/manual-shipment-page" element={<ManualShipmentPage />} />
          <Route path="shipment-management/created-shipments-page" element={<CreatedShipmentsPage />}/>
          <Route path="shipment-management/view-shipments" element={<ViewShipmentsPage />} />
          <Route path="shipment-management/manifest/:shipmentId" element={<ManifestPage />} />
          {/* Add other staff routes here */}
          {/* <Route path="shipment-management/create-shipment" element={<CreateShipment />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;