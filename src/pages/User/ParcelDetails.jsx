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
  FiArrowLeft,
  FiCreditCard
} from 'react-icons/fi';
import { FiGitBranch } from 'react-icons/fi';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
const backendURL = import.meta.env.VITE_BACKEND_URL;

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
          `${backendURL}/api/parcels/${parcelId}`,
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                    <p className="text-sm text-gray-500">Submitting Type</p>
                    <p className="font-medium">{parcel.submittingType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Receiving Type</p>
                    <p className="font-medium">{parcel.receivingType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Special Instructions</p>
                    <p className="font-medium">{parcel.specialInstructions || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{formatDate(parcel.createdAt)}</p>
                  </div>
                </div>
              </div>

                          {/* Branch Information - Show for drop-off or collection center */}
             {(parcel.submittingType === 'drop-off' || parcel.receivingType === 'collection_center') && (
               <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                 <FiGitBranch className="mr-2 text-[#1f818e]" />
                   Branch Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {parcel.submittingType === 'drop-off' && parcel.from && (
                 <div>
                <p className="text-sm text-gray-500">Drop-off Branch</p>
                 <p className="font-medium">{parcel.from.location}</p>
         
                </div>
                 )}
               {parcel.receivingType === 'collection_center' && parcel.to && (
               <div>
                 <p className="text-sm text-gray-500">Collection Branch</p>
                 <p className="font-medium">{parcel.to.location}</p>
          
               </div>
                )}
             </div>
            </div>
           )}

              {/* Pickup/Delivery Info - Only show if exists */}
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
                    <FiMapPin className="mr-2 text-[#1f818e]" />
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



            {/* Right Column - Receiver and Payment Info */}
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

              {/* Payment Info - Only show if exists */}
              {parcel.paymentId && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiCreditCard className="mr-2 text-[#1f818e]" />
                    Payment Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">{parcel.paymentId.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">Rs.{parcel.paymentId.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{parcel.paymentId.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Date</p>
                      <p className="font-medium">{formatDate(parcel.paymentId.paymentDate)}</p>
                    </div>
                  </div>
                </div>
              )}

          
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ParcelDetails;

