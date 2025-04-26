import { Outlet } from "react-router-dom";

import NavigationBar from "../../components/staff/NavigationBar";

const StaffLayout = () => {
  return (
    <>
    <NavigationBar/>
    <div className="flex w-full  bg-Background">
      <div className="w-2/12 ">
        {/*add side bar here*/}
      </div>
      <div className="w-10/12">
        <Outlet /> 
      </div>
    </div>
    </>
  );
};

export default StaffLayout;
