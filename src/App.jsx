// import './App.css'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/admin/Dashboard";
// import UserAccounts from "./pages/admin/UserAccounts";
// import AdminLayout from "./pages/admin/AdminLayout";
// import Parcels from "./pages/admin/Parcels";
// import Shipments from "./pages/admin/Shipments";
// import AdminLogin from "./pages/admin/AdminLogin";
// import Home from "./pages/Home"

// const App = () => {
//   return (
//     <Router> {/* Use BrowserRouter instead */}
//       <Routes>

//         <Route path="/" element={<Home/>}/>
//         {/* Admin login Route */}
//         <Route path="/admin/login" element={<AdminLogin />} />

//         {/* Protected Admin Routes */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<Dashboard />} /> {/* Default page /admin */}
//           <Route path="userAccounts" element={<UserAccounts />} /> {/* /admin/userAccounts */}
//           <Route path="parcels" element={<Parcels />} />
//           <Route path="shipments" element={<Shipments />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import UserAccounts from "./pages/admin/UserAccounts";
import AdminLayout from "./pages/admin/AdminLayout";
import Parcels from "./pages/admin/Parcels";
import Shipments from "./pages/admin/Shipments";
import AdminLogin from "./pages/admin/AdminLogin";
import Home from "./pages/Home";
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoutes"; // Import the protected route

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route path="/admin"  element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="userAccounts" element={<UserAccounts />} />
            <Route path="parcels" element={<Parcels />} />
            <Route path="shipments" element={<Shipments />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
