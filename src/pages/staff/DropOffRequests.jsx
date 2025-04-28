import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "../../components/staff/DataTable";

const DropOffRequests = () => {
  const [parcels, setParcels] = useState([]);
  const navigate = useNavigate();

  const getDropOffParcels = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/lodging-management/get-all-dropOff-parcels",
        { withCredentials: true }
      );

      setParcels(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDropOffParcels();
  }, []);

  const columns = [
    { label: "Parcel ID", key: "parcelId" },
    {
      label: "Sender Name",
      key: "senderId",
      render: (value, row) =>
        value?.fName && value?.lName ? `${value.fName} ${value.lName}` : "N/A",
    },
    { label: "Shipping Method", key: "shippingMethod" },
    {
      label: "Registered Date",
      key: "createdAt",
      render: (value) =>
        new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
  ];

  const actions = [
    {
      label: "Register",
      className:
        "bg-Primary text-white font-semibold px-5 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light",
      onClick: (row) =>
        navigate(`/staff/lodging-management/view-dropOffs/${row.parcelId}`),
    },
  ];

  return (
    <div className="mt-5">
      <div className="flex mb-8">
    <div className="w-3/5">
    </div>
    <div className="w-2/5 flex justify-end mr-11 py-3">
      <div className="mx-2  border-2 border-gray-200 rounded-lg px-5 py-4 transition-shadow duration-300 hover:shadow-md">
        <p className="text-gray-400 ">Drop-offs Today</p>
        <h1 className="font-semibold text-3xl">50</h1>
      </div>
      <div className="mx-2 border-2 border-gray-200 rounded-lg px-5 py-4 transition-shadow duration-300 hover:shadow-md">
        <p className="text-gray-400">Pending Drop-offs</p>
        <h1 className="font-semibold text-3xl">20</h1>
      </div>
    </div> 
   </div>
   <div className="ml-12 mr-24 ">
    <DataTable
      data={parcels}
      columns={columns}
      actions={actions}
      rowsPerPage={6}
      textMessage={"No drop-off requests"}
    />
    </div>
    </div>
  );
};

export default DropOffRequests;
