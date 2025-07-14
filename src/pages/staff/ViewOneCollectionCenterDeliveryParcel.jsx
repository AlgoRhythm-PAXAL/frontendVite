import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ParcelInformation from "../../components/staff/ParcelInformation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "sonner";

const ViewOneCollectionCenterDeliveryparcel = () => {
  const { parcelId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const handleParcelLoad = () => {
    setIsLoaded(true);
  };

  const handleDelivery = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/staff/collection-management/update-parcel-as-delivered",
        { parcelId },
        { withCredentials: true }
      );

      if (response.success) {
        toast.success("Parcel Delivery Successful", {
          description: response.message,
          duration: 4000,
        });

        navigate(-1);
      }

      
    } catch (error) {
      console.log("Error in delivery update", error);
      const errorMessage =
        error.response.message ||
        "Parcel Delivery failed. Please try again.";

      toast.error("Parcel not Delivered", {
        description: errorMessage,
        duration: 4000,
      });
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
            <div className="flex justify-between items-center mt-10 mx-8">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md 
                    text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
                    focus:ring-Primary focus:ring-offset-2 transition-all duration-200
                    hover:bg-gray hover:shadow-md hover:shadow-slate-300 hover:border-1 hover:border-gray-400"
              >
                Back to List
              </button>
              <button
                className="bg-Primary text-white px-6 py-2 rounded-xl hover:shadow-green-600 hover:shadow-sm hover:border-2 hover:border-Primary"
                onClick={() => handleDelivery(parcelId)}
              >
                Delivered
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewOneCollectionCenterDeliveryparcel;
