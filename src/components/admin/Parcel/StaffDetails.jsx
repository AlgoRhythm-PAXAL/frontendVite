import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingAnimation from "../../../utils/LoadingAnimation";

const StaffDetails = ({ entryId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      setError(null);

      const response = await axios.put(
        `${backendURL}/api/admin/users/staff/${entryId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the staff data with the new status
        setStaffData(prevData => ({
          ...prevData,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }));

        // Optional: Show success message
        alert(`Staff ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!`);
      }
    } catch (err) {
      console.error("Error updating staff status:", err);
      setError(
        err.response?.data?.message || 
        "Failed to update staff status. Please try again."
      );
    } finally {
      setUpdating(false);
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

  const getStatusColor = (status) => {
    const statusColors = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'inactive': 'bg-red-100 text-red-800 border-red-200',
      'suspended': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'pending': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
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
      ),
      'suspended': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      'pending': (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
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
          {/* Personal Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Name:
                </dt>
                <dd className="text-sm text-gray-900">
                  {staffData.name || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Staff ID:
                </dt>
                <dd className="text-sm text-gray-900">
                  {staffData.staffId || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  NIC:
                </dt>
                <dd className="text-sm text-gray-900">
                  {staffData.nic || "N/A"}
                </dd>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Email:
                </dt>
                <dd className="text-sm text-gray-900">
                  <a href={`mailto:${staffData.email}`} className="text-blue-600 hover:text-blue-800">
                    {staffData.email || "N/A"}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Phone:
                </dt>
                <dd className="text-sm text-gray-900">
                  <a href={`tel:${staffData.contactNo}`} className="text-blue-600 hover:text-blue-800">
                    {staffData.contactNo || "N/A"}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Branch:
                </dt>
                <dd className="text-sm text-gray-900">
                  {staffData.branchId?.location || "N/A"}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Employment Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-2">
                Current Status
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(staffData.status)} ml-2`}>
                  {getStatusIcon(staffData.status)}
                  {formatStatusText(staffData.status)}
                </span>
              </dt>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Joined Date
                <dd className="text-sm text-gray-900">{formatDate(staffData.createdAt)}</dd>
              </dt>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Last Updated
                <dd className="text-sm text-gray-900">{formatDate(staffData.updatedAt)}</dd>
              </dt>
            </div>
          </div>
        </div>

        {/* Administrative Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Administrative Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Registered Admin
                <dd className="text-sm text-gray-900">{staffData.adminId?.name || "N/A"}</dd>
              </dt>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Registered Branch
                <dd className="text-sm text-gray-900">{staffData.branchId?.location || "N/A"}</dd>
              </dt>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Staff
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Activity Log
            </button>
            {staffData.status === 'active' ? (
              <button 
                onClick={() => handleStatusChange('inactive')}
                disabled={updating}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
                {updating ? 'Suspending...' : 'Suspend Staff'}
              </button>
            ) : (
              <button 
                onClick={() => handleStatusChange('active')}
                disabled={updating}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {updating ? 'Activating...' : 'Activate Staff'}
              </button>
            )}
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