import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex w-full">
      <div className="w-2/12"><Sidebar /></div>
      <div className="w-10/12 mx-8">
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  )
}

export default AdminLayout


