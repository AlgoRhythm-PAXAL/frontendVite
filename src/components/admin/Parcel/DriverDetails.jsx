import React, { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Truck, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  CreditCard,
  Calendar,
  RefreshCw,
  Shield
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
    const colors = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-red-100 text-red-800 border-red-200",
      suspended: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
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

  if (!driverData) {
    return (
      <Alert className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No driver data available</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Details</h1>
          <p className="text-gray-600 mt-1">Complete driver information and profile</p>
        </div>
        {driverData.status && (
          <Badge className={getStatusColor(driverData.status)}>
            {driverData.status || "Unknown"}
          </Badge>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Section title="Personal Information" icon={User}>
          <InfoGrid>
            <Info label="Full Name" value={driverData.name} />
            <Info label="Driver ID" value={driverData.driverId} />
            <Info label="NIC Number" value={driverData.nic} />
            <Info label="Email" value={driverData.email} type="email" />
            <Info label="Contact Number" value={driverData.contactNo} type="phone" />
          </InfoGrid>
        </Section>

        {/* Professional Information */}
        <Section title="Professional Information" icon={Truck}>
          <InfoGrid>
            <Info label="License ID" value={driverData.licenseId} />
            <Info label="License Type" value={driverData.licenseType} />
            <Info label="Experience" value={driverData.experience ? `${driverData.experience} years` : "N/A"} />
            <Info label="Employment Status" value={driverData.employmentStatus} />
            {driverData.vehicleAssigned && (
              <Info label="Assigned Vehicle" value={driverData.vehicleAssigned} />
            )}
          </InfoGrid>
        </Section>

        {/* Branch Information */}
        <Section title="Branch Information" icon={MapPin}>
          <InfoGrid>
            <Info label="Branch Location" value={driverData.branchLocation} />
            <Info label="Branch Contact" value={driverData.branchContactNo} type="phone" />
            <Info label="Branch Manager" value={driverData.branchManager} />
          </InfoGrid>
        </Section>

        {/* Administrative Information */}
        <Section title="Administrative Information" icon={Shield}>
          <InfoGrid>
            <Info label="Added by Admin" value={driverData.adminName} />
            <Info label="Date Joined" value={formatDate(driverData.createdAt)} />
            <Info label="Last Updated" value={formatDate(driverData.updatedAt)} />
            <Info label="Employee ID" value={driverData.employeeId} />
          </InfoGrid>
        </Section>
      </div>

      {/* Additional Information */}
      {(driverData.emergencyContact || driverData.address) && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Emergency Contact */}
          {driverData.emergencyContact && (
            <Section title="Emergency Contact" icon={Phone}>
              <InfoGrid>
                <Info label="Contact Name" value={driverData.emergencyContact.name} />
                <Info label="Relationship" value={driverData.emergencyContact.relationship} />
                <Info label="Phone Number" value={driverData.emergencyContact.phone} type="phone" />
              </InfoGrid>
            </Section>
          )}

          {/* Address Information */}
          {driverData.address && (
            <Section title="Address Information" icon={MapPin}>
              <InfoGrid>
                <Info label="Address" value={driverData.address} />
                <Info label="City" value={driverData.city} />
                <Info label="District" value={driverData.district} />
                <Info label="Province" value={driverData.province} />
              </InfoGrid>
            </Section>
          )}
        </div>
      )}

      {/* Performance Metrics */}
      {driverData.performance && (
        <Section title="Performance Metrics" icon={Calendar}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {driverData.performance.totalDeliveries || 0}
              </div>
              <div className="text-sm text-gray-600">Total Deliveries</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {driverData.performance.successRate || "0%"}
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {driverData.performance.rating || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {driverData.performance.monthlyDeliveries || 0}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
};

DriverDetails.propTypes = {
  entryId: PropTypes.string.isRequired,
};

export default DriverDetails;