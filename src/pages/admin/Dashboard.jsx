import SectionTitle from "../../components/admin/SectionTitle";
import { useState, useEffect } from "react";
import axios from "axios";
import { PieChartCard } from "../../components/admin/PieChartCard";
import AdminList from "../../components/admin/AdminList";
import { Component } from "../../components/admin/BarChart";




const Dashboard = () => {
  const [adminData, setAdminData] = useState([]); // Store an array of admins

  

  return (
    <div className="flex flex-col mx-5">
      <SectionTitle title="Dashboard" />

      



      <div className="flex flex-col gap-2">
        <PieChartCard />
        <Component/>
      </div>
      {/* <AdminList/> */}
    </div>
  );
};

export default Dashboard;
