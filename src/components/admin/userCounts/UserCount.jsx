// import NumberShowingCard from '../NUmberShowingCard'

// const UserCount = () => {
//     return (
//         <div className="w-full">
//             <h1 className="text-2xl font-semibold mb-6">User Statistics</h1>
//             <div className="flex flex-wrap justify-between items-center gap-3">
//                 <NumberShowingCard title="Total Customers"type="Customer"/>
//                 <NumberShowingCard title="Total Drivers" type="Driver" />
//                 <NumberShowingCard title="Total Admins"  type="Admin" />
//                 <NumberShowingCard title="Total Staffs" type="Staff" />
//             </div>
//         </div>
//     )
// }

// export default UserCount

import { useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faTruck, 
  faUserShield, 
  faUsers, 
  faChartLine,
  faRefresh,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import NumberShowingCard from '../NUmberShowingCard';

const UserCount = () => {
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    lastUpdated: null,
    hasErrors: false,
    errorCount: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cardErrors, setCardErrors] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  // User type configurations
  const userConfigs = useMemo(() => [
    {
      id: 'customer',
      title: 'Total Customers',
      type: 'Customer',
      icon: faUser,
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Registered customers'
    },
    {
      id: 'driver',
      title: 'Total Drivers',
      type: 'Driver',
      icon: faTruck,
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Active drivers'
    },
    {
      id: 'admin',
      title: 'Total Admins',
      type: 'Admin',
      icon: faUserShield,
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'System administrators'
    },
    {
      id: 'staff',
      title: 'Total Staff',
      type: 'Staff',
      icon: faUsers,
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'Staff members'
    }
  ], []);

  // Handle individual card errors
  const handleCardError = useCallback((errorData) => {
    setCardErrors(prev => ({
      ...prev,
      [errorData.type]: {
        message: errorData.message,
        timestamp: errorData.timestamp,
        retryCount: errorData.retryCount
      }
    }));

    setGlobalStats(prev => ({
      ...prev,
      hasErrors: true,
      errorCount: prev.errorCount + 1
    }));

    // Only show toast for final errors
    if (errorData.retryCount >= 2) {
      toast.error(`Failed to load ${errorData.type} data`, {
        description: errorData.message,
        duration: 4000
      });
    }
  }, []);

  // Handle successful data updates
  const handleDataUpdate = useCallback((updateData) => {
    setCardErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[updateData.type];
      return newErrors;
    });

    setGlobalStats(prev => {
      const errorCount = Math.max(0, prev.errorCount - 1);
      return {
        ...prev,
        lastUpdated: updateData.timestamp,
        hasErrors: errorCount > 0,
        errorCount
      };
    });
  }, []);

  // Global refresh functionality - simplified
  const handleGlobalRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setCardErrors({});
    setGlobalStats(prev => ({
      ...prev,
      hasErrors: false,
      errorCount: 0
    }));

    try {
      // Increment refresh key to trigger force refresh
      setRefreshKey(prev => prev + 1);
      
      // Wait for refresh to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Dashboard refreshed successfully', {
        duration: 2000
      });
    } catch (error) {
      toast.error('Failed to refresh dashboard', {
        description: 'Please try again later'
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Calculate error summary
  const errorSummary = useMemo(() => {
    const errorTypes = Object.keys(cardErrors);
    return {
      count: errorTypes.length,
      types: errorTypes,
      hasErrors: errorTypes.length > 0
    };
  }, [cardErrors]);

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon 
              icon={faChartLine} 
              className="text-2xl text-gray-700" 
            />
            <h1 className="text-2xl font-bold text-gray-900">User Statistics</h1>
          </div>
          <p className="text-sm text-gray-600">
            Real-time overview of user counts across all categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          {errorSummary.hasErrors && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="text-red-500 text-sm" 
              />
              <span className="text-sm text-red-700 font-medium">
                {errorSummary.count} error{errorSummary.count !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          <button
            onClick={handleGlobalRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FontAwesomeIcon 
              icon={faRefresh} 
              className={`text-sm ${isRefreshing ? 'animate-spin' : ''}`} 
            />
            <span className="font-medium">
              {isRefreshing ? 'Refreshing...' : 'Refresh All'}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      {globalStats.lastUpdated && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live Data</span>
              </div>
              
              <div className="text-sm text-gray-600">
                Last updated: {new Date(globalStats.lastUpdated).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">
                Status: <span className={`font-medium ${errorSummary.hasErrors ? 'text-red-600' : 'text-green-600'}`}>
                  {errorSummary.hasErrors ? 'Partial' : 'Healthy'}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* User Count Cards Grid - Remove the key prop to prevent re-mounting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {userConfigs.map((config) => (
          <div key={config.id} className="relative">
            <NumberShowingCard
              title={config.title}
              type={config.type}
              icon={config.icon}
              lightColor={config.lightColor}
              textColor={config.textColor}
              description={config.description}
              onError={handleCardError}
              onDataUpdate={handleDataUpdate}
              enableAutoRefresh={true}
              refreshInterval={300000}
              className="h-full"
              forceRefresh={refreshKey} // Only use forceRefresh prop
            />
            
            {cardErrors[config.type] && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" 
                     title={`Error: ${cardErrors[config.type].message}`}>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Error Details Section */}
      {errorSummary.hasErrors && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              className="text-red-500 mt-0.5" 
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-2">
                Data Loading Issues Detected
              </h3>
              <div className="space-y-1">
                {errorSummary.types.map(type => (
                  <div key={type} className="text-xs text-red-700">
                    <span className="font-medium">{type}:</span> {cardErrors[type].message}
                  </div>
                ))}
              </div>
              <p className="text-xs text-red-600 mt-2">
                Some data may be outdated. Try refreshing or check your connection.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
        <p>Data refreshes automatically every 5 minutes • Click "Refresh All" for immediate updates</p>
      </div>
    </div>
  );
};

export default UserCount;