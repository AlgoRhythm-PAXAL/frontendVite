import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "../../../components/staff/DataTable";

const ViewRepliedInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  const getRepliedInquiries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/staff/inquiry-management/get-replied-inquiries",
        { withCredentials: true }
      );

      setInquiries(response.data);
    } catch (err) {
      console.error("Error in fetching replied inquiries", err);
    }
  };

  useEffect(() => {
    getRepliedInquiries();
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
      label: "View",
      className:
        "bg-white text-Primary border-2 border-Primary font-semibold px-5 py-2 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-Primary-light",
      onClick: (row) =>
        navigate(
          `/staff/inquiry-management/view-replied-inquiries/${row.inquiryId}`
        ),
    },
  ];

  return (
    <div className="px-8 py-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Parcel Inquiry History
          </h2>
          <p className="text-gray-500">View past inquiries made by customers</p>
        </div>
      </div>
      <div>
        <DataTable
          data={inquiries}
          columns={columns}
          actions={actions}
          rowsPerPage={6}
          textMessage={"No past inquiries "}
        />
      </div>
    </div>
  );
};

export default ViewRepliedInquiries;
