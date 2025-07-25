
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiPlus,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const { isAuthenticated, getAuthHeaders, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await axios.get(

          `${import.meta.env.VITE_BACKEND_URL}/api/parcels/user_parcels`,
          { withCredentials: true }
        );
        setParcels(
                  response.data.parcels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  );

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
  // Apply status filter if not 'all'
  if (filter !== 'all' && !parcel.status.toLowerCase().includes(filter.toLowerCase())) {
    return false;
  }
  
  // Apply date filter if searchDate exists
  if (searchDate) {
    try {
      const parcelDate = new Date(parcel.createdAt).toISOString().split('T')[0];
      const searchDateFormatted = new Date(searchDate).toISOString().split('T')[0];
      return parcelDate === searchDateFormatted;
    } catch (error) {
      console.error('Date parsing error:', error);
      return true; // Skip date filtering if there's an error
    }
  }
  
  return true;
});

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredParcels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredParcels.length / itemsPerPage);

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

  const handleRowClick = (parcelId) => {
    navigate(`/parcels/${parcelId}`);
  };

  const handleDetailsClick = (e, parcelId) => {
    e.stopPropagation();
    navigate(`/parcels/${parcelId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

   const handleTrack = (e,trackingNo) => {
     e.stopPropagation();
    navigate(`/track/${trackingNo}`);
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

  

  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 relative min-h-screen p-6">
        {/* Background curve SVG */}
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
                onClick={() => navigate('/addparcel')}
                className="flex items-center justify-center bg-[#16646f] hover:bg-[#34a290] text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-sm"
              >
                <FiPlus className="mr-2" />
                Add Parcel
              </button>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Filter by:
                </span>
                <select
                  className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f818e]"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
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

          <div className="mb-6">
            <div className="relative rounded-md shadow-sm max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="block w-full pl-10 pr-3 py-2 border-[3px] border-[#1f818e] rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1f818e] focus:border-[#1f818e] sm:text-sm"
                value={searchDate}
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchDate && (
                <button
                  onClick={() => setSearchDate('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <span className="text-sm">Clear</span>
                </button>
              )}
            </div>
            <p className="relative mt-1 text-sm text-gray-500">
              {searchDate ? `Showing parcels for ${new Date(searchDate).toLocaleDateString()}` : 'Search parcels by date'}
            </p>
          </div>


          {/* Stats Cards */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200">
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
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200">
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
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200">
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
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200">
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

          {/* Parcels List */}
          {filteredParcels.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No parcels found
              </h3>
              <p className="mt-1 text-gray-500">
                {filter === 'all' && !searchTerm
                  ? "You don't have any parcels yet."
                  : `No parcels match your search criteria.`}
              </p>
            </div>
          ) : (
            <>
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      {/* Table Header */}
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Order #
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tracking #
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Created Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Receiver
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="bg-white divide-y divide-gray-200">
        {currentItems.map((parcel) => (
          <tr 
            key={parcel._id}
            className="hover:bg-gray-50 transition-colors duration-150"
             onClick={() => handleRowClick(parcel.parcelId)}
          >
            {/* Order Number */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {/* #{parcel.orderNumber || parcel.parcelId.substring(0, 8)} */}
                #{parcel.parcelId}
              </div>
            </td>

            {/* Tracking Number */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <FaBarcode className="text-gray-400 mr-2" />
                <div className="text-sm font-medium text-gray-900">
                  {parcel.trackingNo}
                </div>
              </div>
            </td>

            {/* Created Date */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {new Date(parcel.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(parcel.createdAt).toLocaleTimeString()}
              </div>
            </td>

            {/* Receiver Information */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-teal-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {parcel.receiverId.receiverEmail || parcel.receiverId.receiverEmail}
                  </div>
                  <div className="text-sm text-gray-500">
                    {parcel.receiverId.receiverContact || parcel.receiverId.receiverContact}
                  </div>
                </div>
              </div>
            </td>

            {/* Status */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(parcel.status)}`}>
                  {getStatusIcon(parcel.status)}
                  {parcel.status}
                </span>
              </div>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                 onClick={(e) => handleTrack(e, parcel.trackingNo)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiTruck className="mr-1" /> Track
              </button>
              <button
               onClick={(e) => handleDetailsClick(e, parcel.parcelId)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <FiPackage className="mr-1" /> Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, filteredParcels.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredParcels.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <FiChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                          <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === number
                                ? 'bg-[#1f818e] border-[#1f818e] text-white'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <FiChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ParcelDashboard;