import React, { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  User,
  Truck,
  Calendar,
  Package,
  RefreshCw,
  Activity,
  Building
} from "lucide-react";
import PropTypes from "prop-types";
import axios from "axios";
import LoadingAnimation from "../../../utils/LoadingAnimation";

// Reusable components
const Section = ({ title, icon: Icon, children }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        {Icon && <Icon className="h-5 w-5 text-blue-600" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 gap-3">{children}</div>
);

const Info = ({ label, value, type = "text" }) => {
  const renderValue = () => {
    if (!value || value === "N/A") return "N/A";
    
    switch (type) {
      case "email":
        return (
          <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800 underline">
            {value}
          </a>
        );
      case "phone":
        return (
          <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-800 underline">
            {value}
          </a>
        );
      default:
        return value;
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 break-words">
        {renderValue()}
      </span>
    </div>
  );
};

// Custom hook for driver data
const useDriverData = (entryId, backendURL) => {
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDriverData = useCallback(async () => {
    if (!entryId || !backendURL) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backendURL}/api/admin/users/driver/${entryId}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      const data = response.data.userData || response.data;
      if (!data) {
        throw new Error("No driver data received");
      }

      setDriverData(data);
    } catch (err) {
      console.error("Error fetching driver data:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch driver details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entryId, backendURL]);

  useEffect(() => {
    fetchDriverData();
  }, [fetchDriverData]);

  return { driverData, loading, error, refetch: fetchDriverData };
};

const DriverDetails = ({ entryId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { driverData, loading, error, refetch } = useDriverData(entryId, backendURL);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in transit":
      case "dispatched":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScheduleTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "pickup":
        return "bg-orange-100 text-orange-800";
      case "delivery":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button
            onClick={refetch}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!driverData) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No driver data available</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Driver Photo and Basic Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <Badge className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{driverData.name}</h2>
            <p className="text-gray-600">{driverData.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                <Truck className="h-3 w-3 mr-1" />
                Driver
              </Badge>
              <Badge variant="outline">
                ID: {driverData.driverId}
              </Badge>
              <Badge variant="outline">
                License: {driverData.licenseId}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Statistics */}
      {driverData.driverStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {driverData.vehicleType === 'shipment' ? (
            // Statistics for shipment vehicles
            <>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {driverData.driverStats.totalShipments || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Shipments</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {driverData.driverStats.completedShipments || 0}
                  </div>
                  <div className="text-sm text-gray-600">Completed Shipments</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {driverData.driverStats.completionRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {driverData.driverStats.inTransitShipments || 0}
                  </div>
                  <div className="text-sm text-gray-600">In Transit</div>
                </CardContent>
              </Card>
            </>
          ) : (
            // Statistics for pickup/delivery vehicles
            <>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {driverData.driverStats.totalSchedules || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Schedules</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {driverData.driverStats.completedSchedules || 0}
                  </div>
                  <div className="text-sm text-gray-600">Completed Schedules</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {driverData.driverStats.completionRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {driverData.driverStats.activeSchedules || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Schedules</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Section title="Personal Information" icon={User}>
          <InfoGrid>
            <Info label="Full Name" value={driverData.name} />
            <Info label="Driver ID" value={driverData.driverId} />
            <Info label="NIC" value={driverData.nic} />
            <Info label="Email" value={driverData.email} type="email" />
            <Info label="Contact Number" value={driverData.contactNo} type="phone" />
            <Info label="License ID" value={driverData.licenseId} />
            <Info label="Account Created" value={formatDate(driverData.createdAt)} />
            <Info label="Last Updated" value={formatDate(driverData.updatedAt)} />
          </InfoGrid>
        </Section>

        {/* Work Assignment */}
        <Section title="Work Assignment" icon={Building}>
          <InfoGrid>
            <Info 
              label="Assigned Branch"
              value={driverData.branchId ? `${driverData.branchId.branchId} - ${driverData.branchId.location}` : "N/A"}
            />
            <Info 
              label="Assigned Vehicle"
              value={driverData.vehicleId ? `${driverData.vehicleId.registrationNo} (${driverData.vehicleId.vehicleType})` : "N/A"}
            />
            <Info 
              label="Vehicle Capacity"
              value={driverData.vehicleId ? `${driverData.vehicleId.capableWeight}kg / ${driverData.vehicleId.capableVolume}m³` : "N/A"}
            />
            <Info 
              label="Managed By" 
              value={driverData.adminId ? `${driverData.adminId.name} (${driverData.adminId.email})` : "N/A"} 
            />
          </InfoGrid>
        </Section>
      </div>

      {/* Recent Shipments - Only for shipment vehicles */}
      {driverData.vehicleType === 'shipment' && (
        <Section title="Recent Shipments" icon={Package}>
          <div className="space-y-3">
            {driverData.shipments?.length > 0 ? (
              driverData.shipments.map((shipment, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{shipment.shipmentId}</span>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(shipment.createdAt)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">From: </span>
                      <span className="font-medium">
                        {shipment.sourceCenter?.location || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Vehicle: </span>
                      <span className="font-medium">
                        {shipment.assignedVehicle?.registrationNo || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Parcels: </span>
                      <span className="font-medium">
                        {shipment.parcels?.length || 0} items
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Weight: </span>
                      <span className="font-medium">
                        {shipment.totalWeight || 0} kg
                      </span>
                    </div>
                  </div>
                  {shipment.route && shipment.route.length > 1 && (
                    <div className="mt-2 pt-2 border-t">
                      <span className="text-sm text-gray-500">Route: </span>
                      <span className="text-sm">
                        {shipment.route.map(r => r.location || r.branchId).join(" → ")}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent shipments found</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Vehicle Schedules - Only for pickup/delivery vehicles */}
      {driverData.vehicleType === 'pickupDelivery' && (
        <Section title="Vehicle Schedules" icon={Calendar}>
          <div className="space-y-3">
            {driverData.vehicleSchedules?.length > 0 ? (
              driverData.vehicleSchedules.map((schedule, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">
                        {new Date(schedule.scheduleDate).toLocaleDateString()}
                      </span>
                      <Badge className={getScheduleTypeColor(schedule.type)}>
                        {schedule.type}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {schedule.timeSlot}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Branch: </span>
                      <span className="font-medium">
                        {schedule.branch?.location || schedule.branch?.branchId || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Parcels: </span>
                      <span className="font-medium">
                        {schedule.assignedParcels?.length || 0} items
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Weight: </span>
                      <span className="font-medium">
                        {schedule.totalWeight || 0} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Volume: </span>
                      <span className="font-medium">
                        {schedule.totalVolume || 0} m³
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No schedules found</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Recent Activities */}
      <Section title="Recent Activities" icon={Activity}>
        <div className="space-y-3">
          {driverData.recentActivities?.length > 0 ? (
            driverData.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{activity.action}</h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activities recorded</p>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

DriverDetails.propTypes = {
  entryId: PropTypes.string.isRequired,
};

export default DriverDetails;