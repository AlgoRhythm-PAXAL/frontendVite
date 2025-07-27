import { useState } from 'react';
import { Search, Package, MapPin, Clock, Truck, CheckCircle } from 'lucide-react';

const TrackingPage = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    // Parcel status sequence from schema
    const statusSequence = [
        "OrderPlaced",
        "PendingPickup", 
        "PickedUp",
        "ArrivedAtDistributionCenter",
        "ShipmentAssigned",
        "InTransit",
        "ArrivedAtCollectionCenter",
        "DeliveryDispatched",
        "Delivered",
        "NotAccepted",
        "WrongAddress", 
        "Return"
    ];

    // Get status display name
    const getStatusDisplayName = (status) => {
        switch (status) {
            case "OrderPlaced": return "Order Placed";
            case "PendingPickup": return "Pending Pickup";
            case "PickedUp": return "Picked Up";
            case "ArrivedAtDistributionCenter": return "Arrived at Distribution Center";
            case "ShipmentAssigned": return "Shipment Assigned";
            case "InTransit": return "In Transit";
            case "ArrivedAtCollectionCenter": return "Arrived at Collection Center";
            case "DeliveryDispatched": return "Delivery Dispatched";
            case "Delivered": return "Delivered";
            case "NotAccepted": return "Not Accepted";
            case "WrongAddress": return "Wrong Address";
            case "Return": return "Return";
            default: return status;
        }
    };

    // Show notification function
    const showNotificationMessage = (message, type = 'success') => {
        if (type === 'success') {
            setSuccessMessage(message);
            setError('');
        } else {
            setError(message);
            setSuccessMessage('');
        }
        setShowNotification(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            setShowNotification(false);
            setSuccessMessage('');
            setError('');
        }, 5000);
    };

    const handleSearch = async () => {
        if (!trackingNumber.trim()) {
            showNotificationMessage('Please enter a tracking number', 'error');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');
        setTrackingResult(null);

        try {
            const response = await fetch(`http://localhost:8000/parcels/track/${trackingNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTrackingResult(data);
                console.log('Tracking result:', data);
                showNotificationMessage('Parcel found successfully!', 'success');
            } else {
                const errorData = await response.json();
                showNotificationMessage(errorData.message || 'Parcel not found', 'error');
            }
        } catch (err) {
            showNotificationMessage('Error searching for parcel. Please try again.', 'error');
            console.error('Tracking error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'intransit':
            case 'in transit':
                return 'bg-blue-100 text-blue-800';
            case 'pendingpickup':
            case 'pending pickup':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Beautiful Notification */}
            {showNotification && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out ${
                    successMessage 
                        ? 'bg-green-50 border-green-400 text-green-800' 
                        : 'bg-red-50 border-red-400 text-red-800'
                }`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {successMessage ? (
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">
                                {successMessage || error}
                            </p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => {
                                    setShowNotification(false);
                                    setSuccessMessage('');
                                    setError('');
                                }}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    successMessage 
                                        ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                                        : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                                }`}
                            >
                                <span className="sr-only">Dismiss</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-none mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        Track Your Parcel
                    </h1>

                    {/* Search Section */}
                    <div className="mb-8">
                        <div className="flex gap-4 max-w-2xl mx-auto">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search parcel by Tracking Number..."
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="px-6 py-3 bg-[#1F818C] text-white rounded-md hover:bg-[#176872] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tracking Results */}
                    {trackingResult && (
                        <div className="space-y-6">
                            {/* Parcel Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-[#1F818C]" />
                                    Parcel Information
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tracking Number:</span>
                                            <span className="font-medium text-[#1F818C]">{trackingResult.trackingNo || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Parcel ID:</span>
                                            <span className="font-medium">{trackingResult.parcelId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">QR Code:</span>
                                            <div className="font-medium">
                                                {trackingResult.qrCodeNo && trackingResult.qrCodeNo.startsWith('data:image') ? (
                                                    <img 
                                                        src={trackingResult.qrCodeNo} 
                                                        alt="QR Code" 
                                                        className="w-16 h-16 object-contain border border-gray-200 rounded"
                                                    />
                                                ) : (
                                                    <span>No QR Code</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Item Type:</span>
                                            <span className="font-medium">{trackingResult.itemType || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Item Size:</span>
                                            <span className="font-medium capitalize">{trackingResult.itemSize || 'N/A'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                                                {getStatusDisplayName(trackingResult.status)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping Method:</span>
                                            <span className="font-medium capitalize">{trackingResult.shippingMethod || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Submitting Type:</span>
                                            <span className="font-medium capitalize">{trackingResult.submittingType || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Receiving Type:</span>
                                            <span className="font-medium capitalize">{trackingResult.receivingType || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Created:</span>
                                            <span className="font-medium">{formatDate(trackingResult.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Updated:</span>
                                            <span className="font-medium">{formatDate(trackingResult.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Special Instructions if available */}
                                {trackingResult.specialInstructions && (
                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <div className="flex justify-between">
                                            <span className="text-yellow-700 font-medium">Special Instructions:</span>
                                            <span className="text-yellow-800">{trackingResult.specialInstructions}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Location Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* From Location */}
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        From Location
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-blue-600">Location:</span>
                                            <span className="font-medium">{trackingResult.from?.location || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-600">Branch ID:</span>
                                            <span className="font-medium">{trackingResult.from?.branchId || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-600">Address:</span>
                                            <span className="font-medium text-right">{trackingResult.from?.address || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* To Location */}
                                <div className="bg-green-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        To Location
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Location:</span>
                                            <span className="font-medium">{trackingResult.to?.location || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Branch ID:</span>
                                            <span className="font-medium">{trackingResult.to?.branchId || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Address:</span>
                                            <span className="font-medium text-right">{trackingResult.to?.address || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Progress Tracking */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#1F818C]" />
                                    Parcel Journey
                                </h3>
                                
                                <div className="relative">
                                    {/* Progress Line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                                    
                                    <div className="space-y-6">
                                        {statusSequence.slice(0, 9).map((status, index) => {
                                            const isCurrentStatus = trackingResult.status === status;
                                            const isPastStatus = statusSequence.indexOf(trackingResult.status) > index;
                                            const isActive = isCurrentStatus || isPastStatus;
                                            
                                            // Get timestamp for specific statuses from schema
                                            let timestamp = null;
                                            if (status === 'InTransit' && trackingResult.intransitedDate) {
                                                timestamp = trackingResult.intransitedDate;
                                            } else if (status === 'ArrivedAtCollectionCenter' && trackingResult.arrivedToCollectionCenterTime) {
                                                timestamp = trackingResult.arrivedToCollectionCenterTime;
                                            } else if (status === 'DeliveryDispatched' && trackingResult.parcelDispatchedDate) {
                                                timestamp = trackingResult.parcelDispatchedDate;
                                            } else if (status === 'Delivered' && trackingResult.parcelDeliveredDate) {
                                                timestamp = trackingResult.parcelDeliveredDate;
                                            } else if (isCurrentStatus) {
                                                timestamp = trackingResult.updatedAt;
                                            }
                                            
                                            return (
                                                <div key={status} className="relative flex items-center">
                                                    {/* Status Point */}
                                                    <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                                        isCurrentStatus 
                                                            ? 'bg-red-500 border-red-500' 
                                                            : isPastStatus 
                                                                ? 'bg-green-500 border-green-500' 
                                                                : 'bg-white border-gray-300'
                                                    }`}>
                                                        {isPastStatus ? (
                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                        ) : isCurrentStatus ? (
                                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                                        ) : (
                                                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Status Information */}
                                                    <div className="ml-4 flex-1">
                                                        <div className={`font-medium ${
                                                            isActive ? 'text-gray-900' : 'text-gray-500'
                                                        }`}>
                                                            {getStatusDisplayName(status)}
                                                        </div>
                                                        {isCurrentStatus && (
                                                            <div className="text-sm text-red-600 font-medium">Current Status</div>
                                                        )}
                                                        {isPastStatus && (
                                                            <div className="text-sm text-green-600">Completed</div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Timestamp */}
                                                    {timestamp && (
                                                        <div className="text-sm text-gray-500">
                                                            {formatDate(timestamp)}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Shipment Information */}
                            {trackingResult.shipmentId && (
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-[#1F818C]" />
                                        Shipment Information
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipment ID:</span>
                                            <span className="font-medium">{trackingResult.shipmentId}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {!trackingResult && !error && !loading && (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">Enter a tracking number to search for your parcel</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
