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
    <DataTable
      data={parcels}
      columns={columns}
      actions={actions}
      rowsPerPage={6}
      textMessage={"No drop-off requests"}
    />
  );
};

export default DropOffRequests;
