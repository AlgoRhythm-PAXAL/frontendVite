import { useState, useEffect } from "react";
import { DataTable } from "./DataTable";
import { EntryDetails } from "../../Parcel/EntryDetails";
import axios from "axios";
import Modal from "../../adminProfile/Modal";
import LoadingAnimation from "../../../../utils/LoadingAnimation";

const formatUser = (str) => {
  if (!str) return "";
  return (
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") + "s"
  );
};

export default function TableDistributor({
  title,
  entryData,
  columns,
  deleteEnabled,
  updateEnabled,
  disableDateFilter,
  enableRowClick,
  updateText,
  deleteText,
  sorting,
  updateAPI,
  deleteAPI,
  renderUpdateForm,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const user = title.toLowerCase();
  const formattedUser = formatUser(user);

  useEffect(() => {
    const fetchData = async () => {
      if (entryData) {
        setData(Array.isArray(entryData) ? entryData : [entryData]);
        return;
      }

      try {
        let apiEndpoint;
        if (user === "admin") {
          apiEndpoint = `${backendURL}/${user}/all`;
        } else if (user === "branche") {
          apiEndpoint = `${backendURL}/admin/branch/all`;
        } else if (user === "parcel status tracking and assignment detail") {
          apiEndpoint = `${backendURL}/admin/track/statuses`;
        } else {
          apiEndpoint = `${backendURL}/admin/${user}/all`;
        }

        const response = await axios.get(apiEndpoint, {
          withCredentials: true,
        });
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
          let formattedCreatedAt;
          if (user === "parcel") {
            formattedCreatedAt = new Date(item.createdAt).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }
            );
          } else {
            formattedCreatedAt = new Date(item.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            );
          }
          return {
            ...item,
            itemId, // add the resolved itemId
            createdAt: formattedCreatedAt,
            updatedAt: new Date(item.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          };
        });

        setData(updatedData);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching data: `, error);
      }
    };

    fetchData();
  }, [entryData, user, backendURL]);

  const handleRowClick = (collection, itemId) => {
    setSelectedEntry({ collection, itemId });
  };
  if (loading && !entryData) {
    return <LoadingAnimation />;
  }
  return (
    <div className="container mx-auto p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-full">
      <DataTable
        collectionName={user}
        title={formattedUser}
        columns={columns}
        data={data}
        deleteEnabled={deleteEnabled}
        updateEnabled={updateEnabled}
        updateText={updateText}
        deleteText={deleteText}
        disableDateFilter={disableDateFilter}
        enableRowClick={enableRowClick}
        onRowClick={handleRowClick}
        sorting={sorting}
        updateAPI={updateAPI}
        deleteAPI={deleteAPI}
        renderUpdateForm={renderUpdateForm}
      />

      {/* Modal Opening */}
      <Modal open={!!selectedEntry} onClose={() => setSelectedEntry(null)}>
        {selectedEntry && (
          <EntryDetails
            collectionName={selectedEntry.collection}
            entryId={selectedEntry.itemId}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </Modal>
    </div>
  );
}
