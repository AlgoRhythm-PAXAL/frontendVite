import React, { useEffect, useState } from "react";
import DetailItem from "./DetailItem";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;


const ParcelInformation = ({ parcelId, onParcelLoad }) => {
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);

  const getParcel = async () => {
    try {
      const res = await axios.get(
        `${backendURL}/staff/lodging-management/get-one-parcel/${parcelId}`,
        { withCredentials: true }
      );

      setParcel(res.data);
      onParcelLoad(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch parcel details: ", error);
    }
  };

  useEffect(() => {
    if (parcelId) {
      getParcel();
    }
  }, [parcelId]);

  if (loading) return (
    <div className="py-12 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Primary"></div>
    </div>
  );
 if (!parcel) return (
    <div className="text-center py-12">
      <div className="inline-flex items-center p-4 bg-red-50 rounded-xl">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
        <span className="text-red-600 font-medium">No parcel found</span>
      </div>
    </div>
  );


  return (
    <div className="px-6 py-4">
      {/* Sender Information */}
      <div className="mb-8 border border-gray-300 rounded-lg bg-white">
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">
            Sender Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <DetailItem
            label="Name"
            value={`${parcel?.senderId?.fName} ${parcel?.senderId?.lName}`}
          />
          <DetailItem label="NIC" value={parcel?.senderId?.nic} />
          <DetailItem label="Email" value={parcel?.senderId?.email} />
          <DetailItem label="Mobile" value={parcel?.senderId?.contact} />
        </div>
      </div>

      {/* Receiver Information */}
      <div className="mb-8 border border-gray-300 rounded-lg bg-white">
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">
            Receiver Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <DetailItem
            label="Name"
            value={parcel?.receiverId?.receiverFullName}
          />
          <DetailItem label="Email" value={parcel?.receiverId?.receiverEmail} />
          <DetailItem
            label="Mobile"
            value={parcel?.receiverId?.receiverContact}
          />
        </div>
      </div>

      {/* Parcel Information */}
      <div className="mb-8 border border-gray-300 rounded-lg bg-white">
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">
            Parcel Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-4">
              <DetailItem label="Item Size" value={parcel?.itemSize} />
              <DetailItem label="Item Type" value={parcel?.itemType} />
              <DetailItem
                label="Instructions"
                value={parcel?.specialInstructions}
              />
              <DetailItem
                label="From"
                value={parcel?.from.location}
              />
            </div>
            <div className="space-y-4">
              <DetailItem
                label="Shipping Method"
                value={parcel?.shippingMethod}
              />
              <DetailItem
                label="Submitting Type"
                value={parcel?.submittingType}
              />
              <DetailItem
                label="Receiving Type"
                value={parcel?.receivingType}
              />
              <DetailItem
                label="To"
                value={parcel?.to.location}
              />
            </div>
          </div>

          {(parcel?.submittingType === "pickup" ||
            parcel?.receivingType === "doorstep") && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parcel?.submittingType === "pickup" && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Pickup Details
                    </h4>
                    <DetailItem
                      label="Pickup Date"
                      value={
                        parcel?.pickupInformation?.pickupDate &&
                        new Date(
                          parcel?.pickupInformation?.pickupDate
                        ).toLocaleDateString()
                      }
                    />
                    <DetailItem
                      label="Pickup Time"
                      value={parcel?.pickupInformation?.pickupTime}
                    />
                    <DetailItem
                      label="Pickup Address"
                      value={`${parcel?.pickupInformation?.address}, 
                        ${parcel?.pickupInformation?.city}, 
                        ${parcel?.pickupInformation?.district}, 
                        ${parcel?.pickupInformation?.province} Province.`}
                    />
                  </div>
                )}

                {parcel?.receivingType === "doorstep" && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Delivery Details
                    </h4>
                    <DetailItem
                      label="Delivery Address"
                      value={`${parcel?.deliveryInformation?.deliveryAddress}, 
                        ${parcel?.deliveryInformation?.deliveryCity}, 
                        ${parcel?.deliveryInformation?.deliveryDistrict}, 
                        ${parcel?.deliveryInformation?.deliveryProvince} Province.`}
                    />
                    <DetailItem
                      label="Postal Code"
                      value={parcel?.deliveryInformation?.postalCode}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="border border-gray-300 rounded-lg bg-white">
        <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">
            Payment Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <DetailItem
            label="Payment Method"
            value={parcel?.paymentId?.paymentMethod}
          />
          <DetailItem label="Paid by" value={parcel?.paymentId?.paidBy} />
          <DetailItem label="Amount (Rs.)" value={parcel?.paymentId?.amount} />
          <DetailItem
            label="Payment Status"
            value={parcel?.paymentId?.paymentStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default ParcelInformation;
