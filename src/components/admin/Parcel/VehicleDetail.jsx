import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Truck, 
  Calendar, 
  Package, 
  MapPin, 
  User, 
  BarChart3, 
  Weight, 
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Filter,
  Eye,
  Activity
} from "lucide-react";
import LoadingAnimation from "../../../utils/LoadingAnimation";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Reusable components
const Section = ({ title, icon: Icon, children, action }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          {Icon && <Icon className="h-5 w-5 text-blue-600" />}
          {title}
        </CardTitle>
        {action}
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
);

const Info = ({ label, value, type = "text", className = "" }) => {
  const formatValue = () => {
    if (value === null || value === undefined || value === "") return "N/A";
    
    try {
      switch (type) {
        case "date":
          return new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          });
        case "boolean":
          return value ? "Yes" : "No";
        case "currency":
          return `LKR ${parseFloat(value).toLocaleString()}`;
        case "weight":
          return `${value} kg`;
        case "volume":
          return `${value} m³`;
        case "percentage":
          return `${value}%`;
        case "distance":
          return `${value} km`;
        default:
          return value ? value.toString() : "N/A";
      }
    } catch (error) {
      console.warn("Error formatting value:", error);
      return "N/A";
    }
  };

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 break-words font-medium">
        {formatValue()}
      </span>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue", progress }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {progress !== undefined && (
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{progress}% capacity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </Card>
);

// PropTypes for components
Section.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.any, // More permissive for React children
  action: PropTypes.any, // More permissive for React elements
};

InfoGrid.propTypes = {
  children: PropTypes.any, // More permissive for React children
};

Info.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any, // More permissive for any value type
  type: PropTypes.oneOf(["text", "date", "boolean", "currency", "weight", "volume", "percentage", "distance"]),
  className: PropTypes.string,
};

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  color: PropTypes.string,
  progress: PropTypes.number,
};

// Enhanced hook for vehicle data
const useVehicleData = (entryId) => {
  const [vehicleData, setVehicleData] = useState(null);
  const [schedules, setSchedules] = useState({ data: [], pagination: null });
  const [parcels, setParcels] = useState({ data: [], pagination: null });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Memoize API endpoints
  const apiEndpoints = useMemo(() => ({
    details: `${BACKEND_URL}/api/admin/vehicles/${entryId}/details`,
    schedules: `${BACKEND_URL}/api/admin/vehicles/${entryId}/schedules`,
    parcels: `${BACKEND_URL}/api/admin/vehicles/${entryId}/parcels`,
    analytics: `${BACKEND_URL}/api/admin/vehicles/${entryId}/analytics`
  }), [entryId]);

  const fetchVehicleData = useCallback(async () => {
    if (!entryId) {
      setError({ message: "Vehicle ID is required" });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const axiosConfig = {
        withCredentials: true,
        timeout: 15000,
        headers: { 'Cache-Control': 'no-cache' }
      };

      // Fetch basic vehicle details first
      const detailsResponse = await axios.get(apiEndpoints.details, axiosConfig);
      
      if (detailsResponse.data.status === "success") {
        setVehicleData(detailsResponse.data.data);
        
        // Fetch additional data in parallel
        const [schedulesResponse, parcelsResponse, analyticsResponse] = await Promise.allSettled([
          axios.get(apiEndpoints.schedules, { ...axiosConfig, params: { limit: 10 } }),
          axios.get(apiEndpoints.parcels, { ...axiosConfig, params: { limit: 10 } }),
          axios.get(apiEndpoints.analytics, axiosConfig)
        ]);

        // Handle schedules
        if (schedulesResponse.status === "fulfilled" && schedulesResponse.value.data.status === "success") {
          setSchedules(schedulesResponse.value.data.data);
        }

        // Handle parcels
        if (parcelsResponse.status === "fulfilled" && parcelsResponse.value.data.status === "success") {
          setParcels(parcelsResponse.value.data.data);
        }

        // Handle analytics
        if (analyticsResponse.status === "fulfilled" && analyticsResponse.value.data.status === "success") {
          setAnalytics(analyticsResponse.value.data.data);
        }
      } else {
        throw new Error(detailsResponse.data.message || "Failed to fetch vehicle data");
      }

    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      
      let errorMessage = "Failed to load vehicle data";
      
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 401:
            errorMessage = "Authentication required. Please log in again.";
            break;
          case 403:
            errorMessage = "Access denied. You don't have permission to view this vehicle.";
            break;
          case 404:
            errorMessage = "Vehicle not found. It may have been deleted.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = data?.message || `Request failed with status ${status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      setError({ message: errorMessage, canRetry: true });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entryId, apiEndpoints]);

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);

  return { 
    vehicleData, 
    schedules, 
    parcels, 
    analytics, 
    loading, 
    error, 
    refetch: fetchVehicleData,
    activeTab,
    setActiveTab
  };
};

const VehicleDetail = ({ entryId }) => {
  const { 
    vehicleData, 
    schedules, 
    parcels, 
    analytics, 
    loading, 
    error, 
    refetch,
    activeTab,
    setActiveTab
  } = useVehicleData(entryId);

  const getStatusColor = (available) => {
    return available 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const getStatusText = (available) => {
    return available ? "Available" : "Unavailable";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error.message}</span>
          {error.canRetry && (
            <Button variant="outline" size="sm" onClick={refetch} className="ml-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!vehicleData) {
    return (
      <Alert className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No vehicle data available</AlertDescription>
      </Alert>
    );
  }

  const vehicle = vehicleData.vehicle;
  const vehicleStats = vehicleData.statistics;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Details</h1>
          <p className="text-gray-600 mt-1">
            {vehicle?.vehicleId} • {vehicle?.registrationNo}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(vehicle?.available)}>
            {getStatusText(vehicle?.available)}
          </Badge>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {vehicleStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <StatCard
            icon={Calendar}
            title="Total Schedules"
            value={vehicleStats.totalSchedules}
            subtitle="All time"
            color="blue"
          />
          {/* <StatCard
            icon={TrendingUp}
            title="Completion Rate"
            value={`${vehicleStats.utilizationRate}%`}
            subtitle="Success rate"
            color="green"
            progress={parseFloat(vehicleStats.utilizationRate)}
          /> */}
          {/* <StatCard
            icon={Package}
            title="Total Parcels"
            value={vehicleStats.totalParcelsAssigned}
            subtitle="Assigned parcels"
            color="purple"
          /> */}
          <StatCard
            icon={Activity}
            title="This Month"
            value={vehicleStats.currentMonthSchedules}
            subtitle="Schedules"
            color="orange"
          />
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* <TabsTrigger value="schedules">Schedules</TabsTrigger> */}
          {/* <TabsTrigger value="parcels">Parcels</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Vehicle Information */}
            <Section title="Vehicle Information" icon={Truck}>
              <InfoGrid>
                <Info label="Vehicle ID" value={vehicle?.vehicleId} />
                <Info label="Registration No" value={vehicle?.registrationNo} />
                <Info label="Vehicle Type" value={vehicle?.vehicleType} />
                <Info label="Capable Volume" value={vehicle?.capableVolume} type="volume" />
                <Info label="Capable Weight" value={vehicle?.capableWeight} type="weight" />
                <Info label="Available" value={vehicle?.available} type="boolean" />
              </InfoGrid>
            </Section>

            {/* Branch Information */}
            <Section title="Branch Assignment" icon={MapPin}>
              <InfoGrid>
                <Info 
                  label="Assigned Branch" 
                  value={vehicle?.assignedBranch?.location || "Not assigned"} 
                />
                <Info 
                  label="Branch ID" 
                  value={vehicle?.assignedBranch?.branchId} 
                />
                <Info 
                  label="Branch Contact" 
                  value={vehicle?.assignedBranch?.contact} 
                />
                <Info 
                  label="Current Branch" 
                  value={vehicle?.currentBranch?.location || "Same as assigned"} 
                />
              </InfoGrid>
            </Section>
          </div>

          {/* Assigned Drivers */}
          {vehicleData.assignedDrivers && vehicleData.assignedDrivers.length > 0 && (
            <Section title="Assigned Drivers" icon={User}>
              <div className="space-y-4">
                {vehicleData.assignedDrivers.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{driver.name}</p>
                        <p className="text-sm text-gray-500">ID: {driver.driverId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{driver.contactNo}</p>
                      <p className="text-xs text-gray-500">{driver.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Recent Activity */}
          {/* {vehicleData.recentActivity && vehicleData.recentActivity.length > 0 && (
            <Section title="Recent Activity" icon={Activity}>
              <div className="space-y-3">
                {vehicleData.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.formattedDate}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )} */}
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6 mt-6">
          <Section 
            title="Vehicle Schedules" 
            icon={Calendar}
            action={
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            }
          >
            {schedules.data && schedules.data.length > 0 ? (
              <div className="space-y-4">
                {schedules.data.map((schedule, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant={schedule.type === "pickup" ? "default" : "secondary"}>
                          {schedule.type}
                        </Badge>
                        <span className="font-medium">{schedule.formattedDate}</span>
                      </div>
                      <span className="text-sm text-gray-500">{schedule.timeSlot}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Branch</p>
                        <p className="font-medium">{schedule.branch?.location || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Parcels</p>
                        <p className="font-medium">{schedule.parcelCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Volume</p>
                        <p className="font-medium">{schedule.totalVolume} m³</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Weight</p>
                        <p className="font-medium">{schedule.totalWeight} kg</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {schedules.pagination && schedules.pagination.totalPages > 1 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      Showing {schedules.data.length} of {schedules.pagination.totalRecords} schedules
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No schedules found for this vehicle
              </div>
            )}
          </Section>
        </TabsContent>

        {/* Parcels Tab */}
        <TabsContent value="parcels" className="space-y-6 mt-6">
          <Section 
            title="Assigned Parcels" 
            icon={Package}
            action={
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            }
          >
            {parcels.data && parcels.data.length > 0 ? (
              <div className="space-y-4">
                {parcels.data.map((parcel, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{parcel.parcelId}</span>
                        <Badge variant="outline">{parcel.status}</Badge>
                      </div>
                      <span className="text-sm text-gray-500">{parcel.formattedCreatedAt}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Item Type</p>
                        <p className="font-medium">{parcel.itemType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Size</p>
                        <p className="font-medium">{parcel.itemSize}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">From</p>
                        <p className="font-medium">{parcel.from?.location || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">To</p>
                        <p className="font-medium">{parcel.to?.location || "N/A"}</p>
                      </div>
                    </div>

                    {parcel.schedules && parcel.schedules.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-2">Related Schedules:</p>
                        <div className="flex flex-wrap gap-2">
                          {parcel.schedules.map((sched, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {sched.type} - {sched.formattedScheduleDate}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No parcels assigned to this vehicle
              </div>
            )}
          </Section>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          {analytics ? (
            <>
              {/* Efficiency Score */}
              <Section title="Performance Overview" icon={BarChart3}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {analytics.analytics.efficiencyScore.grade}
                    </div>
                    <div className="text-lg font-medium text-gray-900 mb-1">
                      Efficiency Grade
                    </div>
                    <div className="text-sm text-gray-600">
                      Score: {analytics.analytics.efficiencyScore.score}%
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>{analytics.analytics.efficiencyScore.breakdown.completion}%</span>
                      </div>
                      <Progress value={analytics.analytics.efficiencyScore.breakdown.completion} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Utilization Rate</span>
                        <span>{analytics.analytics.efficiencyScore.breakdown.utilization}%</span>
                      </div>
                      <Progress value={analytics.analytics.efficiencyScore.breakdown.utilization} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Delivery Success</span>
                        <span>{analytics.analytics.efficiencyScore.breakdown.delivery}%</span>
                      </div>
                      <Progress value={analytics.analytics.efficiencyScore.breakdown.delivery} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {analytics.analytics.schedule.completedSchedules}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-xl font-bold text-yellow-600">
                        {analytics.analytics.schedule.upcomingSchedules}
                      </div>
                      <div className="text-sm text-gray-600">Upcoming</div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Utilization Metrics */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Section title="Capacity Utilization" icon={Weight}>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Volume Utilization</span>
                        <span className="text-sm">{analytics.analytics.utilization.volumeUtilizationPercentage}%</span>
                      </div>
                      <Progress value={parseFloat(analytics.analytics.utilization.volumeUtilizationPercentage)} />
                      <div className="text-xs text-gray-500 mt-1">
                        Avg: {analytics.analytics.utilization.avgVolumeUtilization?.toFixed(2)} m³ 
                        / Max: {vehicle?.capableVolume} m³
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Weight Utilization</span>
                        <span className="text-sm">{analytics.analytics.utilization.weightUtilizationPercentage}%</span>
                      </div>
                      <Progress value={parseFloat(analytics.analytics.utilization.weightUtilizationPercentage)} />
                      <div className="text-xs text-gray-500 mt-1">
                        Avg: {analytics.analytics.utilization.avgWeightUtilization?.toFixed(2)} kg 
                        / Max: {vehicle?.capableWeight} kg
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="Performance Metrics" icon={TrendingUp}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.analytics.performance.deliverySuccessRate}%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.analytics.performance.totalParcels}
                      </div>
                      <div className="text-sm text-gray-600">Total Parcels</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.analytics.performance.deliveredParcels}
                      </div>
                      <div className="text-sm text-gray-600">Delivered</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {analytics.analytics.performance.returnRate}%
                      </div>
                      <div className="text-sm text-gray-600">Return Rate</div>
                    </div>
                  </div>
                </Section>
              </div>

              {/* Shipment Analytics */}
              {analytics.analytics.shipments.totalShipments > 0 && (
                <Section title="Shipment Performance" icon={Truck}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <div className="text-xl font-bold text-indigo-600">
                        {analytics.analytics.shipments.totalShipments}
                      </div>
                      <div className="text-sm text-gray-600">Total Shipments</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {analytics.analytics.shipments.completionRate}%
                      </div>
                      <div className="text-sm text-gray-600">Completion Rate</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {analytics.analytics.shipments.avgDistance}
                      </div>
                      <div className="text-sm text-gray-600">Avg Distance (km)</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-xl font-bold text-yellow-600">
                        {analytics.analytics.shipments.avgTime}
                      </div>
                      <div className="text-sm text-gray-600">Avg Time (hrs)</div>
                    </div>
                  </div>
                </Section>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Analytics data not available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

VehicleDetail.propTypes = {
  entryId: PropTypes.string.isRequired,
};

export default VehicleDetail;