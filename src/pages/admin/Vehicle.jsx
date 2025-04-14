import SectionTitle from "../../components/admin/SectionTitle"


import DemoPage from "../../components/admin/UserTables/DataTable/DemoPage";


const Vehicle = () => {

  return (
    <div className="flex flex-col mx-5">
        <SectionTitle title="Vehicles"/>
        <DemoPage title="vehicle" disableDateFilter={true}/>
    </div>
  )
}

export default Vehicle