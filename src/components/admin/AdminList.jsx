import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons"; // Changed icon for variety

const AdminList = () => {
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

  const handleDelete = async (adminId) => {
    console.log(adminId);
    try {
      await axios.delete(`http://localhost:8000/admin/delete/${adminId}`,{withCredentials:true});
      setAdminData(prevData => prevData.filter(admin => admin.id !== adminId));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div>
      {adminData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminData.map((admin) => (
            <div key={admin.adminId} className="border p-4 rounded-lg shadow-lg bg-white relative">
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
              <button 
                onClick={() => handleDelete(admin.adminId)} 
                className="text-red-500 hover:text-red-700 absolute top-2 right-2"
              >
                <FontAwesomeIcon icon={faUserSlash} size="lg" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading admins...</p>
      )}
    </div>
  );
};

export default AdminList;
