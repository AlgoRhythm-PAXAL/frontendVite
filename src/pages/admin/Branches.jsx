import BranchRegistrationForm from "../../components/admin/Branch/BranchRegistrationForm";
import BranchUpdateForm from "../../components/admin/Branch/BranchUpdateForm";
import SectionTitle from "../../components/admin/SectionTitle";
import TableDistributor from "../../components/admin/UserTables/DataTable/TableDistributor";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import LoadingAnimation from "../../utils/LoadingAnimation";
import { toast } from "sonner";
import PropTypes from "prop-types";

// Optimized column configuration with better formatting
const branchColumns = [
  {
    accessorKey: "itemId",
    header: "Branch ID",
    size: 100,
  },
  {
    accessorKey: "location",
    header: "Location",
    size: 200,
  },
  {
    accessorKey: "contact",
    header: "Contact Number",
    size: 150,
    cell: ({ getValue }) => {
      const contact = getValue();
      // Format contact number for better display
      if (contact?.startsWith('+94')) {
        return contact.replace('+94', '+94 ').replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
      }
      if (contact?.startsWith('0')) {
        return contact.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
      }
      return contact;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    size: 120,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 120,
  },
];

const Branches = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Memoize backend URL and API endpoints
  const backendURL = useMemo(() => import.meta.env.VITE_BACKEND_URL, []);
  const apiEndpoints = useMemo(() => ({
    fetch: `${backendURL}/api/admin/branches`,
    update: `${backendURL}/api/admin/branches`,
    delete: `${backendURL}/api/admin/branches`,
  }), [backendURL]);

  // Enhanced data fetching with comprehensive error handling
  const fetchData = useCallback(async (showLoadingState = true) => {
    if (showLoadingState) {
      setLoading(true);
    }
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await axios.get(apiEndpoints.fetch, {
        withCredentials: true,
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      clearTimeout(timeoutId);

      const rawData = response.data?.userData || response.data?.data || response.data || [];
      
      if (!Array.isArray(rawData)) {
        throw new Error('Invalid data format received from server');
      }

      // Enhanced data processing with better error handling
      const processedData = rawData.map((item, index) => {
        try {
          const itemId = item.branchId || item.id || `B${String(index + 1).padStart(3, '0')}`;
          
          // Safe date formatting with fallbacks
          const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            try {
              const date = new Date(dateString);
              if (isNaN(date.getTime())) return 'Invalid Date';
              return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            } catch {
              return 'Invalid Date';
            }
          };

          return {
            ...item,
            itemId,
            location: item.location || 'Unknown Location',
            contact: item.contact || 'No Contact',
            createdAt: formatDate(item.createdAt),
            updatedAt: formatDate(item.updatedAt),
          };
        } catch (itemError) {
          console.error(`Error processing branch item at index ${index}:`, itemError);
          return {
            ...item,
            itemId: `ERROR_${index}`,
            location: 'Error Loading',
            contact: 'Error Loading',
            createdAt: 'Error',
            updatedAt: 'Error',
          };
        }
      });

      setData(processedData);
      setRetryCount(0); // Reset retry count on success
      
      // Show success message only on manual refresh or first load
      if (retryCount > 0) {
        toast.success("Branches data refreshed successfully");
      }

    } catch (error) {
      console.error('Error fetching branches data:', error);
      
      let errorMessage = 'Failed to load branches data';
      let shouldRetry = false;

      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection.';
        shouldRetry = true;
      } else if (error.response) {
        const { status, data: errorData } = error.response;
        
        switch (status) {
          case 401:
            errorMessage = 'Authentication required. Please log in again.';
            // Redirect to login after delay
            setTimeout(() => {
              window.location.href = '/admin/login';
            }, 2000);
            break;
          case 403:
            errorMessage = 'Access denied. You don\'t have permission to view branches.';
            break;
          case 404:
            errorMessage = 'Branches endpoint not found. Please contact support.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait a moment before retrying.';
            shouldRetry = true;
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            shouldRetry = true;
            break;
          default:
            errorMessage = errorData?.message || `Server error (${status}). Please try again.`;
            shouldRetry = status >= 500;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
        shouldRetry = true;
      }

      setError({ message: errorMessage, canRetry: shouldRetry });
      
      // Show toast notification
      toast.error(errorMessage, {
        duration: 5000,
        action: shouldRetry ? {
          label: "Retry",
          onClick: () => {
            setRetryCount(prev => prev + 1);
            fetchData();
          }
        } : undefined,
      });

    } finally {
      setLoading(false);
    }
  }, [apiEndpoints.fetch, retryCount]);

  // Optimized effect with proper cleanup
  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchData(false); // Refresh without showing loading state
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchData]);

  // Enhanced update form renderer
  const renderUpdateForm = useCallback((formData, setFormData, rowData) => {
    return <BranchUpdateForm formData={formData} setFormData={setFormData} rowData={rowData} />;
  }, []);

  // Handle successful registration
  const handleRegistrationSuccess = useCallback(() => {
    toast.success("Branch registered successfully!");
    // Refresh data to show the new branch
    fetchData(false);
  }, [fetchData]);

  // Error boundary component
  const ErrorDisplay = ({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Branches</h3>
        <p className="text-sm text-gray-600 mb-4">{error.message}</p>
        {error.canRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  );

  // Add prop validation for ErrorDisplay
  ErrorDisplay.propTypes = {
    error: PropTypes.shape({
      message: PropTypes.string.isRequired,
      canRetry: PropTypes.bool.isRequired,
    }).isRequired,
    onRetry: PropTypes.func.isRequired,
  };

  // Loading state
  if (loading) {
    return (
      <div className="mx-8">
        <SectionTitle title="Branches" />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingAnimation message="Loading branches..." />
        </div>
      </div>
    );
  }

  // Error state
  if (error && data.length === 0) {
    return (
      <div className="mx-8">
        <SectionTitle title="Branches" />
        <ErrorDisplay 
          error={error} 
          onRetry={() => {
            setRetryCount(prev => prev + 1);
            fetchData();
          }} 
        />
      </div>
    );
  }

  return (
    <div className="mx-8">
      <SectionTitle title="Branches" />
      
      {/* Show error toast but allow interaction with existing data */}
      {error && data.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                {error.message} Some data may be outdated.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-12">
        <TableDistributor
          title="branch"
          columns={branchColumns}
          disableDateFilter={true}
          enableRowClick={true}
          sorting={true}
          deleteEnabled={true}
          updateEnabled={true}
          updateText="Edit Branch"
          entryData={data}
          updateAPI={apiEndpoints.update}
          deleteAPI={apiEndpoints.delete}
          renderUpdateForm={renderUpdateForm}
          onDataChange={fetchData} // Refresh data after operations
        />
        
        <BranchRegistrationForm onSuccess={handleRegistrationSuccess} />
      </div>
    </div>
  );
};

export default Branches;
