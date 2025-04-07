import SectionTitle from "../../components/admin/SectionTitle";
import { Component } from "../../components/admin/BarChart";
import PieChartContainer from "../../components/admin/pieCharts/PieChartContainer";
import ImageUpload from "../../components/admin/ImageUpload/ImageUpload"
import AdminList from "../../components/admin/AdminList"





const Dashboard = () => {
  return (
    <div className="flex flex-col mx-5">
      <SectionTitle title="Dashboard" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-evenly items-center">
          <PieChartContainer />
        </div>
        <Component />
      </div>
      <AdminList />
    </div>
  );
};

export default Dashboard;
