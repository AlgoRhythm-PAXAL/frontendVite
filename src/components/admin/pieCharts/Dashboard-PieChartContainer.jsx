
// import { useEffect, useState } from "react";
// import axios from "axios";
// import PieChart from "./PieChart";
// import LoadingAnimation from "../../../utils/LoadingAnimation";
// const backendURL = import.meta.env.VITE_BACKEND_URL;

// const PieChartContainer = () => {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${backendURL}/api/admin/dashboard/pie-chart`,
//           { withCredentials: true }
//         );
//         setChartData(response.data);
//         setLoading(false);
//       } catch (err) {
//         const errorMessage =
//           error.response?.data.message || "Failed to load chart data";
//         TransformStream.error("Data loading error", {
//           description: errorMessage,
//           action: {
//             label: "Retry",
//             onClick: () => fetchData(),
//           },
//         });
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const processGroupData = (group) => ({
//     labels: group.subStages.map((sub) => sub.status),
//     counts: group.subStages.map((sub) => sub.count),
//     total: group.percentage,
//     groupName: group.group,
//   });
//   if (loading) return <LoadingAnimation />;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="flex flex-wrap w-full justify-between items-center gap-y-6 gap-x-0 mt-4">
//       {chartData.map((group, index) => {
//         const processedData = processGroupData(group);
//         return (
//           <div key={index} className="bg-white p-0 rounded-lg shadow-md">
//             <PieChart
//               labels={processedData.labels}
//               data={processedData.counts}
//               total={processedData.total}
//               groupName={processedData.groupName}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default PieChartContainer;


import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import PieChart from "./PieChart";
import LoadingAnimation from "../../../utils/LoadingAnimation";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const PieChartContainer = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${backendURL}/api/admin/dashboard/pie-chart`,
        { 
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid data format received from server");
      }
      
      setChartData(response.data);
      setLoading(false);
      setRetryCount(0);
    } catch (err) {
      console.error("Chart data fetch error:", err);
      
      let errorMessage = "Failed to load chart data";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (err.response?.status === 403) {
        errorMessage = "Access denied. You don't have permission to view this data.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError({
        message: errorMessage,
        status: err.response?.status,
        canRetry: err.response?.status !== 403,
      });
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    fetchData();
  }, [fetchData]);

  const processedChartData = useMemo(() => {
    return chartData.map(group => ({
      labels: group.subStages?.map(sub => sub.status) || [],
      counts: group.subStages?.map(sub => sub.count) || [],
      total: group.percentage || 0,
      groupName: group.group || 'Unknown Group',
    }));
  }, [chartData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-white rounded-lg shadow-md">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Chart Data
          </h3>
          
          <p className="text-gray-600 mb-4">
            {error.message}
          </p>
          
          {error.status && (
            <p className="text-sm text-gray-500 mb-4">
              Error Code: {error.status}
            </p>
          )}
          
          {error.canRetry && (
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Retrying...' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-gray-50 rounded-lg shadow-md">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600">
            There are no charts to display at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {processedChartData.map((processedData, index) => (
          <div 
            key={`${processedData.groupName}-${index}`} 
            className=""
          >
            <PieChart
              labels={processedData.labels}
              data={processedData.counts}
              total={processedData.total}
              groupName={processedData.groupName}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Showing {processedChartData.length} chart{processedChartData.length !== 1 ? 's' : ''} • Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PieChartContainer;
