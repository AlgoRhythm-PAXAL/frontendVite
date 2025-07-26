import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import LoadingAnimation from "../../../utils/LoadingAnimation";
import { validateField, validateAllDriverFields } from "../../../utils/driverValidation";

const DriverDetails = ({ entryId, onDataChange }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [branches, setBranches] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "●";
      case "inactive":
        return "○";
      case "suspended":
        return "✕";
      default:
        return "○";
    }
  };

  const fetchDriverData = async () => {
    if (!entryId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${backendURL}/admin/getDriverById/${entryId}`,
        { withCredentials: true }
      );

      if (response.data && response.data.success) {
        setDriverData(response.data.driver);
        setEditForm({
          name: response.data.driver.name || "",
          email: response.data.driver.email || "",
          contactNo: response.data.driver.contactNo || "",
          nic: response.data.driver.nic || "",
          licenseId: response.data.driver.licenseId || "",
          status: response.data.driver.status || "active",
          branchId: response.data.driver.branchId?._id || "",
        });
      } else {
        setError("Failed to fetch driver data");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching driver data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${backendURL}/admin/getBranches`, {
        withCredentials: true,
      });
      if (response.data?.success) {
        setBranches(response.data.branches || []);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  useEffect(() => {
    fetchDriverData();
    fetchBranches();
  }, [entryId]);

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const fieldError = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));

    // Clear success message when editing
    if (updateSuccess) {
      setUpdateSuccess(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when cancelling edit
      setEditForm({
        name: driverData.name || "",
        email: driverData.email || "",
        contactNo: driverData.contactNo || "",
        nic: driverData.nic || "",
        licenseId: driverData.licenseId || "",
        status: driverData.status || "active",
        branchId: driverData.branchId?._id || "",
      });
      setValidationErrors({});
      setUpdateError(null);
      setUpdateSuccess(false);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);

      // Validate all fields
      const allValidationErrors = validateAllDriverFields(editForm);
      if (Object.keys(allValidationErrors).length > 0) {
        setValidationErrors(allValidationErrors);
        setUpdateError("Please fix validation errors before saving");
        return;
      }

      const response = await axios.put(
        `${backendURL}/admin/updateDriver/${entryId}`,
        editForm,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setDriverData(response.data.driver);
        setIsEditing(false);
        setUpdateSuccess(true);
        setValidationErrors({});
        
        // Call onDataChange to refresh parent component
        if (onDataChange) {
          onDataChange();
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        setUpdateError(response.data?.message || "Failed to update driver");
      }
    } catch (err) {
      setUpdateError(err.response?.data?.message || "Error updating driver");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingAnimation />
      </div>
    );
  }

  if (error || !driverData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Driver Details</p>
          <p className="text-sm mt-2">{error || "Driver not found"}</p>
          <button
            onClick={fetchDriverData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Success Message */}
      {updateSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          Driver details updated successfully!
        </div>
      )}

      {/* Error Message */}
      {updateError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {updateError}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Driver Details
          </h1>
          <p className="text-gray-600 text-sm">
            {isEditing ? "Edit driver information" : "View driver information"}
          </p>
        </div>
        
        <div className="flex gap-2">
          {isEditing && (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={updateLoading}
            >
              Cancel
            </button>
          )}
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              disabled={updateLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Driver
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Personal Information
          </h2>
          
          <div className="space-y-3">
            <div className="flex flex-col">
              <div className="w-24 text-sm font-medium text-gray-500 mb-1">Full Name:</div>
              {isEditing ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                      validationErrors.name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : editForm.name && !validationErrors.name
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter full name"
                  />
                  {validationErrors.name ? (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                  ) : editForm.name && !validationErrors.name ? (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Valid
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="text-gray-900 font-medium text-sm">{driverData.name || "N/A"}</div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="w-24 text-sm font-medium text-gray-500 mb-1">Driver ID:</div>
              <div className="text-gray-900 font-medium text-sm">{driverData.driverId || driverData._id || "N/A"}</div>
            </div>

            <div className="flex flex-col">
              <div className="w-24 text-sm font-medium text-gray-500 mb-1">Email:</div>
              {isEditing ? (
                <div className="flex-1">
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                      validationErrors.email 
                        ? 'border-red-300 focus:ring-red-500' 
                        : editForm.email && !validationErrors.email
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter email address"
                  />
                  {validationErrors.email ? (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                  ) : editForm.email && !validationErrors.email ? (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Valid
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="text-gray-900 font-medium text-sm">
                  <a href={`mailto:${driverData.email}`} className="text-blue-600 hover:text-blue-800 underline">
                    {driverData.email || "N/A"}
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="w-24 text-sm font-medium text-gray-500 mb-1">Contact:</div>
              {isEditing ? (
                <div className="flex-1">
                  <input
                    type="tel"
                    value={editForm.contactNo}
                    onChange={(e) => handleInputChange('contactNo', e.target.value)}
                    className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                      validationErrors.contactNo 
                        ? 'border-red-300 focus:ring-red-500' 
                        : editForm.contactNo && !validationErrors.contactNo
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter contact number"
                  />
                  {validationErrors.contactNo ? (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.contactNo}</p>
                  ) : editForm.contactNo && !validationErrors.contactNo ? (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Valid
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="text-gray-900 font-medium text-sm">
                  <a href={`tel:${driverData.contactNo}`} className="text-blue-600 hover:text-blue-800 underline">
                    {driverData.contactNo || "N/A"}
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="w-24 text-sm font-medium text-gray-500 mb-1">NIC:</div>
              {isEditing ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editForm.nic}
                    onChange={(e) => handleInputChange('nic', e.target.value)}
                    className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                      validationErrors.nic 
                        ? 'border-red-300 focus:ring-red-500' 
                        : editForm.nic && !validationErrors.nic
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter NIC number"
                  />
                  {validationErrors.nic ? (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.nic}</p>
                  ) : editForm.nic && !validationErrors.nic ? (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Valid
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="text-gray-900 font-medium text-sm">{driverData.nic || "N/A"}</div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="w-24 text-sm font-medium text-gray-500 mb-1">License ID:</div>
              {isEditing ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editForm.licenseId}
                    onChange={(e) => handleInputChange('licenseId', e.target.value)}
                    className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                      validationErrors.licenseId 
                        ? 'border-red-300 focus:ring-red-500' 
                        : editForm.licenseId && !validationErrors.licenseId
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter license ID"
                  />
                  {validationErrors.licenseId ? (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.licenseId}</p>
                  ) : editForm.licenseId && !validationErrors.licenseId ? (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Valid
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="text-gray-900 font-medium text-sm">{driverData.licenseId || "N/A"}</div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="w-24 text-sm font-medium text-gray-500 mb-1">Status:</div>
              {isEditing ? (
                <div className="flex-1">
                  <select
                    value={editForm.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              ) : (
                <div className="text-gray-900 font-medium text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driverData.status)}`}>
                    {getStatusIcon(driverData.status)}
                    <span className="ml-1">{driverData.status || "Active"}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="w-24 text-sm font-medium text-gray-500 mb-1">Created:</div>
              <div className="text-gray-900 font-medium text-sm">{formatDate(driverData.createdAt)}</div>
            </div>

            <div className="flex flex-col">
              <div className="w-24 text-sm font-medium text-gray-500 mb-1">Updated:</div>
              <div className="text-gray-900 font-medium text-sm">{formatDate(driverData.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* Work Assignment */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Work Assignment
          </h2>
          
          <div className="space-y-3">
            <div className="flex flex-col">
              <div className="w-32 text-sm font-medium text-gray-500 mb-1">Assigned Branch:</div>
              {isEditing ? (
                <div className="flex-1">
                  <select
                    value={editForm.branchId}
                    onChange={(e) => handleInputChange('branchId', e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={branches.length === 0}
                  >
                    <option value="">Select branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.branchId} - {branch.location}
                      </option>
                    ))}
                  </select>
                  {branches.length === 0 && (
                    <p className="text-gray-500 text-xs mt-1">Loading branches...</p>
                  )}
                </div>
              ) : (
                <div className="text-gray-900 font-medium text-sm">
                  {driverData.branchId ? `${driverData.branchId.branchId} - ${driverData.branchId.location}` : "N/A"}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="w-32 text-sm font-medium text-gray-500 mb-1">Assigned Vehicle:</div>
              <div className="text-gray-900 font-medium text-sm">
                {driverData.vehicleId ? `${driverData.vehicleId.registrationNo} (${driverData.vehicleId.vehicleType})` : "N/A"}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="w-32 text-sm font-medium text-gray-500 mb-1">Vehicle Capacity:</div>
              <div className="text-gray-900 font-medium text-sm">
                {driverData.vehicleId ? `${driverData.vehicleId.capableWeight}kg / ${driverData.vehicleId.capableVolume}m³` : "N/A"}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="w-32 text-sm font-medium text-gray-500 mb-1">Managed By:</div>
              <div className="text-gray-900 font-medium text-sm">
                {driverData.adminId ? `${driverData.adminId.name} (${driverData.adminId.email})` : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DriverDetails.propTypes = {
  entryId: PropTypes.string.isRequired,
  onDataChange: PropTypes.func,
};

export default DriverDetails;
