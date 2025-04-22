import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import UserAccounts from "./pages/admin/UserAccounts";
import AdminLayout from "./pages/admin/AdminLayout";
import Parcels from "./pages/admin/Parcels";
import Shipments from "./pages/admin/Shipments";
import AdminLogin from "./pages/admin/AdminLogin";
import Home from "./pages/User/userHome";
import Signup from "./pages/User/Signup";
import Login from './pages/User/Login';
import Emailverify from './pages/User/Emailverify';
import ForgetPassword from './pages/User/ForgetPassword';
import ResetPassword from './pages/User/ResetPassword';
import Profile from './pages/User/Profile';
import AddParcel from './pages/User/AddParcel';
import Parcel from './pages/User/Parcel';
import TrackingPage from './pages/User/TrackingPage';
import Checkout from './pages/User/Checkout';
import ContactUs from './pages/User/ContactUs';
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster
import AboutUs from './pages/User/AboutUs';
import PaymentSuccess from "./pages/User/PaymentSuccess";






const App = () => {
  return (

    
  

   
    <Router> {/* Use BrowserRouter instead */}

     {/* ✅ Toaster added here */}
     <Toaster position="top-center" reverseOrder={false} /> 
      <Routes>
        
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<Emailverify/>}/>
      <Route path="/forget-password" element={<ForgetPassword/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/addparcel" element={<AddParcel/>}/>
      <Route path="/parcel" element={<Parcel/>}/>
      <Route path="/track" element={<TrackingPage/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path='/contactus' element={<ContactUs/>}/>
      <Route path='/aboutus' element={<AboutUs/>}/>
      <Route path="/payment-success" element={<PaymentSuccess />} />
     


      
     

        {/* Admin login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> {/* Default page /admin */}
          <Route path="userAccounts" element={<UserAccounts />} /> {/* /admin/userAccounts */}
          <Route path="parcels" element={<Parcels />} />
          <Route path="shipments" element={<Shipments />} />


          {/* customer routes */}
          
          

        </Route>
      </Routes>
    </Router>



    

   
 






  );
}

export default App;
