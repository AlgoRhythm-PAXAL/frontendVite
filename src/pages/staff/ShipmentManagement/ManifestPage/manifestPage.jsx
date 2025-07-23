import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Package, Truck, MapPin, Clock, User } from 'lucide-react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/${shipmentId}/manifest`, {
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
    const downloadPDF = async () => {
        if (!manifestData) return;
        
        try {
            // Add PDF-specific styles temporarily
            const element = document.getElementById('manifest-content');
            const originalStyle = element.style.cssText;
            
            // Apply print-optimized styles
            element.style.cssText = `
                ${originalStyle}
                background: white !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                padding: 20px !important;
                font-family: 'Arial', sans-serif !important;
                line-height: 1.4 !important;
            `;
            
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: element.scrollWidth,
                height: element.scrollHeight,
                scrollX: 0,
                scrollY: 0
            });
            
            // Restore original styles
            element.style.cssText = originalStyle;
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 10; // 10mm top margin
            
            // Add first page
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20); // Account for margins
            
            // Add additional pages if content is longer than one page
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 10; // 10mm top margin for new page
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= (pdfHeight - 20);
            }
            
            pdf.save(`PAXAL-Manifest-${manifestData.shipmentId}-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/${shipmentId}/manifest`, {
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
            <div id="manifest-content" className="bg-white rounded-lg shadow-lg" style={{ padding: '40px', maxWidth: '210mm', margin: '0 auto', fontSize: '12px', lineHeight: '1.5' }}>
                {/* Professional Header */}
                <div className="text-center mb-10 pb-6 border-b-2 border-[#1F818C]">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-[#1F818C] rounded-full flex items-center justify-center mr-4">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#1F818C] tracking-wide">PAXAL LOGISTICS</div>
                            <div className="text-sm text-gray-600 mt-1">Professional Logistics Solutions</div>
                        </div>
                    </div>
                    <div className="text-2xl font-semibold text-gray-800 mb-2">SHIPMENT MANIFEST</div>
                    <div className="text-sm text-gray-600">
                        Document ID: MF-{manifestData.shipmentId} | Generated: {new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Package className="w-6 h-6 text-[#1F818C]" />
                            SHIPMENT OVERVIEW
                        </h2>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-[#1F818C]">{manifestData.shipmentId}</div>
                            <div className="text-sm text-gray-600">Shipment ID</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold text-blue-600">{manifestData.parcelCount}</div>
                            <div className="text-sm text-gray-600 font-medium">Total Parcels</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold text-green-600">{manifestData.totalWeight} kg</div>
                            <div className="text-sm text-gray-600 font-medium">Total Weight</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold text-purple-600">{manifestData.totalVolume || 'N/A'}</div>
                            <div className="text-sm text-gray-600 font-medium">Volume (m³)</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold text-orange-600">{manifestData.totalDistance || 'N/A'}</div>
                            <div className="text-sm text-gray-600 font-medium">Distance (km)</div>
                        </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="font-semibold text-gray-700">Delivery Type:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                manifestData.deliveryType === 'Express' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                                {manifestData.deliveryType}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="font-semibold text-gray-700">Status:</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                                {manifestData.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="font-semibold text-gray-700">Created:</span>
                            <span className="font-semibold text-gray-800">
                                {new Date(manifestData.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Vehicle Information */}
                {manifestData.assignedVehicle ? (
                    <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Truck className="w-6 h-6 text-[#1F818C]" />
                            ASSIGNED VEHICLE
                        </h2>
                        <div className="bg-white rounded-lg p-5 shadow-sm">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Vehicle Details */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                                        <Truck className="w-5 h-5 text-green-600" />
                                        Vehicle Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-700">Registration No:</span>
                                            <span className="px-3 py-2 bg-blue-600 text-white rounded-lg font-bold tracking-wider">
                                                {manifestData.assignedVehicle.registrationNo || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-700">Vehicle ID:</span>
                                            <span className="font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                                {manifestData.assignedVehicle.vehicleId || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-700">Vehicle Type:</span>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg font-semibold">
                                                {manifestData.assignedVehicle.vehicleType || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-700">Weight Capacity:</span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold">
                                                {manifestData.assignedVehicle.capableWeight || 'N/A'} kg
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-700">Volume Capacity:</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg font-bold">
                                                {manifestData.assignedVehicle.capableVolume || 'N/A'} m³
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Driver Information */}
                                {manifestData.assignedDriver && (
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                                            <User className="w-5 h-5 text-blue-600" />
                                            Driver Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-700">Driver Name:</span>
                                                <span className="font-bold text-gray-800">
                                                    {manifestData.assignedDriver.name || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-700">Contact Number:</span>
                                                <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                    {manifestData.assignedDriver.contactNo || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-700">License ID:</span>
                                                <span className="font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                                    {manifestData.assignedDriver.licenseId || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-700">Experience:</span>
                                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded font-semibold">
                                                    {manifestData.assignedDriver.experience || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Truck className="w-6 h-6 text-[#1F818C]" />
                            ASSIGNED VEHICLE
                        </h2>
                        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                            <div className="text-yellow-600 mb-4">
                                <Truck className="w-16 h-16 mx-auto opacity-60" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Vehicle Assigned</h3>
                            <p className="text-gray-600 font-medium mb-1">Vehicle assignment is pending</p>
                            <p className="text-sm text-gray-500">Vehicle will be assigned before dispatch</p>
                        </div>
                    </div>
                )}

                {/* Shipment Timeline */}
                <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-[#1F818C]" />
                        SHIPMENT TIMELINE
                    </h2>
                    <div className="space-y-4">
                        <div className="timeline-item bg-white rounded-lg p-5 shadow-sm border-l-4 border-blue-500">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-blue-800 text-lg">Shipment Created</div>
                                        <div className="text-sm text-blue-600 mt-1">Initial shipment created and parcels assigned</div>
                                        <div className="text-xs text-gray-500 mt-2">Status: Preparation Phase</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-blue-700 font-bold">
                                        {new Date(manifestData.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(manifestData.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {manifestData.assignedVehicle && (
                            <div className="timeline-item bg-white rounded-lg p-5 shadow-sm border-l-4 border-green-500">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-green-800 text-lg">Vehicle Assigned</div>
                                            <div className="text-sm text-green-600 mt-1">
                                                Vehicle {manifestData.assignedVehicle.registrationNo || manifestData.assignedVehicle.vehicleId} assigned
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                Driver: {manifestData.assignedDriver?.name || 'TBA'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-green-700 font-bold">
                                            {manifestData.vehicleAssignedAt ? new Date(manifestData.vehicleAssignedAt).toLocaleDateString() : 'Today'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {manifestData.vehicleAssignedAt ? new Date(manifestData.vehicleAssignedAt).toLocaleTimeString() : 'Current'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {manifestData.status === 'In Transit' && (
                            <div className="timeline-item bg-white rounded-lg p-5 shadow-sm border-l-4 border-yellow-500">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-yellow-800 text-lg">In Transit</div>
                                            <div className="text-sm text-yellow-600 mt-1">Shipment is currently on the road</div>
                                            <div className="text-xs text-gray-500 mt-2">Status: Active Transport</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-yellow-700 font-bold">
                                            {manifestData.transitStartedAt ? new Date(manifestData.transitStartedAt).toLocaleDateString() : 'Pending'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {manifestData.transitStartedAt ? new Date(manifestData.transitStartedAt).toLocaleTimeString() : 'TBA'}
                                        </div>
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
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Package className="w-6 h-6 text-[#1F818C]" />
                                PARCEL MANIFEST
                            </h2>
                            <div className="px-4 py-2 bg-[#1F818C] text-white rounded-lg font-bold">
                                {manifestData.parcels?.length || 0} Parcels
                            </div>
                        </div>
                        
                        {manifestData.parcels?.length > 0 ? (
                            <div className="space-y-6">
                                {manifestData.parcels.map((parcel, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden parcel-section">
                                        {/* Parcel Header */}
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                                        <span className="font-bold text-lg">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg">Parcel #{parcel.parcelId || `P${index + 1}`}</div>
                                                        <div className="text-sm opacity-90">Tracking: {parcel.trackingNo || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                        parcel.status === 'Delivered' ? 'bg-green-500 text-white' :
                                                        parcel.status === 'InTransit' ? 'bg-blue-500 text-white' :
                                                        parcel.status === 'PendingPickup' ? 'bg-yellow-500 text-white' :
                                                        'bg-gray-500 text-white'
                                                    }`}>
                                                        {parcel.status || 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Parcel Details Grid */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                {/* Basic Information */}
                                                <div className="space-y-4">
                                                    <h4 className="font-bold text-gray-800 text-lg border-b pb-2 text-[#1F818C]">
                                                        Parcel Details
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600 font-medium">Item Type:</span>
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold">
                                                                {parcel.itemType || 'General'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600 font-medium">Size:</span>
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded font-semibold">
                                                                {parcel.itemSize || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600 font-medium">Shipping Method:</span>
                                                            <span className="font-semibold text-gray-800">
                                                                {parcel.shippingMethod || 'Standard'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600 font-medium">Created Date:</span>
                                                            <span className="font-semibold text-gray-800">
                                                                {parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : 'N/A'}
                                                            </span>
                                                        </div>
                                                        {parcel.qrCodeNo && (
                                                            <div className="text-center pt-3 border-t">
                                                                <div className="text-sm text-gray-600 mb-2">QR Code</div>
                                                                <img 
                                                                    src={parcel.qrCodeNo} 
                                                                    alt="QR Code" 
                                                                    className="w-16 h-16 border border-gray-300 rounded mx-auto"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Sender Information */}
                                                <div className="space-y-4">
                                                    <h4 className="font-bold text-gray-800 text-lg border-b pb-2 text-[#1F818C]">
                                                        Sender Details
                                                    </h4>
                                                    <div className="bg-blue-50 rounded-lg p-4">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <div className="text-sm font-medium text-blue-700">Name</div>
                                                                <div className="font-semibold text-gray-800">
                                                                    {parcel.senderId?.name || 'N/A'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-blue-700">Email</div>
                                                                <div className="font-mono text-sm text-gray-700">
                                                                    {parcel.senderId?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-blue-700">Phone</div>
                                                                <div className="font-mono text-sm text-gray-700">
                                                                    {parcel.senderId?.phone || 'N/A'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-blue-700">Address</div>
                                                                <div className="text-sm text-gray-700">
                                                                    {parcel.senderId?.address || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Receiver Information */}
                                                <div className="space-y-4">
                                                    <h4 className="font-bold text-gray-800 text-lg border-b pb-2 text-[#1F818C]">
                                                        Receiver Details
                                                    </h4>
                                                    <div className="bg-green-50 rounded-lg p-4">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <div className="text-sm font-medium text-green-700">Name</div>
                                                                <div className="font-semibold text-gray-800">
                                                                    {parcel.receiverId?.name || 'N/A'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-green-700">Email</div>
                                                                <div className="font-mono text-sm text-gray-700">
                                                                    {parcel.receiverId?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-green-700">Phone</div>
                                                                <div className="font-mono text-sm text-gray-700">
                                                                    {parcel.receiverId?.phone || 'N/A'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-green-700">Address</div>
                                                                <div className="text-sm text-gray-700">
                                                                    {parcel.receiverId?.address || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Special Instructions */}
                                            {parcel.specialInstructions && (
                                                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <span className="text-white text-sm font-bold">!</span>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-yellow-800 text-sm">Special Instructions</div>
                                                            <div className="text-yellow-700 text-sm mt-1">
                                                                {parcel.specialInstructions}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                                <div className="text-gray-400 mb-4">
                                    <Package className="w-20 h-20 mx-auto opacity-60" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-600 mb-2">No Parcels Found</h3>
                                <p className="text-gray-500">No parcels are associated with this shipment.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Professional Footer */}
                <div className="mt-12 pt-8 border-t-2 border-gray-200 text-center">
                    <div className="bg-gradient-to-r from-[#1F818C] to-blue-600 text-white rounded-lg p-6">
                        <div className="text-lg font-bold mb-2">MANIFEST COMPLETE</div>
                        <p className="text-blue-100 text-sm mb-2">
                            This manifest was generated automatically by PAXAL Logistics System
                        </p>
                        <div className="text-xs text-blue-200">
                            Generated on {new Date().toLocaleString()} | For queries: support@paxal.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManifestPage;
