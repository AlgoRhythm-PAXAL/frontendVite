import SectionTitle from "../../components/admin/SectionTitle";
import PieChartContainer from "../../components/admin/pieCharts/Dashboard-PieChartContainer";
import AdminList from "../../components/admin/AdminList"
import { ParcelBarChart } from "../../components/admin/Dashboard-BarChart";


const Dashboard = () => {
  return (
    <div className="flex flex-col mx-5 mb-10 ">
      <SectionTitle title="Dashboard" />
      <div className="flex flex-col gap-5">
        <div className="flex justify-evenly items-center">
          <PieChartContainer />
        </div>
        <ParcelBarChart/>
      </div>
      {/* <AdminList /> */}
    </div>
  );
};

export default Dashboard;
