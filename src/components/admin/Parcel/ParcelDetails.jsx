//Formatting Date to meaningful structure and capitalize strings
import { capitalize, formatDateTime } from '../../../utils/formatters'
import DemoPage from '../UserTables/DataTable/TableDistributor';
const parcelColumns = [
  {
    accessorKey: "itemId",
    header: "Parcel No"
  },
  {
    accessorKey: "trackingNo",
    header: "Tracking No"
  },
  {
    accessorKey: "itemType",
    header: "Item type"
  },
  {
    accessorKey: "itemSize",
    header: "Item size"
  },
  {
    accessorKey: "receivingType",
    header: "Receiving type"
  },
  {
    accessorKey: "senderName",
    header: "Sender"
  },
  {
    accessorKey: "shipmentMethod",
    header: "Shipping Method"
  },
  {
    accessorKey: "specialInstructions",
    header: "Special Instructions"
  },
  {
    accessorKey: "status",
    header: "Current status"
  },
  {
    accessorKey: "createdAt",
    header: "Order placed date"
  },
]

const ParcelDetails = ({ parcel }) => {

  //if parcels are not existed loading will be displayed
  if (!parcel) return <div className="text-center p-8">Loading parcel details...</div>;

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
    pickupInformation,
    deliveryInformation,
    senderId,
    receiverId,
    createdAt,
    updatedAt,
    paymentId,
  } = parcel;



  return (
    <div className="w-full mx-auto px-6 grid grid-rows-2 gap-1">

      {/* Parcel Info */}
      <div className="grid grid-cols-2">
        <Section title="Parcel Information">
          <div className="grid grid-cols-2 gap-6 p-6 mx-6">
            <Info label="Parcel ID" value={parcelId} />
            <Info label="Tracking No" value={trackingNo || "N/A"} />
            <Info label="QR Code No" value={qrCodeNo || "N/A"} />
            <Info label="Item Type" value={capitalize(itemType)} />
            <Info label="Item Size" value={capitalize(itemSize)} />
            <Info label="Shipping Method" value={capitalize(shippingMethod)} />
            <Info label="Submitting Type" value={capitalize(submittingType)} />
            <Info label="Receiving Type" value={capitalize(receivingType)} />
            <Info label="Special Instructions" value={capitalize(specialInstructions || "None")} />
            <Info label="Status" value={capitalize(status)} />
          </div>
        </Section>
      </div>


      {/* Payment Details*/}
      {paymentId && (
        <Section title="Payment Details">
          <div className="grid gris-cols-2 gap-6 p-6 mx-6">
            <Info label="Payment Status" value={capitalize(paymentId?.paymentStatus)} />
            <Info label="Payment Type" value={capitalize(paymentId?.paymentMethod)} />
            <Info label="Paid by" value={capitalize(paymentId?.paidBy)} />
            <Info label="Paid at" value={formatDateTime(paymentId?.paymentDate || paymentId?.createdAt)} />
          </div>
        </Section>)}


      {/* Sender & Receiver Info */}
      <div className=" w-full mx-auto grid grid-cols-2 gap-4">
        {/* Sender Info */}
        {senderId && (
          <Section title="Sender Details">
            <div className="grid grid-cols-2 gap-6 p-6 mx-6">
              <Info label="Name" value={capitalize(`${senderId?.fName} ${senderId?.lName}` || senderId?.fullname)} />
              <Info label="Email" value={senderId?.email || '-'} />
              <Info label="NIC" value={senderId?.nic || '-'} />
              <Info label="Contact" value={senderId?.contact || '-'} />
              <Info label="Address" value={capitalize(senderId?.address)} />
              <Info label="City" value={capitalize(senderId?.city)} />
              <Info label="District" value={capitalize(senderId?.district)} />
              <Info label="Province" value={capitalize(senderId?.province)} />
              <Info label="Zone" value={capitalize(senderId?.zone)} />
            </div>
          </Section>
        )}


        {/* Receiver Info */}
        {receiverId && (
          <Section title="Receiver Details">
            <div className="grid grid-cols-2 gap-6 p-6 mx-6">
              <Info label="Name" value={capitalize(receiverId?.receiverFullname)} />
              <Info label="Email" value={receiverId?.receiverEmail || '-'} />
              <Info label="Contact" value={receiverId?.receiverContact?.[0] || '-'} />
              <Info label="Postal Code" value={receiverId?.receiverPostalcode || '-'} />
              <Info label="Receiver Address" value={receiverId?.receiverNumber || '-'} />
              <Info label="City" value={capitalize(receiverId?.receiverAddress)} />
              <Info label="District" value={capitalize(receiverId?.receiverDistrict)} />
              <Info label="Province" value={capitalize(receiverId?.receiverProvince)} />
              <Info label="Zone" value={capitalize(receiverId?.receiverZone)} />
              <Info label="Landmark" value={capitalize(receiverId?.receiverLandmark)} />
            </div>
          </Section>
        )}
      </div>

      {/* Pickup and Deliver info */}
      <div className=" w-full mx-auto  grid grid-cols-2 gap-4">
        {/* Pickup Info */}
        {pickupInformation && (
          <Section title="Pickup Information">
            <div className="grid grid-cols-2 gap-6 p-6 mx-6">
              <Info label="Date" value={new Date(pickupInformation?.pickupDate).toLocaleDateString()} />
              <Info label="Time" value={pickupInformation?.pickupTime} />
              <Info label="Address" value={capitalize(pickupInformation?.address)} />
              <Info label="City" value={capitalize(pickupInformation?.city)} />
              <Info label="District" value={capitalize(pickupInformation?.district)} />
              <Info label="Province" value={capitalize(pickupInformation?.province)} />
            </div>
          </Section>
        )}

        {/* Delivery Info */}
        {deliveryInformation && (
          <Section title="Delivery Information">
            <div className="grid grid-cols-2 gap-4 p-6 mx-6">
              <Info label="Address" value={capitalize(deliveryInformation?.deliveryAddress)} />
              <Info label="City" value={capitalize(deliveryInformation?.deliveryCity)} />
              <Info label="District" value={capitalize(deliveryInformation?.deliveryDistrict)} />
              <Info label="Province" value={capitalize(deliveryInformation?.deliveryProvince)} />
              <Info label="Postal Code" value={capitalize(deliveryInformation?.postalCode)} />
            </div>
          </Section>
        )}
      </div>

      {/* Meta */}
      <div className="text-sm text-gray-600 mt-6 m-6 my-10">
        <p>Created At: {new Date(createdAt).toLocaleString()}</p>
        <p>Updated At: {new Date(updatedAt).toLocaleString()}</p>
      </div>

      {/* Status Tracking Table */}

      <DemoPage title='Parcel Status Tracking and Assignment Detail' columns={parcelColumns} disableDateFilter={true} />
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-5 mb-6">
    <h2 className="text-xl font-semibold mb-4 mt-3  mx-4">{title}</h2>
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default ParcelDetails;
