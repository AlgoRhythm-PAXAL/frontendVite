import { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  User,
  Shield,
  RefreshCw,
  Users,
  Settings
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

Section.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
};

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 gap-3">{children}</div>
);

InfoGrid.propTypes = {
  children: PropTypes.node.isRequired,
};

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
      case "array":
        return Array.isArray(value) ? value.join(", ") : String(value);
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

Info.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  type: PropTypes.oneOf(["text", "email", "phone", "array"]),
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

  return { adminData, loading, error, refetch: fetchAdminData, setAdminData };
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPermissionColor = (permission) => {
    switch (permission?.toLowerCase()) {
      case "full":
      case "admin":
        return "bg-red-100 text-red-800";
      case "write":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <LoadingAnimation />
          <p className="mt-4 text-gray-600">Loading admin details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-700">
            <div className="flex flex-col gap-3">
              <span className="font-medium">Failed to load admin details</span>
              <span className="text-sm">{error}</span>
              <Button
                onClick={refetch}
                variant="outline"
                size="sm"
                className="w-fit border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="p-6">
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            <span className="font-medium">No admin data available</span>
            <br />
            <span className="text-sm">The requested admin information could not be found.</span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header with Admin Photo and Basic Info */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-100">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Badge className={`${getStatusColor(adminData.status || "active")} shadow-sm`}>
                {adminData.status || "Active"}
              </Badge>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{adminData.name}</h1>
            <p className="text-lg text-gray-600 mb-3">{adminData.email}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                <Shield className="h-4 w-4 mr-2" />
                Administrator
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                ID: {adminData.adminId || adminData._id}
              </Badge>
              {adminData.role && (
                <Badge variant="outline" className="px-3 py-1">
                  Role: {adminData.role}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Statistics */}
      {/* {adminData.adminStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {adminData.adminStats.totalUsers || 0}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {adminData.adminStats.totalParcels || 0}
              </div>
              <div className="text-sm text-gray-600">Total Parcels</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {adminData.adminStats.activeShipments || 0}
              </div>
              <div className="text-sm text-gray-600">Active Shipments</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {adminData.adminStats.totalBranches || 0}
              </div>
              <div className="text-sm text-gray-600">Managed Branches</div>
            </CardContent>
          </Card>
        </div>
      )} */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Section title="Personal Information" icon={User}>
          <div className="space-y-4">
            <InfoGrid>
              <Info 
                label="Full Name" 
                value={adminData.name}
              />
              <Info label="Admin ID" value={adminData.adminId || adminData._id} />
              <Info 
                label="Email" 
                value={adminData.email} 
                type="email"
              />
              <Info 
                label="Contact Number" 
                value={adminData.contactNo || adminData.phone} 
                type="phone"
              />
              <Info 
                label="Role" 
                value={adminData.role || "Administrator"}
              />
              <Info 
                label="Status" 
                value={adminData.status || "Active"}
              />
              <Info label="Account Created" value={formatDate(adminData.createdAt)} />
              <Info label="Last Updated" value={formatDate(adminData.updatedAt)} />
            </InfoGrid>
          </div>
        </Section>

        {/* Permissions & Access */}
        <Section title="Permissions & Access" icon={Settings}>
          <div className="space-y-4">
            <InfoGrid>
              <Info 
                label="Access Level"
                value={adminData.accessLevel || "Full Access"}
              />
              <Info 
                label="Assigned Branch"
                value={adminData.branchId ? `${adminData.branchId.branchName} (${adminData.branchId.city})` : "All Branches"}
              />
              <Info 
                label="Permissions"
                value={adminData.permissions || ["Full Access"]}
                type="array"
              />
            </InfoGrid>
          </div>
        </Section>
      </div>

      {/* Managed Users */}
      <Section title="Managed Users" icon={Users}>
        <div className="space-y-4">
          {adminData.managedUsers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminData.managedUsers.map((user, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                        <Badge className={`${getStatusColor(user.status)} ml-2`}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {user.role}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-right">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact:</span>
                      <span className="font-medium text-right">{user.contactNo || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No managed users found</p>
              <p className="text-sm">This administrator doesn&apos;t manage any users currently.</p>
            </div>
          )}
        </div>
      </Section>

      {/* Recent Activities */}
      {/* <Section title="Recent Activities" icon={Activity}>
        <div className="space-y-3">
          {adminData.recentActivities?.length > 0 ? (
            adminData.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border-l-4 border-purple-200 bg-purple-50 rounded-r-lg">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
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
      </Section> */}

      {/* System Permissions */}
      {adminData.systemPermissions && (
        <Section title="System Permissions" icon={Shield}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(adminData.systemPermissions).map(([permission, level]) => (
              <div key={permission} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900 capitalize block">
                    {permission.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <Badge className={`${getPermissionColor(level)} ml-3`}>
                  {level}
                </Badge>
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
