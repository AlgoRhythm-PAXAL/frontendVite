import SectionTitle from "../../components/admin/SectionTitle"
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor"


const vehicleColumns=[
  {
      accessorKey: "itemId",
      header: "Vehicle ID"
  },
  {
      accessorKey: "registrationNo",
      header: "Registration No"
  },
  {
      accessorKey: "vehicleType",
      header: "Vehicle Type"
  },
  {
      accessorKey: "capableVolume",
      header: "Capable Volume"
  },
  {
      accessorKey: "capableWeight",
      header: "Capable Weight"
  },
  {
      accessorKey: "assignedBranch",
      header: "Assigned Branch"
  },
  {
      accessorKey: "currentBranch",
      header: "Current Branch"
  },
]
const Vehicle = () => {

  return (
    <div className="flex flex-col mx-5">
        <SectionTitle title="Vehicles"/>
        <TableDistributor title="vehicle" columns={vehicleColumns} disableDateFilter={true}/>
    </div>
  )
}
export default Vehicle