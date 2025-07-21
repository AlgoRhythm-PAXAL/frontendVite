import React, { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Shield, 
  User, 
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Key,
  Users,
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

// Custom hook for admin data
const useAdminData = (entryId, backendURL) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = useCallback(async () => {
    if (!entryId || !backendURL) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backendURL}/api/admin/users/admin/${entryId}`,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      const data = response.data.userData || response.data;
      if (!data) {
        throw new Error("No admin data received");
      }

      setAdminData(data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch admin details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entryId, backendURL]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  return { adminData, loading, error, refetch: fetchAdminData };
};

const AdminDetails = ({ entryId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { adminData, loading, error, refetch } = useAdminData(entryId, backendURL);

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

  const getRoleColor = (role) => {
    const colors = {
      "super admin": "bg-red-100 text-red-800 border-red-200",
      "admin": "bg-blue-100 text-blue-800 border-blue-200",
      "manager": "bg-purple-100 text-purple-800 border-purple-200",
      "operator": "bg-green-100 text-green-800 border-green-200",
    };
    return colors[role?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      suspended: "bg-yellow-100 text-yellow-800",
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

  if (!adminData) {
    return (
      <Alert className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No admin data available</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Details</h1>
          <p className="text-gray-600 mt-1">Administrative user information and permissions</p>
        </div>
        <div className="flex gap-2">
          {adminData.role && (
            <Badge className={getRoleColor(adminData.role)}>
              {adminData.role}
            </Badge>
          )}
          {adminData.status && (
            <Badge className={getStatusColor(adminData.status)}>
              {adminData.status || "Unknown"}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Section title="Personal Information" icon={User}>
          <InfoGrid>
            <Info label="Full Name" value={adminData.name} />
            <Info label="Admin ID" value={adminData.adminId} />
            <Info label="NIC Number" value={adminData.nic} />
            <Info label="Email" value={adminData.email} type="email" />
            <Info label="Contact Number" value={adminData.contactNo} type="phone" />
          </InfoGrid>
        </Section>

        {/* Role & Permissions */}
        <Section title="Role & Permissions" icon={Key}>
          <InfoGrid>
            <Info label="Role" value={adminData.role} />
            <Info label="Department" value={adminData.department} />
            <Info label="Branch" value={adminData.branch} />
            <Info label="Permissions Level" value={adminData.permissionLevel} />
            <Info label="Can Approve" value={adminData.canApprove ? "Yes" : "No"} />
          </InfoGrid>
        </Section>

        {/* Account Information */}
        <Section title="Account Information" icon={Calendar}>
          <InfoGrid>
            <Info label="Date Joined" value={formatDate(adminData.createdAt)} />
            <Info label="Last Updated" value={formatDate(adminData.updatedAt)} />
            <Info label="Last Login" value={formatDate(adminData.lastLogin)} />
            <Info label="Account Status" value={adminData.status} />
            <Info label="Email Verified" value={adminData.isEmailVerified ? "Yes" : "No"} />
          </InfoGrid>
        </Section>

        {/* Security Information */}
        <Section title="Security Information" icon={Shield}>
          <InfoGrid>
            <Info label="Two Factor Auth" value={adminData.twoFactorEnabled ? "Enabled" : "Disabled"} />
            <Info label="Password Last Changed" value={formatDate(adminData.passwordLastChanged)} />
            <Info label="Failed Login Attempts" value={adminData.failedLoginAttempts || 0} />
            <Info label="Account Locked" value={adminData.isLocked ? "Yes" : "No"} />
          </InfoGrid>
        </Section>
      </div>

      {/* Activity Statistics */}
      {adminData.statistics && (
        <Section title="Activity Statistics" icon={Activity}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {adminData.statistics.totalActions || 0}
              </div>
              <div className="text-sm text-gray-600">Total Actions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {adminData.statistics.usersManaged || 0}
              </div>
              <div className="text-sm text-gray-600">Users Managed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {adminData.statistics.parcelsProcessed || 0}
              </div>
              <div className="text-sm text-gray-600">Parcels Processed</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {adminData.statistics.monthlyActivity || 0}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
          </div>
        </Section>
      )}

      {/* Recent Activity */}
      {adminData.recentActivity && adminData.recentActivity.length > 0 && (
        <Section title="Recent Activity" icon={Users}>
          <div className="space-y-3">
            {adminData.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.description}</div>
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

AdminDetails.propTypes = {
  entryId: PropTypes.string.isRequired,
};

export default AdminDetails;