import { useState, useEffect } from "react";
import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import VehicleRegistrationForm from "../../components/admin/Vehicle/VehicleRegistrationForm";
import LoadingAnimation from "../../utils/LoadingAnimation";
import axios from "axios";
import RenderVehicleUpdateForm from '../../components/admin/Vehicle/RenderVehicleUpdateForm'

// Utility function to format camelCase to readable text
const formatCamelCaseToReadable = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Transform vehicle data to ensure proper formatting
const transformVehicleData = (vehicles) => {
  if (!Array.isArray(vehicles)) return [];
  
  return vehicles.map(vehicle => ({
    ...vehicle,
    vehicleType: formatCamelCaseToReadable(vehicle.vehicleType),
    assignedBranch: formatCamelCaseToReadable(vehicle.assignedBranch),
    // Format volume and weight with units if not already present
    capableVolume: vehicle.capableVolume ? 
      `${vehicle.capableVolume}${vehicle.capableVolume.toString().includes('L') ? '' : ' m³'}` : 'N/A',
    capableWeight: vehicle.capableWeight ? 
      `${vehicle.capableWeight}${vehicle.capableWeight.toString().includes('kg') ? '' : ' kg'}` : 'N/A',
  }));
};


const vehicleColumns = [
  // {
  //   accessorKey: "vehicleId",
  //   header: "Vehicle ID",
  // },
  {
    accessorKey: "registrationNo",
    header: "Registration Number",
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-gray-900">
        {row.getValue("registrationNo") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium">
          {row.getValue("vehicleType") || "Unknown"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "capableVolume",
    header: "Volume Capacity",
    cell: ({ row }) => (
      <div className="text-sm text-gray-900 font-medium">
        {row.getValue("capableVolume")}
      </div>
    ),
  },
  {
    accessorKey: "capableWeight",
    header: "Weight Capacity",
    cell: ({ row }) => (
      <div className="text-sm text-gray-900 font-medium">
        {row.getValue("capableWeight")}
      </div>
    ),
  },
  {
    accessorKey: "assignedBranch",
    header: "Assigned Branch",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm text-gray-700">
          {row.getValue("assignedBranch") || "Unassigned"}
        </span>
      </div>
    ),
  },
];

const Vehicle = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const deleteAPI = `${backendURL}/api/admin/vehicles`;
  const updateAPI = `${backendURL}/api/admin/vehicles`;

  const fetchData = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      setError(null);

      const response = await axios.get(`${backendURL}/api/admin/vehicles`, {
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      });

      if (response.data && response.data.userData) {
        const transformedData = transformVehicleData(response.data.userData);
        setData(transformedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      
      let errorMessage = 'Failed to load vehicle data. ';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please check your connection.';
      } else if (error.response?.status === 401) {
        errorMessage += 'You are not authorized to view this data.';
      } else if (error.response?.status === 403) {
        errorMessage += 'Access forbidden. Please contact an administrator.';
      } else if (error.response?.status >= 500) {
        errorMessage += 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps






  return (
    <div className="flex flex-col mx-5 space-y-6">
      {/* Header Section */}
      <div className="">
        <SectionTitle title="Vehicle Management" />
        
      </div>

      {/* Loading State */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingAnimation message="Loading vehicle data..." />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error Loading Vehicles</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleRetry}
              className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again {retryCount > 0 && `(${retryCount})`}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Found</h3>
          <p className="text-gray-600 mb-6">Get started by registering your first vehicle.</p>
          <button
            onClick={() => fetchData()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && data.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Vehicle Fleet ({data.length} vehicles)
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Last updated: {new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <TableDistributor
              title="vehicle"
              columns={vehicleColumns}
              disableDateFilter={true}
              enableRowClick={true}
              deleteEnabled={true}
              updateEnabled={true}
              entryData={data}
              deleteAPI={deleteAPI}
              updateAPI={updateAPI}
              updateText="Edit"
              renderUpdateForm={RenderVehicleUpdateForm}
              sorting={false}
            />
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="">
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New Vehicle</h2>
              <p className="text-sm text-gray-600 mt-1">Register a new vehicle to your fleet</p>
            </div>
            <div className="p-6">
              <VehicleRegistrationForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Vehicle;
