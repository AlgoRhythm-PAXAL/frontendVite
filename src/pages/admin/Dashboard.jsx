import SectionTitle from "../../components/admin/SectionTitle";
import  PieChartShadcn  from "../../components/admin/PieChartShadcn";
import { Component } from "../../components/admin/BarChart";
import PieChartMUI from "../../components/admin/PieChartMUI";
import AllPieCharts from "../../components/admin/AllPieCharts";


const Dashboard = () => {
  return (
    <div className="flex flex-col mx-5">
      <SectionTitle title="Dashboard" />
      <div className="flex flex-col gap-2">
        <div className="flex">
          {/* <PieChartShadcn /> */}
          {/* <PieChartMUI /> */}
          <AllPieCharts/>
        </div>
        <Component />
      </div>
      {/* <AdminList/> */}
    </div>
  );
};

export default Dashboard;
