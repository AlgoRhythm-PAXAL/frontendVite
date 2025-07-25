import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Calendar } from 'lucide-react';

const ParcelListPage = () => {
    const { type, date } = useParams();
    const navigate = useNavigate();
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    // Map type to display titles and colors
    const typeConfig = {
        total: {
            title: 'Total Parcels',
            color: 'bg-[#1F818C]',
            hoverColor: 'hover:bg-[#176872]'
        },
        arrived: {
            title: 'Arrived Parcels',
            color: 'bg-blue-600',
            hoverColor: 'hover:bg-blue-700'
        },
        delivered: {
            title: 'Delivered Parcels',
            color: 'bg-green-600',
            hoverColor: 'hover:bg-green-700'
        },
        nonDelivered: {
            title: 'Non-Delivered Parcels',
            color: 'bg-red-600',
            hoverColor: 'hover:bg-red-700'
        }
    };

    const currentConfig = typeConfig[type] || typeConfig.total;

    const fetchParcels = useCallback(async () => {
        try {
            setLoading(true);
            const userCenter = localStorage.getItem('userCenter') || '682e1059ce33c2a891c9b168';
            
            // Use the daily endpoint to get detailed parcel list
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/parcels/dashboard/daily/${userCenter}/${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                let filteredParcels = [];
                
                // Use the pre-filtered arrays from backend based on type
                switch (type) {
                    case 'total':
                        filteredParcels = data.data.parcels || [];
                        break;
                    case 'arrived':
                        // Use the pre-filtered arrived parcels from backend
                        filteredParcels = (data.data.arrivedParcels || []).map(parcel => ({
                            _id: parcel._id,
                            parcelId: parcel.parcelId,
                            trackingNo: parcel.trackingNo,
                            status: parcel.status,
                            from: parcel.from?.location || 'N/A',
                            to: parcel.to?.location || 'N/A',
                            processedDate: parcel.arrivedToCollectionCenterTime
                        }));
                        break;
                    case 'delivered':
                        // Use the pre-filtered delivered parcels from backend
                        filteredParcels = (data.data.deliveredParcels || []).map(parcel => ({
                            _id: parcel._id,
                            parcelId: parcel.parcelId,
                            trackingNo: parcel.trackingNo,
                            status: parcel.status,
                            from: parcel.from?.location || 'N/A',
                            to: parcel.to?.location || 'N/A',
                            processedDate: parcel.parcelDeliveredDate
                        }));
                        break;
                    case 'nonDelivered':
                        // Use the pre-filtered non-delivered parcels from backend
                        filteredParcels = (data.data.nonDeliveredParcels || []).map(parcel => ({
                            _id: parcel._id,
                            parcelId: parcel.parcelId,
                            trackingNo: parcel.trackingNo,
                            status: parcel.status,
                            from: parcel.from?.location || 'N/A',
                            to: parcel.to?.location || 'N/A',
                            processedDate: parcel.arrivedToCollectionCenterTime
                        }));
                        break;
                }

                setParcels(filteredParcels);
                setStats(data.data.statistics);
            } else {
                setError('Failed to load parcels');
            }
        } catch (error) {
            console.error('Error fetching parcels:', error);
            setError('Error loading parcels');
        } finally {
            setLoading(false);
        }
    }, [type, date]);

    useEffect(() => {
        fetchParcels();
    }, [fetchParcels]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'ArrivedAtCollectionCenter':
                return 'bg-blue-100 text-blue-800';
            case 'InTransit':
                return 'bg-yellow-100 text-yellow-800';
            case 'DeliveryDispatched':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-center items-center py-20">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F818C]"></div>
                        <span className="text-gray-600 text-lg">Loading parcels...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-none mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/staff/collection-management/dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 ${currentConfig.color} text-white rounded-md ${currentConfig.hoverColor} transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800">{currentConfig.title}</h1>
                        <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(date)}</span>
                        </div>
                    </div>
                    
                    <div className={`${currentConfig.color} text-white rounded-lg p-4 text-center shadow-md`}>
                        <div className="text-sm font-medium mb-1">Total Count</div>
                        <div className="text-2xl font-bold">{parcels.length}</div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {/* Parcels Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Table Header */}
                    <div className={`${currentConfig.color} text-white`}>
                        <div className="grid grid-cols-6 gap-4 p-4">
                            <div className="text-center font-medium">Parcel ID</div>
                            <div className="text-center font-medium">Tracking Number</div>
                            <div className="text-center font-medium">Status</div>
                            <div className="text-center font-medium">From</div>
                            <div className="text-center font-medium">To</div>
                            <div className="text-center font-medium">Processed Date</div>
                        </div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {parcels.map((parcel, index) => (
                            <div
                                key={parcel._id || index}
                                className={`grid grid-cols-6 gap-4 p-4 ${
                                    index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                                } transition-colors cursor-pointer`}
                                onClick={() => {
                                    // Optional: Navigate to parcel detail page
                                    // navigate(`/staff/lodging-management/view-parcels/${parcel._id}`);
                                }}
                            >
                                <div className="text-center text-sm">
                                    {parcel.parcelId || parcel._id?.slice(-6) || 'N/A'}
                                </div>
                                <div className="text-center text-sm font-medium">
                                    {parcel.trackingNo || 'N/A'}
                                </div>
                                <div className="text-center text-sm">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(parcel.status)}`}>
                                        {parcel.status || 'Unknown'}
                                    </span>
                                </div>
                                <div className="text-center text-sm">
                                    {parcel.from || 'N/A'}
                                </div>
                                <div className="text-center text-sm">
                                    {parcel.to || 'N/A'}
                                </div>
                                <div className="text-center text-sm">
                                    {parcel.processedDate ? new Date(parcel.processedDate).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        ))}
                        
                        {parcels.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium mb-2">No parcels found</h3>
                                <p>No {currentConfig.title.toLowerCase()} for {formatDate(date)}.</p>
                            </div>
                        )}
                    </div>
                </div>

                
            </div>
        </div>
    );
};

export default ParcelListPage;
