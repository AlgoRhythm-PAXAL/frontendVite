// import { useState, useEffect } from "react";
// import axios from "axios";
// import PropTypes from "prop-types";
// import LoadingAnimation from "../../../utils/LoadingAnimation";

// const UserDetails = ({ entryId }) => {
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!entryId) {
//         setError("User ID is required");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await axios.get(
//           `${backendURL}/api/admin/users/customer/${entryId}`,
//           { withCredentials: true }
//         );
        
//         setUserData(response.data.userData);
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//         setError(
//           err.response?.data?.message || 
//           "Failed to fetch user details. Please try again."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [entryId, backendURL]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatAddress = (address, city, district, province) => {
//     const parts = [address, city, district, province].filter(part => part && part.trim());
//     return parts.length > 0 ? parts.join(", ") : "N/A";
//   };

//   if (loading) {
//     return (
//       <LoadingAnimation/>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6 ">
//         <div className="flex items-center">
//           <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//           </svg>
//           <h3 className="text-red-800 font-medium">Error Loading User Details</h3>
//         </div>
//         <p className="text-red-700 mt-2">{error}</p>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//         <div className="flex items-center">
//           <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           <h3 className="text-yellow-800 font-medium">No User Data Found</h3>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto">
//       {/* Header */}
//       {/* <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
//         <h1 className="text-2xl font-bold text-white">User Details</h1>
//         <p className="text-blue-100 mt-1">Complete customer information</p>
//       </div> */}

//       {/* User Information */}
//       <div className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal Information */}
//           <div className="space-y-4">
//             <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
//               Personal Information
//             </h2>
            
//             <div className="space-y-3">
//               <div className="flex items-center">
//                 <div className="w-20 text-xs font-medium text-gray-500">Name:</div>
//                 <div className="text-gray-900 font-medium text-sm">{userData.name || "N/A"}</div>
//               </div>
              
//               <div className="flex items-center">
//                 <div className="w-20 text-xs font-medium text-gray-500">First Name:</div>
//                 <div className="text-gray-900 text-sm">{userData.fName || "N/A"}</div>
//               </div>
              
//               <div className="flex items-center">
//                 <div className="w-20 text-xs font-medium text-gray-500">Last Name:</div>
//                 <div className="text-gray-900 text-sm">{userData.lName || "N/A"}</div>
//               </div>
              
//               <div className="flex items-center">
//                 <div className="w-20 text-xs font-medium text-gray-500">NIC:</div>
//                 <div className="text-gray-900 font-mono text-sm">{userData.nic || "N/A"}</div>
//               </div>
              
              
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="space-y-4">
//             <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
//               Contact Information
//             </h2>
            
//             <div className="space-y-3">
//               <div className="flex items-center">
//                 <div className="w-20 text-xs font-medium text-gray-500">Email:</div>
//                 <div className="text-gray-900">
//                   <a href={`mailto:${userData.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
//                     {userData.email || "N/A"}
//                   </a>
//                 </div>
//               </div>
              
//               <div className="flex items-center">
//                 <div className="w-20 text-xs font-medium text-gray-500">Phone:</div>
//                 <div className="text-gray-900">
//                   <a href={`tel:${userData.contact}`} className="text-blue-600 hover:text-blue-800 text-sm">
//                     {userData.contact || "N/A"}
//                   </a>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <div className="w-20 text-xs font-medium text-gray-500">Address:</div>
//                 <div className="text-gray-900 flex-1 text-sm">
//                   {formatAddress(userData.address, userData.city, userData.district, userData.province)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Account Status */}
//         <div className="mt-8 pt-6 border-t border-gray-200">
//           <h2 className="text-base font-semibold text-gray-900 mb-4">Account Status</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-medium text-gray-500">Verification Status</span>
//                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                   userData.isVerify 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {userData.isVerify ? 'Verified' : 'Not Verified'}
//                 </span>
//               </div>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-medium text-gray-500">Account Created</span>
//                 <span className="text-xs text-gray-900">{formatDate(userData.createdAt)}</span>
//               </div>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-medium text-gray-500">Last Updated</span>
//                 <span className="text-xs text-gray-900">{formatDate(userData.updatedAt)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

        
//       </div>
//     </div>
//   );
// };

// UserDetails.propTypes = {
//   entryId: PropTypes.string.isRequired,
// };

// export default UserDetails;









// import { useState, useEffect } from "react";
// import axios from "axios";
// import PropTypes from "prop-types";
// import LoadingAnimation from "../../../utils/LoadingAnimation";

// const UserDetails = ({ entryId }) => {
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const [userData, setUserData] = useState(null);
//   const [parcels, setParcels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!entryId) {
//         setError("User ID is required");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await axios.get(
//           `${backendURL}/api/admin/users/customer/${entryId}`,
//           { withCredentials: true }
//         );
        
//         setUserData(response.data.userData);
//         setParcels(response.data.parcels || []);
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//         setError(
//           err.response?.data?.message || 
//           "Failed to fetch user details. Please try again."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [entryId, backendURL]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatAddress = (address, city, district, province) => {
//     const parts = [address, city, district, province].filter(part => part && part.trim());
//     return parts.length > 0 ? parts.join(", ") : "N/A";
//   };

//   const getStatusColor = (status) => {
//     const statusColors = {
//       'Delivered': 'bg-green-100 text-green-800 border-green-200',
//       'InTransit': 'bg-blue-100 text-blue-800 border-blue-200',
//       'PendingPickup': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'Cancelled': 'bg-red-100 text-red-800 border-red-200',
//       'Processing': 'bg-purple-100 text-purple-800 border-purple-200',
//       'OutForDelivery': 'bg-orange-100 text-orange-800 border-orange-200',
//     };
//     return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       'Delivered': (
//         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//         </svg>
//       ),
//       'InTransit': (
//         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//           <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
//           <path d="M3 4a1 1 0 000 2h1.05l.5 8.5a1 1 0 001 .95h8.9a1 1 0 00.95-.87L16.05 6H5.03l-.5-2H3z" />
//         </svg>
//       ),
//       'PendingPickup': (
//         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//         </svg>
//       ),
//     };
//     return icons[status] || (
//       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//       </svg>
//     );
//   };

//   const formatStatusText = (status) => {
//     const statusMap = {
//       'PendingPickup': 'Pending Pickup',
//       'InTransit': 'In Transit',
//       'OutForDelivery': 'Out for Delivery',
//       'Delivered': 'Delivered',
//       'Cancelled': 'Cancelled',
//       'Processing': 'Processing'
//     };
//     return statusMap[status] || status;
//   };

//   if (loading) {
//     return <LoadingAnimation />;
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//         <div className="flex items-center">
//           <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//           </svg>
//           <h3 className="text-red-800 font-medium">Error Loading User Details</h3>
//         </div>
//         <p className="text-red-700 mt-2">{error}</p>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//         <div className="flex items-center">
//           <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           <h3 className="text-yellow-800 font-medium">No User Data Found</h3>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto">
//       {/* User Information */}
//       <div className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal Information */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
//               Personal Information
//             </h2>
            
//             <div className="space-y-3">
//               <div className="flex items-center">
//                 <div className="w-24 text-sm font-medium text-gray-500">Name:</div>
//                 <div className="text-gray-900 font-medium text-sm">{userData.name || "N/A"}</div>
//               </div>
              
//               <div className="flex items-center">
//                 <div className="w-24 text-sm font-medium text-gray-500">User ID:</div>
//                 <div className="text-gray-900 font-mono text-sm">{userData.userId || "N/A"}</div>
//               </div>
              
//               <div className="flex items-center">
//                 <div className="w-24 text-sm font-medium text-gray-500">NIC:</div>
//                 <div className="text-gray-900 font-mono text-sm">{userData.nic || "N/A"}</div>
//               </div>
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
//               Contact Information
//             </h2>
            
//             <div className="space-y-3">
//               <div className="flex items-center">
//                 <div className="w-20 text-sm font-medium text-gray-500">Email:</div>
//                 <div className="text-gray-900">
//                   <a href={`mailto:${userData.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
//                     {userData.email || "N/A"}
//                   </a>
//                 </div>
//               </div>
              
//               <div className="flex items-center">
//                 <div className="w-20 text-sm font-medium text-gray-500">Phone:</div>
//                 <div className="text-gray-900">
//                   <a href={`tel:${userData.contact}`} className="text-blue-600 hover:text-blue-800 text-sm">
//                     {userData.contact || "N/A"}
//                   </a>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <div className="w-20 text-sm font-medium text-gray-500">Address:</div>
//                 <div className="text-gray-900 flex-1 text-sm">
//                   {formatAddress(userData.address, userData.city, userData.district, userData.province)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Account Status */}
//         <div className="mt-8 pt-6 border-t border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-gray-500">Verification Status</span>
//                 <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
//                   userData.isVerify 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {userData.isVerify ? 'Verified' : 'Not Verified'}
//                 </span>
//               </div>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-gray-500">Account Created</span>
//                 <span className="text-sm text-gray-900">{formatDate(userData.createdAt)}</span>
//               </div>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-gray-500">Total Parcels</span>
//                 <span className="text-sm font-bold text-gray-900">{parcels.length}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Parcel Information */}
//         <div className="mt-8 pt-6 border-t border-gray-200">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Parcel History</h2>
//             <div className="text-sm text-gray-500">
//               {parcels.length} {parcels.length === 1 ? 'parcel' : 'parcels'} found
//             </div>
//           </div>
          
//           {parcels.length > 0 ? (
//             <div className="space-y-4">
//               {parcels.map((parcel) => (
//                 <div key={parcel._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <div className="flex-shrink-0">
//                         <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(parcel.status)}`}>
//                           {getStatusIcon(parcel.status)}
//                           <span className="ml-1">{formatStatusText(parcel.status)}</span>
//                         </div>
//                       </div>
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-900">{parcel.parcelId}</h3>
//                         <p className="text-xs text-gray-500">
//                           {parcel.createdAt ? `Created: ${formatDate(parcel.createdAt)}` : ''}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-gray-500">Last Updated</p>
//                       <p className="text-sm font-medium text-gray-900">{formatDate(parcel.updatedAt)}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-8 8-4-4m0 0L7 7l-1 1" />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No parcels found</h3>
//               <p className="mt-1 text-sm text-gray-500">This customer hasn't created any parcels yet.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// UserDetails.propTypes = {
//   entryId: PropTypes.string.isRequired,
// };

// export default UserDetails;




import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingAnimation from "../../../utils/LoadingAnimation";
import ParcelDetails from "./ParcelDetails";

const UserDetails = ({ entryId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [userData, setUserData] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Personal Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-500">Name:</div>
                <div className="text-gray-900 font-medium text-sm">{userData.name || "N/A"}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-500">User ID:</div>
                <div className="text-gray-900 font-mono text-sm">{userData.userId || "N/A"}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-500">NIC:</div>
                <div className="text-gray-900 font-mono text-sm">{userData.nic || "N/A"}</div>
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
                <div className="text-gray-900">
                  <a href={`mailto:${userData.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
                    {userData.email || "N/A"}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-20 text-sm font-medium text-gray-500">Phone:</div>
                <div className="text-gray-900">
                  <a href={`tel:${userData.contact}`} className="text-blue-600 hover:text-blue-800 text-sm">
                    {userData.contact || "N/A"}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-20 text-sm font-medium text-gray-500">Address:</div>
                <div className="text-gray-900 flex-1 text-sm">
                  {formatAddress(userData.address, userData.city, userData.district, userData.province)}
                </div>
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
              <p className="mt-1 text-sm text-gray-500">This customer hasn't created any parcels yet.</p>
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