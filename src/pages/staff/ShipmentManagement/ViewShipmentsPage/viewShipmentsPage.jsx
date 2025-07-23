

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

const ViewShipmentsPage = () => {
    const navigate = useNavigate();
    const [shipments, setShipments] = useState([]);
    const [filteredShipments, setFilteredShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedShipmentId, setExpandedShipmentId] = useState(null);
    
    // Staff authentication states
    const [staffInfo, setStaffInfo] = useState(null);
    const [staffBranchId, setStaffBranchId] = useState(null);

    // Function to fetch staff information from API (same as CreatedShipmentsPage)
    const fetchStaffInfo = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/staff/ui/get-staff-information`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch staff info: ${response.status}`);
            }
            
            const data = await response.json();
            setStaffInfo(data);
            setStaffBranchId(data.branchId?._id);
            return data.branchId?._id;
        } catch (err) {
            console.error('Error fetching staff info:', err);
            setError('Failed to fetch staff information');
            return null;
        }
    }, []);

    // Fetch completed shipments using the same method as CreatedShipmentsPage
    const fetchCompletedShipments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get staff branch if not already available
            let branchId = staffBranchId;
            if (!branchId) {
                branchId = await fetchStaffInfo();
            }
            
            if (!branchId) {
                setError('Staff branch information not available');
                return;
            }

            const queryParams = new URLSearchParams();
            queryParams.append('status', 'Completed');
            queryParams.append('branchId', branchId);
            
            // Try fetching completed shipments for the staff's branch using the same API structure
            let url = `${import.meta.env.VITE_BACKEND_URL}/vehicles/b2b/shipments/branch/${branchId}?${queryParams.toString()}`;
            let response = await fetch(url, {
                credentials: 'include'
            });
            
            // Fallback to original endpoints if branch-specific endpoint doesn't exist
            if (response.status === 404) {
                // Use staff ID from staffInfo if available, otherwise use branch-based approach
                const staffId = staffInfo?._id || branchId;
                url = `${import.meta.env.VITE_BACKEND_URL}/vehicles/b2b/shipments/${staffId}?${queryParams.toString()}`;
                response = await fetch(url, {
                    credentials: 'include'
                });
                
                if (response.status === 404) {
                    url = `${import.meta.env.VITE_BACKEND_URL}/shipments/completed/${branchId}`;
                    response = await fetch(url, {
                        credentials: 'include'
                    });
                }
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle different response formats (same as CreatedShipmentsPage)
            let shipmentsData = [];
            
            if (data.success && data.shipments) {
                shipmentsData = data.shipments;
            } else if (Array.isArray(data)) {
                shipmentsData = data;
            } else if (data.shipments) {
                shipmentsData = Array.isArray(data.shipments) ? data.shipments : [data.shipments];
            } else {
                shipmentsData = [data];
            }

            // Filter for completed shipments if not already filtered by backend
            const completedShipments = shipmentsData.filter(shipment => 
                shipment.status === 'Completed' || shipment.status === 'completed'
            );

            setShipments(completedShipments);
            setFilteredShipments(completedShipments);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching shipments:', err);
        } finally {
            setLoading(false);
        }
    }, [staffBranchId, staffInfo, fetchStaffInfo]);

    // Search functionality
    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);
        if (!searchValue.trim()) {
            setFilteredShipments(shipments);
        } else {
            const filtered = shipments.filter(shipment =>
                shipment.shipmentId?.toLowerCase().includes(searchValue.toLowerCase()) ||
                shipment.deliveryType?.toLowerCase().includes(searchValue.toLowerCase()) ||
                shipment.status?.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredShipments(filtered);
        }
    };

    // Navigate to manifest page
    const navigateToManifest = (shipmentId) => {
        navigate(`/staff/shipment-management/manifest/${shipmentId}`);
    };

    // Calculate total weight from shipment data (not from parcels since weight doesn't exist in parcel schema)
    const getShipmentWeight = (shipment) => {
        return shipment.totalWeight || 0;
    };

    // Get parcel count
    const getParcelCount = (shipment) => {
        return shipment.parcelCount || shipment.parcels?.length || 0;
    };

    // Toggle row expansion for detailed view
    const toggleRowExpansion = (id, e) => {
        e.stopPropagation();
        setExpandedShipmentId(expandedShipmentId === id ? null : id);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        handleSearch(e.target.value);
    };

    useEffect(() => {
        fetchCompletedShipments();
    }, [fetchCompletedShipments]);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg font-medium text-gray-500">Loading completed shipments...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-700 font-medium">Error loading completed shipments:</div>
                <div className="text-red-600">{error}</div>
                <button
                    onClick={fetchCompletedShipments}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* Controls Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search by shipment ID, delivery type, or status..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                    />

                    {/* Refresh Button */}
                    <button
                        onClick={fetchCompletedShipments}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-500"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table Statistics */}
            <div className="text-sm text-gray-600 mb-2">
                Showing {filteredShipments.length} of {shipments.length} completed shipments
            </div>

            {/* Shipments Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shipment ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Delivery Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Weight (kg)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Parcel Count
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Manifest
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredShipments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {searchTerm ? 'No shipments found matching your search.' : 'No completed shipments found.'}
                                </td>
                            </tr>
                        ) : (
                            filteredShipments.map((shipment) => (
                                <>
                                    <tr key={shipment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {shipment.shipmentId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                shipment.deliveryType === 'Express' || shipment.deliveryType === 'express'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {shipment.deliveryType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getShipmentWeight(shipment)} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {getParcelCount(shipment)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {shipment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button
                                                onClick={() => navigateToManifest(shipment.shipmentId)}
                                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-teal-600 bg-teal-100 rounded-full hover:bg-teal-200 transition-colors"
                                            >
                                                <FileText size={12} />
                                                View Manifest
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button
                                                onClick={(e) => toggleRowExpansion(shipment._id, e)}
                                                className="text-[#1F818C] hover:text-[#176872] focus:outline-none focus:underline flex items-center"
                                            >
                                                View More
                                                {expandedShipmentId === shipment._id ?
                                                    <ChevronUp className="ml-1 w-4 h-4" /> :
                                                    <ChevronDown className="ml-1 w-4 h-4" />
                                                }
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Expanded Row - Show detailed shipment information */}
                                    {expandedShipmentId === shipment._id && (
                                        <tr className="bg-gray-50">
                                            <td colSpan="7" className="p-0">
                                                <div className="rounded-lg shadow-inner bg-white m-2 p-6 border border-gray-200">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-lg font-semibold text-blue-700">
                                                            Completed Shipment Details - {shipment.shipmentId}
                                                        </h3>
                                                    </div>

                                                    {/* Complete Shipment Information */}
                                                    <div className="grid md:grid-cols-1 gap-6 mb-6">
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <h4 className="font-semibold text-gray-800 mb-3">Shipment Information</h4>
                                                            <div className="grid md:grid-cols-3 gap-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Shipment ID:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.shipmentId || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Delivery Type:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.deliveryType || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Status:</span>
                                                                        <span className="font-medium text-green-600">{shipment.status || 'N/A'}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Total Weight:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.totalWeight || 'N/A'} kg</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Total Volume:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.totalVolume || 'N/A'} m³</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Total Distance:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.totalDistance || 'N/A'} km</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Created At:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString() : 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Parcel Count:</span>
                                                                        <span className="font-medium text-gray-800">{getParcelCount(shipment)}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Vehicle:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.assignedVehicle?.registrationNo || shipment.assignedVehicle?.vehicleId || 'Not Assigned'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Driver:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.assignedDriver?.name || 'Not Assigned'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Vehicle Information */}
                                                    {shipment.assignedVehicle && (
                                                        <div className="bg-green-50 rounded-lg p-4 mb-6">
                                                            <h4 className="font-semibold text-green-800 mb-3">Assigned Vehicle Details</h4>
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex">
                                                                        <span className="text-green-700 w-36">Vehicle ID:</span>
                                                                        <span className="font-medium text-green-800">{shipment.assignedVehicle.vehicleId || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-green-700 w-36">Registration No:</span>
                                                                        <span className="font-medium text-green-800">{shipment.assignedVehicle.registrationNo || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-green-700 w-36">Vehicle Type:</span>
                                                                        <span className="font-medium text-green-800">{shipment.assignedVehicle.vehicleType || 'N/A'}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {shipment.assignedDriver && (
                                                                        <>
                                                                            <div className="flex">
                                                                                <span className="text-green-700 w-36">Driver Name:</span>
                                                                                <span className="font-medium text-green-800">{shipment.assignedDriver.name || 'N/A'}</span>
                                                                            </div>
                                                                            <div className="flex">
                                                                                <span className="text-green-700 w-36">Driver Contact:</span>
                                                                                <span className="font-medium text-green-800">{shipment.assignedDriver.contactNo || 'N/A'}</span>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Parcels Information - Only show schema fields */}
                                                    {shipment.parcels && shipment.parcels.length > 0 && (
                                                        <div className="bg-blue-50 rounded-lg p-4">
                                                            <h4 className="font-semibold text-blue-800 mb-3">Parcels Information ({shipment.parcels.length} parcels)</h4>
                                                            <div className="space-y-2">
                                                                {shipment.parcels.map((parcel, index) => (
                                                                    <div key={parcel._id || index} className="flex justify-between items-center bg-white rounded p-3">
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="font-medium text-blue-700">#{parcel.parcelId || index + 1}</span>
                                                                            <span className="text-sm text-gray-600">Type: {parcel.itemType || 'N/A'}</span>
                                                                            <span className="text-sm text-gray-600">Size: {parcel.itemSize || 'N/A'}</span>
                                                                            <span className="text-sm text-gray-600">Method: {parcel.shippingMethod || 'N/A'}</span>
                                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                                parcel.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                                parcel.status === 'InTransit' ? 'bg-blue-100 text-blue-800' :
                                                                                parcel.status === 'PendingPickup' ? 'bg-yellow-100 text-yellow-800' :
                                                                                'bg-gray-100 text-gray-800'
                                                                            }`}>
                                                                                {parcel.status || 'N/A'}
                                                                            </span>
                                                                        </div>
                                                                        {parcel.trackingNo && (
                                                                            <span className="text-xs text-gray-500">Tracking: {parcel.trackingNo}</span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewShipmentsPage;