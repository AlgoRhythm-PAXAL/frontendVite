import SectionTitle from "../../components/admin/SectionTitle"
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor"

const branchColumns=[
  {
      accessorKey: "itemId",
      header: "Branch No"
  },
  {
      accessorKey: "location",
      header: "Branch location"
  },
  {
      accessorKey: "contact",
      header: "Contact"
  },
  {
      accessorKey: "updatedAt",
      header: "Last update"
  },
  {
      accessorKey: "createdAt",
      header: "Since"
  },
]

const Branches = () => {
  return (
    <div className="mx-8">
        <SectionTitle title="Branches"/>
        <TableDistributor title="branch" columns={branchColumns} disableDateFilter={true}/>
        
    </div>
  )
}

export default Branches