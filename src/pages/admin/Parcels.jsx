import SectionTitle from "../../components/admin/SectionTitle"
import { format } from 'date-fns';
import { DatePickerWithPresets } from "../../components/admin/DatePicker";
import ParcelTable from "../../components/admin/ParcelTable"


const Parcels = () => {
  const now = new Date();
  console.log(now);
  const formattedDate = format(now, 'MMMM do, yyyy ');
  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="Parcels" />
      <div className="flex flex-col gap-">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">On <span className="font-semibold text-2xl">{formattedDate} </span></h1>
          <DatePickerWithPresets />
        </div>
        <div className="my-8">
          <ParcelTable title="Customer" apiEndPoint="http://localhost:8000/admin/parcel/all" />
        </div>
      </div>
    </div>
  )
}

export default Parcels