
import { FiSearch, FiMapPin, FiTruck, FiCalendar, FiClock } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import { useNavigate } from 'react-router-dom';
const backendURL = import.meta.env.VITE_BACKEND_URL;

const TrackParcelPage = () => {
  const { trackingNumber: trackingNumberFromURL } = useParams();
  const [trackingNumber, setTrackingNumber] = useState(trackingNumberFromURL || '');
  const [parcelData, setParcelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendURL}/api/parcels/track/${trackingNumber}`,
        { withCredentials: true }
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

  const getStatusDetails = (status) => {
    const statusMap = {
      OrderPlaced: {
        text: 'Order Placed',
        description: 'Your order has been received and is being processed',
      },
      PendingPickup: {
        text: 'Pending Pickup',
        description: 'Waiting for our courier to pick up your parcel',
      },
      PickedUp: {
        text: 'Picked Up',
        description: 'Parcel has been collected by our courier',
      },
      ArrivedAtDistributionCenter: {
        text: 'At Distribution Center',
        description: 'Your parcel has arrived at our sorting facility',
      },
      InTransit: {
        text: 'In Transit',
        description: 'Your parcel is on its way to the destination',
      },
      ArrivedAtCollectionCenter: {
        text: 'At Collection Center',
        description: 'Your parcel has arrived at the local collection point',
      },
      DeliveryDispatched: {
        text: 'Out for Delivery',
        description: 'Parcel is on its way to the final destination',
      },
      Delivered: {
        text: 'Delivered',
        description: 'Your parcel has been successfully delivered',
      },
    };
    return statusMap[status] || { text: status, description: '' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    };
  };

  const getTrackingHistory = () => {
    if (!parcelData) return [];
    
    const history = [];
    const { 
      submittingType, 
      receivingType,
      from,
      to,
      createdAt,
      parcelPickedUpDate,
      arrivedToDistributionCenterTime,
      intransitedDate,
      arrivedToCollectionCenterTime,
      parcelDispatchedDate,
      parcelDeliveredDate
    } = parcelData;

    // Always include Order Placed
    history.push({
      status: 'OrderPlaced',
      date: createdAt,
      description: 'Order received and confirmed',
    });

    // Special case: Same branch to branch
    if (from && to && from._id === to._id && submittingType === 'drop-off') {
      history.push({
        status: 'ArrivedAtCollectionCenter',
        date: arrivedToCollectionCenterTime,
        description: 'Parcel arrived at branch',
      });

    if (parcelDispatchedDate) {
        history.push({
          status: 'DeliveryDispatched',
          date: parcelDispatchedDate,
          description: 'Parcel is ready for Delivery',
        });
    }

      if (parcelDeliveredDate) {
        history.push({
          status: 'Delivered',
          date: parcelDeliveredDate,
          description: 'Parcel collected by recipient',
        });
      }

      return history;
    }

    // For pickup scenarios
    if (submittingType === 'pickup') {
      if (parcelData.pickupInformation.pickupDate) {
        history.push({
          status: 'PendingPickup',
          date: parcelData.pickupInformation.pickupDate,
          description: 'Waiting for courier pickup',
        });

        history.push({
          status: 'PickedUp',
          date: parcelPickedUpDate,
          description: 'Parcel collected by courier',
        });
      }
    }

    // Distribution center step
    if (arrivedToDistributionCenterTime) {
      history.push({
        status: 'ArrivedAtDistributionCenter',
        date: arrivedToDistributionCenterTime,
        description: 'Parcel arrived at sorting facility',
      });
    }

     // In transit step
    if (intransitedDate) {
      history.push({
        status: 'InTransit',
        date: intransitedDate,
        description: 'Parcel is on the way',
      });
    }

    if (arrivedToCollectionCenterTime) {
      history.push({
        status: 'ArrivedAtCollectionCenter',
        date: arrivedToCollectionCenterTime,
        description: 'Parcel arrived at branch',
      });
      
    }

    if (parcelDispatchedDate) {
        history.push({
          status: 'DeliveryDispatched',
          date: parcelDispatchedDate,
          description: 'Parcel is ready for Delivery',
        });
    }

   

    // Collection center step (unless doorstep delivery)
    if (arrivedToCollectionCenterTime && receivingType !== 'doorstep') {
      history.push({
        status: 'ArrivedAtCollectionCenter',
        date: arrivedToCollectionCenterTime,
        description: 'Parcel arrived at local center',
      });
    }

   
    // Delivered step
    if (parcelDeliveredDate) {
      history.push({
        status: 'Delivered',
        date: parcelDeliveredDate,
        description: receivingType === 'doorstep'
          ? 'Delivered to recipient'
          : 'Collected by recipient',
      });
    }

    return history;
  };

  const getRouteInfo = () => {
    if (!parcelData) return { origin: {}, destination: {} };

    // Default to branch locations if available
    let origin = {
      name: parcelData.from?.branchName || 'Origin',
      city: parcelData.from?.location,
      district: parcelData.from?.location,
    };

    let destination = {
      name: parcelData.to?.branchName || 'Destination',
      city: parcelData.to?.location,
      district: parcelData.to?.location,
    };

    // Override with pickup/delivery info if available
    if (parcelData.pickupInformation) {
      origin = {
        name: 'Pickup Location',
        city: parcelData.pickupInformation.city,
        district: parcelData.pickupInformation.district,
      };
    }

    if (parcelData.deliveryInformation) {
      destination = {
        name: 'Delivery Address',
        city: parcelData.deliveryInformation.deliveryCity,
        district: parcelData.deliveryInformation.deliveryDistrict,
      };
    }

    return { origin, destination };
  };

  const calculateProgress = (status) => {
    const statusWeights = {
      OrderPlaced: 0,
      PendingPickup: 10,
      PickedUp: 20,
      ArrivedAtDistributionCenter: 40,
      ShipmentAssigned:50,
      InTransit: 60,
      ArrivedAtCollectionCenter: 80,
      DeliveryDispatched: 90,
      Delivered: 100,
      
    };
    return statusWeights[status] || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full rotate-180">
          <svg className="w-full h-auto" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="topToBottomGradient" x1="0" y1="0" x2="0" y2="1">
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
          {/* Tracking Input Section */}
          <div className="text-center mb-14">
            <h1 className="text-4xl relative md:text-5xl font-bold text-gray-800 mb-2">
              Track Your Parcel
            </h1>
            <p className="text-xl relative text-[#1f818c] max-w-2xl mb-3 mx-auto">
              Enter your tracking number to get real-time updates on your delivery
            </p>
          </div>

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
            <div className="space-y-8">
              {/* Parcel Summary Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                <div className="bg-gradient-to-r from-[#1f818c] to-teal-400 p-6 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-2xl font-bold">Parcel #{parcelData.trackingNo}</h2>
                      <div className="flex items-center mt-2">
                        <FiMapPin className="text-red-500 mr-2" />
                        <span className="font-medium">
                          {getStatusDetails(parcelData.status).text}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <div className="text-sm">Estimated Progress</div>
                      <div className="flex items-center">
                        <div className="w-32 bg-white/30 h-2 rounded-full mr-2 overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${calculateProgress(parcelData.status)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold">{calculateProgress(parcelData.status)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Visualization */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="bg-[#1f818c] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FiMapPin />
                      </div>
                      <p className="font-medium text-gray-800">{getRouteInfo().origin.name}</p>
                      <p className="text-sm text-gray-500">
                        {getRouteInfo().origin.district}, {getRouteInfo().origin.city}
                      </p>
                    </div>
                    
                    <div className="flex-1 px-4 relative">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1f818c] to-teal-400 transition-all duration-1000"
                          style={{ width: `${calculateProgress(parcelData.status)}%` }}
                        ></div>
                      </div>
                      <div
                        className="absolute top-0 transform -translate-y-1/2 transition-all duration-1000"
                        style={{ left: `${calculateProgress(parcelData.status)}%` }}
                      >
                        <div className="relative">
                          <FiTruck className="text-[#1f818c] text-2xl" />
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-[#1f818c]">
                            {calculateProgress(parcelData.status)}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center flex-1">
                      <div className="bg-teal-400 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FiMapPin />
                      </div>
                      <p className="font-medium text-gray-800">{getRouteInfo().destination.name}</p>
                      <p className="text-sm text-gray-500">
                        {getRouteInfo().destination.district}, {getRouteInfo().destination.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-[#1f818c] mb-2">
                      <FiCalendar className="mr-2" />
                      <span className="font-medium">Order Date</span>
                    </div>
                    <p className="text-gray-700">
                      {formatDate(parcelData.createdAt)?.full || 'Not available'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-[#1f818c] mb-2">
                      <FiTruck className="mr-2" />
                      <span className="font-medium">Shipping Method</span>
                    </div>
                    <p className="text-gray-700 capitalize">
                      {parcelData.shippingMethod}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center text-[#1f818c] mb-2">
                      <FiMapPin className="mr-2" />
                      <span className="font-medium">Item Type</span>
                    </div>
                    <p className="text-gray-700 capitalize">
                      {parcelData.itemType.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking History */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-800">Tracking History</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {getTrackingHistory().map((item, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-[#1f818c] text-white' : 'bg-[#1f818c] text-white'
                          }`}>
                            <FiMapPin />
                          </div>
                          {index < getTrackingHistory().length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {item.status}
                              </h4>
                              <p className="text-gray-500 text-sm">
                                {item.description}
                              </p>
                            </div>
                            {item.date && (
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  {formatDate(item.date)?.date}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDate(item.date)?.time}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
          <div className="bg-gradient-to-r from-[#1f818c] to-teal-400 rounded-2xl p-10 text-center text-white shadow-xl mt-8">
            <h3 className="text-2xl font-bold mb-4">
              Need Help With Your Parcel?
            </h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Our customer support team is available 24/7 to assist you with any
              delivery questions.
            </p>
            <button   onClick={() => navigate('/contactus')} className="bg-white text-[#1f818c] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
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
