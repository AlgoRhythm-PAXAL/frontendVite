import axios from "axios";
import React, { useEffect, useState } from "react";
const backendURL = import.meta.env.VITE_BACKEND_URL;


const InquiryReplyInfo = ({ inquiryId, onInquiryLoad }) => {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInquiry = async () => {
    try {
      const res = await axios.get(
        `${backendURL}/staff/inquiry-management/get-one-replied-inquiry/${inquiryId}`,
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

  if (loading)
    return <div className="m-20">Loading Inquiry Information...</div>;
  if (!inquiry) return <div>No inquiry found</div>;
  return (
    <div className="space-y-16 p-6 max-w-5xl mx-auto">
      {/* Inquiry Information */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Inquiry: {inquiryId}
            </h2>
            <p className="text-sm text-gray-500">
              Received on{" "}
              {new Date(inquiry?.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="border-b pb-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Customer Details
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">{inquiry?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="font-medium text-Primary break-all">
                    {inquiry?.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Tracking Number</dt>
                  <dd className="font-medium text-gray-900">
                    {inquiry?.parcelTrackingNo}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Inquiry Message
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {inquiry?.message}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Information */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Staff Response
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="border-b pb-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Respondent Details
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">Staff ID</dt>
                  <dd className="font-medium text-gray-900">
                    {inquiry?.staffId?.staffId}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Staff Name</dt>
                  <dd className="font-medium text-gray-900">
                    {inquiry?.staffId?.name}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-green-50 p-5 rounded-xl border border-green-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Reply Message
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {inquiry?.reply}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryReplyInfo;
