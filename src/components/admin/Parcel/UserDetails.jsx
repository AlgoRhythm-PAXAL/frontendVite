import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingAnimation from "../../../utils/LoadingAnimation";
import ParcelDetails from "./ParcelDetails";
import { validateField, validateAllCustomerFields } from "../../../utils/customerValidation";

const UserDetails = ({ entryId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [userData, setUserData] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (!entryId) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${backendURL}/api/admin/users/customer/${entryId}`,
          { withCredentials: true }
        );
        console.log("User data response:", response.data);
        setUserData(response.data.userData);
        setParcels(response.data.parcels || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(
          err.response?.data?.message || 
          "Failed to fetch user details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [entryId, backendURL]);

  // Initialize edit form when userData is loaded
  useEffect(() => {
    if (userData && !isEditing) {
      setEditForm({
        fName: userData.fName || '',
        lName: userData.lName || '',
        email: userData.email || '',
        contact: userData.contact || '',
        nic: userData.nic || '',
        address: userData.address || '',
        city: userData.city || '',
        district: userData.district || '',
        province: userData.province || ''
      });
    }
  }, [userData, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values when canceling
      setEditForm({
        fName: userData.fName || '',
        lName: userData.lName || '',
        email: userData.email || '',
        contact: userData.contact || '',
        nic: userData.nic || '',
        address: userData.address || '',
        city: userData.city || '',
        district: userData.district || '',
        province: userData.province || ''
      });
      setUpdateError(null);
      setUpdateSuccess(false);
      setValidationErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate the field in real-time
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    // Clear errors when user starts typing
    if (updateError) setUpdateError(null);
    if (updateSuccess) setUpdateSuccess(false);
  };

  const handleSaveChanges = async () => {
    try {
      // Validate all fields before saving
      const validation = validateAllCustomerFields(editForm);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setUpdateError("Please fix the validation errors before saving");
        return;
      }
      
      // Clear validation errors if everything is valid
      setValidationErrors({});
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(false);

      const response = await axios.put(
        `${backendURL}/api/admin/users/customer/${entryId}`,
        editForm,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserData(response.data.userData);
        setIsEditing(false);
        setUpdateSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error updating user data:", err);
      
      // Handle backend validation errors
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.field] = error.message;
        });
        setValidationErrors(backendErrors);
      }
      
      setUpdateError(
        err.response?.data?.message || 
        "Failed to update user details. Please try again."
      );
    } finally {
      setUpdateLoading(false);
    }
  };

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

  const formatAddress = (address, city, district, province) => {
    const parts = [address, city, district, province].filter(part => part && part.trim());
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
      'InTransit': 'bg-blue-100 text-blue-800 border-blue-200',
      'PendingPickup': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200',
      'Processing': 'bg-purple-100 text-purple-800 border-purple-200',
      'OutForDelivery': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Delivered': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      'InTransit': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 000 2h1.05l.5 8.5a1 1 0 001 .95h8.9a1 1 0 00.95-.87L16.05 6H5.03l-.5-2H3z" />
        </svg>
      ),
      'PendingPickup': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    };
    return icons[status] || (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    );
  };

  const formatStatusText = (status) => {
    const statusMap = {
      'PendingPickup': 'Pending Pickup',
      'InTransit': 'In Transit',
      'OutForDelivery': 'Out for Delivery',
      'Delivered': 'Delivered',
      'Cancelled': 'Cancelled',
      'Processing': 'Processing'
    };
    return statusMap[status] || status;
  };

  const handleParcelClick = (parcelId) => {
    setSelectedParcelId(parcelId);
  };

  const handleBackToUserDetails = () => {
    setSelectedParcelId(null);
  };

  // If a parcel is selected, show ParcelDetails component
  if (selectedParcelId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={handleBackToUserDetails}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to User Details</span>
          </button>
          <div className="text-gray-500">|</div>
          <div className="text-gray-900 font-medium">
            {userData?.name} - Parcel Details
          </div>
        </div>
        <ParcelDetails entryId={selectedParcelId} />
      </div>
    );
  }
  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-red-800 font-medium">Error Loading User Details</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-yellow-800 font-medium">No User Data Found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto w-fit px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* User Information */}
      <div className="p-6">
        {/* Edit Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <div className="flex items-center space-x-3">
            {updateSuccess && (
              <div className="flex items-center text-green-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Updated successfully
              </div>
            )}
            {updateError && (
              <div className="text-red-600 text-sm max-w-md">
                {updateError}
              </div>
            )}
            {/* Validation Summary */}
            {isEditing && Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 max-w-md">
                <h4 className="text-red-800 text-sm font-medium mb-2">Please fix the following errors:</h4>
                <ul className="text-red-700 text-xs space-y-1">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={handleEditToggle}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isEditing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={updateLoading}
            >
              {isEditing ? 'Cancel' : 'Edit Details'}
            </button>
            {isEditing && (
              <button
                onClick={handleSaveChanges}
                disabled={updateLoading || Object.keys(validationErrors).some(key => validationErrors[key])}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {updateLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
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
                <div className="w-24 text-sm font-medium text-gray-500 mb-1">First Name:</div>
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editForm.fName}
                      onChange={(e) => handleInputChange('fName', e.target.value)}
                      className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                        validationErrors.fName 
                          ? 'border-red-300 focus:ring-red-500' 
                          : editForm.fName && !validationErrors.fName
                          ? 'border-green-300 focus:ring-green-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter first name"
                    />
                    {validationErrors.fName ? (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.fName}</p>
                    ) : editForm.fName && !validationErrors.fName ? (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Valid
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-gray-900 font-medium text-sm">{userData.fName || "N/A"}</div>
                )}
              </div>

              <div className="flex flex-col">
                <div className="w-24 text-sm font-medium text-gray-500 mb-1">Last Name:</div>
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editForm.lName}
                      onChange={(e) => handleInputChange('lName', e.target.value)}
                      className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                        validationErrors.lName 
                          ? 'border-red-300 focus:ring-red-500' 
                          : editForm.lName && !validationErrors.lName
                          ? 'border-green-300 focus:ring-green-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter last name"
                    />
                    {validationErrors.lName ? (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.lName}</p>
                    ) : editForm.lName && !validationErrors.lName ? (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Valid
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-gray-900 font-medium text-sm">{userData.lName || "N/A"}</div>
                )}
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-500">User ID:</div>
                <div className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {userData.userId || "N/A"}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-500">NIC:</div>
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
                  <div className="text-gray-900 font-mono text-sm">{userData.nic || "N/A"}</div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Contact Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-20 text-sm font-medium text-gray-500">Email:</div>
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
                  <div className="text-gray-900">
                    <a href={`mailto:${userData.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
                      {userData.email || "N/A"}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex items-center">
                <div className="w-20 text-sm font-medium text-gray-500">Phone:</div>
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="tel"
                      value={editForm.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                        validationErrors.contact 
                          ? 'border-red-300 focus:ring-red-500' 
                          : editForm.contact && !validationErrors.contact
                          ? 'border-green-300 focus:ring-green-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {validationErrors.contact ? (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.contact}</p>
                    ) : editForm.contact && !validationErrors.contact ? (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Valid
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-gray-900">
                    <a href={`tel:${userData.contact}`} className="text-blue-600 hover:text-blue-800 text-sm">
                      {userData.contact || "N/A"}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex items-start">
                <div className="w-20 text-sm font-medium text-gray-500">Address:</div>
                {isEditing ? (
                  <div className="flex-1 space-y-2">
                    <div>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          validationErrors.address 
                            ? 'border-red-300 focus:ring-red-500' 
                            : editForm.address && !validationErrors.address
                            ? 'border-green-300 focus:ring-green-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="Street address"
                      />
                      {validationErrors.address ? (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                      ) : editForm.address && !validationErrors.address ? (
                        <p className="text-green-600 text-xs mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Valid
                        </p>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                            validationErrors.city 
                              ? 'border-red-300 focus:ring-red-500' 
                              : editForm.city && !validationErrors.city
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="City"
                        />
                        {validationErrors.city ? (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
                        ) : editForm.city && !validationErrors.city ? (
                          <p className="text-green-600 text-xs mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ✓
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={editForm.district}
                          onChange={(e) => handleInputChange('district', e.target.value)}
                          className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                            validationErrors.district 
                              ? 'border-red-300 focus:ring-red-500' 
                              : editForm.district && !validationErrors.district
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="District"
                        />
                        {validationErrors.district ? (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.district}</p>
                        ) : editForm.district && !validationErrors.district ? (
                          <p className="text-green-600 text-xs mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ✓
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={editForm.province}
                          onChange={(e) => handleInputChange('province', e.target.value)}
                          className={`w-full px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                            validationErrors.province 
                              ? 'border-red-300 focus:ring-red-500' 
                              : editForm.province && !validationErrors.province
                              ? 'border-green-300 focus:ring-green-500'
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder="Province"
                        />
                        {validationErrors.province ? (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.province}</p>
                        ) : editForm.province && !validationErrors.province ? (
                          <p className="text-green-600 text-xs mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ✓
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-900 flex-1 text-sm">
                    {formatAddress(userData.address, userData.city, userData.district, userData.province)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Verification Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  userData.isVerify 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userData.isVerify ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Account Created</span>
                <span className="text-sm text-gray-900">{formatDate(userData.createdAt)}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total Parcels</span>
                <span className="text-sm font-bold text-gray-900">{parcels.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Parcel Information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Parcel History</h2>
            <div className="text-sm text-gray-500">
              {parcels.length} {parcels.length === 1 ? 'parcel' : 'parcels'} found
            </div>
          </div>
          
          {parcels.length > 0 ? (
            <div className="space-y-4">
              {parcels.map((parcel) => (
                <div 
                  key={parcel._id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                  onClick={() => handleParcelClick(parcel._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(parcel.status)}`}>
                          {getStatusIcon(parcel.status)}
                          <span className="ml-1">{formatStatusText(parcel.status)}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{parcel.parcelId}</h3>
                        <p className="text-xs text-gray-500">
                          {parcel.createdAt ? `Created: ${formatDate(parcel.createdAt)}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(parcel.updatedAt)}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-8 8-4-4m0 0L7 7l-1 1" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No parcels found</h3>
              <p className="mt-1 text-sm text-gray-500">This customer hasn&apos;t created any parcels yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

UserDetails.propTypes = {
  entryId: PropTypes.string.isRequired,
};

export default UserDetails;