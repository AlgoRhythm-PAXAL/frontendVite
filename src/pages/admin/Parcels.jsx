import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import LoadingAnimation from "../../utils/LoadingAnimation";

const backendURL = import.meta.env.VITE_BACKEND_URL;

// Utility function to format camelCase to readable text
const formatCamelCaseToReadable = (text) => {
  if (!text) return text;
  
  return text
    // Split camelCase words
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Handle consecutive capitals
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    // Capitalize first letter of each word
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
};

// Utility function to format status text
const formatStatusText = (status) => {
  if (!status) return status;
  
  // Handle special cases
  const specialCases = {
    'arrivedAtCollectionCenter': 'Arrived at Collection Center',
    'inTransit': 'In Transit',
    'outForDelivery': 'Out for Delivery',
    'deliveredToRecipient': 'Delivered to Recipient',
    'returnToSender': 'Return to Sender',
    'awaitingPickup': 'Awaiting Pickup',
    'processingAtFacility': 'Processing at Facility',
  };
  
  const lowerStatus = status.toLowerCase();
  const camelCaseKey = Object.keys(specialCases).find(key => key.toLowerCase() === lowerStatus);
  
  if (camelCaseKey) {
    return specialCases[camelCaseKey];
  }
  
  // Fallback to general formatting
  return formatCamelCaseToReadable(status);
};

// Column configuration - memoized for performance
const parcelColumns = [
  {
    accessorKey: "itemId",
    header: "Parcel No",
    cell: ({ getValue }) => (
      <span className="font-medium text-gray-800 bg-gray-50 px-2 py-1 rounded">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "trackingNo",
    header: "Tracking No",
    cell: ({ getValue }) => (
      <span className="font-mono text-sm bg-slate-50 text-slate-700 px-2 py-1 rounded border border-slate-200">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "itemType",
    header: "Type",
    cell: ({ getValue }) => (
      <span className="text-gray-700 bg-gray-50 px-2 py-1 rounded">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "itemSize",
    header: "Size",
    cell: ({ getValue }) => (
      <span className="text-gray-700 bg-slate-50 px-2 py-1 rounded">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "receivingType",
    header: "Rcv. Type",
    cell: ({ getValue }) => (
      <span className="text-gray-700 bg-slate-100 px-2 py-1 rounded">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "senderName",
    header: "Sender",
    cell: ({ getValue }) => (
      <span className="truncate max-w-32 text-gray-800 font-medium" title={getValue()}>
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "shipmentMethod",
    header: "Shp. Method",
    cell: ({ getValue }) => (
      <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case "delivered":
          case "deliveredtorecipient":
            return "bg-green-50 text-green-700 border border-green-200";
          case "in_transit":
          case "intransit":
          case "in transit":
            return "bg-blue-50 text-blue-700 border border-blue-200";
          case "pending":
          case "awaitingpickup":
            return "bg-amber-50 text-amber-700 border border-amber-200";
          case "cancelled":
          case "returntosender":
            return "bg-red-50 text-red-700 border border-red-200";
          case "shipped":
          case "outfordelivery":
            return "bg-indigo-50 text-indigo-700 border border-indigo-200";
          case "processing":
          case "processingatfacility":
          case "arrivedatcollectioncenter":
            return "bg-slate-50 text-slate-700 border border-slate-200";
          default:
            return "bg-gray-50 text-gray-700 border border-gray-200";
        }
      };
      
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
          {getValue()}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
  },
];

const Parcels = () => {
  const [parcelData, setParcelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Data transformation utility
  const transformParcelData = useMemo(() => (rawData) => {
    return rawData.map((item) => {
      const itemId = item.parcelId || item._id;
      
      let formattedCreatedAt = "Invalid Date";
      try {
        formattedCreatedAt = new Date(item.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } catch (dateError) {
        console.warn("Date parsing error for item:", item._id, dateError);
      }

      let formattedUpdatedAt = "Invalid Date";
      try {
        formattedUpdatedAt = new Date(item.updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (dateError) {
        console.warn("Updated date parsing error for item:", item._id, dateError);
      }

      return {
        ...item,
        itemId,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
        // Ensure all required fields have defaults and proper formatting
        trackingNo: item.trackingNo || "N/A",
        itemType: formatCamelCaseToReadable(item.itemType) || "Unknown",
        itemSize: formatCamelCaseToReadable(item.itemSize) || "Unknown",
        receivingType: formatCamelCaseToReadable(item.receivingType) || "Unknown",
        senderName: item.senderName || "Unknown Sender",
        shipmentMethod: formatCamelCaseToReadable(item.shipmentMethod) || "Unknown",
        status: formatStatusText(item.status) || "Pending",
      };
    });
  }, []);

  // Fetch data with retry logic
  const fetchParcelData = useCallback(async () => {
    try {
      setError(null);
      
      const apiEndpoint = `${backendURL}/api/admin/parcels`;

      const response = await axios.get(apiEndpoint, {
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      });

      // Handle different response structures
      const rawData = response.data?.userData || 
                     response.data?.data || 
                     response.data || 
                     [];

      if (!Array.isArray(rawData)) {
        throw new Error("Invalid data format received from server");
      }

      const transformedData = transformParcelData(rawData);
      setParcelData(transformedData);
      setRetryCount(0); // Reset retry count on success
      
    } catch (error) {
      console.error("Error fetching parcel data:", error);
      
      let errorMessage = "Failed to load parcels";
      
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your connection.";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to view this data.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.status === 404) {
        errorMessage = "Parcel data not found.";
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network.";
      }

      setError({
        message: errorMessage,
        details: error.message,
        canRetry: error.response?.status !== 403, // Don't allow retry for forbidden
      });
    } finally {
      setLoading(false);
    }
  }, [transformParcelData]);

  // Retry handler
  const handleRetry = useCallback(() => {
    if (retryCount < 3) { // Limit retries to prevent infinite loops
      setLoading(true);
      setRetryCount(prev => prev + 1);
      fetchParcelData();
    }
  }, [retryCount, fetchParcelData]);

  useEffect(() => {
    fetchParcelData();
  }, [fetchParcelData]);

  // Error component
  // eslint-disable-next-line react/prop-types
  const ErrorState = ({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Parcels</h3>
        <p className="text-red-600 mb-2">{error.message}</p>
        {error.details && (
          <p className="text-sm text-gray-500 mb-4">{error.details}</p>
        )}
        {error.canRetry && retryCount < 3 && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry ({3 - retryCount} attempts left)
          </button>
        )}
        {retryCount >= 3 && (
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <p className="text-sm text-gray-600">Maximum retry attempts reached. Please refresh the page.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Loading component with skeleton
  const LoadingState = () => (
    <div className="flex flex-col mx-8">
      <SectionTitle title="Parcels" />
      <div className="flex flex-col">
        <div className="my-8">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 rounded bg-gray-50">
                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <LoadingAnimation />
            {/* <span className="ml-3 text-gray-600 font-medium">Loading parcels...</span> */}
          </div>
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Parcels Found</h3>
        <p className="text-gray-600 mb-4">There are currently no parcels in the system.</p>
        <button
          onClick={fetchParcelData}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );

  // Main render logic
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex flex-col mx-8">
        <SectionTitle title="Parcels" />
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (parcelData.length === 0) {
    return (
      <div className="flex flex-col mx-8">
        <SectionTitle title="Parcels" />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-8">
      <SectionTitle title="Parcels" />
      <div className="flex flex-col">
        <div className="my-8">
          <div className="mb-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Total Parcels: <span className="font-semibold text-gray-900">{parcelData.length}</span>
                </span>
              </div>
              {parcelData.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Data loaded successfully</span>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setLoading(true);
                fetchParcelData();
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <TableDistributor
              title="parcel"
              entryData={parcelData}
              columns={parcelColumns}
              enableRowClick={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parcels;
