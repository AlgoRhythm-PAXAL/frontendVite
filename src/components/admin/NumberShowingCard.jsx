
import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faSync, 
  faExclamationTriangle, 
  faWifi
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
  forceRefresh = 0
}) => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
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

  // Enhanced fetch function
  const fetchUserCount = useCallback(async (isRetry = false, isForceRefresh = false) => {
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

      // Fetch current count
      const response = await axios.get(
        `${backendUrl}/api/admin/users/count`,
        { 
          withCredentials: true, 
          params: { user: type },
          timeout: 10000,
          signal: abortControllerRef.current.signal
        }
      );

      // Handle current count
      if (response.data) {
        const currentData = response.data;
        if (typeof currentData.count !== 'number' || isNaN(currentData.count)) {
          throw new Error('Invalid count response format');
        }

        const newCount = Math.max(0, Math.floor(currentData.count || 0));
        setCount(newCount);
        setLastUpdated(Date.now());
        setRetryCount(0);
        
        // Notify parent component
        if (onDataUpdate) {
          onDataUpdate({
            count: newCount,
            type,
            timestamp: Date.now()
          });
        }
      } else {
        throw new Error('Failed to fetch user count');
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
  }, [type, onError, onDataUpdate, retryCount]);

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
              {(count || 0).toLocaleString()}
            </p>
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
};

export default NumberShowingCard;