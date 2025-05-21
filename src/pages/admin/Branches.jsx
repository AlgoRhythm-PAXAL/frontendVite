import BranchRegistrationForm from "../../components/admin/Branch/BranchRegistrationForm";
import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import { useState, useEffect } from "react";
import axios from 'axios'

const branchColumns = [
  {
    accessorKey: "itemId",
    header: "Branch No",
  },
  {
    accessorKey: "location",
    header: "Branch location",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "updatedAt",
    header: "Last update",
  },
  {
    accessorKey: "createdAt",
    header: "Since",
  },
];



const Branches = () => {
  const [data, setData] = useState([]);
  const [loading,setLoading]=useState(true)

  const fetchData = async () => {
  setLoading(true)
  const backendURL = import.meta.env.VITE_BACKEND_URL
  try {
    const apiEndpoint = `${backendURL}/admin/branch/all`;
    const response = await axios.get(apiEndpoint, { withCredentials: true });
    const rawData = response.data.userData || response.data;
    const updatedData = rawData.map((item) => {
      const itemId =
        item.parcelId ||
        item.userId ||
        item.driverId ||
        item.staffId ||
        item.branchId ||
        item.adminId ||
        item.vehicleId ||
        item.id;
      let formattedCreatedAt,formattedUpdatedAt;

      formattedCreatedAt = new Date(item.createdAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );

      formattedUpdatedAt =  new Date(item.updatedAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );

      return {
        ...item,
        itemId, // add the resolved itemId
        createdAt: formattedCreatedAt,
        updatedAt:formattedUpdatedAt
      };
    });

    setData(updatedData);
    setLoading(false);
  } catch (error) {
    console.error(`Error fetching data: `, error);
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mx-8">
      <SectionTitle title="Branches" />
      <div className="flex flex-col gap-12">
        <BranchRegistrationForm />
        <TableDistributor
          title="branche"
          columns={branchColumns}
          disableDateFilter={true}
          enableRowClick={false}
          deleteEnabled={true}
          entryData={data}
        />
        
      </div>
    </div>
  );
};

export default Branches;
