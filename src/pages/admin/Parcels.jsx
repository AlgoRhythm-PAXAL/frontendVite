import SectionTitle from "../../components/admin/SectionTitle"
import { format } from 'date-fns';
import { DatePickerWithPresets } from "../../components/admin/DatePicker";
import React from 'react'
import DemoPage from "../../components/admin/UserTables/DataTable/TableDistributor";

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
// const Parcels = () => {
//   const now = new Date();
//   const formattedDate = format(now, 'MMMM do, yyyy ');
//   return (
//     <div className="flex flex-col  mx-8  ">
//       <SectionTitle title="Parcels" />
//       <div className="flex flex-col gap-">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl">On <span className="font-semibold text-2xl">{formattedDate} </span></h1>
//           <div className="">
//           <DatePickerWithPresets />
//           </div>
//         </div>
//         <div className="my-8">
//           {/* <ParcelTable title="Customer" apiEndPoint="http://localhost:8000/admin/parcel/all" /> */}
//           <DemoPage title='parcel' deleteEnabled={true} updateEnabled={true}/>

//         </div>
//       </div>
//     </div>
//   )
// }

const Parcels = () => {


  return (
    <div className="flex flex-col mx-8">
      <SectionTitle title="Parcels" />
      <div className="flex flex-col gap-">

        <div className="my-8">
          <DemoPage title='parcel' columns={parcelColumns} deleteEnabled={true} updateEnabled={true} />
        </div>
      </div>
    </div>
  );
};

export default Parcels