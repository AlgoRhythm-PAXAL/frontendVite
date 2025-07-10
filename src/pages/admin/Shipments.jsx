import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import {useState,useEffect} from 'react'
import axios from 'axios'
import RenderShipmentUpdateForm from '../../components/admin/Shipment/RenderShipmentUpdateForm'

const shipmentColumns = [
  {
    accessorKey: "shipmentId",
    header: "Shipment No",
  },
  {
    accessorKey: "deliveryType",
    header: "Shipment Type",
  },
  {
    accessorKey: "route",
    header: "Routes",
  },
  {
    accessorKey: "sourceCenterLocation",
    header: "Source Branch",
  },
  {
    accessorKey: "currentLocation",
    header: "Current Branch",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];




const Shipments = () => {

  const [data,setData]=useState([])
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const updateAPI = `${backendURL}/admin//shipment/update`
  const deleteAPI = `${backendURL}/admin/delete/shipment`

  const fetchData=async()=>{
    const response = await axios.get(`${backendURL}/admin/shipment/all`,{withCredentials:true})
    const shipments = response.data.userData
    console.log(shipments)
    setData(shipments)
  }

  useEffect(()=>{
    fetchData();
  },[])


  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="Shipments" />
      <div className="flex flex-col gap-">
        <TableDistributor
          title="shipment"
          columns={shipmentColumns}
          disableDateFilter={true}
          deleteEnabled={true}
          updateEnabled={true}
          updateAPI={updateAPI}
          deleteAPI={deleteAPI}
          entryData={data}
          renderUpdateForm={RenderShipmentUpdateForm}
          enableRowClick={false}
        />
      </div>
    </div>
  );
};

export default Shipments;
