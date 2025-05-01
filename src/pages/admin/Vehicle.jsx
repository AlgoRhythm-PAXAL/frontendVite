import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import VehicleRegistrationForm from "../../components/admin/Vehicle/VehicleRegistrationForm";

const vehicleColumns = [
  {
    accessorKey: "itemId",
    header: "Vehicle ID",
  },
  {
    accessorKey: "registrationNo",
    header: "Registration No",
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
  },
  {
    accessorKey: "capableVolume",
    header: "Capable Volume",
  },
  {
    accessorKey: "capableWeight",
    header: "Capable Weight",
  },
  {
    accessorKey: "assignedBranch",
    header: "Assigned Branch",
  },
];
const Vehicle = () => {
  return (
    <div className="flex flex-col mx-5">
      <SectionTitle title="Vehicles" />
      <div className="flex flex-col gap-6">
        <TableDistributor
          title="vehicle"
          columns={vehicleColumns}
          disableDateFilter={true}
          enableRowClick={false}
        />
        <VehicleRegistrationForm />
      </div>
    </div>
  );
};
export default Vehicle;
