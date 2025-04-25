import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/staff/DataTable";
import axios from "axios";

const ViewParcels = () => {
  const [parcels, setParcels] = useState([]);
  const navigate = useNavigate();

  const getParcels = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/lodging-management/get-all-parcels",
        { withCredentials: true }
      );

      setParcels(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getParcels();
  }, []);

  const columns = [
    { label: "Tracking Number", key: "trackingNo" },
    { label: "Submitting Type", key: "submittingType" },
    { label: "Shipment Method", key: "shippingMethod" },
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
    { label: "Status", key: "status" },
  ];

  const actions = [
    {
      label: "View",
      className:
        "bg-white font-semibold text-Primary border-2 border-Primary px-7 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light",
      onClick: (row) =>
        navigate(`/staff/lodging-management/view-parcels/${row.parcelId}`),
    },
    {
      label: "Invoice",
      className:
        "bg-Primary text-white font-semibold px-5 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light",
      onClick: (row) =>
        navigate(
          `/staff/lodging-management/view-parcels/invoice/${row.parcelId}`
        ),
    },
  ];

  return (
    <DataTable
      data={parcels}
      columns={columns}
      actions={actions}
      rowsPerPage={6}
      textMessage={"No parcel found"}
    />
  );
};

export default ViewParcels;
