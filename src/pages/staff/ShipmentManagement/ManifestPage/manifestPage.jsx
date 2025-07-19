import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Package, Truck, MapPin, Clock, CreditCard } from 'lucide-react';

const ManifestPage = () => {
    const { shipmentId } = useParams();
    const navigate = useNavigate();
    const [manifestData, setManifestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch manifest data
    const fetchManifestData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`http://localhost:8000/shipments/${shipmentId}/manifest`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setManifestData(data.manifest);
            } else {
                throw new Error(data.error || 'Failed to fetch manifest data');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching manifest:', err);
        } finally {
            setLoading(false);
        }
    };

    // Download PDF function
    const downloadPDF = () => {
        if (!manifestData) return;
        
        // Create PDF content
        const printContent = document.getElementById('manifest-content');
        const printWindow = window.open('', '', 'height=600,width=800');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Shipment Manifest - ${manifestData.shipmentId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .company-name { font-size: 24px; font-weight: bold; color: #1F818C; }
                        .manifest-title { font-size: 18px; margin-top: 10px; }
                        .section { margin: 20px 0; }
                        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333; }
                        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
                        .info-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
                        .info-label { font-weight: bold; }
                        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        .table th { background-color: #f5f5f5; font-weight: bold; }
                        .route-item { padding: 10px; margin: 5px 0; background-color: #f9f9f9; border-radius: 5px; }
                        .parcel-details { margin-top: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; }
                        .address-info { background-color: #e8f4f8; padding: 8px; border-radius: 4px; margin: 5px 0; }
                        .timeline-item { padding: 10px; margin: 5px 0; background-color: #f0f8ff; border-left: 4px solid #1F818C; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`http://localhost:8000/shipments/${shipmentId}/manifest`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.success) {
                    setManifestData(data.manifest);
                } else {
                    throw new Error(data.error || 'Failed to fetch manifest data');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching manifest:', err);
            } finally {
                setLoading(false);
            }
        };

        if (shipmentId) {
            fetchData();
        }
    }, [shipmentId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg font-medium text-gray-500">Loading manifest...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-700 font-medium">Error loading manifest:</div>
                <div className="text-red-600">{error}</div>
                <button
                    onClick={fetchManifestData}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!manifestData) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-yellow-700 font-medium">No manifest data found</div>
                <div className="text-yellow-600">Unable to load manifest for shipment {shipmentId}</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate('/staff/shipment-management/view-shipments')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Shipments
                </button>
                <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Download size={16} />
                    Download PDF
                </button>
            </div>

            {/* Manifest Content */}
            <div id="manifest-content" className="bg-white rounded-lg shadow-lg p-8">
                {/* Header */}
                <div className="header text-center mb-8">
                    <div className="company-name text-2xl font-bold text-[#1F818C]">PAXAL Logistics</div>
                    <div className="manifest-title text-lg mt-2">Shipment Manifest</div>
                    <div className="text-sm text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()}</div>
                </div>

                {/* Shipment Overview */}
                <div className="section mb-8">
                    <div className="section-title flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
                        <Package className="w-6 h-6 text-[#1F818C]" />
                        Shipment Overview
                    </div>
                    <div className="info-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="info-item flex justify-between py-2 border-b border-gray-200">
                                <span className="info-label font-semibold">Shipment ID:</span>
                                <span className="font-mono">{manifestData.shipmentId}</span>
                            </div>
                            <div className="info-item flex justify-between py-2 border-b border-gray-200">
                                <span className="info-label font-semibold">Delivery Type:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    manifestData.deliveryType === 'Express' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {manifestData.deliveryType}
                                </span>
                            </div>
                            <div className="info-item flex justify-between py-2 border-b border-gray-200">
                                <span className="info-label font-semibold">Status:</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                    {manifestData.status}
                                </span>
                            </div>
                            <div className="info-item flex justify-between py-2 border-b border-gray-200">
                                <span className="info-label font-semibold">Created Date:</span>
                                <span>{new Date(manifestData.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="info-item flex justify-between py-2 border-b border-gray-200">
                                <span className="info-label font-semibold">Total Weight:</span>
                                <span className="font-semibold">{manifestData.totalWeight} kg</span>
                            </div>
                            <div className="info-item flex justify-between py-2 border-b border-gray-200">
                                <span className="info-label font-semibold">Parcel Count:</span>
                                <span className="font-semibold">{manifestData.parcelCount}</span>
                            </div>
                            <div className="info-item flex justify-between py-2 border-b border-gray-200">
                                <span className="info-label font-semibold">Total Volume:</span>
                                <span className="font-semibold">{manifestData.totalVolume || 'N/A'} m³</span>
                            </div>
                            <div className="info-item flex justify-between py-2 border-b border-gray-200">
                                <span className="info-label font-semibold">Total Distance:</span>
                                <span className="font-semibold">{manifestData.totalDistance || 'N/A'} km</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicle Information */}
                {manifestData.assignedVehicle && (
                    <div className="section mb-8">
                        <div className="section-title flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
                            <Truck className="w-6 h-6 text-[#1F818C]" />
                            Assigned Vehicle
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-green-700">Vehicle Number:</span>
                                        <span className="text-green-800">{manifestData.assignedVehicle.vehicleNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-green-700">Vehicle Type:</span>
                                        <span className="text-green-800">{manifestData.assignedVehicle.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-green-700">Capacity:</span>
                                        <span className="text-green-800">{manifestData.assignedVehicle.capacity} kg</span>
                                    </div>
                                </div>
                                {manifestData.assignedDriver && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-green-700">Driver Name:</span>
                                            <span className="text-green-800">{manifestData.assignedDriver.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-green-700">Contact:</span>
                                            <span className="text-green-800">{manifestData.assignedDriver.contactNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-green-700">License:</span>
                                            <span className="text-green-800">{manifestData.assignedDriver.licenseNumber}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Shipment Timeline */}
                <div className="section mb-8">
                    <div className="section-title flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
                        <Clock className="w-6 h-6 text-[#1F818C]" />
                        Shipment Timeline
                    </div>
                    <div className="space-y-4">
                        <div className="timeline-item bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-blue-800">Shipment Created</div>
                                    <div className="text-sm text-blue-600">Initial shipment created and parcels assigned</div>
                                </div>
                                <div className="text-sm text-blue-700 font-medium">
                                    {new Date(manifestData.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {manifestData.assignedVehicle && (
                            <div className="timeline-item bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-green-800">Vehicle Assigned</div>
                                        <div className="text-sm text-green-600">
                                            Vehicle {manifestData.assignedVehicle.vehicleNumber} assigned to shipment
                                        </div>
                                    </div>
                                    <div className="text-sm text-green-700 font-medium">
                                        {manifestData.vehicleAssignedAt ? new Date(manifestData.vehicleAssignedAt).toLocaleString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {manifestData.status === 'In Transit' && (
                            <div className="timeline-item bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-yellow-800">In Transit</div>
                                        <div className="text-sm text-yellow-600">Shipment is currently in transit</div>
                                    </div>
                                    <div className="text-sm text-yellow-700 font-medium">
                                        {manifestData.transitStartedAt ? new Date(manifestData.transitStartedAt).toLocaleString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {manifestData.status === 'Completed' && (
                            <div className="timeline-item bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-emerald-800">Shipment Completed</div>
                                        <div className="text-sm text-emerald-600">All parcels delivered successfully</div>
                                    </div>
                                    <div className="text-sm text-emerald-700 font-medium">
                                        {manifestData.completedAt ? new Date(manifestData.completedAt).toLocaleString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Arrival Times */}
                {manifestData.arrivalTimes && manifestData.arrivalTimes.length > 0 && (
                    <div className="section mb-8">
                        <div className="section-title flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
                            <Clock className="w-6 h-6 text-[#1F818C]" />
                            Estimated Arrival Times
                        </div>
                        <div className="space-y-3">
                            {manifestData.arrivalTimes.map((arrival, index) => (
                                <div key={index} className="bg-indigo-50 rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-indigo-800">
                                            {arrival.center?.location || arrival.center?.branchId || arrival.center}
                                        </div>
                                        <div className="text-sm text-indigo-600">
                                            Branch ID: {arrival.center?.branchId || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-indigo-800">{arrival.time} hours</div>
                                        <div className="text-sm text-indigo-600">from start</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Route Information */}
                {manifestData.route && manifestData.route.length > 0 && (
                    <div className="section mb-8">
                        <div className="section-title flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
                            <MapPin className="w-6 h-6 text-[#1F818C]" />
                            Route Information
                        </div>
                        <div className="space-y-3">
                            {manifestData.route.map((location, index) => (
                                <div key={index} className="route-item bg-blue-50 rounded-lg p-4 flex items-center gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-blue-800">{location.location}</div>
                                        <div className="text-sm text-blue-600">Branch ID: {location.branchId}</div>
                                    </div>
                                    {index < manifestData.route.length - 1 && (
                                        <div className="text-blue-400">→</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Parcel Information */}
                <div className="section mb-8">
                    <div className="section-title flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
                        <Package className="w-6 h-6 text-[#1F818C]" />
                        Parcel Information ({manifestData.parcels?.length || 0} parcels)
                    </div>
                    
                    {manifestData.parcels?.length > 0 ? (
                        <div className="space-y-6">
                            {manifestData.parcels.map((parcel, index) => (
                                <div key={index} className="parcel-details bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Parcel Basic Info */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <Package className="w-5 h-5 text-[#1F818C]" />
                                                Parcel #{index + 1}
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Parcel ID:</span>
                                                    <span className="font-medium">{parcel.parcelId || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tracking No:</span>
                                                    <span className="font-medium">{parcel.trackingNo || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Weight:</span>
                                                    <span className="font-medium">{parcel.weight || 'N/A'} kg</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Item Type:</span>
                                                    <span className="font-medium">{parcel.itemType || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        parcel.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        parcel.status === 'InTransit' ? 'bg-blue-100 text-blue-800' :
                                                        parcel.status === 'PendingPickup' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {parcel.status || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Parcel Details */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3">Additional Details</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Description:</span>
                                                    <span className="font-medium text-right flex-1 ml-2">{parcel.description || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Dimensions:</span>
                                                    <span className="font-medium">{parcel.dimensions || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Fragile:</span>
                                                    <span className="font-medium">{parcel.fragile ? 'Yes' : 'No'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">COD Amount:</span>
                                                    <span className="font-medium">{parcel.codAmount ? `Rs. ${parcel.codAmount}` : 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Created:</span>
                                                    <span className="font-medium">{parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sender & Receiver Information */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="address-info bg-blue-50 rounded-lg p-4">
                                            <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                From: {parcel.from?.location || 'N/A'}
                                            </h5>
                                            <div className="space-y-2 text-sm">
                                                <div><span className="font-medium">Branch ID:</span> {parcel.from?.branchId || 'N/A'}</div>
                                                <div><span className="font-medium">Address:</span> {parcel.from?.address || 'N/A'}</div>
                                                <div><span className="font-medium">Contact:</span> {parcel.from?.contact || 'N/A'}</div>
                                            </div>
                                        </div>

                                        <div className="address-info bg-green-50 rounded-lg p-4">
                                            <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                To: {parcel.to?.location || 'N/A'}
                                            </h5>
                                            <div className="space-y-2 text-sm">
                                                <div><span className="font-medium">Branch ID:</span> {parcel.to?.branchId || 'N/A'}</div>
                                                <div><span className="font-medium">Address:</span> {parcel.to?.address || 'N/A'}</div>
                                                <div><span className="font-medium">Contact:</span> {parcel.to?.contact || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Information */}
                                    {(parcel.paymentInfo || parcel.paymentMethod || parcel.paymentStatus) && (
                                        <div className="mt-4 bg-purple-50 rounded-lg p-4">
                                            <h5 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                Payment Information
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div><span className="font-medium">Method:</span> {parcel.paymentMethod || 'N/A'}</div>
                                                <div><span className="font-medium">Status:</span> 
                                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                                        parcel.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                                        parcel.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {parcel.paymentStatus || 'N/A'}
                                                    </span>
                                                </div>
                                                <div><span className="font-medium">Amount:</span> {parcel.paymentAmount ? `Rs. ${parcel.paymentAmount}` : 'N/A'}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Delivery Tracking */}
                                    {parcel.deliveryHistory && parcel.deliveryHistory.length > 0 && (
                                        <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                                            <h5 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Delivery Tracking
                                            </h5>
                                            <div className="space-y-2">
                                                {parcel.deliveryHistory.map((event, eventIndex) => (
                                                    <div key={eventIndex} className="flex justify-between items-center text-sm">
                                                        <span>{event.status || event.event}</span>
                                                        <span className="text-gray-600">{new Date(event.timestamp).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p>No parcels found for this shipment.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="section mt-12 pt-8 border-t border-gray-200">
                    <div className="text-center text-sm text-gray-500">
                        <p>This manifest was generated automatically by PAXAL Logistics System</p>
                        <p>Generated on {new Date().toLocaleString()}</p>
                        <p className="mt-2">For any queries, contact: support@paxal.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManifestPage;
