import { capitalize, formatDateTime } from "../../../utils/formatters";
import TableDistributor from "../UserTables/DataTable/TableDistributor";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingAnimation from "../../../utils/LoadingAnimation";

const parcelColumns = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "time",
    header: "Timestamp",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "handledBy",
    header: "Handled By",
  },
  {
    accessorKey: "note",
    header: "Notes",
  },
];

const ParcelDetails = ({ entryId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [entryData, setEntryData] = useState(null);
  const [parcelTimeData, setParcelTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/admin/parcel/${entryId}`,
          { withCredentials: true }
        );
        const Data = response.data.data;
        if (Data) {
          setEntryData(Data);
        } else {
          throw new Error("No data received");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPTime = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/admin/track/statuses/${entryId}`,
          { withCredentials: true }
        );
        const tempTimeData = response.data.timeData;
        const TimeData = tempTimeData.map((item) => ({
          status: capitalize(item?.status),
          time: formatDateTime(item?.time),
          location: item?.location,
          handledBy: item.handledBy,
          note: item.note,
        }));
        console.log(TimeData);
        setParcelTimeData(TimeData);
      } catch (error) {
        setError(error.message);
      }
    };

    if (entryId) {
      fetchDetails();
      fetchPTime();
    }
  }, [entryId, backendURL]);
  const parcel = entryData;

  //Loading and error states handling
  if (loading) return <LoadingAnimation />;
  if (error) return <div>Error loading details: {error}</div>;
  const {
    _id,
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
  } = parcel;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className=" flex items-center space-x-4 text-sm text-gray-500">
          <span>
            Status:{" "}
            <span className="font-medium text-indigo-600">
              {capitalize(status)}
            </span>
          </span>
          <span>•</span>
          <span>Last Updated: {formatDateTime(updatedAt)}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Parcel Info Card */}
          <Section title="Parcel Information">
            <div className="grid grid-cols-3 md:grid-cols-2 gap-4 p-4">
              <InfoGrid>
                <Info label="Tracking No" value={trackingNo || "N/A"} />
                <Info label="Item Type" value={capitalize(itemType)} />
                <Info label="Item Size" value={capitalize(itemSize)} />
              </InfoGrid>
              <InfoGrid>
                <Info
                  label="Shipping Method"
                  value={capitalize(shippingMethod)}
                />
                <Info
                  label="Submitting Type"
                  value={capitalize(submittingType)}
                />
                <Info
                  label="Receiving Type"
                  value={capitalize(receivingType)}
                />
                <Info
                  label="Special Instructions"
                  value={capitalize(specialInstructions || "None")}
                />
              </InfoGrid>
              <InfoGrid>
                <Info label="Address" value={deliveryInformation?.deliveryAddress} />
                <Info label="City" value={deliveryInformation?.deliveryCity} />
                <Info label="District" value={deliveryInformation?.deliveryDistrict} />
                <Info label="Province" value={deliveryInformation?.deliveryProvince} />
                <Info label="Postal Code" value={deliveryInformation?.postalCode} />
              </InfoGrid>
            </div>
          </Section>

          {/* Branches Card */}
          <Section title="Branch Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <InfoGrid>
                <Info
                  label="Originating Branch"
                  value={capitalize(`${from?.location} branch`)}
                />
                <Info
                  label="Destination Branch"
                  value={capitalize(`${to?.location} branch`)}
                />
              </InfoGrid>
            </div>
          </Section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* QR Code Card */}
          <Section title="QR Code">
            <div className="p-4 flex justify-center">
              <img
                src={qrCodeNo || "N/A"}
                alt="QR Code"
                className="w-48 h-48 object-contain border rounded-lg p-2 bg-gray-50"
              />
            </div>
          </Section>

          {/* Payment Card */}
          {paymentId && (
            <Section title="Payment Details">
              <div className="grid grid-cols-2 gap-4 p-4">
                <InfoGrid>
                  <Info
                    label="Payment Status"
                    value={capitalize(paymentId?.paymentStatus)}
                  />
                  <Info
                    label="Payment Type"
                    value={capitalize(paymentId?.paymentMethod)}
                  />
                  <Info label="Paid by" value={capitalize(paymentId?.paidBy)} />
                  <Info
                    label="Paid at"
                    value={formatDateTime(
                      paymentId?.paymentDate || paymentId?.createdAt
                    )}
                  />
                </InfoGrid>
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sender/Receiver Column */}
        <div className="space-y-8">
          {senderId && (
            <Section title="Sender Information">
              <DetailGrid>
                <Info
                  label="Name"
                  value={capitalize(
                    `${senderId?.fName} ${senderId?.lName}` ||
                      senderId?.fullname
                  )}
                />
                <Info label="Contact" value={senderId?.contact || "-"} />
                <Info label="Email" value={senderId?.email || "-"} />
                <Info label="Address" value={capitalize(senderId?.address)} />
                <Info
                  label="City/District"
                  value={`${capitalize(senderId?.city)} / ${capitalize(
                    senderId?.district
                  )}`}
                />
                <Info
                  label="Province/Zone"
                  value={`${capitalize(senderId?.province)} / ${capitalize(
                    senderId?.zone
                  )}`}
                />
              </DetailGrid>
            </Section>
          )}
        </div>

        {/* Receiver/Delivery Column */}
        <div className="space-y-8">
          {receiverId && (
            <Section title="Receiver Information">
              <DetailGrid>
                <Info
                  label="Name"
                  value={capitalize(receiverId?.receiverFullName)}
                />
                <Info
                  label="Contact"
                  value={receiverId?.receiverContact || "-"}
                />
                <Info label="Email" value={receiverId?.receiverEmail || "-"} />
                <Info
                  label="Address"
                  value={capitalize(receiverId?.receiverAddress)}
                />
                <Info
                  label="City/District"
                  value={`${capitalize(
                    receiverId?.receiverCity
                  )} / ${capitalize(receiverId?.receiverDistrict)}`}
                />
                <Info
                  label="Province/Zone"
                  value={`${capitalize(
                    receiverId?.receiverProvince
                  )} / ${capitalize(receiverId?.receiverZone)}`}
                />
              </DetailGrid>
            </Section>
          )}
        </div>
      </div>

      {/* Pickup/Delivery Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {pickupInformation && (
          <Section title="Pickup Details">
            <DetailGrid>
              <Info
                label="Date/Time"
                value={`${new Date(
                  pickupInformation?.pickupDate
                ).toLocaleDateString()} ${pickupInformation?.pickupTime}`}
              />
              <Info
                label="Address"
                value={capitalize(pickupInformation?.address)}
              />
              <Info
                label="City/District"
                value={`${capitalize(pickupInformation?.city)} / ${capitalize(
                  pickupInformation?.district
                )}`}
              />
              <Info
                label="Province"
                value={capitalize(pickupInformation?.province)}
              />
            </DetailGrid>
          </Section>
        )}

        {deliveryInformation && (
          <Section title="Delivery Details">
            <DetailGrid>
              <Info
                label="Address"
                value={capitalize(deliveryInformation?.deliveryAddress)}
              />
              <Info
                label="City/District"
                value={`${capitalize(
                  deliveryInformation?.deliveryCity
                )} / ${capitalize(deliveryInformation?.deliveryDistrict)}`}
              />
              <Info
                label="Province/Postal"
                value={`${capitalize(
                  deliveryInformation?.deliveryProvince
                )} / ${deliveryInformation?.postalCode}`}
              />
            </DetailGrid>
          </Section>
        )}
      </div>

      {/* Timeline Card */}
      <Section title="Status Timeline">
        <div className="p-4">
          <TableDistributor
            title=""
            entryData={parcelTimeData}
            columns={parcelColumns}
            disableDateFilter={true}
            enableRowClick={false}
            className="overflow-x-auto"
          />
        </div>
      </Section>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <span>Created: {new Date(createdAt).toLocaleString()}</span>
          <span>Last Updated: {new Date(updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// Section
const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Info Components
const InfoGrid = ({ children }) => (
  <div className="grid grid-rows-2 sm:grid-rows-2 gap-4 md:gap-6">
    {children}
  </div>
);

const DetailGrid = ({ children }) => (
  <div className="grid grid-cols-1 gap-4 md:gap-6">{children}</div>
);

const Info = ({ label, value }) => (
  <div className="space-y-1">
    <dt className="text-sm font-medium text-gray-600">{label}</dt>
    <dd className="text-gray-900 break-words font-[500]">{value || "-"}</dd>
  </div>
);
export default ParcelDetails;
