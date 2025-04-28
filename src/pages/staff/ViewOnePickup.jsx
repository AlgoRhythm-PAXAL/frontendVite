import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ParcelInfo from "../../components/staff/ParcelInfo";
import PickupSchedules from "../../components/staff/PickupSchedules";

const ViewOnePickup = () => {
  const { parcelId } = useParams();
  const [parcel, setParcel] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasAssignedSchedule, setHasAssignedSchedule] = useState(false);
  const [isCheckingAssignment, setIsCheckingAssignment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAssignment = async () => {
      if (!parcelId) return;
      setIsCheckingAssignment(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/staff/vehicle-schedules/check-parcel-assignment",
          {
            params: {
              parcelId: parcelId,
            },
          },
          { withCredentials: true }
        );
        setHasAssignedSchedule(response.data.isAssigned);
      } catch (error) {
        console.error("Assignment check failed:", error);
      } finally {
        setIsCheckingAssignment(false);
      }
    };
    checkAssignment();
  }, [parcelId]);

  const handleParcelLoad = (data) => {
    setParcel(data);
    setIsLoaded(true);
  };

  const handleScheduleAssignment = (isAssigned) => {
    setHasAssignedSchedule(isAssigned);
  };

  const registerPickup = async (parcelId) => {
    if (!hasAssignedSchedule) {
      alert("Please assign the parcel to a schedule first");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/lodging-management/register-pickup",
        { parcelId },
        { withCredentials: true }
      );

      console.log("pickup registered successfully", response);
      alert("pickup registered successfully!");
      navigate(`/staff/lodging-management/view-parcels/invoice/${parcelId}`)
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ParcelInfo parcelId={parcelId} onParcelLoad={handleParcelLoad} />

      {isLoaded && (
        <div className="mx-12">
          {parcel?.pickupInformation && (
            <PickupSchedules
              pickupDate={parcel.pickupInformation.pickupDate}
              pickupTimeSlot={parcel.pickupInformation.pickupTime}
              onAssignmentChange={handleScheduleAssignment}
              parcelId={parcelId}
            />
          )}
          <div className="flex justify-end mr-16 mb-12">
            <button
              className={`bg-Primary text-white px-6 py-2 rounded-xl
                ${!hasAssignedSchedule ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => registerPickup(parcelId)}
              disabled={!hasAssignedSchedule}
            >
              {isCheckingAssignment ? "Checking..." : "Register"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewOnePickup;
