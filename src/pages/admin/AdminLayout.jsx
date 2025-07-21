import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-Background">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-40">
        <Sidebar />
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 ml-64 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
