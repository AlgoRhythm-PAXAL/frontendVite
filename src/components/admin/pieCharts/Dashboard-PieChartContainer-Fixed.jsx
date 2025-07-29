// import { useEffect, useState, useCallback, useMemo } from "react";
// import axios from "axios";
// import PieChart from "./PieChart";
// import LoadingAnimation from "../../../utils/LoadingAnimation";
// import { Calendar as CalendarIcon, MapPin, Filter, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// const backendURL = import.meta.env.VITE_BACKEND_URL;

// const PieChartContainer = () => {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Filter states
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [selectedBranch, setSelectedBranch] = useState('all');
//   const [branches, setBranches] = useState([]);
//   const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
//   const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

//   // Helper function to format date for API (YYYY-MM-DD format)
//   const formatDateForAPI = (date) => {
//     if (!date) return null;
//     try {
//       const d = new Date(date);
//       if (isNaN(d.getTime())) return null;
//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1).padStart(2, '0');
//       const day = String(d.getDate()).padStart(2, '0');
//       return `${year}-${month}-${day}`;
//     } catch (error) {
//       console.warn('Error formatting date for API:', date, error);
//       return null;
//     }
//   };

//   // Helper function to format date for display
//   const formatDateForDisplay = (dateInput) => {
//     if (!dateInput) return '';
//     try {
//       return new Date(dateInput).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   // Fetch branches for filter dropdown
//   const fetchBranches = useCallback(async () => {
//     try {
//       const response = await axios.get(`${backendURL}/api/admin/branches`, {
//         withCredentials: true,
//       });
//       setBranches(response.data.branches || []);
//     } catch (err) {
//       console.error("Error fetching branches:", err);
//     }
//   }, []);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Build query parameters
//       const queryParams = new URLSearchParams();
      
//       if (startDate) {
//         const apiStartDate = formatDateForAPI(startDate);
//         if (apiStartDate) {
//           queryParams.append('startDate', apiStartDate);
//         }
//       }
      
//       if (endDate) {
//         const apiEndDate = formatDateForAPI(endDate);
//         if (apiEndDate) {
//           queryParams.append('endDate', apiEndDate);
//         }
//       }
      
//       if (selectedBranch !== 'all') {
//         queryParams.append('branchId', selectedBranch);
//       }

//       const url = `${backendURL}/api/admin/dashboard/pie-chart${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
//       const response = await axios.get(url, { 
//         withCredentials: true,
//         timeout: 10000, // 10 second timeout
//       });
      
//       if (!response.data || !Array.isArray(response.data)) {
//         throw new Error("Invalid data format received from server");
//       }
      
//       setChartData(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Chart data fetch error:", err);
      
//       let errorMessage = "Failed to load chart data";
      
//       if (err.code === 'ECONNABORTED') {
//         errorMessage = "Request timed out. Please try again.";
//       } else if (err.response?.status === 401) {
//         errorMessage = "Authentication required. Please log in again.";
//       } else if (err.response?.status === 403) {
//         errorMessage = "Access denied. You don't have permission to view this data.";
//       } else if (err.response?.status === 500) {
//         errorMessage = "Server error. Please try again later.";
//       } else if (err.response?.data?.message) {
//         errorMessage = err.response.data.message;
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError({
//         message: errorMessage,
//         status: err.response?.status,
//         canRetry: err.response?.status !== 403,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [startDate, endDate, selectedBranch]);

//   useEffect(() => {
//     fetchBranches();
//   }, [fetchBranches]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleRetry = useCallback(() => {
//     fetchData();
//   }, [fetchData]);

//   const clearFilters = useCallback(() => {
//     setStartDate(null);
//     setEndDate(null);
//     setSelectedBranch('all');
//   }, []);

//   const hasActiveFilters = useMemo(() => {
//     return startDate || endDate || selectedBranch !== 'all';
//   }, [startDate, endDate, selectedBranch]);

//   const processedChartData = useMemo(() => {
//     return chartData.map(group => ({
//       labels: group.subStages?.map(sub => sub.status) || [],
//       counts: group.subStages?.map(sub => sub.count) || [],
//       total: group.percentage || 0,
//       groupName: group.group || 'Unknown Group',
//     }));
//   }, [chartData]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[300px]">
//         <LoadingAnimation message="Loading pie-chart data..." />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-white rounded-lg shadow-md">
//         <div className="text-center max-w-md">
//           <div className="mb-4">
//             <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
          
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Unable to Load Chart Data
//           </h3>
          
//           <p className="text-gray-600 mb-4">
//             {error.message}
//           </p>
          
//           {error.status && (
//             <p className="text-sm text-gray-500 mb-4">
//               Error Code: {error.status}
//             </p>
//           )}
          
//           {error.canRetry && (
//             <button
//               onClick={handleRetry}
//               className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
//               disabled={loading}
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               {loading ? 'Retrying...' : 'Try Again'}
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   if (!chartData.length) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-gray-50 rounded-lg shadow-md">
//         <div className="text-center">
//           <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//           </svg>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             No Data Available
//           </h3>
//           <p className="text-gray-600">
//             There are no charts to display at this time.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full space-y-4">
//       {/* Compact Professional Filters */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
//         {/* Collapsible Filter Header */}
//         <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <Filter className="w-4 h-4 text-gray-600" />
//               <span className="text-sm font-semibold text-gray-900">Filter Charts</span>
//               {hasActiveFilters && (
//                 <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
//                   {[startDate, endDate, selectedBranch !== 'all'].filter(Boolean).length} active
//                 </span>
//               )}
//             </div>
//             {hasActiveFilters && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={clearFilters}
//                 className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900"
//               >
//                 <RefreshCw className="w-3 h-3 mr-1" />
//                 Clear All
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Compact Filter Controls */}
//         <div className="p-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//             {/* Start Date Picker */}
//             <div className="space-y-1">
//               <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//                 Start Date
//               </label>
//               <Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       'w-full h-8 justify-start text-left font-normal text-xs',
//                       !startDate && 'text-muted-foreground'
//                     )}
//                   >
//                     <CalendarIcon className="mr-2 h-3 w-3 flex-shrink-0" />
//                     <span className="truncate">
//                       {startDate
//                         ? formatDateForDisplay(startDate)
//                         : 'Select start date'}
//                     </span>
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar
//                     mode="single"
//                     selected={startDate ? new Date(startDate) : undefined}
//                     onSelect={(newDate) => {
//                       const isoDate = newDate ? newDate.toISOString() : null;
//                       setStartDate(isoDate);
//                       setStartDatePickerOpen(false);
//                     }}
//                     initialFocus
//                   />
//                   {startDate && (
//                     <div className="p-3 border-t">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           setStartDate(null);
//                           setStartDatePickerOpen(false);
//                         }}
//                         className="w-full text-xs"
//                       >
//                         Clear selection
//                       </Button>
//                     </div>
//                   )}
//                 </PopoverContent>
//               </Popover>
//             </div>

//             {/* End Date Picker */}
//             <div className="space-y-1">
//               <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//                 End Date
//               </label>
//               <Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       'w-full h-8 justify-start text-left font-normal text-xs',
//                       !endDate && 'text-muted-foreground'
//                     )}
//                   >
//                     <CalendarIcon className="mr-2 h-3 w-3 flex-shrink-0" />
//                     <span className="truncate">
//                       {endDate
//                         ? formatDateForDisplay(endDate)
//                         : 'Select end date'}
//                     </span>
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar
//                     mode="single"
//                     selected={endDate ? new Date(endDate) : undefined}
//                     onSelect={(newDate) => {
//                       const isoDate = newDate ? newDate.toISOString() : null;
//                       setEndDate(isoDate);
//                       setEndDatePickerOpen(false);
//                     }}
//                     initialFocus
//                   />
//                   {endDate && (
//                     <div className="p-3 border-t">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           setEndDate(null);
//                           setEndDatePickerOpen(false);
//                         }}
//                         className="w-full text-xs"
//                       >
//                         Clear selection
//                       </Button>
//                     </div>
//                   )}
//                 </PopoverContent>
//               </Popover>
//             </div>

//             {/* Branch Filter */}
//             <div className="space-y-1">
//               <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//                 Branch
//               </label>
//               <Select
//                 value={selectedBranch}
//                 onValueChange={setSelectedBranch}
//               >
//                 <SelectTrigger className="w-full h-8 text-xs">
//                   <MapPin className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
//                   <SelectValue placeholder="Select branch" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">
//                     <div className="flex items-center">
//                       <MapPin className="w-3 h-3 mr-2 text-gray-500" />
//                       <span className="text-xs">All Branches ({branches.length})</span>
//                     </div>
//                   </SelectItem>
//                   {branches.map((branch) => (
//                     <SelectItem key={branch._id} value={branch.branchId}>
//                       <div className="flex items-center">
//                         <MapPin className="w-3 h-3 mr-2 text-gray-400" />
//                         <span className="text-xs">{branch.branchId} - {branch.location}</span>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Active Filters Inline Display */}
//           {hasActiveFilters && (
//             <div className="mt-3 pt-3 border-t border-gray-100">
//               <div className="flex flex-wrap items-center gap-1 text-xs">
//                 <span className="font-medium text-gray-700">Active:</span>
//                 {startDate && (
//                   <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
//                     From {formatDateForDisplay(startDate)}
//                   </span>
//                 )}
//                 {endDate && (
//                   <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
//                     To {formatDateForDisplay(endDate)}
//                   </span>
//                 )}
//                 {selectedBranch !== 'all' && (
//                   <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
//                     {branches.find(b => b.branchId === selectedBranch)?.location || selectedBranch}
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Charts Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {processedChartData.map((processedData, index) => (
//           <div 
//             key={`${processedData.groupName}-${index}`} 
//             className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
//           >
//             <PieChart
//               labels={processedData.labels}
//               data={processedData.counts}
//               total={processedData.total}
//               groupName={processedData.groupName}
//             />
//           </div>
//         ))}
//       </div>
      
//       {/* Footer Info */}
//       <div className="text-center">
//         <p className="text-xs text-gray-500">
//           Showing {processedChartData.length} chart{processedChartData.length !== 1 ? 's' : ''} • Last updated: {new Date().toLocaleDateString()}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PieChartContainer;
