import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import LoadingAnimation from "../../utils/LoadingAnimation";
import { Calendar as CalendarIcon, MapPin, Filter, RefreshCw, Package, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  
  // Filter states with default 30-day range
  const getDefaultDateRange = useCallback(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return {
      start: thirtyDaysAgo.toISOString(),
      end: today.toISOString()
    };
  }, []);

  const [startDate, setStartDate] = useState(() => getDefaultDateRange().start);
  const [endDate, setEndDate] = useState(() => getDefaultDateRange().end);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFromBranch, setSelectedFromBranch] = useState('all');
  const [selectedToBranch, setSelectedToBranch] = useState('all');
  const [selectedItemType, setSelectedItemType] = useState('all');
  const [selectedItemSize, setSelectedItemSize] = useState('all');
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('all');
  const [selectedReceivingType, setSelectedReceivingType] = useState('all');
  const [selectedSubmittingType, setSelectedSubmittingType] = useState('all');
  const [selectedPreset, setSelectedPreset] = useState('30days');
  
  // Dropdown data
  const [branches, setBranches] = useState([]);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  
  // Memoized safe branches array
  const safeBranches = useMemo(() => {
    return Array.isArray(branches) ? branches : [];
  }, [branches]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 50;

  // Helper functions for date formatting
  const formatDateForAPI = (date) => {
    if (!date) return null;
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.warn('Error formatting date for API:', date, error);
      return null;
    }
  };

  const formatDateForDisplay = (dateInput) => {
    if (!dateInput) return '';
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Static options for filters
  const statusOptions = [
    'OrderPlaced',
    'PendingPickup',
    'PickedUp',
    'ArrivedAtDistributionCenter',
    'ShipmentAssigned',
    'InTransit',
    'ArrivedAtCollectionCenter',
    'DeliveryDispatched',
    'Delivered',
    'NotAccepted',
    'WrongAddress',
    'Return'
  ];

  const itemTypeOptions = ['Glass', 'Flowers', 'Document', 'Clothing', 'Electronics', 'Food', 'Other'];
  const itemSizeOptions = ['small', 'medium', 'large'];
  const shippingMethodOptions = ['standard', 'express'];
  const receivingTypeOptions = ['doorstep', 'collection_center'];
  const submittingTypeOptions = ['pickup', 'drop-off', 'branch'];

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
  // Fetch branches for filter dropdown
  const fetchBranches = useCallback(async () => {
    try {
      const response = await axios.get(`${backendURL}/api/admin/branches`, {
        withCredentials: true,
      });
      const branchData = response.data.branches|| [];
      console.log("Fetched branches:", branchData);
      // Ensure branchData is always an array
      setBranches(Array.isArray(branchData) ? branchData : []);
    } catch (err) {
      console.warn('Failed to fetch branches:', err);
      setBranches([]);
    }
  }, []);

  // Fetch data with filters
  const fetchParcelData = useCallback(async () => {
    try {
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add filter parameters
      if (startDate) params.append('startDate', formatDateForAPI(startDate));
      if (endDate) params.append('endDate', formatDateForAPI(endDate));
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedFromBranch !== 'all') params.append('fromBranch', selectedFromBranch);
      if (selectedToBranch !== 'all') params.append('toBranch', selectedToBranch);
      if (selectedItemType !== 'all') params.append('itemType', selectedItemType);
      if (selectedItemSize !== 'all') params.append('itemSize', selectedItemSize);
      if (selectedShippingMethod !== 'all') params.append('shippingMethod', selectedShippingMethod);
      if (selectedReceivingType !== 'all') params.append('receivingType', selectedReceivingType);
      if (selectedSubmittingType !== 'all') params.append('submittingType', selectedSubmittingType);
      
      // Add pagination
      params.append('page', currentPage);
      params.append('limit', limit);

      const apiEndpoint = `${backendURL}/api/admin/parcels?${params.toString()}`;
      console.log('Fetching with filters:', params.toString());

      const response = await axios.get(apiEndpoint, {
        withCredentials: true,
        timeout: 15000,
      });

      // Handle new response structure with pagination
      const responseData = response.data;
      const rawData = responseData?.data || responseData?.userData || responseData || [];

      if (!Array.isArray(rawData)) {
        throw new Error("Invalid data format received from server");
      }

      const transformedData = transformParcelData(rawData);
      setParcelData(transformedData);
      
      // Update pagination info
      if (responseData?.pagination) {
        setTotalCount(responseData.pagination.totalCount);
        setTotalPages(responseData.pagination.totalPages);
      }
      
      setRetryCount(0);
      
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
        canRetry: error.response?.status !== 403,
      });
    } finally {
      setLoading(false);
    }
  }, [
    transformParcelData, 
    startDate, 
    endDate, 
    selectedStatus, 
    selectedFromBranch, 
    selectedToBranch, 
    selectedItemType, 
    selectedItemSize, 
    selectedShippingMethod, 
    selectedReceivingType, 
    selectedSubmittingType, 
    currentPage
  ]);

  // Retry handler
  const handleRetry = useCallback(() => {
    if (retryCount < 3) { // Limit retries to prevent infinite loops
      setLoading(true);
      setRetryCount(prev => prev + 1);
      fetchParcelData();
    }
  }, [retryCount, fetchParcelData]);

  // Date preset functions
  const applyDatePreset = useCallback((preset) => {
    const today = new Date();
    let startDate, endDate;

    switch (preset) {
      case '7days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = new Date(today);
        break;
      case '30days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        endDate = new Date(today);
        break;
      case '2months':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 2);
        endDate = new Date(today);
        break;
      case 'custom':
        // Don't change dates for custom
        return;
      default:
        return;
    }

    setStartDate(startDate.toISOString());
    setEndDate(endDate.toISOString());
    setSelectedPreset(preset);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Clear filters function
  const clearFilters = useCallback(() => {
    const defaultRange = getDefaultDateRange();
    setStartDate(defaultRange.start);
    setEndDate(defaultRange.end);
    setSelectedStatus('all');
    setSelectedFromBranch('all');
    setSelectedToBranch('all');
    setSelectedItemType('all');
    setSelectedItemSize('all');
    setSelectedShippingMethod('all');
    setSelectedReceivingType('all');
    setSelectedSubmittingType('all');
    setSelectedPreset('30days');
    setCurrentPage(1);
  }, [getDefaultDateRange]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    const defaultRange = getDefaultDateRange();
    const hasCustomDateRange = startDate !== defaultRange.start || endDate !== defaultRange.end;
    return hasCustomDateRange || 
           selectedStatus !== 'all' || 
           selectedFromBranch !== 'all' || 
           selectedToBranch !== 'all' ||
           selectedItemType !== 'all' || 
           selectedItemSize !== 'all' || 
           selectedShippingMethod !== 'all' ||
           selectedReceivingType !== 'all' || 
           selectedSubmittingType !== 'all';
  }, [
    startDate, endDate, selectedStatus, selectedFromBranch, selectedToBranch,
    selectedItemType, selectedItemSize, selectedShippingMethod, 
    selectedReceivingType, selectedSubmittingType, getDefaultDateRange
  ]);

  // Update preset when dates change manually
  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const todayStr = today.toDateString();
    const endStr = end.toDateString();

    if (endStr === todayStr) {
      if (diffDays <= 7) {
        setSelectedPreset('7days');
      } else if (diffDays <= 30) {
        setSelectedPreset('30days');
      } else if (diffDays <= 62) {
        setSelectedPreset('2months');
      } else {
        setSelectedPreset('custom');
      }
    } else {
      setSelectedPreset('custom');
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

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
      <div className="min-h-screen flex items-center justify-center">
      <LoadingAnimation message="Loading parcels..." />
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
      
      {/* Filter Component */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">Filter Parcels</span>
              {hasActiveFilters && (
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                  {(() => {
                    let count = 0;
                    if (selectedStatus !== 'all') count++;
                    if (selectedFromBranch !== 'all') count++;
                    if (selectedToBranch !== 'all') count++;
                    if (selectedItemType !== 'all') count++;
                    if (selectedItemSize !== 'all') count++;
                    if (selectedShippingMethod !== 'all') count++;
                    if (selectedReceivingType !== 'all') count++;
                    if (selectedSubmittingType !== 'all') count++;
                    const defaultRange = getDefaultDateRange();
                    if (startDate !== defaultRange.start || endDate !== defaultRange.end) count++;
                    return count;
                  })()} active
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* Date Range Presets */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
              Quick Date Range
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: '7days', label: 'Last 7 Days' },
                { key: '30days', label: 'Last 30 Days' },
                { key: '2months', label: 'Last 2 Months' },
                { key: 'custom', label: 'Custom Range' }
              ].map((preset) => (
                <Button
                  key={preset.key}
                  variant={selectedPreset === preset.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyDatePreset(preset.key)}
                  className={cn(
                    "h-7 px-3 text-xs transition-all",
                    selectedPreset === preset.key 
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                      : "hover:bg-gray-50 hover:border-gray-300"
                  )}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            
            {/* Start Date */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Start Date
              </label>
              <Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full h-8 justify-start text-left font-normal text-xs',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      {startDate ? formatDateForDisplay(startDate) : 'Select start date'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate ? new Date(startDate) : undefined}
                    onSelect={(newDate) => {
                      if (newDate) {
                        setStartDate(newDate.toISOString());
                        setCurrentPage(1);
                      }
                      setStartDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                End Date
              </label>
              <Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full h-8 justify-start text-left font-normal text-xs',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      {endDate ? formatDateForDisplay(endDate) : 'Select end date'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate ? new Date(endDate) : undefined}
                    onSelect={(newDate) => {
                      if (newDate) {
                        setEndDate(newDate.toISOString());
                        setCurrentPage(1);
                      }
                      setEndDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <Package className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="text-xs">All Statuses</span>
                  </SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      <span className="text-xs">{formatStatusText(status)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Branch Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                From Branch
              </label>
              <Select
                value={selectedFromBranch}
                onValueChange={(value) => {
                  setSelectedFromBranch(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <MapPin className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
                  <SelectValue placeholder="Select from branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="text-xs">All Branches</span>
                  </SelectItem>
                  {Array.isArray(branches) && branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      <span className="text-xs">{branch.branchId} - {branch.location}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Branch Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                To Branch
              </label>
              <Select
                value={selectedToBranch}
                onValueChange={(value) => {
                  setSelectedToBranch(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <MapPin className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
                  <SelectValue placeholder="Select to branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="text-xs">All Branches</span>
                  </SelectItem>
                  {Array.isArray(branches) && branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      <span className="text-xs">{branch.branchId} - {branch.location}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Item Type Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Item Type
              </label>
              <Select
                value={selectedItemType}
                onValueChange={(value) => {
                  setSelectedItemType(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <Package className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="text-xs">All Types</span>
                  </SelectItem>
                  {itemTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="text-xs">{type}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Item Size Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Item Size
              </label>
              <Select
                value={selectedItemSize}
                onValueChange={(value) => {
                  setSelectedItemSize(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <Package className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
                  <SelectValue placeholder="Select item size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="text-xs">All Sizes</span>
                  </SelectItem>
                  {itemSizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      <span className="text-xs">{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shipping Method Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Shipping Method
              </label>
              <Select
                value={selectedShippingMethod}
                onValueChange={(value) => {
                  setSelectedShippingMethod(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <Package className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="text-xs">All Methods</span>
                  </SelectItem>
                  {shippingMethodOptions.map((method) => (
                    <SelectItem key={method} value={method}>
                      <span className="text-xs">{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Receiving Type Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Receiving Type
              </label>
              <Select
                value={selectedReceivingType}
                onValueChange={(value) => {
                  setSelectedReceivingType(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <User className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
                  <SelectValue placeholder="Select receiving type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="text-xs">All Types</span>
                  </SelectItem>
                  {receivingTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="text-xs">{formatCamelCaseToReadable(type)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submitting Type Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Submitting Type
              </label>
              <Select
                value={selectedSubmittingType}
                onValueChange={(value) => {
                  setSelectedSubmittingType(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <User className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
                  <SelectValue placeholder="Select submitting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="text-xs">All Types</span>
                  </SelectItem>
                  {submittingTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="text-xs">{formatCamelCaseToReadable(type)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-1 text-xs">
                <span className="font-medium text-gray-700">Active:</span>
                {(() => {
                  const defaultRange = getDefaultDateRange();
                  if (startDate !== defaultRange.start || endDate !== defaultRange.end) {
                    return (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                        {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
                      </span>
                    );
                  }
                  return null;
                })()}
                {selectedStatus !== 'all' && (
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                    Status: {formatStatusText(selectedStatus)}
                  </span>
                )}
                {selectedFromBranch !== 'all' && (
                  <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">
                    From: {Array.isArray(branches) ? branches.find(b => b._id === selectedFromBranch)?.location || selectedFromBranch : selectedFromBranch}
                  </span>
                )}
                {selectedToBranch !== 'all' && (
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-200">
                    To: {Array.isArray(branches) ? branches.find(b => b._id === selectedToBranch)?.location || selectedToBranch : selectedToBranch}
                  </span>
                )}
                {selectedItemType !== 'all' && (
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-200">
                    Type: {selectedItemType}
                  </span>
                )}
                {selectedItemSize !== 'all' && (
                  <span className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200">
                    Size: {selectedItemSize}
                  </span>
                )}
                {selectedShippingMethod !== 'all' && (
                  <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-200">
                    Method: {selectedShippingMethod}
                  </span>
                )}
                {selectedReceivingType !== 'all' && (
                  <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded border border-teal-200">
                    Receiving: {formatCamelCaseToReadable(selectedReceivingType)}
                  </span>
                )}
                {selectedSubmittingType !== 'all' && (
                  <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded border border-pink-200">
                    Submitting: {formatCamelCaseToReadable(selectedSubmittingType)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="my-8">
          <div className="mb-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Showing: <span className="font-semibold text-gray-900">{parcelData.length}</span>
                  {totalCount > 0 && (
                    <span className="text-gray-500"> of {totalCount} total</span>
                  )}
                </span>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              )}
              {hasActiveFilters && (
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <Filter className="w-3 h-3" />
                  <span>Filtered results</span>
                </div>
              )}
              {parcelData.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Data loaded successfully</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-8 px-3 text-xs"
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-gray-500 px-2">
                    {currentPage}/{totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 px-3 text-xs"
                  >
                    Next
                  </Button>
                </div>
              )}
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
