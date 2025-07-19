import BranchRegistrationForm from "../../components/admin/Branch/BranchRegistrationForm";
import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import LoadingAnimation from "../../utils/LoadingAnimation";

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
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const fetchData = async () => {
    setLoading(true);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    try {
      const apiEndpoint = `${backendURL}/api/admin/branches`;
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
        let formattedCreatedAt, formattedUpdatedAt;

        formattedCreatedAt = new Date(item.createdAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );

        formattedUpdatedAt = new Date(item.updatedAt).toLocaleDateString(
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
          updatedAt: formattedUpdatedAt,
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

  const updateAPI = `${backendURL}/api/admin/branches`;
  const deleteAPI = `${backendURL}/api/admin/branches`;

  const renderUpdateForm = ( formData, setFormData, rowData ) => {
    return (
      <>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              value={
                formData.location !== undefined
                  ? formData.location
                  : rowData?.location || ""
              }
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Enter branch location"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Number</label>
            <Input
              value={
                formData.contact !== undefined
                  ? formData.contact
                  : rowData?.contact || ""
              }
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              placeholder="Enter contact number"
              pattern="[0-9]{10}"
            />
            <p className="text-xs text-gray-500">
              Sri Lankan format: 07XXXXXXXX
            </p>
          </div>
        </div>
      </>
    );
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="mx-8">
      <SectionTitle title="Branches" />
      <div className="flex flex-col gap-12">
        <TableDistributor
          title="branche"
          columns={branchColumns}
          disableDateFilter={true}
          enableRowClick={false}
          deleteEnabled={true}
          updateEnabled={true}
          updateText="Edit"
          sorting={false}
          entryData={data}
          updateAPI={updateAPI}
          deleteAPI={deleteAPI}
          renderUpdateForm={renderUpdateForm}
        />
        <BranchRegistrationForm />
      </div>
    </div>
  );
};

export default Branches;
