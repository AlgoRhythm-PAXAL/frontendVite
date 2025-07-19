import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { PrinterIcon } from "@heroicons/react/24/outline";

const ParcelInvoice = () => {
  const { parcelId } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);

  const componentRef = useRef(null);

  const getParcel = async () => {
    try {
      console.log(parcelId);
      const res = await axios.get(
        `http://localhost:8000/staff/lodging-management/get-one-parcel/${parcelId}`,
        { withCredentials: true }
      );
      setParcel(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch parcel details: ", error);
      setLoading(false);
    }
  };

  // Prompt the print dialog to print the invoice
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
    @page { size: A4; margin: 10mm; }
    @media print { 
      body { -webkit-print-color-adjust: exact; } 
      .print-only { display: block; }
    }
  `,
  });

  useEffect(() => {
    if (parcelId) {
      getParcel();
    }
  }, [parcelId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Primary"></div>
      </div>
    );
  if (!parcel)
    return (
      <div className="text-center py-20 text-gray-500">
        No parcel invoice found for ID: {parcelId}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Printable Content */}
      <div
        ref={componentRef}
        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
      >
        <div className="bg-[#1f818c] text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Parcel Invoice</h1>
              <p className="text-white/90">{parcel?.parcelId}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-semibold">
                #{parcel?.trackingNo}
              </p>
            </div>
          </div>
        </div>

        {/* Sender/Receiver Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Sender Information
            </h2>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {`${parcel?.senderId?.fName} ${parcel?.senderId?.lName}`}
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {parcel?.senderId?.contact}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Receiver Information
            </h2>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {parcel?.receiverId?.receiverFullName}
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {parcel?.receiverId?.receiverContact}
              </p>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {parcel.receivingType}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Delivery Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>
                <span className="font-medium">Branch:</span>{" "}
                {parcel?.to?.location}
              </p>
              <p>
                <span className="font-medium">Method:</span>{" "}
                {parcel?.shippingMethod}
              </p>
            </div>
            {parcel.receivingType === "doorstep" && (
              <div>
                <p className="font-medium">Delivery Address:</p>
                <p className="text-gray-700">
                  {parcel?.deliveryInformation?.deliveryAddress},<br />
                  {parcel?.deliveryInformation?.deliveryCity},<br />
                  {parcel?.deliveryInformation?.deliveryDistrict},<br />
                  {parcel?.deliveryInformation?.deliveryProvince} Province
                  <br />
                  Postal: {parcel?.deliveryInformation?.postalCode}
                </p>
              </div>
            )}
          </div>
          {parcel?.specialInstructions && (
            <div className="mt-2">
              <p>
                <span className="font-medium">Special Instructions:</span>
              </p>
              <p className="text-gray-700">{parcel.specialInstructions}</p>
            </div>
          )}
        </div>

        {/* Payment Information */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Payment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <span className="font-medium">Amount:</span> Rs.{" "}
                {parcel?.paymentId?.amount}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Paid By:</span>{" "}
                {parcel?.paymentId?.paidBy}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    parcel?.paymentId?.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {parcel?.paymentId?.paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* QR Code */}
        <div className="p-6 flex justify-center">
          {parcel?.qrCodeNo && (
            <div className="text-center">
              <p className="font-medium mb-2">Tracking QR Code</p>
              <img
                src={parcel.qrCodeNo}
                className="w-32 h-32 mx-auto border border-gray-200 p-2"
                alt="QR Code"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 print-only">
          Thank you for choosing our service
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-8 flex justify-end">
        <button
          className="flex items-center gap-2 bg-[#1f818c] text-white font-semibold 
                    px-6 py-3 rounded-lg hover:bg-[#1a6d77] transition-colors
                    shadow-md hover:shadow-lg"
          onClick={handlePrint}
          disabled={loading || !parcel}
        >
          <PrinterIcon className="h-5 w-5" />
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default ParcelInvoice;
