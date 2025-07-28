import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import DataTable from "../../../components/staff/DataTable";
import StatsBox from "../../../components/staff/StatsBox";

const backendURL = import.meta.env.VITE_BACKEND_URL;


const PickupRequests = () => {
  const [parcels, setParcels] = useState([]);
  const [pickupStats, setPickupStats] = useState({
    pickupsToday: 0,
    pendingPickups: 0,
  });

  const navigate = useNavigate();

  const getPickupParcels = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/staff/lodging-management/get-all-pickup-parcels`,
        { withCredentials: true }
      );

      setParcels(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getPickupStats = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/staff/lodging-management/get-pickup-stats`,
        { withCredentials: true }
      );

      setPickupStats(response.data);
    } catch (error) {
      console.error("Error fetching pickup stats:", error);
    }
  }

  useEffect(() => {
    getPickupParcels();
    getPickupStats();
  }, []);

  const columns = [
    { label: "Parcel ID", key: "parcelId" },
    {
      label: "Created",
      key: "createdAt",
      render: (value) => {
        const date = new Date(value);
        if (isNaN(date)) {
          return "Invalid Date";
        }
        return formatDistanceToNow(date, {
          addSuffix: true,
        });
      },
    },
    {
      label: "Pickup Date",
      key: "pickupInformation",
      render: (value, row) =>
        new Date(row.pickupInformation.pickupDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    { label: "Shipping Method", key: "shippingMethod" },
    {
      label: "Pickup City",
      key: "pickupInformation",
      render: (value, row) => row.pickupInformation?.city || "N/A",
    },
  ];

  const actions = [
    {
      label: "Register",
      className:
        "bg-Primary text-white font-semibold px-5 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light",
      onClick: (row) =>
        navigate(`/staff/lodging-management/view-pickups/${row.parcelId}`),
    },
  ];

  return (
    <div className="px-8 py-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Pickup Management</h2>
        <p className="text-gray-500">Manage all pickup requests and schedules</p>
      </div>
      
      <div className="flex gap-4 w-full lg:w-auto">
        <StatsBox title="Pickups Today" value={pickupStats.pickupsToday} />
        <StatsBox title="Pending Pickups" value={pickupStats.pendingPickups} />
      </div>
    </div>
   <div>
     <DataTable
      data={parcels}
      columns={columns}
      actions={actions}
      rowsPerPage={5}
      textMessage={"No pickup requests"}
    />
    </div>
   </div>
  );
};

export default PickupRequests;
