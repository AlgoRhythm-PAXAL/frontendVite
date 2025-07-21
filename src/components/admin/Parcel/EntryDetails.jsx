// import { Button } from "@/components/ui/button";
// import SectionTitle from "../SectionTitle";
// import { capitalize } from "../../../utils/formatters";
// import ParcelDetails from "./ParcelDetails";
// import UserDetails from "./UserDetails";
// import StaffDetails from "./StaffDetails";
// import DriverDetails from "./DriverDetails";
// import ShipmentDetails from "./ShipmentDetail";
// import AdminDetails from "./AdminDetails";
// import VehicleDetails from "./VehicleDetail";

// export const EntryDetails = (collectionName, entryId, onClose, givenId) => {
//   if (!collectionName || !entryId) {
//     console.error("Collection name or entry ID is missing.");
//     return null;
//   }

//   const formattedUser = capitalize(collectionName);
//   return (
//     //Old code

//     <div
//       className={`bg-white rounded-xl px-6   w-full flex flex-col max-h-[95vh] overflow-auto 
//      ${
//        collectionName === "parcels"
//          ? " bg-Background min-w-[60vw]  sm:min-w-[70vw] lg:min-w-[90vw] xl:min-w-[100vw]"
//          : ""
//      }`}
//     >
//       {/* Header Section */}
//       {/* Adjusted to use the givenId prop for display */}
//       <div className="flex justify-between items-center m-6 ">
//         <SectionTitle
//           title={`${capitalize(collectionName)} Details | ${givenId || "" || entryId}`}
//         />
//         <Button
//           variant="ghost"
//           onClick={onClose}
//           className=" text-gray-500 hover:text-red-500"
//         >
//           {" "}
//           ✕{" "}
//         </Button>
//       </div>

//       <div className="w-full">
//         <div className="w-full justify-center items-center">
//           {collectionName === "parcel" && <ParcelDetails entryId={entryId} />}
//           {collectionName === "customer" && <UserDetails entryId={entryId} />}
//           {collectionName === "staff" && <StaffDetails entryId={entryId} />}
//           {collectionName === "driver" && <DriverDetails entryId={entryId} />}
//           {collectionName === "admin" && <AdminDetails entryId={entryId} />}
//           {collectionName === "vehicle" && <VehicleDetails entryId={entryId} />}
//           {collectionName === "shipment" && <ShipmentDetails entryId={entryId} />}
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import SectionTitle from "../SectionTitle";
import { capitalize } from "../../../utils/formatters";
import LoadingAnimation from "../../../utils/LoadingAnimation";

// Lazy load components for better performance
const ParcelDetails = lazy(() => import("./ParcelDetails"));
const UserDetails = lazy(() => import("./UserDetails"));
const StaffDetails = lazy(() => import("./StaffDetails"));
const DriverDetails = lazy(() => import("./DriverDetails"));
const ShipmentDetails = lazy(() => import("./ShipmentDetail"));
const AdminDetails = lazy(() => import("./AdminDetails"));
const VehicleDetails = lazy(() => import("./VehicleDetail"));
const BranchDetails = lazy(() => import("./BranchDetails"));

// Collection mapping for consistency
const COLLECTION_MAPPING = {
  parcel: ParcelDetails,
  customer: UserDetails,
  staff: StaffDetails,
  driver: DriverDetails,
  admin: AdminDetails,
  vehicle: VehicleDetails,
  shipment: ShipmentDetails,
  branch: BranchDetails, // Added for consistency with backend naming
};

// Error Boundary Component
class DetailsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("EntryDetails Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load details. Please try again or contact support.
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export const EntryDetails = React.memo(
  ({ collectionName, entryId, onClose, givenId }) => {
    // Input validation
    if (!collectionName || !entryId || !givenId) {
      console.error("EntryDetails: Missing required props", {
        collectionName,
        entryId,
      });
      return (
        <div className="bg-white rounded-xl p-6 max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to load details. Missing required information.
            </AlertDescription>
          </Alert>
          <Button variant="outline" onClick={onClose} className="mt-4 w-full">
            Close
          </Button>
        </div>
      );
    }

    const normalizedCollection = collectionName.toLowerCase();
    const DetailComponent = COLLECTION_MAPPING[normalizedCollection];

    if (!DetailComponent) {
      console.warn(
        `EntryDetails: Unknown collection type '${normalizedCollection}'`
      );
      return (
        <div className="bg-white rounded-xl p-6 max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unsupported entry type: {collectionName}
            </AlertDescription>
          </Alert>
          <Button variant="outline" onClick={onClose} className="mt-4 w-full">
            Close
          </Button>
        </div>
      );
    }

    const displayId = givenId || entryId;
    const formattedCollectionName = capitalize(normalizedCollection);

    return (
      <DetailsErrorBoundary>
        <div
          className={`bg-white rounded-xl px-6 w-fit flex flex-col max-h-[95vh] overflow-auto shadow-lg border m-auto`}
        >
          {/* Header Section */}
          <div className="flex justify-between items-center py-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <SectionTitle
              title={`${formattedCollectionName} Details | ${displayId}`}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex-1 py-6">
            <Suspense fallback={<LoadingAnimation />}>
              <DetailComponent entryId={entryId} />
            </Suspense>
          </div>
        </div>
      </DetailsErrorBoundary>
    );
  }
);

EntryDetails.displayName = "EntryDetails";