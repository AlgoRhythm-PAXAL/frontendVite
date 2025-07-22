import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Calendar, Filter } from 'lucide-react';

const FilteredParcelsPage = () => {
    const { type, date } = useParams();
    const navigate = useNavigate();
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchParcels = async () => {
            try {
                setLoading(true);
                const userCenter = localStorage.getItem('userCenter') || '682e1059ce33c2a891c9b168';
                
                const response = await fetch(`http://localhost:8000/parcels/dashboard/parcels/${userCenter}/${date}/${type}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setParcels(data.parcels || []);
                } else {
                    setError('Failed to load parcels');
                }
            } catch (error) {
                console.error('Error fetching parcels:', error);
                setError('Error fetching parcels');
            } finally {
                setLoading(false);
            }
        };

        fetchParcels();
    }, [type, date]);

    const getTypeTitle = () => {
        switch(type) {
            case 'arrived': return 'Arrived Parcels';
            case 'delivered': return 'Delivered Parcels';
            case 'total': return 'Total Parcels';
            default: return 'Parcels';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'ArrivedAtCollectionCenter': return 'bg-blue-100 text-blue-800';
            case 'DeliveryDispatched': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1F818C]"></div>
                    <span className="text-gray-600">Loading parcels...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/staff/collection-management/dashboard')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1F818C] text-white rounded-md hover:bg-[#176872] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-5 h-5" />
                            <span>{formatDate(date)}</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {getTypeTitle()}
                    </h1>
                </div>

                {/* Stats Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-6 h-6 text-[#1F818C]" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Filter Summary</h3>
                            <p className="text-gray-600">
                                Showing {parcels.length} {getTypeTitle().toLowerCase()} for {formatDate(date)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Parcels Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[#1F818C] text-white">
                        <div className="grid grid-cols-8 gap-4 p-4 text-sm font-medium">
                            <div>Parcel ID</div>
                            <div>Tracking No</div>
                            <div>Status</div>
                            <div>Sender</div>
                            <div>Receiver</div>
                            <div>From</div>
                            <div>To</div>
                            <div>Date</div>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                        {parcels.map((parcel, index) => (
                            <div
                                key={parcel._id}
                                className={`grid grid-cols-8 gap-4 p-4 text-sm ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                            >
                                <div className="font-medium">{parcel.parcelId}</div>
                                <div>{parcel.trackingNo}</div>
                                <div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(parcel.status)}`}>
                                        {parcel.status}
                                    </span>
                                </div>
                                <div>{parcel.senderId?.name || 'N/A'}</div>
                                <div>{parcel.receiverId?.name || 'N/A'}</div>
                                <div>{parcel.from?.location || 'N/A'}</div>
                                <div>{parcel.to?.location || 'N/A'}</div>
                                <div>
                                    {parcel.status === 'Delivered' && parcel.parcelDeliveredDate 
                                        ? new Date(parcel.parcelDeliveredDate).toLocaleDateString()
                                        : parcel.status === 'ArrivedAtCollectionCenter' && parcel.parcelArrivedDate
                                        ? new Date(parcel.parcelArrivedDate).toLocaleDateString()
                                        : new Date(parcel.createdAt).toLocaleDateString()
                                    }
                                </div>
                            </div>
                        ))}
                        
                        {parcels.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-500">
                                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium mb-2">No parcels found</h3>
                                <p>No {getTypeTitle().toLowerCase()} for the selected date.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilteredParcelsPage;
