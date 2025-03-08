import SectionTitle from "../../components/admin/SectionTitle";
import { useState, useEffect } from "react";
import axios from "axios";
import { PieChartCard } from "../../components/admin/PieChartCard";




const Dashboard = () => {
  const [adminData, setAdminData] = useState([]); // Store an array of admins

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/all", { withCredentials: true });
      console.log("API Response:", response.data.admins);
      setAdminData(response.data.admins); // Set entire admins array
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col mx-5">
      <SectionTitle title="Dashboard" />

      



      <div className="flex gap-2">
        <PieChartCard />
        <PieChartCard />
        <PieChartCard />
        <PieChartCard />
      </div>

      {adminData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminData.map((admin, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-lg bg-white">
              <p><strong>Name:</strong> {admin.name}</p>
              <p><strong>Email:</strong> {admin.email}</p>
              <p><strong>NIC:</strong> {admin.nic}</p>
              <p><strong>Contact No:</strong> {admin.contactNo}</p>
              {admin.profilePicLink && (
                <img
                  src={admin.profilePicLink}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mt-2"
                />
              )}
            </div>
          ))}


        </div>
      ) : (
        <p>Loading admins...</p>
      )}
    </div>
  );
};

export default Dashboard;
