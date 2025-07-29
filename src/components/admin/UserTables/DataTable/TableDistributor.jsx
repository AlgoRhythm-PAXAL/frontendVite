// import { useState, useEffect } from "react";
// import { DataTable } from "./DataTable";
// import { EntryDetails } from "../../Parcel/EntryDetails";
// import axios from "axios";
// import Modal from "../../adminProfile/Modal";
// import LoadingAnimation from "../../../../utils/LoadingAnimation";

// const formatUser = (str) => {
//   if (!str) return "";
//   return (
//     str
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(" ") + "s"
//   );
// };

// export default function TableDistributor({
//   title,
//   entryData,
//   columns,
//   deleteEnabled,
//   updateEnabled,
//   disableDateFilter,
//   enableRowClick,
//   updateText,
//   deleteText,
//   sorting,
//   updateAPI,
//   deleteAPI,
//   renderUpdateForm,
// }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const user = title.toLowerCase();
//   const formattedUser = formatUser(user);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (entryData) {
//         setData(Array.isArray(entryData) ? entryData : [entryData]);
//         return;
//       }
//       if (!user) return;
//       try {
//         let apiEndpoint = `${backendURL}/api/admin/users/${user}`;
//         const response = await axios.get(apiEndpoint, {
//           withCredentials: true,
//         });
//         const rawData = response.data.userData || response.data;
//         const updatedData = rawData.map((item) => {
//           const itemId = item.id;
//           let formattedCreatedAt = new Date(item.createdAt).toLocaleDateString(
//             "en-US",
//             {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             }
//           );

//           return {
//             ...item,
//             itemId, // add the resolved itemId
//             createdAt: formattedCreatedAt,
//             updatedAt: new Date(item.updatedAt).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             }),
//           };
//         });
//         setData(updatedData);
//         setLoading(false);
//       } catch (error) {
//         console.error(`Error fetching data: `, error);
//       }
//     };

//     fetchData();
//   }, [entryData, user, backendURL]);

//   const handleRowClick = (collection, itemId, givenId) => {
//     if (!enableRowClick) return;
//     if (!itemId) {
//       console.warn("No itemId provided for row click.");
//       return;
//     }
//     setSelectedEntry({ collection, itemId, givenId });
//   };
//   if (loading && !entryData) {
//     return <LoadingAnimation />;
//   }
//   return (
//     <div className="container mx-auto p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-full">
//       <DataTable
//         collectionName={user}
//         title={formattedUser}
//         columns={columns}
//         data={data}
//         deleteEnabled={deleteEnabled}
//         updateEnabled={updateEnabled}
//         updateText={updateText}
//         deleteText={deleteText}
//         disableDateFilter={disableDateFilter}
//         enableRowClick={enableRowClick}
//         onRowClick={handleRowClick}
//         sorting={sorting}
//         updateAPI={updateAPI}
//         deleteAPI={deleteAPI}
//         renderUpdateForm={renderUpdateForm}
//       />

//       {/* Modal Opening */}
//       {/* Modal Opening */}
//       <Modal open={!!selectedEntry} onClose={() => setSelectedEntry(null)}>
//         {selectedEntry &&
//           EntryDetails(
//             selectedEntry.collection,
//             selectedEntry.itemId,
//             () => setSelectedEntry(null),
//             selectedEntry.givenId
//           )}
//       </Modal>
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DataTable } from "./DataTable";
import { EntryDetails } from "../../Parcel/EntryDetails";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Modal from "../../adminProfile/Modal";
import LoadingAnimation from "../../../../utils/LoadingAnimation";

// Utility function with error handling
const formatUser = (str) => {
  try {
    if (!str || typeof str !== "string") return "";
    return (
      str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ") + "s"
    );
  } catch (error) {
    console.error("Error formatting user string:", error);
    return "";
  }
};

// Custom hook for data fetching
const useTableData = (entryData, user, backendURL) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (entryData) {
        const processedData = Array.isArray(entryData) ? entryData : [entryData];
        setData(processedData);
        return;
      }

      if (!user || !backendURL) {
        throw new Error("Missing required parameters for data fetching");
      }

      const apiEndpoint = `${backendURL}/api/admin/users/${user}`;
      const response = await axios.get(apiEndpoint, {
        withCredentials: true,
        timeout: 15000, // 15 second timeout
      });

      const rawData = response.data.userData || response.data;
      console.log("Raw data fetched:", rawData);
      
      if (!Array.isArray(rawData)) {
        throw new Error("Invalid data format received from server");
      }

      const updatedData = rawData.map((item) => {
        try {
          const itemId = item.id || item._id;
          const createdAt = item.createdAt 
            ? new Date(item.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A";

          const updatedAt = item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A";

          return {
            ...item,
            itemId,
            createdAt,
            updatedAt,
          };
        } catch (itemError) {
          console.warn("Error processing item:", itemError, item);
          return item; // Return original item if processing fails
        }
      });

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to load data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entryData, user, backendURL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default function TableDistributor({
  title,
  entryData,
  columns = [],
  deleteEnabled = false,
  updateEnabled = false,
  disableDateFilter = false,
  enableRowClick = true,
  updateText = "Update",
  deleteText = "Delete",
  sorting = true,
  updateAPI,
  deleteAPI,
  renderUpdateForm,
}) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const user = title?.toLowerCase();
  const formattedUser = useMemo(() => formatUser(user), [user]);

  const { data, loading, error, refetch } = useTableData(entryData, user, backendURL);

  // Enhanced row click handler with validation
  const handleRowClick = useCallback((collection, itemId, givenId) => {
    if (!enableRowClick) return;
    
    if (!itemId) {
      console.warn("No itemId provided for row click:", { collection, itemId, givenId });
      return;
    }

    if (!collection) {
      console.warn("No collection provided for row click:", { collection, itemId, givenId });
      return;
    }

    setSelectedEntry({ collection, itemId, givenId });
  }, [enableRowClick]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setSelectedEntry(null);
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    refetch();
  }, [refetch]);

  // Input validation
  if (!title) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          TableDistributor: Title prop is required
        </AlertDescription>
      </Alert>
    );
  }

  if (!Array.isArray(columns) || columns.length === 0) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          TableDistributor: Valid columns array is required
        </AlertDescription>
      </Alert>
    );
  }

  // Loading state
  if (loading && !entryData) {
    return (
      <div className="container mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <LoadingAnimation message={`Loading ${formattedUser}...`} />
       
      </div>
    );
  }

  // Error state with retry option
  if (error && !data.length) {
    return (
      <div className="container mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="mb-4">
            Failed to load {formattedUser}: {error}
          </AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-full">
      {/* Show warning if there's an error but we have cached data */}
      {error && data.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: Some data may be outdated. {error}
          </AlertDescription>
        </Alert>
      )}

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

      {/* Enhanced Modal */}
      <Modal 
        open={!!selectedEntry} 
        onClose={handleCloseModal}
        className="w-full max-w-7xl mx-4"
      >
        {selectedEntry && (
          <EntryDetails
            collectionName={selectedEntry.collection}
            entryId={selectedEntry.itemId}
            onClose={handleCloseModal}
            givenId={selectedEntry.givenId}
            onDataChange={refetch} // Pass refetch function to refresh table data
          />
        )}
      </Modal>
    </div>
  );
}