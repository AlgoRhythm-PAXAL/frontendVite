import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingAnimation from "../../../utils/LoadingAnimation";
import { 
  validateField, 
  validateAllStaffFields
} from "../../../utils/staffValidation";

const StaffDetails = ({ entryId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);

  useEffect(() => {
    const fetchStaffData = async () => {
      if (!entryId) {
        setError("Staff ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${backendURL}/api/admin/users/staff/${entryId}`,
          { withCredentials: true }
        );
        
        setStaffData(response.data.data || response.data);
      } catch (err) {
        console.error("Error fetching staff data:", err);
        setError(
          err.response?.data?.message || 
          "Failed to fetch staff details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [entryId, backendURL]);

  // Initialize edit form when staffData is loaded
  useEffect(() => {
    if (staffData && isEditing) {
      setEditForm({
        name: staffData.name || '',
        email: staffData.email || '',
        contactNo: staffData.contactNo || '',
        nic: staffData.nic || '',
        status: staffData.status || 'active',
        branchId: staffData.branchId?._id || ''
      });
    }
  }, [staffData, isEditing]);

  // Fetch branches when entering edit mode
  useEffect(() => {
    if (isEditing && branches.length === 0) {
      fetchBranches();
    }
  }, [isEditing, branches.length]);

  const fetchBranches = useCallback(async () => {
    try {
      setBranchesLoading(true);
      const response = await axios.get(
        `${backendURL}/api/admin/users/branches`,
        { withCredentials: true }
      );
      setBranches(response.data.data.branches || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
      setUpdateError("Failed to fetch branches");
    } finally {
      setBranchesLoading(false);
    }
  }, [backendURL]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setValidationErrors({});
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // Clear update messages
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleSaveChanges = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);

      // Validate all fields
      const errors = validateAllStaffFields(editForm);
      setValidationErrors(errors);

      if (Object.keys(errors).length > 0) {
        setUpdateError("Please fix validation errors before saving");
        return;
      }

      // Prepare update data (only include fields that have changed)
      const updateData = {};
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== (staffData[key] || '')) {
          updateData[key] = editForm[key];
        }
      });

      // Don't send empty update
      if (Object.keys(updateData).length === 0) {
        setUpdateError("No changes detected");
        return;
      }

      const response = await axios.put(
        `${backendURL}/api/admin/users/staff/${entryId}`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.status === 'success') {
        setStaffData(response.data.data.staff);
        setUpdateSuccess(true);
        setIsEditing(false);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error updating staff:", err);
      setUpdateError(
        err.response?.data?.message || 
        "Failed to update staff details. Please try again."
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'text-green-600 bg-green-100',
      'inactive': 'text-red-600 bg-red-100',
      'suspended': 'text-yellow-600 bg-yellow-100',
      'pending': 'text-blue-600 bg-blue-100',
    };
    return colors[status?.toLowerCase()] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'active': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      'inactive': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    };
    return icons[status?.toLowerCase()] || (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    );
  };

  const formatStatusText = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Staff Details
          </h3>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Staff Data Found
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Staff Information */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with Edit Button */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Staff Details
            </h2>
            <div className="flex items-center gap-3">
              {updateSuccess && (
                <span className="text-green-600 text-sm font-medium">
                  ✓ Updated successfully
                </span>
              )}
              <button
                onClick={handleEditToggle}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              {isEditing && (
                <button
                  onClick={handleSaveChanges}
                  disabled={updateLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {updateError && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{updateError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Name:</div>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
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
                  <div className="text-gray-900">{staffData.name || "N/A"}</div>
                )}
              </div>

              {/* Staff ID */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Staff ID:</div>
                <div className="text-gray-900">{staffData.staffId || "N/A"}</div>
              </div>

              {/* Email */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Email:</div>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
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
                  <div className="text-gray-900">{staffData.email || "N/A"}</div>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Contact Number:</div>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      value={editForm.contactNo}
                      onChange={(e) => handleInputChange('contactNo', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
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
                  <div className="text-gray-900">{staffData.contactNo || "N/A"}</div>
                )}
              </div>

              {/* NIC */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">NIC:</div>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.nic}
                      onChange={(e) => handleInputChange('nic', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
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
                  <div className="text-gray-900">{staffData.nic || "N/A"}</div>
                )}
              </div>

              {/* Status */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Status:</div>
                {isEditing ? (
                  <select
                    value={editForm.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staffData.status)}`}>
                    {getStatusIcon(staffData.status)}
                    <span className="ml-1">{formatStatusText(staffData.status)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Work Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Branch:</div>
                {isEditing ? (
                  <div>
                    {branchesLoading ? (
                      <div className="text-gray-500">Loading branches...</div>
                    ) : (
                      <select
                        value={editForm.branchId}
                        onChange={(e) => handleInputChange('branchId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                          <option key={branch.value} value={branch.value}>
                            {branch.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-900">
                    {staffData.branchId?.location || "N/A"}
                  </div>
                )}
              </div>

              {/* Admin */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Admin:</div>
                <div className="text-gray-900">
                  {staffData.adminId?.name || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Created At:</div>
                <div className="text-gray-900">{formatDate(staffData.createdAt)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Last Updated:</div>
                <div className="text-gray-900">{formatDate(staffData.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StaffDetails.propTypes = {
  entryId: PropTypes.string.isRequired,
};

export default StaffDetails;
