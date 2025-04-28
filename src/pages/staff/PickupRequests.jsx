import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import DataTable from "../../components/staff/DataTable";

const PickupRequests = () => {
  const [parcels, setParcels] = useState([]);
  const navigate = useNavigate();

  const getPickupParcels = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/lodging-management/get-all-pickup-parcels",
        { withCredentials: true }
      );

      setParcels(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPickupParcels();
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
   < div className=" mt-5 ">
   <div className="flex mb-8">
    <div className="w-3/5">
    </div>
    <div className="w-2/5 flex justify-end mr-11 py-3">
      <div className="mx-2  border-2 border-gray-200 rounded-lg px-5 py-4 transition-shadow duration-300 hover:shadow-md">
        <p className="text-gray-400 ">Pickups Today</p>
        <h1 className="font-semibold text-3xl">50</h1>
      </div>
      <div className="mx-2 border-2 border-gray-200 rounded-lg px-5 py-4 transition-shadow duration-300 hover:shadow-md">
        <p className="text-gray-400">Pending Pickups</p>
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
      textMessage={"No pickup requests"}
    />
    </div>
   </div>
  );
};

export default PickupRequests;
