import axios from "axios";
import React, { useEffect, useState } from "react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';


const backendURL = import.meta.env.VITE_BACKEND_URL;


const InquiryInfo = ({ inquiryId, onInquiryLoad }) => {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInquiry = async () => {
    try {
      const res = await axios.get(
        `${backendURL}/staff/inquiry-management/get-one-inquiry/${inquiryId}`,
        { withCredentials: true }
      );

      setInquiry(res.data);
      onInquiryLoad(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch inquiry details: ", error);
    }
  };

  useEffect(() => {
    if (inquiryId) {
      getInquiry();
    }
  }, [inquiryId]);

 if (loading) return (
    <div className="py-12 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Primary"></div>
    </div>
  );
  if (!inquiry) return (
    <div className="text-center py-12">
      <div className="inline-flex items-center p-4 bg-red-50 rounded-xl">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
        <span className="text-red-600 font-medium">No Inquiry found</span>
      </div>
    </div>
  );
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Inquiry #{inquiryId}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Received on{" "}
            {new Date(inquiry?.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            inquiry?.status === "new"
              ? "bg-blue-100 text-blue-800"
              : inquiry?.status === "solved"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800" // Default for unknown statuses
          }`}
        >
          {inquiry?.status}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
            <p className="font-medium">{inquiry?.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
            <p className="font-medium text-Primary break-all">
              {inquiry?.email}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Parcel Tracking Number
            </h3>
            <p className="font-medium">{inquiry?.parcelTrackingNo}</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Inquiry Message
          </h3>
          <p className="text-gray-700 whitespace-pre-line">
            {inquiry?.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InquiryInfo;
