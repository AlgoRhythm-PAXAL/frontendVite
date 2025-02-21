import SectionTitle from "../../components/admin/SectionTitle";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

const Dashboard = () => {
  const [adminData, setAdminData] = useState([]); // Store an array of admins

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =Cookies.get('AdminToken');
        console.log(token);
        const response = await axios.get("http://localhost:8000/admin/all",{withCredentials:true});
        console.log("API Response:", response.data.admins);
        setAdminData(response.data.admins); // Set entire admins array
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <SectionTitle title="Dashboard" />

      {adminData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminData.map((admin, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-lg">
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
