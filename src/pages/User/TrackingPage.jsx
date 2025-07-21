import { FiSearch, FiMapPin, FiTruck } from 'react-icons/fi';
import { useState , useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';

const TrackParcelPage = () => {
  const { trackingNumber: trackingNumberFromURL } = useParams(); // ✅ Get from URL
  const [trackingNumber, setTrackingNumber] = useState(trackingNumberFromURL || '');
  const [parcelData, setParcelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/parcels/track/${trackingNumber}`,
        {
          withCredentials: true,
        }
      );
      setParcelData(response.data);
    } catch (error) {
      console.error('Tracking error:', error);
      setParcelData(null);
      toast.error(
        error.response?.data?.message ||
          'Parcel not found. Please check your tracking number.'
      );
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
    if (trackingNumberFromURL) {
      handleTrack();
    }
  }, [trackingNumberFromURL]);

  const getStatusText = (status) => {
    const statusMap = {
      OrderPlaced: 'Order Placed',
      PendingPickup: 'Pending Pickup',
      PickedUp: 'Picked Up',
      ArrivedAtDistributionCenter: 'At Distribution Center',
      ShipmentAssigned: 'Shipment Assigned',
      InTransit: 'In Transit',
      ArrivedAtCollectionCenter: 'Arrived at Collection Center',
      DeliveryDispatched: 'Out for Delivery',
      Delivered: 'Delivered',
      NotAccepted: 'Not Accepted',
      WrongAddress: 'Wrong Address',
      Return: 'Returned',
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRouteInfo = (parcel) => {
    const {
      from,
      to,
      deliveryInformation,
      pickupInformation,
      receivingType,
      submittingType,
    } = parcel;

    let origin = {};
    let destination = {};

    if (receivingType === 'doorstep') {
      if (submittingType === 'pickup') {
        origin = {
          name: 'Pickup Location',
          city: pickupInformation?.city,
          district: pickupInformation?.district,
        };
        destination = {
          name: 'Delivery Address',
          city: deliveryInformation?.deliveryCity,
          district: deliveryInformation?.deliveryDistrict,
        };
      } else {
        // drop-off or branch
        origin = {
          name: from?.branchName || 'Branch',
          city: from?.city,
          district: from?.district,
        };
        destination = {
          name: 'Delivery Address',
          city: deliveryInformation?.deliveryCity,
          district: deliveryInformation?.deliveryDistrict,
        };
      }
    } else {
      // collection_center
      if (submittingType === 'pickup') {
        origin = {
          name: 'Pickup Location',
          city: pickupInformation?.city,
          district: pickupInformation?.district,
        };
        destination = {
          name: to?.branchName || 'Collection Center',
          city: to?.city,
          district: to?.district,
        };
      } else {
        // drop-off or branch
        origin = {
          name: from?.branchName || 'Branch',
          city: from?.city,
          district: from?.district,
        };
        destination = {
          name: to?.branchName || 'Collection Center',
          city: to?.city,
          district: to?.district,
        };
      }
    }

    return { origin, destination };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
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
                <stop offset="0%" stopColor="#1f818c" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
            </defs>
            <path
              fill="url(#topToBottomGradient)"
              fillOpacity="1"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Hero Tracking Section */}
          <div className="text-center mb-14">
            <h1 className="text-4xl relative md:text-5xl font-bold text-gray-800 mb-2">
              Track Your Parcel
            </h1>
            <p className="text-xl relative text-[#1f818c] max-w-2xl mb-3 mx-auto">
              Enter your tracking number to get real-time updates on your
              delivery
            </p>
          </div>

          {/* Tracking Input */}
          <div className="bg-white relative rounded-2xl shadow-xl overflow-hidden mb-12 transition-all duration-300 hover:shadow-2xl">
            <div className="p-1 bg-gradient-to-r from-[#1f818c] to-teal-400">
              <div className="flex items-center bg-white p-4">
                <FiSearch className="text-gray-400 text-2xl mr-4" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter your tracking number (e.g. F3242AC0-1745839632)"
                  className="flex-grow text-lg outline-none placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                />
                <button
                  onClick={handleTrack}
                  disabled={isLoading}
                  className={`ml-4 px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                    isLoading ? 'bg-gray-400' : 'bg-[#1f818c] hover:bg-teal-600'
                  } flex items-center`}
                >
                  {isLoading ? 'Tracking...' : 'Track Parcel'}
                  {!isLoading && <FiMapPin className="ml-2" />}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {parcelData ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16 animate-fadeIn">
              {/* Status Header */}
              <div className="bg-gradient-to-r from-[#1f818c] to-teal-400 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Parcel #{parcelData.trackingNo}
                    </h2>
                    <p className="text-teal-100">
                      {getStatusText(parcelData.status)}
                    </p>
                  </div>
                  {parcelData.arrivedToCollectionCenterTime && (
                    <div className="text-right">
                      <p className="text-sm text-teal-100">
                        {parcelData.status === 'ArrivedAtCollectionCenter'
                          ? 'Arrived at Center'
                          : 'Last Updated'}
                      </p>
                      <p className="text-xl font-semibold">
                        {formatDate(
                          parcelData.arrivedToCollectionCenterTime ||
                            parcelData.updatedAt
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Route Information */}
              <div className="px-6 pb-6">
                {(() => {
                  const { origin, destination } = getRouteInfo(parcelData);
                  return (
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <div className="bg-[#1f818c] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FiMapPin />
                        </div>
                        <p className="font-medium text-gray-800">
                          {origin.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {origin.city}, {origin.district}
                        </p>
                      </div>
                      <div className="flex-1 px-4">
                        <div className="h-1 bg-gradient-to-r from-[#1f818c] to-teal-400 relative">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <FiTruck className="text-[#1f818c] text-2xl animate-bounce" />
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-teal-400 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FiMapPin />
                        </div>
                        <p className="font-medium text-gray-800">
                          {destination.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {destination.city}, {destination.district}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Parcel Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Sender Information
                    </h4>
                    <p className="text-gray-600">{parcelData.senderId?.name}</p>
                    <p className="text-gray-600">
                      {parcelData.senderId?.phone}
                    </p>
                    {parcelData.pickupInformation && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Pickup Address:</p>
                        <p className="text-sm text-gray-600">
                          {parcelData.pickupInformation.address},{' '}
                          {parcelData.pickupInformation.city},{' '}
                          {parcelData.pickupInformation.district}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Receiver Information
                    </h4>
                    <p className="text-gray-600">
                      {parcelData.receiverId?.name}
                    </p>
                    <p className="text-gray-600">
                      {parcelData.receiverId?.phone}
                    </p>
                    {parcelData.deliveryInformation && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Delivery Address:
                        </p>
                        <p className="text-sm text-gray-600">
                          {parcelData.deliveryInformation.deliveryAddress},{' '}
                          {parcelData.deliveryInformation.deliveryCity},{' '}
                          {parcelData.deliveryInformation.deliveryDistrict}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Parcel Details */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Parcel Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Item Type</p>
                      <p className="text-gray-700 capitalize">
                        {parcelData.itemType.toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Item Size</p>
                      <p className="text-gray-700 capitalize">
                        {parcelData.itemSize}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Shipping Method</p>
                      <p className="text-gray-700 capitalize">
                        {parcelData.shippingMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Order Date</p>
                      <p className="text-gray-700">
                        {formatDate(parcelData.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Submitting Type</p>
                      <p className="text-gray-700 capitalize">
                        {parcelData.submittingType}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Receiving Type</p>
                      <p className="text-gray-700 capitalize">
                        {parcelData.receivingType.replace('_', ' ')}
                      </p>
                    </div>
                    {parcelData.specialInstructions && (
                      <div className="col-span-2">
                        <p className="text-gray-500 text-sm">
                          Special Instructions
                        </p>
                        <p className="text-gray-700">
                          {parcelData.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center pt-0 pb-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <FiSearch className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  {trackingNumber ? 'No parcel found' : 'Enter tracking number'}
                </h3>
                <p className="text-gray-500">
                  {trackingNumber
                    ? 'Please check your tracking number and try again'
                    : 'Track your parcel by entering the tracking number above'}
                </p>
              </div>
            </div>
          )}

          {/* Support CTA */}
          <div className="bg-gradient-to-r from-[#1f818c] to-teal-400 rounded-2xl p-10 text-center text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Need Help With Your Parcel?
            </h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Our customer support team is available 24/7 to assist you with any
              delivery questions.
            </p>
            <button className="bg-white text-[#1f818c] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackParcelPage;
