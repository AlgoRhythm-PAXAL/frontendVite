import React, { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Truck, 
  Calendar, 
  MapPin,
  Fuel,
  Wrench,
  RefreshCw,
  User,
  Activity
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

const Info = ({ label, value, type = "text" }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-sm text-gray-900 break-words">
      {value || "N/A"}
    </span>
  </div>
);

// Custom hook for vehicle data
const useVehicleData = (entryId, backendURL) => {
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicleData = useCallback(async () => {
    if (!entryId || !backendURL) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backendURL}/api/admin/vehicles/${entryId}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      const data = response.data.vehicleData || response.data;
      if (!data) {
        throw new Error("No vehicle data received");
      }

      setVehicleData(data);
    } catch (err) {
      console.error("Error fetching vehicle data:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch vehicle details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entryId, backendURL]);

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);

  return { vehicleData, loading, error, refetch: fetchVehicleData };
};

const VehicleDetail = ({ entryId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { vehicleData, loading, error, refetch } = useVehicleData(entryId, backendURL);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      retired: "bg-gray-100 text-gray-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
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
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={refetch} className="ml-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Details</h1>
          <p className="text-gray-600 mt-1">Complete vehicle information and status</p>
        </div>
        {vehicleData.status && (
          <Badge className={getStatusColor(vehicleData.status)}>
            {vehicleData.status}
          </Badge>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vehicle Information */}
        <Section title="Vehicle Information" icon={Truck}>
          <InfoGrid>
            <Info label="Vehicle ID" value={vehicleData.vehicleId} />
            <Info label="License Plate" value={vehicleData.licensePlate} />
            <Info label="Make" value={vehicleData.make} />
            <Info label="Model" value={vehicleData.model} />
            <Info label="Year" value={vehicleData.year} />
            <Info label="Type" value={vehicleData.vehicleType} />
            <Info label="Color" value={vehicleData.color} />
          </InfoGrid>
        </Section>

        {/* Technical Specifications */}
        <Section title="Technical Specifications" icon={Wrench}>
          <InfoGrid>
            <Info label="Engine Type" value={vehicleData.engineType} />
            <Info label="Fuel Type" value={vehicleData.fuelType} />
            <Info label="Capacity" value={vehicleData.capacity} />
            <Info label="Mileage" value={vehicleData.mileage ? `${vehicleData.mileage} km` : "N/A"} />
            <Info label="VIN Number" value={vehicleData.vinNumber} />
            <Info label="Engine Number" value={vehicleData.engineNumber} />
          </InfoGrid>
        </Section>

        {/* Assignment Information */}
        <Section title="Assignment Information" icon={User}>
          <InfoGrid>
            <Info label="Assigned Driver" value={vehicleData.assignedDriver?.name} />
            <Info label="Driver Contact" value={vehicleData.assignedDriver?.contact} />
            <Info label="Branch" value={vehicleData.branch} />
            <Info label="Route" value={vehicleData.assignedRoute} />
            <Info label="Assignment Date" value={formatDate(vehicleData.assignmentDate)} />
          </InfoGrid>
        </Section>

        {/* Maintenance Information */}
        <Section title="Maintenance Information" icon={Wrench}>
          <InfoGrid>
            <Info label="Last Service" value={formatDate(vehicleData.lastServiceDate)} />
            <Info label="Next Service Due" value={formatDate(vehicleData.nextServiceDate)} />
            <Info label="Service Provider" value={vehicleData.serviceProvider} />
            <Info label="Maintenance Status" value={vehicleData.maintenanceStatus} />
            <Info label="Total Services" value={vehicleData.totalServices} />
          </InfoGrid>
        </Section>
      </div>

      {/* Performance Metrics */}
      {vehicleData.performance && (
        <Section title="Performance Metrics" icon={Activity}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {vehicleData.performance.totalTrips || 0}
              </div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {vehicleData.performance.totalDistance || "0 km"}
              </div>
              <div className="text-sm text-gray-600">Total Distance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {vehicleData.performance.fuelEfficiency || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Fuel Efficiency</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {vehicleData.performance.monthlyTrips || 0}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
          </div>
        </Section>
      )}

      {/* Registration & Insurance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Registration Information" icon={Calendar}>
          <InfoGrid>
            <Info label="Registration Date" value={formatDate(vehicleData.registrationDate)} />
            <Info label="Registration Expiry" value={formatDate(vehicleData.registrationExpiry)} />
            <Info label="Registration Number" value={vehicleData.registrationNumber} />
            <Info label="Registered Owner" value={vehicleData.registeredOwner} />
          </InfoGrid>
        </Section>

        <Section title="Insurance Information" icon={Calendar}>
          <InfoGrid>
            <Info label="Insurance Provider" value={vehicleData.insuranceProvider} />
            <Info label="Policy Number" value={vehicleData.policyNumber} />
            <Info label="Insurance Expiry" value={formatDate(vehicleData.insuranceExpiry)} />
            <Info label="Coverage Type" value={vehicleData.coverageType} />
          </InfoGrid>
        </Section>
      </div>

      {/* Recent Activity */}
      {vehicleData.recentActivity && vehicleData.recentActivity.length > 0 && (
        <Section title="Recent Activity" icon={MapPin}>
          <div className="space-y-3">
            {vehicleData.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{activity.activity}</div>
                  <div className="text-xs text-gray-500">{activity.location}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

VehicleDetail.propTypes = {
  entryId: PropTypes.string.isRequired,
};

export default VehicleDetail;