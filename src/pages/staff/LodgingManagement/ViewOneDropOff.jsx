import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ParcelInformation from "../../../components/staff/ParcelInformation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "sonner";

const backendURL = import.meta.env.VITE_BACKEND_URL;


const ViewOneDropOff = () => {
  const { parcelId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleParcelLoad = () => {
    setIsLoaded(true);
  };

  const handleRegistration = async (parcelId) => {
    try {
      setIsRegistering(true);
      const response = await axios.post(
        `${backendURL}/staff/lodging-management/register-dropOff/${parcelId}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.success);

      toast.success("Drop-off parcel collected", {
        description: response.message,
        duration: 4000,
      });

      navigate(`/staff/lodging-management/view-parcels/invoice/${parcelId}`);
    } catch (error) {
      console.log("Error in drop-off parcel collecting", error);
      const errorMessage =
        error.response?.message ||
        "Failed to update the drop-off parcel. Please try again.";

      toast.error("Drop-off Collection Failed", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsRegistering(false);
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
            <div className="flex justify-end">
              <button
                disabled={isRegistering}
                onClick={() => handleRegistration(parcelId)}
                className="bg-white font-semibold text-Primary border-[2px] border-Primary px-7 py-2 rounded-lg hover:shadow-md
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-Primary-light mb-10 mt-5 mr-14"
              >
                {isRegistering ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-Primary"></span>
                    Registering...
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewOneDropOff;
