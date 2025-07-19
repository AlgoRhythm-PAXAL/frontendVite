import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ParcelInfo = ({ parcelId, onParcelLoad }) => {
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getParcel = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/staff/lodging-management/get-one-parcel/${parcelId}`,
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

  if (loading) return <div className="m-20">Loading Parcel Information...</div>;
  if (!parcel) return <div>No parcel found</div>;

  return (
    <>
      <form className="m-5">
        <fieldset className="border-2 border-gray-400 px-8 py-5 mb-6 mx-6 ">
          <legend className="ml-10 px-2">Sender Information</legend>
          <p>
            <strong>Name:</strong>{" "}
            {`${parcel.senderId.fName} ${parcel.senderId.lName}`}{" "}
          </p>
          <p>
            <strong>NIC:</strong> {parcel.senderId.nic}{" "}
          </p>
          <p>
            <strong>Email:</strong> {parcel.senderId.email}{" "}
          </p>
          <p>
            <strong>Mobile:</strong> {parcel.senderId.contact}{" "}
          </p>
        </fieldset>

        <fieldset className="border-2 border-gray-400 px-8 py-5 mb-6 mx-6">
          <legend className="ml-10 px-2 ">Receiver Information</legend>
          <p>
            <strong>Name:</strong> {parcel.receiverId.receiverFullName}{" "}
          </p>
          <p>
            <strong>Email:</strong> {parcel.receiverId.receiverEmail}{" "}
          </p>
          <p>
            <strong>Mobile:</strong> {parcel.receiverId.receiverContact}{" "}
          </p>
        </fieldset>

        <fieldset className="border-2 border-gray-400  mb-6 mx-6">
          <legend className="ml-10 px-2">Parcel Information</legend>
          <div className="flex   px-8 py-5">
            <div className="w-1/2 ">
              <p>
                <strong>Item Size:</strong> {parcel.itemSize}{" "}
              </p>
              <p>
                <strong>Item Type:</strong> {parcel.itemType}
              </p>
              <p>
                <strong>Instructions:</strong> {parcel?.specialInstructions}
              </p>
            </div>
            <div className="w-1/2">
              <p>
                <strong>Shipping Method:</strong> {parcel.shippingMethod}
              </p>
              <p>
                <strong>Submitting Type:</strong> {parcel.submittingType}{" "}
              </p>
              <p>
                <strong>Receiving Type:</strong> {parcel.receivingType}
              </p>
            </div>
          </div>
          {(parcel.submittingType === "pickup" ||
            parcel.receivingType === "doorstep") && (
            <div className="flex border-t-2 border-t-gray-400 px-8 py-5">
              {parcel.submittingType === "pickup" && (
                <div className="w-1/2">
                  <p>
                    <strong>Pickup Date:</strong>{" "}
                    {parcel?.pickupInformation?.pickupDate &&
                      new Date(
                        parcel.pickupInformation.pickupDate
                      ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Pickup Time:</strong>{" "}
                    {parcel?.pickupInformation?.pickupTime}
                  </p>
                  <p>
                    <strong>Pickup Address:</strong>
                    {parcel?.pickupInformation?.address},<br />
                    {parcel?.pickupInformation?.city},<br />
                    {parcel?.pickupInformation?.district},<br />
                    {parcel?.pickupInformation?.province} Province.
                  </p>
                </div>
              )}
              {parcel.receivingType === "doorstep" && (
                <div className="w-1/2">
                  <p>
                    <strong>Delivery Address:</strong>
                    {parcel?.deliveryInformation?.deliveryAddress},<br />
                    {parcel?.deliveryInformation?.deliveryCity},<br />
                    {parcel?.deliveryInformation?.deliveryDistrict},<br />
                    {parcel?.deliveryInformation?.deliveryProvince} Province.
                  </p>
                  <p>
                    <strong>Postal Code:</strong>{" "}
                    {parcel?.deliveryInformation?.postalCode}
                  </p>
                </div>
              )}
            </div>
          )}
        </fieldset>

        <fieldset className="border-2 border-gray-400 px-8 py-5 mx-6">
          <legend className="ml-10 px-2">Payment Information</legend>
          <p>
            <strong>Payment Method:</strong> {parcel?.paymentId?.paymentMethod}
          </p>
          <p>
            <strong>Paid by:</strong> {parcel?.paymentId?.paidBy}
          </p>
          <p>
            <strong>Amount (Rs.):</strong> {parcel?.paymentId?.amount}{" "}
          </p>
          <p>
            <strong>Payment Status:</strong> {parcel?.paymentId?.paymentStatus}
          </p>
        </fieldset>
      </form>
    </>
  );
};

export default ParcelInfo;
