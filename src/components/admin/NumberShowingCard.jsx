// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser, // Customers
//   faTruck, // Drivers
//   faUserShield, // Admins
//   faUsers, // Staff
// } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "sonner";
// import LoadingAnimation from "../../utils/LoadingAnimation";

// const NumberShowingCard = ({ title, type }) => {
//   const [data, setData] = useState({ count: 0, since: "" });
//   const [loading, setLoading] = useState(true);

//   const getIconConfig = () => {
//     const baseClasses = "w-14 h-14 flex items-center justify-center rounded-xl";

//     switch (type) {
//       case "Customer":
//         return {
//           icon: faUser,
//           bgClass: `${baseClasses} bg-blue-100 text-blue-600`,
//         };
//       case "Driver":
//         return {
//           icon: faTruck,
//           bgClass: `${baseClasses} bg-green-100 text-green-600`,
//         };
//       case "Admin":
//         return {
//           icon: faUserShield,
//           bgClass: `${baseClasses} bg-purple-100 text-purple-600`,
//         };
//       case "Staff":
//         return {
//           icon: faUsers,
//           bgClass: `${baseClasses} bg-orange-100 text-orange-600`,
//         };
//       default:
//         return {
//           icon: faUser,
//           bgClass: `${baseClasses} bg-gray-100 text-gray-600`,
//         };
//     }
//   };

//   useEffect(() => {
//     const fetchUserCount = async () => {
//       const backendUrl = import.meta.env.VITE_BACKEND_URL;
//       try {
//         const response = await axios.get(
//           `${backendUrl}/api/admin/users/count`,
//           { withCredentials: true, params: { user: type } }
//         );

//         setData({
//           count: response.data.count,
//           since: new Date(response.data.since).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           }),
//         });
//       } catch (error) {
//         const errorMessage = error.message;
//         console.error(`Error fetching ${type} count:`, error);
//         toast.error(`Fetching data went fishing 🎣. No luck yet. ${type}`, {
//           description: errorMessage,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserCount();
//   }, [type]);

//   const { icon, bgClass } = getIconConfig();

//   return (
//     <div className="flex items-center gap-5 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex-[1_1_280px] min-w-[280px] max-w-full">
//       {/* Icon Container */}
//       <div className={bgClass}>
//         <FontAwesomeIcon icon={icon} className="text-2xl" />
//       </div>

//       {/* Content */}
//       <div className="flex flex-col gap-1">
//         <span className="text-sm font-medium text-gray-500">{title}</span>
//         <div className="flex items-baseline gap-3">
//           {loading ? (
//             <LoadingAnimation />
//           ) : (
//             <span className="text-3xl font-bold text-gray-900">
//               {data.count.toLocaleString()}
//             </span>
//           )}
//         </div>
//         <span className="text-xs font-medium text-gray-400">
//           Since {loading ? "..." : data.since}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default NumberShowingCard;


import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faSync, 
  faExclamationTriangle, 
  faWifi,
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Professional Number Showing Card Component
 * Enhanced with historical data tracking and period-based comparisons
 */
const NumberShowingCard = ({ 
  title, 
  type, 
  icon = faUsers,
  lightColor = "bg-blue-50",
  textColor = "text-Primary",
  description = "",
  onError,
  onDataUpdate,
  className = "",
  refreshInterval = 300000,
  enableAutoRefresh = false,
  forceRefresh = 0,
  comparisonPeriod = 7 // Default to 7 days comparison
}) => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const abortControllerRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const isRequestInProgressRef = useRef(false);
  const lastForceRefreshRef = useRef(0);

  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 1500;

  // Cleanup function
  const cleanup = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    // Don't abort controller here to prevent cancellation errors
  }, []);

  // Enhanced fetch function with historical data
  const fetchUserCount = useCallback(async (isRetry = false, isForceRefresh = false) => {
    // Get comparison period text inside callback
    const getComparisonPeriodText = () => {
      switch (comparisonPeriod) {
        case 1: return "yesterday";
        case 7: return "7 days ago";
        case 30: return "30 days ago";
        case 90: return "3 months ago";
        default: return `${comparisonPeriod} days ago`;
      }
    };

    // Prevent multiple simultaneous requests
    if (isRequestInProgressRef.current && !isForceRefresh) {
      return;
    }

    try {
      isRequestInProgressRef.current = true;

      // Only abort if this is a force refresh
      if (isForceRefresh && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      
      if (!isRetry) {
        setIsLoading(true);
        if (!isForceRefresh) {
          setRetryCount(0);
        }
      } else {
        setIsRetrying(true);
      }
      
      setHasError(false);
      setErrorMessage('');

      // Validate required props
      if (!type) {
        throw new Error('Type parameter is required');
      }

      if (!backendUrl) {
        throw new Error('Backend URL is not configured');
      }

      // Calculate comparison date
      const comparisonDate = new Date();
      comparisonDate.setDate(comparisonDate.getDate() - comparisonPeriod);

      // Fetch current count and historical count in parallel
      const [currentResponse, historicalResponse] = await Promise.allSettled([
        // Current count
        axios.get(
          `${backendUrl}/api/admin/users/count`,
          { 
            withCredentials: true, 
            params: { user: type },
            timeout: 10000,
            signal: abortControllerRef.current.signal
          }
        ),
        // Historical count
        axios.get(
          `${backendUrl}/api/admin/users/count`,
          { 
            withCredentials: true, 
            params: { 
              user: type,
              date: comparisonDate.toISOString().split('T')[0] // YYYY-MM-DD format
            },
            timeout: 10000,
            signal: abortControllerRef.current.signal
          }
        )
      ]);

      // Handle current count
      if (currentResponse.status === 'fulfilled' && currentResponse.value.data) {
        const currentData = currentResponse.value.data;
        if (typeof currentData.count !== 'number') {
          throw new Error('Invalid current count response format');
        }

        const newCount = Math.max(0, currentData.count);
        setCount(newCount);
        setLastUpdated(Date.now());
        setRetryCount(0);

        // Handle historical count with better error handling
        let historicalCount = null;
        let hasValidHistoricalData = false;
        let change = 0;
        let changePercentage = 0;
        
        if (historicalResponse.status === 'fulfilled' && historicalResponse.value.data) {
          const historicalData = historicalResponse.value.data;
          if (typeof historicalData.count === 'number') {
            historicalCount = Math.max(0, historicalData.count);
            hasValidHistoricalData = true;
          }
        } else if (historicalResponse.status === 'rejected') {
          console.warn(`Historical data for ${comparisonPeriod} days ago failed:`, historicalResponse.reason?.message);
        }
        
        // Only set comparison data if we have valid historical data
        if (hasValidHistoricalData && historicalCount !== null) {
          change = newCount - historicalCount;
          changePercentage = historicalCount > 0 ? ((change / historicalCount) * 100) : 0;
          
          setComparisonData({
            current: newCount,
            previous: historicalCount,
            change: change,
            changePercentage: changePercentage,
            period: comparisonPeriod,
            periodText: getComparisonPeriodText()
          });
        } else {
          // Clear comparison data if historical data is not available
          setComparisonData(null);
          console.info(`No comparison data available for ${type} - ${comparisonPeriod} days ago`);
        }
        
        // Notify parent component
        if (onDataUpdate) {
          onDataUpdate({
            count: newCount,
            previousCount: historicalCount,
            change: hasValidHistoricalData ? change : 0,
            changePercentage: hasValidHistoricalData ? changePercentage : 0,
            type,
            comparisonPeriod,
            timestamp: Date.now()
          });
        }
      } else {
        throw new Error('Failed to fetch current user count');
      }
      
    } catch (error) {
      // Only handle non-cancelled errors
      if (error.name === 'AbortError') {
        return; // Silently ignore cancelled requests
      }

      let userFriendlyMessage = 'Unable to load data';
      
      if (error.code === 'ECONNABORTED') {
        userFriendlyMessage = 'Request timeout';
      } else if (error.code === 'ERR_NETWORK') {
        userFriendlyMessage = 'Network connection issue';
      } else if (error.response?.status === 404) {
        userFriendlyMessage = 'Data endpoint not found';
      } else if (error.response?.status === 403) {
        userFriendlyMessage = 'Access denied';
      } else if (error.response?.status >= 500) {
        userFriendlyMessage = 'Server error occurred';
      } else if (error.message && !error.message.includes('canceled')) {
        userFriendlyMessage = error.message;
      }

      console.error(`Failed to fetch ${type} count:`, {
        error: error.message,
        status: error.response?.status,
        attempt: retryCount + 1
      });

      setHasError(true);
      setErrorMessage(userFriendlyMessage);
      
      // Auto-retry logic
      if (!isRetry && retryCount < MAX_RETRY_ATTEMPTS) {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        
        setTimeout(() => {
          fetchUserCount(true, false);
        }, RETRY_DELAY);
      } else {
        // Only notify parent on final error
        if (onError && retryCount >= MAX_RETRY_ATTEMPTS) {
          onError({
            message: userFriendlyMessage,
            type,
            retryCount: retryCount + 1,
            timestamp: Date.now()
          });
        }
      }
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
      isRequestInProgressRef.current = false;
    }
  }, [type, onError, onDataUpdate, retryCount, comparisonPeriod]);

  // Manual retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setHasError(false);
    fetchUserCount(false, true);
  }, [fetchUserCount]);

  // Handle force refresh from parent - improved logic
  useEffect(() => {
    if (forceRefresh > 0 && forceRefresh !== lastForceRefreshRef.current) {
      lastForceRefreshRef.current = forceRefresh;
      setRetryCount(0);
      setHasError(false);
      fetchUserCount(false, true);
    }
  }, [forceRefresh, fetchUserCount]);

  // Auto-refresh setup
  useEffect(() => {
    if (enableAutoRefresh && !hasError && !isRequestInProgressRef.current) {
      refreshTimeoutRef.current = setTimeout(() => {
        fetchUserCount(false, false);
      }, refreshInterval);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [enableAutoRefresh, refreshInterval, hasError, lastUpdated, fetchUserCount]);

  // Initial data fetch - only runs once
  useEffect(() => {
    let mounted = true;
    
    const initialFetch = async () => {
      if (mounted) {
        await fetchUserCount(false, false);
      }
    };
    
    initialFetch();
    
    return () => {
      mounted = false;
      cleanup();
    };
  }, [type, fetchUserCount, cleanup]);

  // Enhanced change indicator with period information
  const getChangeIndicator = () => {
    if (!comparisonData) return null;
    
    const { change, changePercentage, periodText } = comparisonData;
    const isPositive = change > 0;
    const isUnchanged = change === 0;
    
    // If no change, don't show anything
    if (isUnchanged) return null;
    
    return (
      <div className="flex flex-col gap-1 text-xs font-medium">
        {/* Change amount and icon */}
        <div className={`flex items-center gap-1 ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{isPositive ? '+' : ''}{change.toLocaleString()}</span>
          <FontAwesomeIcon 
            icon={isPositive ? faCheckCircle : faExclamationTriangle} 
            className="w-3 h-3" 
          />
        </div>
        
        {/* Always show comparison period when there's a change */}
        <div className="text-gray-500 text-xs">
          vs {periodText}
        </div>
        
        {/* Percentage change */}
        {Math.abs(changePercentage) > 0 && (
          <div className={`text-xs flex items-center gap-1 ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            <span>{isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(changePercentage).toFixed(1)}%</span>
          </div>
        )}
      </div>
    );
  };

  // Loading skeleton
  if (isLoading && !isRetrying) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry options
  if (hasError && retryCount >= MAX_RETRY_ATTEMPTS) {
    return (
      <div className={`bg-red-50 border-2 border-red-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6 text-red-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-red-800 mb-1">{title}</h3>
            <p className="text-sm text-red-600 mb-3 break-words">{errorMessage}</p>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-2 text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FontAwesomeIcon 
                  icon={faSync} 
                  className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} 
                />
                {isRetrying ? 'Retrying...' : 'Retry'}
              </button>
              
              <div className="text-xs text-red-500 flex items-center gap-1">
                <FontAwesomeIcon icon={faWifi} className="w-3 h-3" />
                Attempts: {retryCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 p-6 ${className}`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 ${lightColor} rounded-xl flex items-center justify-center shadow-inner`}>
          <FontAwesomeIcon icon={icon} className={`w-7 h-7 ${textColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-700 truncate">{title}</h3>
            {(isRetrying || isRequestInProgressRef.current) && (
              <FontAwesomeIcon 
                icon={faSync} 
                className="w-3 h-3 text-blue-500 animate-spin" 
              />
            )}
          </div>
          
          <div className="flex items-center gap-3 mb-1">
            <p className="text-3xl font-bold text-gray-900">
              {count.toLocaleString()}
            </p>
            {getChangeIndicator()}
          </div>
          
          {description && (
            <p className="text-xs text-gray-500 truncate">{description}</p>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">
            Active {type.toLowerCase()}s
          </span>
          
          <div className="flex items-center gap-2">
            {enableAutoRefresh && (
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            )}
            
            {lastUpdated && (
              <span className="text-gray-500">
                {new Date(lastUpdated).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

NumberShowingCard.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  icon: PropTypes.object,
  lightColor: PropTypes.string,
  textColor: PropTypes.string,
  description: PropTypes.string,
  onError: PropTypes.func,
  onDataUpdate: PropTypes.func,
  className: PropTypes.string,
  refreshInterval: PropTypes.number,
  enableAutoRefresh: PropTypes.bool,
  forceRefresh: PropTypes.number,
  comparisonPeriod: PropTypes.number,
};

export default NumberShowingCard;