import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiHome,
  FiArrowLeft
} from 'react-icons/fi';
import { FaBarcode, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';

const ParcelDetails = () => {
  const { parcelId } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcelDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/parcels/${parcelId}`,
          { withCredentials: true }
        );
        setParcel(response.data.parcel);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load parcel details');
      } finally {
        setLoading(false);
      }
    };

    fetchParcelDetails();
  }, [parcelId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'PendingPickup':
        return 'bg-yellow-100 text-yellow-800';
      case 'PickedUp':
      case 'InTransit':
        return 'bg-blue-100 text-blue-800';
      case 'ArrivedAtCollectionCenter':
      case 'ArrivedAtDistributionCenter':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FiCheckCircle className="mr-1" />;
      case 'PendingPickup':
        return <FiClock className="mr-1" />;
      case 'PickedUp':
      case 'InTransit':
        return <FiTruck className="mr-1" />;
      default:
        return <FiPackage className="mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1f818e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Warning! </strong>
          <span className="block sm:inline">Parcel not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Background curve */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full rotate-180">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="topToBottomGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#D9D9D9" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
            </defs>
            <path
              fill="url(#topToBottomGradient)"
              fillOpacity="1"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[#1f818e] hover:text-[#16646f] mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Parcels
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#1f818e] to-[#34a290] p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold">Parcel Details</h1>
                <p className="mt-1 opacity-90">Tracking ID: {parcel.trackingNo}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-white bg-opacity-20 ${getStatusColor(parcel.status)}`}>
                  {getStatusIcon(parcel.status)}
                  {parcel.status}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column - Parcel Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tracking Timeline */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiTruck className="mr-2 text-[#1f818e]" />
                  Tracking History
                </h2>
                <div className="relative">
                  {/* Timeline */}
                  <div className="space-y-4">
                    {[
                      'OrderPlaced',
                      'PendingPickup',
                      'PickedUp',
                      'InTransit',
                      'ArrivedAtCollectionCenter',
                      'Delivered'
                    ].map((status) => (
                      <div key={status} className="flex items-start">
                        <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${parcel.status === status ? 'bg-[#1f818e] text-white' : 'bg-gray-200'}`}>
                          {status === 'Delivered' ? (
                            <FiCheckCircle className="h-4 w-4" />
                          ) : status === 'InTransit' ? (
                            <FiTruck className="h-4 w-4" />
                          ) : (
                            <FiPackage className="h-4 w-4" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${parcel.status === status ? 'text-[#1f818e]' : 'text-gray-600'}`}>
                            {status.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {parcel.status === status ? 
                              new Date(parcel.updatedAt).toLocaleString() : 
                              'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parcel Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiPackage className="mr-2 text-[#1f818e]" />
                  Parcel Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Parcel ID</p>
                    <p className="font-medium">{parcel.parcelId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Item Type</p>
                    <p className="font-medium">{parcel.itemType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{parcel.itemSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shipping Method</p>
                    <p className="font-medium">{parcel.shippingMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{parcel.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Special Instructions</p>
                    <p className="font-medium">{parcel.specialInstructions || 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Pickup/Delivery Info */}
              {parcel.pickupInformation && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiMapPin className="mr-2 text-[#1f818e]" />
                    Pickup Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Pickup Date</p>
                      <p className="font-medium">
                        {new Date(parcel.pickupInformation.pickupDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Time</p>
                      <p className="font-medium">{parcel.pickupInformation.pickupTime}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{parcel.pickupInformation.address}</p>
                      <p className="text-sm text-gray-600">
                        {parcel.pickupInformation.city}, {parcel.pickupInformation.district}, {parcel.pickupInformation.province}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {parcel.deliveryInformation && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-[#1f818e]" />
                    Delivery Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{parcel.deliveryInformation.deliveryAddress}</p>
                      <p className="text-sm text-gray-600">
                        {parcel.deliveryInformation.deliveryCity}, {parcel.deliveryInformation.deliveryDistrict}, {parcel.deliveryInformation.deliveryProvince}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Postal Code</p>
                      <p className="font-medium">{parcel.deliveryInformation.postalCode}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Receiver and Branch Info */}
            <div className="space-y-6">
              {/* Receiver Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiUser className="mr-2 text-[#1f818e]" />
                  Receiver Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{parcel.receiverId.receiverFullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="font-medium">{parcel.receiverId.receiverContact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{parcel.receiverId.receiverEmail}</p>
                  </div>
                </div>
              </div>

              {/* Branch Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiTruck className="mr-2 text-[#1f818e]" />
                  Branch Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">From Branch</p>
                    <p className="font-medium">
                      {parcel.from?.location || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To Branch</p>
                    <p className="font-medium">
                      {parcel.to?.location || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
                  <FaBarcode className="mr-2 text-[#1f818e]" />
                  Tracking QR Code
                </h2>
                <div className="bg-white p-4 rounded-md inline-block">
                  {/* Placeholder for QR code - you can generate actual QR code using a library */}
                  <div className="border-2 border-dashed border-gray-300 p-8 flex items-center justify-center text-gray-400">
                    QR Code for {parcel.trackingNo}
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Scan this code at any collection center
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ParcelDetails;

// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   FiPackage,
//   FiTruck,
//   FiCheckCircle,
//   FiClock,
//   FiMapPin,
//   FiDollarSign,
//   FiUser,
//   FiPhone,
//   FiMail,
//   FiCalendar,
//   FiWeight,
//   FiArrowLeft,
//   FiDownload,
//   FiPrinter,
//   FiShare2,
//   FiAlertCircle,
//   FiNavigation,
//   FiBox
// } from 'react-icons/fi';
// import { FaBarcode, FaRoute } from 'react-icons/fa';
// import { AuthContext } from '../../contexts/AuthContext';
// import Navbar from '../../components/User/Navbar';
// import Footer from '../../components/User/Footer';

// const ParcelDetails = () => {
//   const { parcelId } = useParams();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useContext(AuthContext);
//   const [parcelData, setParcelData] = useState(null);
//   const [trackingHistory, setTrackingHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');

//   useEffect(() => {
//     const fetchParcelDetails = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch parcel details
//         const parcelResponse = await axios.get(
//           `http://localhost:8000/api/parcels/${parcelId}`,
//           { withCredentials: true }
//         );

//         // Fetch tracking history
//         const trackingResponse = await axios.get(
//           `http://localhost:8000/api/parcels/${parcelId}/tracking`,
//           { withCredentials: true }
//         );

//         setParcelData(parcelResponse.data.data);
//         setTrackingHistory(trackingResponse.data.data.trackingHistory);
//       } catch (err) {
//         setError(
//           err.response?.data?.message || 
//           'Failed to load parcel details. Please try again.'
//         );
//         console.error('Error fetching parcel details:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (parcelId && isAuthenticated) {
//       fetchParcelDetails();
//     }
//   }, [parcelId, isAuthenticated]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Delivered':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'PendingPickup':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'PickedUp':
//       case 'InTransit':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'ArrivedAtCollectionCentre':
//       case 'ArrivedAtDistributionCentre':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'Delivered':
//         return <FiCheckCircle className="w-5 h-5" />;
//       case 'PendingPickup':
//         return <FiClock className="w-5 h-5" />;
//       case 'PickedUp':
//       case 'InTransit':
//         return <FiTruck className="w-5 h-5" />;
//       case 'ArrivedAtCollectionCentre':
//       case 'ArrivedAtDistributionCentre':
//         return <FiNavigation className="w-5 h-5" />;
//       default:
//         return <FiPackage className="w-5 h-5" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: `Parcel ${parcelData.parcelId}`,
//           text: `Track my parcel: ${parcelData.trackingNo}`,
//           url: window.location.href
//         });
//       } catch (err) {
//         console.log('Share failed:', err);
//       }
//     } else {
//       // Fallback to copy to clipboard
//       navigator.clipboard.writeText(window.location.href);
//       alert('Link copied to clipboard!');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1f818e]"></div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
//             <div className="flex items-center">
//               <FiAlertCircle className="w-5 h-5 mr-2" />
//               <div>
//                 <strong className="font-bold">Error!</strong>
//                 <p className="mt-1">{error}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (!parcelData) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="flex items-center justify-center min-h-screen">
//           <p className="text-gray-600">No parcel data found.</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       {/* Background curve */}
//       <div className="absolute top-0 left-0 w-full rotate-180">
//         <svg className="w-full h-auto" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <linearGradient id="topToBottomGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#D9D9D9" />
//               <stop offset="100%" stopColor="white" />
//             </linearGradient>
//           </defs>
//           <path
//             fill="url(#topToBottomGradient)"
//             fillOpacity="1"
//             d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
//           />
//         </svg>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => navigate('/parcels')}
//               className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               <FiArrowLeft className="w-5 h-5 mr-2" />
//               Back to Parcels
//             </button>
//             <div className="h-6 w-px bg-gray-300"></div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Parcel Details
//             </h1>
//           </div>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={handleShare}
//               className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <FiShare2 className="w-4 h-4 mr-2" />
//               Share
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <FiPrinter className="w-4 h-4 mr-2" />
//               Print
//             </button>
//           </div>
//         </div>

//         {/* Status Card */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-4">
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPackage className="w-8 h-8 text-blue-600" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   {parcelData.parcelId}
//                 </h2>
//                 <p className="text-gray-600">{parcelData.itemType}</p>
//               </div>
//             </div>
//             <div className={`px-4 py-2 rounded-full border ${getStatusColor(parcelData.status)}`}>
//               <div className="flex items-center space-x-2">
//                 {getStatusIcon(parcelData.status)}
//                 <span className="font-semibold">{parcelData.status}</span>
//               </div>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-6">
//             <div className="flex justify-between text-sm text-gray-600 mb-2">
//               <span>Progress</span>
//               <span>{parcelData.statusProgress}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div
//                 className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
//                 style={{ width: `${parcelData.statusProgress}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* Quick Info */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="flex items-center space-x-2">
//               <FaBarcode className="w-4 h-4 text-gray-400" />
//               <div>
//                 <p className="text-sm text-gray-600">Tracking No.</p>
//                 <p className="font-semibold">{parcelData.trackingNo}</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <FiCalendar className="w-4 h-4 text-gray-400" />
//               <div>
//                 <p className="text-sm text-gray-600">Created</p>
//                 <p className="font-semibold">
//                   {formatDate(parcelData.createdAt)}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <FiTruck className="w-4 h-4 text-gray-400" />
//               <div>
//                 <p className="text-sm text-gray-600">Shipping</p>
//                 <p className="font-semibold">{parcelData.shippingMethod}</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <FiDollarSign className="w-4 h-4 text-gray-400" />
//               <div>
//                 <p className="text-sm text-gray-600">Total Cost</p>
//                 <p className="font-semibold">Rs. {parcelData.totalCost}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//               <button
//                 onClick={() => setActiveTab('details')}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${
//                   activeTab === 'details'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Details
//               </button>
//               <button
//                 onClick={() => setActiveTab('tracking')}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${
//                   activeTab === 'tracking'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Tracking History
//               </button>
//             </nav>
//           </div>

//           <div className="p-6">
//             {activeTab === 'details' && (
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Sender Information */}
//                 <div className="bg-gray-50 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                     <FiUser className="w-5 h-5 mr-2" />
//                     Sender Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center space-x-3">
//                       <FiUser className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Name</p>
//                         <p className="font-medium">{parcelData.senderId?.fullname}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiMail className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Email</p>
//                         <p className="font-medium">{parcelData.senderId?.email}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiPhone className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Phone</p>
//                         <p className="font-medium">{parcelData.senderId?.phone}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiMapPin className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Address</p>
//                         <p className="font-medium">
//                           {parcelData.senderId?.address}, {parcelData.senderId?.district}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Receiver Information */}
//                 <div className="bg-gray-50 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                     <FiUser className="w-5 h-5 mr-2" />
//                     Receiver Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center space-x-3">
//                       <FiUser className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Name</p>
//                         <p className="font-medium">{parcelData.receiverId?.receiverFullname}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiMail className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Email</p>
//                         <p className="font-medium">{parcelData.receiverId?.receiverEmail}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiPhone className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Phone</p>
//                         <p className="font-medium">{parcelData.receiverId?.receiverPhone}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiMapPin className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Address</p>
//                         <p className="font-medium">
//                           {parcelData.receiverId?.receiverAddress}, {parcelData.receiverId?.receiverDistrict}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Parcel Information */}
//                 <div className="bg-gray-50 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                     <FiBox className="w-5 h-5 mr-2" />
//                     Parcel Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center space-x-3">
//                       <FiPackage className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Item Type</p>
//                         <p className="font-medium">{parcelData.itemType}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiBox className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Size</p>
//                         <p className="font-medium">{parcelData.itemSize}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiWeight className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Weight</p>
//                         <p className="font-medium">{parcelData.itemWeight || 'N/A'} kg</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiDollarSign className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Declared Value</p>
//                         <p className="font-medium">Rs. {parcelData.itemValue || 'N/A'}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Information */}
//                 <div className="bg-gray-50 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                     <FiTruck className="w-5 h-5 mr-2" />
//                     Shipping Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center space-x-3">
//                       <FiTruck className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Shipping Method</p>
//                         <p className="font-medium">{parcelData.shippingMethod}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiDollarSign className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Payment Method</p>
//                         <p className="font-medium">{parcelData.paymentMethod}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiCalendar className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Estimated Delivery</p>
//                         <p className="font-medium">
//                           {formatDate(parcelData.deliveryEstimation?.estimatedDate)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <FiDollarSign className="w-4 h-4 text-gray-400" />
//                       <div>
//                         <p className="text-sm text-gray-600">Total Cost</p>
//                         <p className="font-medium text-lg">Rs. {parcelData.totalCost}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'tracking' && (
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                   <FaRoute className="w-5 h-5 mr-2" />
//                   Tracking History
//                 </h3>
//                 <div className="space-y-4">
//                   {trackingHistory.map((item, index) => (
//                     <div key={index} className="flex items-start space-x-4">
//                       <div className="flex-shrink-0 mt-1">
//                         <div className={`w-3 h-3 rounded-full ${
//                           index === 0 ? 'bg-blue-500' : 'bg-gray-300'
//                         }`}></div>
//                         {index !== trackingHistory.length - 1 && (
//                           <div className="w-px h-16 bg-gray-300 ml-1 mt-2"></div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <div className="flex items-center justify-between mb-2">
//                             <h4 className="font-medium text-gray-800">
//                               {item.status}
//                             </h4>
//                             <span className="text-sm text-gray-500">
//                               {formatDate(item.timestamp)}
//                             </span>
//                           </div>
//                           {item.location && (
//                             <div className="flex items-center text-sm text-gray-600 mb-2">
//                               <FiMapPin className="w-4 h-4 mr-1" />
//                               {item.location}
//                             </div>
//                           )}
//                           {item.description && (
//                             <p className="text-sm text-gray-600 mb-2">
//                               {item.description}
//                             </p>
//                           )}
//                           {item.updatedBy && (
//                             <div className="flex items-center text-xs text-gray-500">
//                               <FiUser className="w-3 h-3 mr-1" />
//                               Updated by: {item.updatedBy.fullname} ({item.updatedBy.role})
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {trackingHistory.length === 0 && (
//                   <div className="text-center py-8">
//                     <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                     <p className="text-gray-500">No tracking history available yet.</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Delivery Estimation Alert */}
//         {parcelData.deliveryEstimation?.isDelayed && (
//           <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <div className="flex items-center">
//               <FiAlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
//               <div>
//                 <h3 className="font-medium text-yellow-800">Delivery Delayed</h3>
//                 <p className="text-sm text-yellow-700 mt-1">
//                   This parcel has exceeded the estimated delivery time. Please contact customer service for more information.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       <Footer />
//     </div>
//   );
// };

// export default ParcelDetails;