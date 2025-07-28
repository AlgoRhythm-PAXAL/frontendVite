import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ParcelInformation from "../../../components/staff/ParcelInformation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const ViewOneParcel = () => {
  const { parcelId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const handleParcelLoad = () => {
    setIsLoaded(true);
  };

  const handleViewInvoice = (parcelId) => {
    
    navigate(`/staff/lodging-management/view-parcels/invoice/${parcelId}`);
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
            Parcel ID: <span className="font-mono text-Primary">{parcelId}</span>
          </h1>
        </div>
        
      </div>
      <ParcelInformation parcelId={parcelId} onParcelLoad={handleParcelLoad} />

      {isLoaded && (
        <div className="flex justify-end">
          <input
            type="button"
            value="Get Invoice"
            className="bg-white font-semibold text-Primary border-[2px] border-Primary px-7 py-2 rounded-lg hover:shadow-md
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-Primary-light mb-10 mt-5 mr-14"
            onClick={() => handleViewInvoice(parcelId)}
          />
        </div>
      )}
     </div>
      </div>
    
  );
};

export default ViewOneParcel;
