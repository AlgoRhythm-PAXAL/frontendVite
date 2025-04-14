import SectionTitle from "../../components/admin/SectionTitle"
import DemoPage from "../../components/admin/UserTables/DataTable/DemoPage";



const Shipments = () => {

  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="Shipments" />
      <div className="flex flex-col gap-">
          <DemoPage title="shipment" deleteEnabled={false} updateEnabled={false} disableDateFilter = {true}/>
      </div>
    </div>
  )
}

export default Shipments