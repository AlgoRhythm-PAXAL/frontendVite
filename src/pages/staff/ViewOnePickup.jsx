import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ParcelInformation from "../../components/staff/ParcelInformation";
import PickupSchedules from "../../components/staff/PickupSchedules";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

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
            withCredentials: true,
          }
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
      setIsCheckingAssignment(true);
      const response = await axios.post(
        "http://localhost:8000/staff/lodging-management/register-pickup",
        { parcelId },
        { withCredentials: true }
      );

      console.log("pickup registered successfully", response);
      toast.success("Pickup registered successfully!", {
        description: response.message,
        duration: 4000,
      });

      navigate(`/staff/lodging-management/view-parcels/invoice/${parcelId}`);
    } catch (error) {
      console.error("pickup registering error", error);
    } finally {
      setIsCheckingAssignment(false);
    }
  };

  return (
    <>
      <div className="min-h-screen  py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Parcel ID:{" "}
                <span className="font-mono text-Primary">{parcelId}</span>
              </h1>
            </div>
          </div>
          <ParcelInformation
            parcelId={parcelId}
            onParcelLoad={handleParcelLoad}
          />

          {isLoaded && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {parcel?.pickupInformation && (
                <div className="mt-14">
                  <PickupSchedules
                    pickupDate={parcel.pickupInformation.pickupDate}
                    pickupTimeSlot={parcel.pickupInformation.pickupTime}
                    onAssignmentChange={handleScheduleAssignment}
                    parcelId={parcelId}
                  />
                </div>
              )}
              <div className="flex justify-end mt-5">
                <button
                  className={`bg-Primary text-white px-6 py-2 rounded-xl
                ${!hasAssignedSchedule ? "opacity-50 cursor-not-allowed" : ""}
              `}
                  onClick={() => registerPickup(parcelId)}
                  disabled={!hasAssignedSchedule}
                >
                  {isCheckingAssignment ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      Registering...
                    </div>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewOnePickup;
