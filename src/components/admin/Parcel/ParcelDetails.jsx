import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Package,
  MapPin,
  Clock,
  User,
  RefreshCw,
  QrCode,
  CreditCard,
  Truck,
} from "lucide-react";
import {
  capitalize,
  formatDateTime,
  camelToSentenceCase,
  getStatusStyle,
} from "../../../utils/formatters";
import TableDistributor from "../UserTables/DataTable/TableDistributor";
import LoadingAnimation from "../../../utils/LoadingAnimation";
import { toast } from "sonner";
import axios from "axios";

// Enhanced column definitions with better formatting
const parcelColumns = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();
      const { color } = getStatusStyle(status) || {};
      return (
        <Badge variant="outline" className={color}>
          {camelToSentenceCase(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "time",
    header: "Timestamp",
    cell: ({ getValue }) => (
      <span className="text-sm font-mono">{getValue() || "N/A"}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-gray-400" />
        <span className="text-sm">{getValue() || "N/A"}</span>
      </div>
    ),
  },
  {
    accessorKey: "handledBy",
    header: "Handled By",
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1">
        <User className="h-3 w-3 text-gray-400" />
        <span className="text-sm">{getValue() || "N/A"}</span>
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: "Notes",
    cell: ({ getValue }) => {
      const note = getValue();
      return note ? (
        <span className="text-sm text-gray-600" title={note}>
          {note.length > 30 ? `${note.substring(0, 30)}...` : note}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">No notes</span>
      );
    },
  },
];

// Custom hook for data fetching
const useParcelData = (entryId, backendURL) => {
  const [parcelData, setParcelData] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchParcelDetails = useCallback(async () => {
    if (!entryId || !backendURL) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [parcelResponse, trackingResponse] = await Promise.allSettled([
        axios.get(`${backendURL}/api/admin/parcels/${entryId}`, {
          withCredentials: true,
          timeout: 15000,
        }),
        axios.get(`${backendURL}/api/admin/parcels/track/${entryId}`, {
          withCredentials: true,
          timeout: 15000,
        }),
      ]);

      // Handle parcel data
      if (parcelResponse.status === "fulfilled") {
        const parcelData = parcelResponse.value.data.data;
        if (!parcelData || Object.keys(parcelData).length === 0) {
          throw new Error("No parcel data received");
        }
        setParcelData(parcelData);
        
      } else {
        console.error("Failed to fetch parcel details:", parcelResponse.reason);
        throw new Error(
          parcelResponse.reason?.response?.data?.message ||
            "Failed to fetch parcel details"
        );
      }

      // Handle tracking data
      if (trackingResponse.status === "fulfilled") {
        const rawTrackingData = trackingResponse.value.data.data;
        
        if (Array.isArray(rawTrackingData) && rawTrackingData.length > 0) {
          const processedTrackingData = rawTrackingData.map((item, index) => ({
            id: index,
            status: item?.status ? capitalize(item.status) : "Unknown",
            time: item?.time ? formatDateTime(item.time) : "N/A",
            location: item?.location || "N/A",
            handledBy: item?.handledBy || "N/A",
            note: item?.note || "",
          }));

          // Apply sentence case to first status if exists
          if (processedTrackingData.length > 0 && processedTrackingData[0].status) {
            processedTrackingData[0].status = camelToSentenceCase(
              processedTrackingData[0].status
            );
          }

          setTrackingData(processedTrackingData);
        } else {
          console.warn("No tracking data available");
          setTrackingData([]);
        }
      } else {
        console.warn("Failed to fetch tracking data:", trackingResponse.reason);
        setTrackingData([]);
        // Don't throw error for tracking data failure
      }
    } catch (error) {
      console.error("Error fetching parcel data:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load parcel details";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [entryId, backendURL, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchParcelDetails();
  }, [fetchParcelDetails]);

  return { parcelData, trackingData, loading, error, retry };
};

const ParcelDetails = React.memo(({ entryId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { parcelData, trackingData, loading, error, retry } = useParcelData(
    entryId,
    backendURL
  );

  // Memoized parcel sections for performance
  const parcelSections = useMemo(() => {
    if (!parcelData) return null;

    const {
      parcelId,
      trackingNo,
      qrCodeNo,
      itemType,
      itemSize,
      specialInstructions,
      submittingType,
      receivingType,
      shippingMethod,
      status,
      from,
      to,
      pickupInformation,
      deliveryInformation,
      senderId,
      receiverId,
      createdAt,
      updatedAt,
      paymentId,
    } = parcelData;

   
    const { color, icon } = getStatusStyle(status) || {};

    return {
      header: { status, color, icon, updatedAt },
      basic: {
        trackingNo,
        itemType,
        itemSize,
        shippingMethod,
        submittingType,
        receivingType,
        specialInstructions,
      },
      branches: { from, to },
      qrCode: qrCodeNo,
      payment: paymentId,
      sender: senderId,
      receiver: receiverId,
      pickup: pickupInformation,
      delivery: deliveryInformation,
      metadata: { createdAt, updatedAt },
    };
  }, [parcelData]);

   console.log("Parcel data fetched successfully:", parcelSections?.payment?.amount);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingAnimation />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="mb-4">{error}</AlertDescription>
          <Button variant="outline" size="sm" onClick={retry} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  // No data state
  if (!parcelData) {
    return (
      <div className="p-6">
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>No parcel data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-fit max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Enhanced Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Package className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Parcel #{parcelData.parcelId}
            </h1>
            <p className="text-sm text-gray-500">
              Last Updated: {formatDateTime(parcelSections.header.updatedAt)}
            </p>
          </div>
        </div>
        
        <Badge
          variant="outline"
          className={`${parcelSections.header.color} px-4 py-2 text-sm font-semibold`}
        >
          <span className="mr-2">{parcelSections.header.icon}</span>
          {camelToSentenceCase(parcelSections.header.status)}
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parcel Information */}
          <Section title="Parcel Information" icon={<Package className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoGrid>
                <Info label="Tracking Number" value={parcelSections.basic.trackingNo} />
                <Info label="Item Type" value={capitalize(parcelSections.basic.itemType)} />
                <Info label="Item Size" value={capitalize(parcelSections.basic.itemSize)} />
              </InfoGrid>
              <InfoGrid>
                <Info
                  label="Shipping Method"
                  value={capitalize(parcelSections.basic.shippingMethod)}
                />
                <Info
                  label="Submission Type"
                  value={capitalize(parcelSections.basic.submittingType)}
                />
                <Info
                  label="Receiving Type"
                  value={capitalize(parcelSections.basic.receivingType)}
                />
              </InfoGrid>
            </div>
            {parcelSections.basic.specialInstructions && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  Special Instructions
                </h4>
                <p className="text-sm text-yellow-700">
                  {capitalize(parcelSections.basic.specialInstructions)}
                </p>
              </div>
            )}
          </Section>

          {/* Branch Information */}
          <Section title="Branch Information" icon={<MapPin className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info
                label="Origin Branch"
                value={capitalize(`${parcelSections.branches.from?.location} Branch`)}
              />
              <Info
                label="Destination Branch"
                value={capitalize(`${parcelSections.branches.to?.location} Branch`)}
              />
            </div>
          </Section>
        </div>

        {/* Right Column - QR & Payment */}
        <div className="space-y-6">
          {/* QR Code */}
          {parcelSections.qrCode && (
            <Section title="QR Code" icon={<QrCode className="h-5 w-5" />}>
              <div className="flex justify-center p-4">
                <img
                  src={parcelSections.qrCode}
                  alt="Parcel QR Code"
                  className="w-40 h-40 object-contain border rounded-lg p-2 bg-gray-50"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div
                  className="hidden flex items-center justify-center w-40 h-40 border rounded-lg bg-gray-100 text-gray-500"
                >
                  <QrCode className="h-8 w-8" />
                </div>
              </div>
            </Section>
          )}

          {/* Payment Information */}
          {parcelSections.payment && (
            <Section title="Payment Details" icon={<CreditCard className="h-5 w-5" />}>
              <InfoGrid>
                <Info
                  label="Payment Status"
                  value={
                    <Badge
                      variant={
                        parcelSections.payment.paymentStatus === "completed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {capitalize(parcelSections.payment.paymentStatus)}
                    </Badge>
                  }
                />
                <Info
                  label="Payment Method"
                  value={capitalize(parcelSections.payment.paymentMethod)}
                />
                <Info
                  label="Amount"
                  value={parcelSections?.payment?.amount ? `Rs. ${parcelSections.payment.amount}` : "N/A"}
                />
                <Info
                  label="Paid By"
                  value={capitalize(parcelSections?.payment?.paidBy) || "N/A"}
                />
                <Info
                  label="Payment Date"
                  value={formatDateTime(
                    parcelSections.payment.paymentDate ||
                      parcelSections.payment.createdAt
                  )}
                />
              </InfoGrid>
            </Section>
          )}
        </div>
      </div>

      {/* People Information */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sender Information */}
        {parcelSections.sender && (
          <Section title="Sender Information" icon={<User className="h-5 w-5" />}>
            <InfoGrid>
              <Info
                label="Name"
                value={capitalize(
                  `${parcelSections.sender.fName || ""} ${parcelSections.sender.lName || ""}`
                )}
              />
              <Info label="Contact" value={parcelSections.sender.contact} />
              <Info label="Email" value={parcelSections.sender.email} />
              <Info label="Address" value={capitalize(parcelSections.sender.address)} />
              <Info
                label="Location"
                value={`${capitalize(parcelSections.sender.city || "")} / ${capitalize(
                  parcelSections.sender.district || ""
                )}`}
              />
              <Info
                label="Province/Zone"
                value={`${capitalize(parcelSections.sender.province || "")} / ${capitalize(
                  parcelSections.sender.zone || ""
                )}`}
              />
            </InfoGrid>
          </Section>
        )}

        {/* Receiver Information */}
        {parcelSections.receiver && (
          <Section title="Receiver Information" icon={<User className="h-5 w-5" />}>
            <InfoGrid>
              <Info
                label="Name"
                value={capitalize(parcelSections.receiver.receiverFullName)}
              />
              <Info label="Contact" value={parcelSections.receiver.receiverContact} />
              <Info label="Email" value={parcelSections.receiver.receiverEmail} />
            </InfoGrid>
          </Section>
        )}
      </div>

      {/* Pickup/Delivery Information */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pickup Details */}
        {parcelSections.pickup && (
          <Section title="Pickup Details" icon={<Clock className="h-5 w-5" />}>
            <InfoGrid>
              <Info
                label="Scheduled Date/Time"
                value={`${new Date(
                  parcelSections.pickup.pickupDate
                ).toLocaleDateString()} ${parcelSections.pickup.pickupTime || ""}`}
              />
              <Info
                label="Address"
                value={capitalize(parcelSections.pickup.address)}
              />
              <Info
                label="City/District"
                value={`${capitalize(parcelSections.pickup.city || "")} / ${capitalize(
                  parcelSections.pickup.district || ""
                )}`}
              />
              <Info
                label="Province"
                value={capitalize(parcelSections.pickup.province)}
              />
            </InfoGrid>
          </Section>
        )}

        {/* Delivery Details */}
        {parcelSections.delivery && (
          <Section title="Delivery Details" icon={<Truck className="h-5 w-5" />}>
            <InfoGrid>
              <Info
                label="Address"
                value={capitalize(parcelSections.delivery.deliveryAddress)}
              />
              <Info
                label="City/District"
                value={`${capitalize(parcelSections.delivery.deliveryCity || "")} / ${capitalize(
                  parcelSections.delivery.deliveryDistrict || ""
                )}`}
              />
              <Info
                label="Province/Postal"
                value={`${capitalize(parcelSections.delivery.deliveryProvince || "")} / ${
                  parcelSections.delivery.postalCode || "N/A"
                }`}
              />
            </InfoGrid>
          </Section>
        )}
      </div>

      {/* Timeline Section */}
      <Section title="Tracking Timeline" icon={<Clock className="h-5 w-5" />}>
        <div className="overflow-hidden">
          {trackingData && trackingData.length > 0 ? (
            <TableDistributor
              title="PARCEL TRACKING TIMELINE"
              entryData={trackingData}
              columns={parcelColumns}
              disableDateFilter={true}
              enableRowClick={false}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No tracking information available</p>
            </div>
          )}
        </div>
      </Section>

      {/* Metadata Footer */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 border">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <span>
            Created: {new Date(parcelSections.metadata.createdAt).toLocaleString()}
          </span>
          <span>
            Last Updated: {new Date(parcelSections.metadata.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
});

// Enhanced Section Component
const Section = React.memo(({ title, children, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        {icon}
        {title}
      </h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
));

// Enhanced Info Components
const InfoGrid = React.memo(({ children }) => (
  <div className="space-y-4">{children}</div>
));

const Info = React.memo(({ label, value }) => (
  <div className="space-y-1">
    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </dt>
    <dd className="text-gray-900 font-medium break-words">
      {typeof value === "string" || typeof value === "number"
        ? value || "N/A"
        : value || "N/A"}
    </dd>
  </div>
));

// PropTypes
ParcelDetails.propTypes = {
  entryId: PropTypes.string.isRequired,
};

Section.displayName = "Section";
InfoGrid.displayName = "InfoGrid";
Info.displayName = "Info";
ParcelDetails.displayName = "ParcelDetails";

export default ParcelDetails;