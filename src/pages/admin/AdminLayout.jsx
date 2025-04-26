import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-Background">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-40"> {/* Adjust width as needed */}
        <Sidebar />
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 ml-64 p-4 overflow-auto"> {/* ml-64 should match sidebar width */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;






// import { Outlet } from "react-router-dom";
// import Sidebar from "../../components/admin/Sidebar";

// const AdminLayout = () => {
//   return (
//     <div className="flex w-full  bg-Background">
//       <div className="w-2/12 "><Sidebar /></div>
//       <div className="w-10/12">
//         <Outlet /> {/* This will render the nested routes */}
//       </div>
//     </div>
//   )
// }

// export default AdminLayout


