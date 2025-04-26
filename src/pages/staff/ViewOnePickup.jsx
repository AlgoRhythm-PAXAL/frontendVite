import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ParcelInfo from "../../components/staff/ParcelInfo";
import PickupSchedules from "../../components/staff/PickupSchedules";

const ViewOnePickup = () => {
  const { parcelId } = useParams();
  const [parcel, setParcel] = useState(null);

  const handleParcelLoad = (data) => {
    setParcel(data);
  };

  const registerPickup = () => {
    try {
    } catch (error) {}
  };

  return (
    <>
      <ParcelInfo parcelId={parcelId} onParcelLoad={handleParcelLoad} />
      <div className="mx-12">
        <button className="bg-white text-Primary font-semibold border-2 border-Primary mt-14 px-4 py-2 rounded-xl">
          + New Schedule
        </button>
        {parcel?.pickupInformation && (
          <PickupSchedules
            pickupDate={parcel.pickupInformation.pickupDate}
            pickupTimeSlot={parcel.pickupInformation.pickupTime}
          />
        )}
        <div className="flex justify-end mr-16 mb-12">
          <button className="bg-Primary text-white px-6 py-2 rounded-xl">
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewOnePickup;
