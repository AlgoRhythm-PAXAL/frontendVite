import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import DataTable from "../../components/staff/DataTable";
import StatsBox from "../../components/staff/StatsBox";

const CollectionCenterDeliveryParcels = () => {
  const [parcels, setParcels] = useState([]);
   const [deliveryStats, setDeliveryStats] = useState({
      pendingCollectionCenterDeliveries: 0
        
      });
  const navigate = useNavigate();

  const getCollectionCenterDeliveryParcels = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/collection-management/get-all-collection-center-delivery-parcels",
        { withCredentials: true }
      );

      setParcels(response.data);
    } catch (err) {
      console.error(err);
    }
  };
 const getDeliveryStats = async () => {
    try {
      console.log("Fetching collection-center delivery stats...");
      const response = await axios.get(
        "http://localhost:8000/staff/collection-management/get-collection-center-delivery-stats",
        { withCredentials: true }
      );

      console.log("Collection-center Delivery Stats:", response.data);
      setDeliveryStats(response.data);
    } catch (error) {
      console.error("Error fetching collection-center delivery stats:", error);
    }
  }


  useEffect(() => {
    getCollectionCenterDeliveryParcels();
  }, []);

  const handleDelivery = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/collection-management//update-parcel-as-delivered",
        { parcelId },
        { withCredentials: true }
      );

      if (response.success) {
        toast.success("Parcel Delivery Successful", {
          description: response.data.message,
          duration: 4000,
        });
      }
    } catch (error) {
      console.log("Error in delivery update", error);
      const errorMessage =
        error.response?.data?.message ||
        "Parcel Delivery failed. Please try again.";

      toast.error("Parcel not Delivered", {
        description: errorMessage,
        duration: 4000,
      });
    }
  };

  const columns = [
    { label: "Parcel ID", key: "parcelId" },
    { label: "Tracking Number", key: "trackingNo" },

    {
      label: "Receiver Name",
      key: "receiverId",
      render: (value, row) =>
        value?.receiverFullName ? `${value.receiverFullName}` : "N/A",
    },
    {
      label: "Payment Status",
      key: "paymentId",
      render: (value, row) =>
        value?.paymentStatus ? `${value.paymentStatus}` : "N/A",
    },

    {
      label: "Payment Amount (Rs.)",
      key: "paymentId",
      render: (value, row) => (value?.amount ? `${value.amount}` : "N/A"),
    },
  ];

  const actions = [
    {
      label: "Delivered",
      className:
        "bg-Primary text-white font-semibold px-5 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light",
      onClick: (row) => {
        handleDelivery;
      },
    },
    {
      label: "View ",
      className:
        "bg-white text-Primary border-2 border-Primary font-semibold px-5 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light",
      onClick: (row) =>
        navigate(
          `/staff/collection-management/view-collection-center-delivery-parcels/${row.parcelId}`
        ),
    },
  ];

  return (
    <div className="px-8 py-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Collection Center Deliveries
          </h2>
          <p className="text-gray-500">
            Manage all parcels collected by customers
          </p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <StatsBox title="Pending Deliveries" value={deliveryStats.pendingCollectionCenterDeliveries} />
        </div>
      </div>
      <div>
        <DataTable
          data={parcels}
          columns={columns}
          actions={actions}
          rowsPerPage={6}
          textMessage={"No collection center delivery parcels"}
        />
      </div>
    </div>
  );
};

export default CollectionCenterDeliveryParcels;
