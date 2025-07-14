import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import UserAccounts from "./pages/admin/UserAccounts";
import AdminLayout from "./pages/admin/AdminLayout";
import Parcels from "./pages/admin/Parcels";
import Shipments from "./pages/admin/Shipments";
import AdminLogin from "./pages/admin/AdminLogin";

{
  /*User Routes */
}

import Home from "./pages/User/userHome";
import Signup from "./pages/User/Signup";
import Login from "./pages/User/Login";
import Emailverify from "./pages/User/Emailverify";
import ForgetPassword from "./pages/User/ForgetPassword";
import ResetPassword from "./pages/User/ResetPassword";
import Profile from "./pages/User/Profile";
import AddParcel from "./pages/User/AddParcel";
import Parcel from "./pages/User/Parcel";
import TrackingPage from "./pages/User/TrackingPage";
import Checkout from "./pages/User/Checkout";
import ContactUs from "./pages/User/ContactUs";
import { Toaster as HotToastToaster } from "react-hot-toast"; // ✅ Import Toaster
import AboutUs from "./pages/User/AboutUs";
import PaymentSuccess from "./pages/User/PaymentSuccess";
{
  /*User Routes */
}

import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoutes"; // Import the protected route
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminVerifyCode from "./pages/admin/AdminVerifyCode";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import Branches from "./pages/admin/Branches";
import AdminProfile from "./pages/admin/AdminProfile";
import { Toaster as SonnerToaster } from "sonner";
import Vehicle from "./pages/admin/Vehicle";

{/* Staff login */}

import StaffLogin from "./pages/staff/Login/StaffLogin";
import ForgotPasswordEmail from "./pages/staff/Login/ForgotPasswordEmail";
import ForgotPasswordCode from "./pages/staff/Login/ForgotPasswordCode";
import StaffResetPassword from "./pages/staff/Login/ResetPassword";
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
import AddNewParcel from "./pages/staff/AddNewParcel";
import ViewOneDoorStepDeliveryParcel from "./pages/staff/ViewOneDoorstepDeliveryParcel";
import DoorstepDeliveryParcels from "./pages/staff/DoorstepDeliveryParcels";
import CollectionCenterDeliveryParcels from "./pages/staff/CollectionCenterDeliveryParcels";
import NewInquiries from "./pages/staff/Inquiry/NewInquiries";
import ViewRepliedInquiries from "./pages/staff/Inquiry/ViewRepliedInquiries";
import ReplyToInquiry from "./pages/staff/Inquiry/ReplyToInquiry";
import ViewOneRepliedInquiry from "./pages/staff/Inquiry/ViewOneRepliedInquiry";
import ViewOneCollectionCenterDeliveryparcel from "./pages/staff/ViewOneCollectionCenterDeliveryParcel";
import Scanner from "./pages/staff/Scanner";

const App = () => {
  return (
    <Router>
      <SonnerToaster position="bottom-right" richColors expand visibleToasts={5} offset="16px" />
      <HotToastToaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Emailverify />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addparcel" element={<AddParcel />} />
        <Route path="/parcel" element={<Parcel />} />
        <Route path="/track" element={<TrackingPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Admin Routes */}
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
            <Route path="vehicles" element={<Vehicle />} />
          </Route>
        </Route>

        {/* Staff Routes */}
        <Route path="staff/login" element={<StaffLogin/>}/>
        <Route path="staff/forgot-password" element={<ForgotPasswordEmail/>}/>
        <Route path="staff/forgot-password-code" element={<ForgotPasswordCode/>}/>
        <Route path="staff/reset-password" element={<StaffResetPassword/>}/>

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
            <Route path="lodging-management/add-new-parcel" element={<AddNewParcel/>}/>

            <Route path="collection-management/assign-driver" element={<DoorstepDeliveryParcels/>}/>
            <Route path="collection-management/view-one-doorstep-delivery-parcel/:parcelId" element={<ViewOneDoorStepDeliveryParcel/>}/>
            <Route path="collection-management/view-collection-center-delivery-parcels" element={<CollectionCenterDeliveryParcels/>}/>
            <Route path="collection-management/view-collection-center-delivery-parcels/:parcelId" element={<ViewOneCollectionCenterDeliveryparcel/>}/>
            <Route path="collection-management/scan-qr-code" element={<Scanner/>}/>



            <Route path="inquiry-management/view-new-inquiries" element={<NewInquiries/>}/>
            <Route path="inquiry-management/view-replied-inquiries" element={<ViewRepliedInquiries/>}/>
            <Route path="inquiry-management/reply-to-inquiry/:inquiryId" element={<ReplyToInquiry/>}/>
            <Route path="inquiry-management/view-replied-inquiries/:inquiryId" element={<ViewOneRepliedInquiry/>}/>

          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
