import { Button } from "@/components/ui/button";
import SectionTitle from "../SectionTitle";
import { capitalize } from "../../../utils/formatters";
import ParcelDetails from "./ParcelDetails";
import UserDetails from "./UserDetails";
import StaffDetails from "./StaffDetails";
import DriverDetails from "./DriverDetails";
import ShipmentDetails from "./ShipmentDetail";
import AdminDetails from "./AdminDetails";
import VehicleDetails from "./VehicleDetail";

export const EntryDetails = (collectionName, entryId, onClose, givenId) => {
  if (!collectionName || !entryId) {
    console.error("Collection name or entry ID is missing.");
    return null;
  }

  const formattedUser = capitalize(collectionName);
  return (
    //Old code

    <div
      className={`bg-white rounded-xl px-6   w-full flex flex-col max-h-[95vh] overflow-auto 
     ${
       collectionName === "parcels"
         ? " bg-Background min-w-[60vw]  sm:min-w-[70vw] lg:min-w-[90vw] xl:min-w-[100vw]"
         : ""
     }`}
    >
      {/* Header Section */}
      {/* Adjusted to use the givenId prop for display */}
      <div className="flex justify-between items-center m-6 ">
        <SectionTitle
          title={`${capitalize(collectionName)} Details | ${givenId || "" || entryId}`}
        />
        <Button
          variant="ghost"
          onClick={onClose}
          className=" text-gray-500 hover:text-red-500"
        >
          {" "}
          ✕{" "}
        </Button>
      </div>

      <div className="w-full">
        <div className="w-full justify-center items-center">
          {collectionName === "parcel" && <ParcelDetails entryId={entryId} />}
          {collectionName === "customer" && <UserDetails entryId={entryId} />}
          {collectionName === "staff" && <StaffDetails entryId={entryId} />}
          {collectionName === "driver" && <DriverDetails entryId={entryId} />}
          {collectionName === "admin" && <AdminDetails entryId={entryId} />}
          {collectionName === "vehicle" && <VehicleDetails entryId={entryId} />}
          {collectionName === "shipment" && <ShipmentDetails entryId={entryId} />}
        </div>
      </div>
    </div>
  );
};
