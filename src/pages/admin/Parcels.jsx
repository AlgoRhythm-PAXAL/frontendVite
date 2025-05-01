import SectionTitle from "../../components/admin/SectionTitle"
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";

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
    header: "Type"
  },
  {
    accessorKey: "itemSize",
    header: "Size"
  },
  {
    accessorKey: "receivingType",
    header: "Rcv. Type"
  },
  {
    accessorKey: "senderName",
    header: "Sender"
  },
  {
    accessorKey: "shipmentMethod",
    header: "Shp. Mtd"
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

const Parcels = () => {


  return (
    <div className="flex flex-col mx-8">
      <SectionTitle title="Parcels" />
      <div className="flex flex-col ">

        <div className="my-8">
          <TableDistributor title='parcel' columns={parcelColumns}  enableRowClick={true} />
        </div>
      </div>
    </div>
  );
};

export default Parcels