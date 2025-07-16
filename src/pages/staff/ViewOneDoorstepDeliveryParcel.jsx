import { useNavigate, useParams } from "react-router-dom";
import ParcelInformation from "../../components/staff/ParcelInformation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import DeliverySchedules from "../../components/staff/DeliveryScedules";
import axios from "axios";
import { toast } from "sonner";

const ViewOneDoorStepDeliveryParcel = () => {
  const { parcelId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasAssignedSchedule, setHasAssignedSchedule] = useState(false);
  const [isCheckingAssignment, setIsCheckingAssignment] = useState(false);

  const navigate = useNavigate();

  const checkAssignment = async () => {
      if (!parcelId) return;
      setIsCheckingAssignment(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/staff/delivery-schedules/check-parcel-assignment",
          {
            params: {
              parcelId: parcelId,
            },
             withCredentials: true 
          },
        
        );
        console.log("Assignment check response:", response.data);
        setHasAssignedSchedule(response.data.isAssigned);
      } catch (error) {
        console.error("Assignment check failed:", error);
      } finally {
        setIsCheckingAssignment(false);
      }
    };

  useEffect(() => {
    checkAssignment();
  }, [parcelId]);

  const handleParcelLoad = () => {
    setIsLoaded(true);
  };

  const handleScheduleAssignment = (isAssigned) => {
    setHasAssignedSchedule(isAssigned);
  };

  const updateParcel = async (parcelId) => {
    if (!hasAssignedSchedule) {
      toast.warning("Please assign the parcel to a delivery schedule");
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/staff/collection-management/update-delivery-parcel/:${parcelId}`,
        { parcelId },
        { withCredentials: true }
      );

      console.log("Parcel is assigned to a delivery schedule", response)
        toast.success("Parcel is assigned to a delivery schedule", {
          description: response.message,
          duration: 4000,
        });
        navigate(-1);
      
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.message ||
        "Delivery schedule assignment failed. Please try again.";

      toast.error("Parcel status not updated", {
        description: errorMessage,
        duration: 4000,
      });
    }
  };

  return (
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
              Parcel ID: #{parcelId}
            </h1>
          </div>
        </div>

        <div className="">
          <ParcelInformation
            parcelId={parcelId}
            onParcelLoad={handleParcelLoad}
          />
        </div>

        {isLoaded && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Vehicle schdeules */}
            <div className="mt-11">
              <DeliverySchedules
                onAssignmentChange={handleScheduleAssignment}
                parcelId={parcelId}
              />
            </div>

            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md 
                    text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
                    focus:ring-Primary focus:ring-offset-2 transition-all duration-200"
              >
                Back to List
              </button>

              <div className="flex space-x-3">
                <button
                  className={`bg-Primary text-white px-6 py-2 rounded-xl
                ${!hasAssignedSchedule ? "opacity-50 cursor-not-allowed" : ""}
              `}
                  onClick={() => updateParcel(parcelId)}
                  disabled={!hasAssignedSchedule}
                >
                  {isCheckingAssignment ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOneDoorStepDeliveryParcel;
