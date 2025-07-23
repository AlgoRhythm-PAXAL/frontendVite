

import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faChartLine, faExclamationTriangle, faWifi } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';
import { useAdminAuth } from "../../hooks/useAdminAuth";
import SectionTitle from "../../components/admin/SectionTitle";

// Lazy load components for better performance
const PieChartContainer = lazy(() => import("../../components/admin/pieCharts/Dashboard-PieChartContainer"));
const ParcelBarChart = lazy(() => import("../../components/admin/Dashboard-BarChart").then(module => ({ default: module.ParcelBarChart })));

// Loading component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center p-6 md:p-8  min-h-[200px] w-full">
    <div className="w-8 h-8 border-4 border-Primary border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-gray-600 text-sm text-center">{message}</p>
  </div>
);

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

// Error boundary component
const ErrorFallback = ({ error, resetError, title = "Something went wrong" }) => (
  <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-red-50 rounded-lg border border-red-200 min-h-[200px] w-full">
    <FontAwesomeIcon icon={faExclamationTriangle} className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-red-800 mb-2 text-center">{title}</h3>
    <p className="text-red-600 text-sm mb-4 text-center max-w-md">{error}</p>
    <button
      onClick={resetError}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
    >
      Try Again
    </button>
  </div>
);

ErrorFallback.propTypes = {
  error: PropTypes.string.isRequired,
  resetError: PropTypes.func.isRequired,
  title: PropTypes.string,
};

// Dashboard stats component
const DashboardStats = ({ stats, isLoading, error, onRefresh }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {isLoading ? (
      Array(4).fill(0).map((_, index) => (
        <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-md animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))
    ) : error ? (
      <div className="col-span-full">
        <ErrorFallback error={error} resetError={onRefresh} title="Failed to load statistics" />
      </div>
    ) : (
      stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 truncate">{stat.label}</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ml-3 ${stat.bgColor}`}>
              <FontAwesomeIcon icon={stat.icon} className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`} />
            </div>
          </div>
          {stat.change && (
            <p className={`text-xs md:text-sm mt-2 ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change > 0 ? '+' : ''}{stat.change}% from last week
            </p>
          )}
        </div>
      ))
    )}
  </div>
);

DashboardStats.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    bgColor: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
    change: PropTypes.number,
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRefresh: PropTypes.func.isRequired,
};

const Dashboard = () => {
  // Admin auth context
  const { admin } = useAdminAuth();
  
  // State management
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
  const [dashboardStats, setDashboardStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats = [
        {
          label: "Total Parcels",
          value: "1,234",
          icon: faChartLine,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          change: 12.5
        },
        {
          label: "Active Shipments",
          value: "856",
          icon: faChartLine,
          bgColor: "bg-green-100",
          iconColor: "text-green-600",
          change: 8.2
        },
        {
          label: "Pending Deliveries",
          value: "234",
          icon: faChartLine,
          bgColor: "bg-yellow-100",
          iconColor: "text-yellow-600",
          change: -3.1
        },
        {
          label: "Completed Today",
          value: "89",
          icon: faChartLine,
          bgColor: "bg-purple-100",
          iconColor: "text-purple-600",
          change: 15.7
        }
      ];
      
      setDashboardStats(mockStats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setStatsError("Failed to load dashboard statistics");
      toast.error("Failed to load statistics", {
        description: "Please try refreshing the page",
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    if (!isOnline) {
      toast.warning("Cannot refresh while offline", {
        description: "Please check your internet connection",
      });
      return;
    }
    
    setRefreshKey(prev => prev + 1);
    setLastRefresh(new Date().toLocaleTimeString());
    fetchDashboardStats();
    
    toast.success("Dashboard refreshed", {
      description: "All data has been updated",
    });
  }, [isOnline, fetchDashboardStats]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored", {
        description: "Dashboard data will be refreshed automatically",
      });
      handleRefresh();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You are offline", {
        description: "Some features may not work properly",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleRefresh]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <div className="flex flex-col mx-3 md:mx-5 mb-10 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <SectionTitle title="Dashboard" />
          {admin && (
            <p className="text-gray-600 text-sm">
              Welcome back, <span className="font-medium text-Primary">{admin.name}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isOnline 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <FontAwesomeIcon icon={faWifi} className="w-4 h-4" />
            {isOnline ? 'Online' : 'Offline'}
          </div>
          
          {/* Last Refresh */}
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh}
          </span>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={!isOnline}
            className="flex items-center gap-2 px-4 py-2 bg-Primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <FontAwesomeIcon icon={faSync} className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      {/* <DashboardStats 
        stats={dashboardStats}
        isLoading={statsLoading}
        error={statsError}
        onRefresh={fetchDashboardStats}
      /> */}

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        {/* Charts Section */}
        <div className="flex flex-col gap-6">
          {/* Pie Charts */}
          <div className="bg-gray-100 rounded-lg  p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Parcel Status Overview</h3>
            <Suspense fallback={<LoadingSpinner message="Loading pie charts..." />}>
              <PieChartContainer key={`pie-${refreshKey}`} />
            </Suspense>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-100 rounded-lg  p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Parcel Trends</h3>
            <Suspense fallback={<LoadingSpinner message="Loading bar chart..." />}>
              <ParcelBarChart key={`bar-${refreshKey}`} />
            </Suspense>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;