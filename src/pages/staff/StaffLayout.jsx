import { Outlet } from "react-router-dom";

import NavigationBar from "../../components/staff/NavigationBar";
import SideBar from "../../components/staff/SideBar";

const StaffLayout = () => {
  return (
  <div className="flex flex-col h-screen">
      
      <NavigationBar />
      
      {/* Main Content Area */}
      <div className="flex flex-1 pt-16"> 
       
        <div className="fixed h-[calc(100vh-4rem)] w-64">
          <SideBar />
        </div>
        
        
        <div className="flex-1 ml-64 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;
