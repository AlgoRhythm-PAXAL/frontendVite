import SectionTitle from "../../components/admin/SectionTitle";
import  PieChartShadcn  from "../../components/admin/PieChartShadcn";
import { Component } from "../../components/admin/BarChart";
import PieChartMUI from "../../components/admin/PieChartMUI";
import AllPieCharts from "../../components/admin/AllPieCharts";
import PieChart from '../../components/admin/pieCharts/PieChart'
import PieChartContainer from "../../components/admin/pieCharts/PieChartContainer";
import UserCount from "../../components/admin/userCounts/userCount";


const Dashboard = () => {
  return (
    <div className="flex flex-col mx-5">
      <SectionTitle title="Dashboard" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-evenly items-center">
          {/* <PieChartShadcn /> */}
          {/* <PieChartMUI /> */}
          {/* <AllPieCharts/> */}
          <PieChartContainer/>
          {/* <UserCount/> */}
        </div>
        
        <Component />
      </div>
      {/* <AdminList/> */}
    </div>
  );
};

export default Dashboard;
