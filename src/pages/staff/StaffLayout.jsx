import { Outlet } from "react-router-dom";

import NavigationBar from "../../components/staff/NavigationBar";
import Sidebar from "../../components/staff/LeftBar";


const StaffLayout = () => {
  return (
    <>
    <NavigationBar/>
    <div className="flex w-full ">
      <div className="w-2/12 ">
        <Sidebar/>
      </div>
      <div className="w-10/12">
        <Outlet /> 
      </div>
    </div>
    </>
  );
};

export default StaffLayout;
