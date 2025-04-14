import SectionTitle from "../../components/admin/SectionTitle"
import DemoPage from "../../components/admin/UserTables/DataTable/DemoPage"

const Branches = () => {
  return (
    <div className="mx-8">
        <SectionTitle title="Branches"/>
        <DemoPage title="branch" disableDateFilter={true}/>
        
    </div>
  )
}

export default Branches