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
            const response = await fetch('http://localhost:8000/parcels/682e1059ce33c2a891c9b168');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("API Response:", data);
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
            setLoading(true);
            const response = await fetch(`http://localhost:8000/shipments/process/${type}/682e1059ce33c2a891c9b168`, {
                method: 'POST',
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
    };

    const toggleParcelSelection = (id, e) => {
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
                    className="px-4 py-2 bg-[#1F818C] text-white rounded-md hover:bg-[#176872] focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                >
                    Make Shipment
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
                                            className={`hover:bg-gray-50 ${parcel.isSelected ? 'bg-cyan-50' : ''}`}
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.shippingMethod}</td>
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
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-lg font-semibold text-blue-700">Parcel #{parcel.qrCodeNo}</h3>

                                                        </div>

                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            {/* Package Details */}
                                                            <div className="bg-gray-50 rounded-lg p-4">
                                                                <div className="flex items-center mb-3">

                                                                    <h4 className="font-semibold text-gray-800">Package Details</h4>
                                                                </div>
                                                                <div className="space-y-2 ml-7">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">QR Code:</span>
                                                                        <span className="font-medium text-gray-800">{parcel.qrCodeNo}</span>
                                                                    </div>
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

                                                            {/* Delivery Details */}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create B2B Shipment</h2>
                        <p className="mb-4 text-gray-600">
                            How would you like to create the shipment for selected parcel(s)?
                        </p>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleManualShipment}
                                className="px-4 py-2 bg-[#1F818C] text-white rounded-md hover:bg-[#176872] focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                            >
                                Create Manually
                            </button>

                            <button
                                onClick={openAutoShipmentModal}
                                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-500"
                            >
                                Create Automatically
                            </button>

                            <button
                                onClick={closeShipmentModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAutoShipmentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Shipment Type</h2>
                        <p className="mb-4 text-gray-600">
                            What type of automatic shipment would you like to create?
                        </p>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => createAutomaticShipment('standard')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500"
                            >
                                Standard Shipment
                            </button>

                            <button
                                onClick={() => createAutomaticShipment('express')}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-purple-500"
                            >
                                Express Shipment
                            </button>

                            <button
                                onClick={closeAutoShipmentModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-300"
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