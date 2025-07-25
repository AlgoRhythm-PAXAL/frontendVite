import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ParcelTablePage = () => {
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'parcelId', direction: 'ascending' });
    const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
    const [isAutoShipmentModalOpen, setIsAutoShipmentModalOpen] = useState(false);
    const [selectedParcels, setSelectedParcels] = useState([]);
    const [expandedParcelId, setExpandedParcelId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [staffInfo, setStaffInfo] = useState(null);

    const navigate = useNavigate();
    const showNotificationMessage = (message, type = 'success') => {
        if (type === 'success') {
            setSuccessMessage(message);
            setErrorMessage('');
        } else {
            setErrorMessage(message);
            setSuccessMessage('');
        }
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
            setSuccessMessage('');
            setErrorMessage('');
        }, 5000);
    };
    const fetchParcels = useCallback(async () => {
        try {
            setLoading(true);
            // Updated to use staff authentication endpoint
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/parcels/staff/assigned-parcels`, {
                method: 'GET',
                credentials: 'include', // Include cookies for staff authentication
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("API Response:", data);

            // Update staff info
            if (data.staffInfo) {
                setStaffInfo(data.staffInfo);
            }

            let parcelsArray;
            if (Array.isArray(data)) {
                parcelsArray = data;
            } else if (data && typeof data === 'object') {
                if (Array.isArray(data.parcels)) {
                    parcelsArray = data.parcels;
                } else if (Array.isArray(data.data)) {
                    parcelsArray = data.data;
                } else if (data._id) {
                    parcelsArray = [data];
                } else {
                    parcelsArray = Object.values(data).filter(item => item && typeof item === 'object');
                }
            } else {
                parcelsArray = [];
            }

            const filteredParcels = parcelsArray.filter(parcel => {
                if (!parcel.from || !parcel.to) {
                    return true;
                }
                const fromId = typeof parcel.from === 'object' ?
                    (parcel.from._id || parcel.from.toString()) :
                    parcel.from.toString();
                const toId = typeof parcel.to === 'object' ?
                    (parcel.to._id || parcel.to.toString()) :
                    parcel.to.toString();
                return fromId !== toId;
            });

            const parcelsWithSelection = filteredParcels.map(parcel => ({
                ...parcel,
                isSelected: false
            }));

            setParcels(parcelsWithSelection);
            setLoading(false);
            if (parcelsWithSelection.length > 0) {
                // Use a ref or state to track if this is initial load - for now, we'll skip the notification on fetch
                // showNotificationMessage(`Successfully loaded ${parcelsWithSelection.length} parcels`, 'success');
            }
        } catch (error) {
            console.error('Error fetching parcels:', error);
            setLoading(false);
            showNotificationMessage(`Failed to load parcels: ${error.message}`, 'error');
        }
    }, []);

    const handleRefresh = async () => {
        await fetchParcels();
        showNotificationMessage(`Successfully refreshed parcels`, 'success');
    };
    useEffect(() => {
        fetchParcels();
    }, [fetchParcels]);
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    const sortedParcels = [...parcels].sort((a, b) => {
        const getNestedProperty = (obj, path) => {
            const keys = path.split('.');
            return keys.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
        };
        const aValue = getNestedProperty(a, sortConfig.key) || '';
        const bValue = getNestedProperty(b, sortConfig.key) || '';
        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const filteredParcels = sortedParcels.filter(parcel => {
        const searchFields = [
            parcel.parcelId,
            parcel.trackingNo,
            parcel.status,
            parcel.shippingMethod,
            parcel.from?.location,
            parcel.to?.location,
            parcel.itemType,
            parcel.qrCodeNo,
            parcel.itemSize
        ];
        return searchFields.some(field =>
            field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleRowExpansion = (id, e) => {
        e.stopPropagation();
        setExpandedParcelId(expandedParcelId === id ? null : id);
    };

    const openShipmentModal = () => {

        setIsShipmentModalOpen(true);
    };

    const closeShipmentModal = () => {
        setIsShipmentModalOpen(false);
    };

    const openAutoShipmentModal = () => {
        setIsAutoShipmentModalOpen(true);
    };

    const closeAutoShipmentModal = () => {
        setIsAutoShipmentModalOpen(false);
    };

    const handleManualShipment = () => {
        navigate('/staff/shipment-management/manual-shipment-page');
        closeShipmentModal();
    };

    const createAutomaticShipment = async (type) => {
        try {
            if (selectedParcels.length === 0) {
                showNotificationMessage('Please select at least one parcel to proceed!', 'error');
                return;
            }

            // Validate shipping method compatibility
            const selectedParcelObjects = parcels.filter(parcel => selectedParcels.includes(parcel._id));
            const incompatibleParcels = selectedParcelObjects.filter(parcel => 
                parcel.shippingMethod?.toLowerCase() !== type.toLowerCase()
            );

            if (incompatibleParcels.length > 0) {
                const incompatibleCount = incompatibleParcels.length;
                const incompatibleMethod = incompatibleParcels[0].shippingMethod;
                showNotificationMessage(
                    `Cannot create ${type} shipment! ${incompatibleCount} selected parcel(s) have "${incompatibleMethod}" shipping method. Please select only parcels with "${type}" shipping method.`,
                    'error'
                );
                return;
            }
            
            setLoading(true);
            
            // Use staff's branch ID instead of hardcoded value
            const branchId = staffInfo?.branchId || '682e1059ce33c2a891c9b168'; // fallback for backward compatibility
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/process/${type}/${branchId}`, {
                method: 'POST',
                credentials: 'include', // Include cookies for authentication
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parcelIds: selectedParcels
                }),
            });

            if (response.ok) {
                await response.json(); 
                showNotificationMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} shipment created successfully!`, 'success');
                setParcels(parcels.filter(parcel => !selectedParcels.includes(parcel._id)));
                setSelectedParcels([]);
            } else {
                const errorData = await response.json();
                showNotificationMessage(`Failed to create shipment: ${errorData.message || 'Please try again.'}`, 'error');
            }
        } catch (error) {
            console.error('Error creating shipment:', error);
            showNotificationMessage(`An error occurred while creating the shipment: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
        closeAutoShipmentModal();
        closeShipmentModal();
    };    const toggleParcelSelection = (id, e) => {
        e.stopPropagation();

        setParcels(parcels.map(parcel =>
            parcel._id === id ? { ...parcel, isSelected: !parcel.isSelected } : parcel
        ));

        setSelectedParcels(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(parcelId => parcelId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const selectAllParcels = (e) => {
        e.stopPropagation();
        const allSelected = parcels.every(parcel => parcel.isSelected);
        setParcels(parcels.map(parcel => ({
            ...parcel,
            isSelected: !allSelected
        })));
        if (allSelected) {
            setSelectedParcels([]);
        } else {
            setSelectedParcels(parcels.map(parcel => parcel._id));
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Notification will be positioned relative to modals when they're open */}
            {showNotification && !isShipmentModalOpen && !isAutoShipmentModalOpen && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out ${successMessage
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
                                {successMessage || errorMessage}
                            </p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => {
                                    setShowNotification(false);
                                    setSuccessMessage('');
                                    setErrorMessage('');
                                }}
                                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${successMessage
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

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search by parcel ID, status, or center..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                    />
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </div>
                        ) : (
                            'Refresh'
                        )}
                    </button>
                </div>

                <button
                    onClick={openShipmentModal}
                    className="px-6 py-3 bg-[#1F818C] text-white rounded-md hover:bg-[#176872] focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600 font-medium"
                >
                    Create Shipment for Selected Parcels
                </button>
            </div>
            <div className="text-sm text-gray-600 mb-2">
                Showing {filteredParcels.length} of {parcels.length} parcels | Selected: {selectedParcels.length}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg font-medium text-gray-500">Loading parcels...</div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={parcels.length > 0 && parcels.every(parcel => parcel.isSelected)}
                                            onChange={selectAllParcels}
                                            className="h-4 w-4 text-[#1F818C] focus:ring-[#1F818C] border-gray-300 rounded"
                                        />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('parcelId')}
                                >
                                    Parcel ID {sortConfig.key === 'parcelId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('trackingNo')}
                                >
                                    Tracking # {sortConfig.key === 'trackingNo' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('itemType')}
                                >
                                    Item Type {sortConfig.key === 'itemType' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('from.location')}
                                >
                                    From Branch {sortConfig.key === 'from.location' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('to.location')}
                                >
                                    To Branch {sortConfig.key === 'to.location' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('shippingMethod')}
                                >
                                    Shipping Method {sortConfig.key === 'shippingMethod' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('status')}
                                >
                                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredParcels.length > 0 ? (
                                filteredParcels.map(parcel => (
                                    <>
                                        <tr
                                            key={parcel._id}
                                            className={`hover:bg-gray-50 cursor-pointer ${parcel.isSelected ? 'bg-cyan-50' : ''}`}
                                            onClick={(e) => {
                                                // Only trigger selection if not clicking on checkbox or action buttons
                                                if (!e.target.closest('input[type="checkbox"]') && !e.target.closest('button')) {
                                                    toggleParcelSelection(parcel._id, e);
                                                }
                                            }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={parcel.isSelected || false}
                                                    onChange={(e) => toggleParcelSelection(parcel._id, e)}
                                                    className="h-4 w-4 text-[#1F818C] focus:ring-[#1F818C] border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parcel.parcelId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.trackingNo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.itemType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.from?.location || 'Unknown Branch'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.to?.location || 'Unknown Branch'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${parcel.shippingMethod?.toLowerCase() === 'standard' ? 'bg-blue-100 text-blue-800' :
                                                        parcel.shippingMethod?.toLowerCase() === 'express' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                    {parcel.shippingMethod}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${parcel.status === 'InTransit' ? 'bg-blue-100 text-blue-800' :
                                                        parcel.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                            parcel.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                    {parcel.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button
                                                    onClick={(e) => toggleRowExpansion(parcel._id, e)}
                                                    className="text-[#1F818C] hover:text-[#176872] focus:outline-none focus:underline flex items-center"
                                                >
                                                    View More
                                                    {expandedParcelId === parcel._id ?
                                                        <ChevronUp className="ml-1 w-4 h-4" /> :
                                                        <ChevronDown className="ml-1 w-4 h-4" />
                                                    }
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedParcelId === parcel._id && (
                                            <tr className="bg-gray-50">
                                                <td colSpan="9" className="p-0">
                                                    <div className="rounded-lg shadow-inner bg-white m-2 p-6 border border-gray-200">


                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            {/* Package Details */}
                                                            <div className="bg-gray-50 rounded-lg p-4">
                                                                <div className="flex items-center mb-3">
                                                                    <h4 className="font-semibold text-gray-800">Package Details</h4>
                                                                </div>
                                                                <div className="space-y-2 ml-7">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Item Size:</span>
                                                                        <span className="font-medium text-gray-800">{parcel.itemSize}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Special Instructions:</span>
                                                                        <span className="font-medium text-gray-800">{parcel.specialInstructions || 'None'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* QR Code Image */}
                                                            <div className="bg-gray-50 rounded-lg p-4">
                                                                <div className="flex items-center mb-3">
                                                                    <h4 className="font-semibold text-gray-800">QR Code Image</h4>
                                                                </div>
                                                                <div className="flex justify-center">
                                                                    {parcel.qrCodeNo && parcel.qrCodeNo.startsWith('data:image') ? (
                                                                        <img
                                                                            src={parcel.qrCodeNo}
                                                                            alt={`QR Code for parcel ${parcel.parcelId}`}
                                                                            className="w-32 h-32 object-contain border border-gray-300 rounded-lg shadow-sm"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                                                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-500 text-center mt-2">
                                                                    Parcel ID: {parcel.parcelId}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                                                            <div className="bg-gray-50 rounded-lg p-4">
                                                                <div className="flex items-center mb-3">

                                                                    <h4 className="font-semibold text-gray-800">Delivery Details</h4>
                                                                </div>
                                                                <div className="space-y-2 ml-7">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Submitting Type:</span>
                                                                        <span className="font-medium text-gray-800">{parcel.submittingType}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Receiving Type:</span>
                                                                        <span className="font-medium text-gray-800">{parcel.receivingType}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Pickup Address:</span>
                                                                        <span className="font-medium text-gray-800">{parcel.pickupInformation?.address}, {parcel.pickupInformation?.city}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Delivery Address:</span>
                                                                        <span className="font-medium text-gray-800">{parcel.deliveryInformation?.deliveryAddress}, {parcel.deliveryInformation?.deliveryCity}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Additional Parcel Information */}
                                                            <div className="bg-gray-50 rounded-lg p-4">
                                                                <div className="flex items-center mb-3">
                                                                    <h4 className="font-semibold text-gray-800">Additional Information</h4>
                                                                </div>
                                                                <div className="space-y-2 ml-7">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Tracking Number:</span>
                                                                        <span className="font-medium text-gray-800">{parcel.trackingNo || 'Not assigned'}</span>
                                                                    </div>
                                                                    
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Item Type:</span>
                                                                        <span className="font-medium text-gray-800">{parcel.itemType}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Status:</span>
                                                                        <span className={`font-medium px-2 py-1 rounded-full text-xs ${parcel.status === 'InTransit' ? 'bg-blue-100 text-blue-800' :
                                                                                parcel.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                                    parcel.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                                        'bg-gray-100 text-gray-800'
                                                                            }`}>
                                                                            {parcel.status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        No parcels found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {isShipmentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto relative">
                        {/* Notification at top of modal */}
                        {showNotification && (
                            <div className={`mb-4 p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out ${successMessage
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
                                            {successMessage || errorMessage}
                                        </p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <button
                                            onClick={() => {
                                                setShowNotification(false);
                                                setSuccessMessage('');
                                                setErrorMessage('');
                                            }}
                                            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${successMessage
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

                        {/* Close button */}
                        <button
                            onClick={closeShipmentModal}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center pr-8">Create B2B Shipment</h2>
                        <p className="mb-6 text-gray-600 text-center">
                            Choose your preferred method to create a shipment for the selected {selectedParcels.length} parcel(s):
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* PAXAL Enhanced Shipment Page */}
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
                                onClick={handleManualShipment}>
                                <div className="text-blue-600 mb-4 text-center">
                                    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">PAXAL Manual Shipment Creation</h3>
                                <div className="text-blue-700 text-sm">
                                    <p className="mb-3">Advanced manual shipment creation with full control:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>Customize routes and destinations</li>
                                        <li>Smart arrival time calculations</li>
                                        <li>Real-time capacity monitoring</li>
                                        <li>Advanced parcel filtering & selection</li>
                                        <li>Complete shipment customization</li>
                                    </ul>
                                </div>
                            </div>

                            {/* PAXAL Smart Algorithm */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer"
                                onClick={openAutoShipmentModal}>
                                <div className="text-green-600 mb-4 text-center">
                                    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-3 text-center">PAXAL Smart Shipment Creation</h3>
                                <div className="text-green-700 text-sm">
                                    <p className="mb-3">Automated shipment creation with alogrithm:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                               
                                        <li>Automatic capacity management</li>
                                        <li>Smart parcel grouping by destination</li>
                                        <li>Optimal route selection</li>
                                        <li>Time-efficient processing</li>
                                        <li>Zero manual configuration required</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={closeShipmentModal}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-500 font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAutoShipmentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
                        {/* Notification at top of modal */}
                        {showNotification && (
                            <div className={`mb-4 p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out ${successMessage
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
                                            {successMessage || errorMessage}
                                        </p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <button
                                            onClick={() => {
                                                setShowNotification(false);
                                                setSuccessMessage('');
                                                setErrorMessage('');
                                            }}
                                            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${successMessage
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

                        {/* Close button */}
                        <button
                            onClick={closeAutoShipmentModal}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center pr-8">Select Shipment Type</h2>
                        <p className="mb-6 text-gray-600 text-center">
                            Choose the type of shipment based on your delivery requirements and constraints:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Standard Shipment */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer transform hover:scale-105"
                                onClick={() => createAutomaticShipment('standard')}>
                                <div className="text-blue-600 mb-4 text-center">
                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">Standard Shipment</h3>

                                {/* Constraints */}
                                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                                    <h4 className="font-semibold text-blue-800 mb-2 text-center text-sm">Capacity Constraints</h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs text-blue-700">
                                        <div className="text-center">
                                            <div className="font-bold text-base">2 500kg</div>
                                            <div>Maximum Weight</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-base">10m³</div>
                                            <div>Maximum Volume</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-base">300km</div>
                                            <div>Maximum Route Length</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-base">72h</div>
                                            <div>Maximum Shipment Time</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Buffers */}
                                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                                    <h4 className="font-semibold text-blue-800 mb-2 text-center text-sm">Time Buffers</h4>
                                    <div className="grid grid-cols-3 gap-2 text-xs text-blue-700">
                                        <div className="text-center">
                                            <div className="font-bold text-sm">2h</div>
                                            <div className="text-xs">Source Prep</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-sm">2h</div>
                                            <div className="text-xs">Intermediate</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-sm">2h</div>
                                            <div className="text-xs">End Final</div>
                                        </div>
                                    </div>
                                </div>

                                
                            </div>

                            {/* Express Shipment */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 cursor-pointer transform hover:scale-105"
                                onClick={() => createAutomaticShipment('express')}>
                                <div className="text-purple-600 mb-4 text-center">
                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-purple-800 mb-3 text-center">Express Shipment</h3>

                                {/* Constraints */}
                                <div className="bg-purple-50 rounded-lg p-3 mb-3">
                                    <h4 className="font-semibold text-purple-800 mb-2 text-center text-sm">Capacity Constraints</h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs text-purple-700">
                                        <div className="text-center">
                                            <div className="font-bold text-base">1 000kg</div>
                                            <div>Maximum Weight</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-base">5m³</div>
                                            <div>Maximum Volume</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-base">150km</div>
                                            <div>Maximum Route Length</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-base">24h</div>
                                            <div>Maximum Shipment Time</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Buffers */}
                                <div className="bg-purple-50 rounded-lg p-3 mb-3">
                                    <h4 className="font-semibold text-purple-800 mb-2 text-center text-sm">Time Buffers</h4>
                                    <div className="grid grid-cols-3 gap-2 text-xs text-purple-700">
                                        <div className="text-center">
                                            <div className="font-bold text-sm">2h</div>
                                            <div className="text-xs">Source Prep</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-sm">1h</div>
                                            <div className="text-xs">Intermediate</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-sm">2h</div>
                                            <div className="text-xs">End Final</div>
                                        </div>
                                    </div>
                                </div>

                               
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={closeAutoShipmentModal}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-500 font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParcelTablePage;