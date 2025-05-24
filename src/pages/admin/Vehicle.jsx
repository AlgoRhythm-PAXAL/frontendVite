import { useState,useEffect } from "react";
import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import VehicleRegistrationForm from "../../components/admin/Vehicle/VehicleRegistrationForm";
import axios from "axios";
import RenderVehicleUpdateForm from '../../components/admin/Vehicle/RenderVehicleUpdateForm'


const vehicleColumns = [
  // {
  //   accessorKey: "vehicleId",
  //   header: "Vehicle ID",
  // },
  {
    accessorKey: "registrationNo",
    header: "Registration No",
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
  },
  {
    accessorKey: "capableVolume",
    header: "Capable Volume",
  },
  {
    accessorKey: "capableWeight",
    header: "Capable Weight",
  },
  {
    accessorKey: "assignedBranch",
    header: "Assigned Branch",
  },
];

const Vehicle = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [data,setData]=useState([])
  const deleteAPI = `${backendURL}/admin/delete/vehicle`
  const updateAPI = `${backendURL}/admin/vehicle/update`





  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendURL}/admin/vehicle/all`, {withCredentials: true,});
      setData(response.data.userData)
      
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);






  return (
    <div className="flex flex-col mx-5">
      <SectionTitle title="Vehicles" />
      <div className="flex flex-col gap-6">
        <TableDistributor
          title="vehicle"
          columns={vehicleColumns}
          disableDateFilter={true}
          enableRowClick={false}
          deleteEnabled={true}
          updateEnabled={true}
          entryData={data}
          deleteAPI={deleteAPI}
          updateAPI={updateAPI}
          updateText="Edit"
          renderUpdateForm={RenderVehicleUpdateForm}
          sorting={false}
        />
        <VehicleRegistrationForm />
      </div>
    </div>
  );
};
export default Vehicle;
