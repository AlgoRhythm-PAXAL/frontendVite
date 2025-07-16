import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ParcelInfo from "../../components/staff/ParcelInfo";

const ViewOneParcel = () => {
  const { parcelId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const handleParcelLoad = () => {
    setIsLoaded(true);
  };

  const handleViewInvoice = (parcelId) => {
    console.log("invoice clicked");
    navigate(`/staff/lodging-management/view-parcels/invoice/${parcelId}`);
  };

  return (
    <>
      <ParcelInfo parcelId={parcelId} onParcelLoad={handleParcelLoad} />

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
    </>
  );
};

export default ViewOneParcel;
