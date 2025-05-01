import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiPlus,
} from 'react-icons/fi';
import { FaBarcode } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import Navbar from '../../components/User/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/User/Footer';

const ParcelDashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const { isAuthenticated, getAuthHeaders, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/parcels/user_parcels',
          { withCredentials: true }
        );

        setParcels(response.data.parcels);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load parcels. Please try again.'
        );
        console.error('Error details:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, [isAuthenticated, getAuthHeaders, logout]);

  const filteredParcels = parcels.filter((parcel) => {
    if (filter === 'all') return true;
    return parcel.status.toLowerCase().includes(filter.toLowerCase());
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'PendingPickup':
        return 'bg-yellow-100 text-yellow-800';
      case 'PickedUp':
      case 'InTransit':
        return 'bg-blue-100 text-blue-800';
      case 'ArrivedAtCollectionCentre':
      case 'ArrivedAtDistributionCentre':
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  return (
    // <div>
    // <Navbar/>
    // <div className="bg-gray-50 min-h-screen p-6">

    //   <div className="max-w-7xl mx-auto">
    //     {/* Header */}
    //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
    //       <div>
    //         <h1 className="text-3xl font-bold text-gray-800">My Parcels</h1>
    //         <p className="text-gray-600 mt-2">
    //           Track and manage all your shipments in one place
    //         </p>
    //       </div>
    //       <div className="mt-4 md:mt-0">
    //         <span className="text-sm font-medium text-gray-700 mr-2">Filter by:</span>
    //         <select
    //           className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           value={filter}
    //           onChange={(e) => setFilter(e.target.value)}
    //         >
    //           <option value="all">All Parcels</option>
    //           <option value="pending">Pending</option>
    //           <option value="picked">Picked Up</option>
    //           <option value="transit">In Transit</option>
    //           <option value="delivered">Delivered</option>
    //         </select>
    //       </div>
    //     </div>
    <div>
      <Navbar />
      <div className="bg-gray-50  relative min-h-screen p-6">
        {/* Background curve SVG */}
        <div className="absolute top-0 left-0 w-full  rotate-180">
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex relative flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Parcels</h1>
              <p className="text-gray-600 mt-2">
                Track and manage all your shipments in one place
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
              <button
                onClick={() => navigate('/addparcel')} // Update this path according to your route
                className="flex items-center justify-center bg-[#16646f] hover:bg-[#34a290] text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-sm"
              >
                <FiPlus className="mr-2" />
                Add Parcel
              </button>
              <div className="flex  items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Filter by:
                </span>
                <select
                  className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Parcels</option>
                  <option value="pending">Pending</option>
                  <option value="picked">Picked Up</option>
                  <option value="transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid  relative grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiPackage className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Parcels
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {parcels.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FiClock className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {parcels.filter((p) => p.status === 'PendingPickup').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiTruck className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    In Transit
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {
                      parcels.filter(
                        (p) =>
                          p.status === 'InTransit' || p.status === 'PickedUp'
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FiCheckCircle className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Delivered</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {parcels.filter((p) => p.status === 'Delivered').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Parcels Table */}
          {filteredParcels.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No parcels found
              </h3>
              <p className="mt-1 text-gray-500">
                {filter === 'all'
                  ? "You don't have any parcels yet."
                  : `No parcels with status "${filter}" found.`}
              </p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Parcel ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tracking
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Receiver
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParcels.map((parcel) => (
                      <tr key={parcel._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiPackage className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {parcel.parcelId}
                              </div>
                              <div className="text-sm text-gray-500">
                                {parcel.itemType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaBarcode className="text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {parcel.trackingNo}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(
                                  parcel.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(parcel.status)}`}
                          >
                            {getStatusIcon(parcel.status)}
                            {parcel.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {parcel.receiverId.receiverFullname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {parcel.receiverId.receiverDistrict}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <span className="flex items-center text-sm text-gray-500">
                              <FiTruck className="mr-1" />{' '}
                              {parcel.shippingMethod}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              <FiDollarSign className="mr-1" />{' '}
                              {parcel.paymentMethod}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <FiMapPin className="inline mr-1" />{' '}
                            {parcel.itemSize}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Track
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ParcelDashboard;
