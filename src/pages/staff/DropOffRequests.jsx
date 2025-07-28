import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "../../components/staff/DataTable";
import StatsBox from "../../components/staff/StatsBox";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const DropOffRequests = () => {
  const [parcels, setParcels] = useState([]);
  const [dropOffsStats, setdropOffsStats] = useState({
    dropOffsToday: 0,
    pendingDropOffs: 0,
  });
  const navigate = useNavigate();

  const getDropOffParcels = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/staff/lodging-management/get-all-dropOff-parcels`,
        { withCredentials: true }
      );

      setParcels(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getDropOffsStats = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/staff/lodging-management/get-dropoffs-stats`,
        { withCredentials: true }
      );

      setdropOffsStats(response.data);
    } catch (error) {
      console.error("Error fetching drop-offs stats:", error);
    }
  }

  useEffect(() => {
    getDropOffParcels();
    getDropOffsStats();
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
    <div className="px-8 py-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Drop-off Management
          </h1>
          <p className="text-gray-500">
            View and manage incoming parcel drop-offs
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <StatsBox title="Drop-offs Today" value={dropOffsStats.dropOffsToday} />
          <StatsBox title="Pending Drop-offs" value={dropOffsStats.pendingDropOffs} />
        </div>
      </div>
      <div >
        <DataTable
          data={parcels}
          columns={columns}
          actions={actions}
          rowsPerPage={5}
          textMessage={"No drop-off requests"}
        />
      </div>
    </div>
  );
};

export default DropOffRequests;
