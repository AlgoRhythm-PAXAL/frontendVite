import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import DataTable from "../../components/staff/DataTable";
import StatsBox from "../../components/staff/StatsBox";

const backendURL = import.meta.env.VITE_BACKEND_URL;


const DoorstepDeliveryParcels = () => {
  const [parcels, setParcels] = useState([]);
   const [deliveryStats, setDeliveryStats] = useState({
    pendingDoorstepDeliveries: 0
      
    });
  const navigate = useNavigate();

  const getDoorstepDeliveryParcels = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/staff/collection-management/get-all-doorstep-delivery-parcels`,
        { withCredentials: true }
      );

      setParcels(response.data);
    } catch (err) {
      console.error("Error in fetching doorstep delivery parcels", err);
    }
  };

  
  const getDeliveryStats = async () => {
    try {
      console.log("Fetching door-step delivery stats...");
      const response = await axios.get(
        `${backendURL}/staff/collection-management/get-doorstep-delivery-stats`,
        { withCredentials: true }
      );

      console.log("Door-step Delivery Stats:", response.data);
      setDeliveryStats(response.data);
    } catch (error) {
      console.error("Error fetching door-step delivery stats:", error);
    }
  }


  useEffect(() => {
    getDoorstepDeliveryParcels();
    getDeliveryStats();
  }, []);

  const columns = [
    { label: "Parcel ID", key: "parcelId" },
    { label: "Shipping Method", key: "shippingMethod" },
    {
      label: "Arrived",
      key: "arrivedToCollectionCenterTime",
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
    { label: "Item Type", key: "itemType" },

    {
      label: "delivery City",
      key: "deliveryInformation",
      render: (value, row) => row.deliveryInformation?.deliveryCity || "N/A",
    },
  ];

  const actions = [
    {
      label: "Assign Driver",
      className:
        "bg-Primary text-white font-semibold px-5 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light",
      onClick: (row) =>
        navigate(
          `/staff/collection-management/view-one-doorstep-delivery-parcel/${row.parcelId}`
        ),
    },
  ];

  return (
    <div className="px-8 py-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Doorstep Delivery Management
          </h2>
          <p className="text-gray-500">
            Manage all doorstep deliveries and schedules
          </p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <StatsBox title="Pending Deliveries" value={deliveryStats.pendingDoorstepDeliveries} />
        </div>
      </div>
      <div>
        <DataTable
          data={parcels}
          columns={columns}
          actions={actions}
          rowsPerPage={6}
          textMessage={"No doorstep delivery parcels"}
        />
      </div>
    </div>
  );
};

export default DoorstepDeliveryParcels;
