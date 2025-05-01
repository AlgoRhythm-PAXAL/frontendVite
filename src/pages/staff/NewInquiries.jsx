import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "../../components/staff/DataTable";
import StatsBox from "../../components/staff/StatsBox";

const NewInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  const getNewInquiries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/inquiry-management/get-all-new-inquiries",
        { withCredentials: true }
      );

      setInquiries(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNewInquiries();
  }, []);

  const columns = [
    { label: "Inquiry ID", key: "inquiryId" },
    {
      label: "Sent Date",
      key: "createdAt",
      render: (value) =>
        new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    { label: "Tracking Number", key: "parcelTrackingNo" },
  ];

  const actions = [
    {
      label: "Reply",
      className:
        "bg-Primary text-white font-semibold px-5 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light",
      onClick: (row) =>
        navigate(`/staff/inquiry-management/reply-to-inquiry/${row.inquiryId}`),
    },
  ];

  return (
    <div className="px-8 py-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Inquiry Management
          </h2>
          <p className="text-gray-500">Manage all parcel inquiries</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <StatsBox title="Inquiries Today" value="50" />
          <StatsBox title="Pending Inquiries" value="20" />
        </div>
      </div>
      <div>
        <DataTable
          data={inquiries}
          columns={columns}
          actions={actions}
          rowsPerPage={6}
          textMessage={"No new inquiries"}
        />
      </div>
    </div>
  );
};

export default NewInquiries;
