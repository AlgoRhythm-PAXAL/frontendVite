import { useState, useEffect } from 'react';
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

    const navigate = useNavigate();

    // Fetch parcels on component mount
    useEffect(() => {
        fetchParcels();
    }, []);

    // Function to fetch parcels from API
    // Function to fetch parcels from API
    const fetchParcels = async () => {
        try {
            setLoading(true);
            // Replace with actual API endpoint
            const response = await fetch('http://localhost:8000/parcels/67c41df8c2ca1289195def43');
            const data = await response.json();

            // Check what type of data we received
            console.log("API Response:", data);

            // Handle different response formats
            let parcelsArray;
            if (Array.isArray(data)) {
                // If data is already an array
                parcelsArray = data;
            } else if (data && typeof data === 'object') {
                // If data is an object that might contain parcels array
                // Check common response structures
                if (Array.isArray(data.parcels)) {
                    parcelsArray = data.parcels;
                } else if (Array.isArray(data.data)) {
                    parcelsArray = data.data;
                } else if (data._id) {
                    // If it's a single parcel object
                    parcelsArray = [data];
                } else {
                    // Last resort - try to convert object values to array
                    parcelsArray = Object.values(data).filter(item => item && typeof item === 'object');
                }
            } else {
                // Fallback to empty array if nothing works
                parcelsArray = [];
            }

            // Add isSelected property to each parcel
            const parcelsWithSelection = parcelsArray.map(parcel => ({
                ...parcel,
                isSelected: false
            }));

            setParcels(parcelsWithSelection);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching parcels:', error);
            setLoading(false);
        }
    };

    // Function to handle table sorting
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Apply sorting to parcels array
    const sortedParcels = [...parcels].sort((a, b) => {
        // Handle nested properties with dot notation
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

    // Apply search filter to parcels
    const filteredParcels = sortedParcels.filter(parcel => {
        const searchFields = [
            parcel.parcelId,
            parcel.trackingNo,
            parcel.status,
            parcel.shippingMethod,
            parcel.pickupInformation?.city,
            parcel.deliveryInformation?.deliveryCity,
            parcel.itemType
        ];

        return searchFields.some(field =>
            field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Toggle row expansion
    const toggleRowExpansion = (id, e) => {
        e.stopPropagation(); // Prevent this from triggering the row selection
        setExpandedParcelId(expandedParcelId === id ? null : id);
    };

    // Open the shipment modal
    const openShipmentModal = () => {
        
        setIsShipmentModalOpen(true);
    };

    // Close the shipment modal
    const closeShipmentModal = () => {
        setIsShipmentModalOpen(false);
    };

    // Open the auto shipment type selection modal
    const openAutoShipmentModal = () => {
        setIsAutoShipmentModalOpen(true);
    };

    // Close the auto shipment type selection modal
    const closeAutoShipmentModal = () => {
        setIsAutoShipmentModalOpen(false);
    };

    // Handle manual shipment creation
    const handleManualShipment = () => {
        // Navigate to manual shipment page with selected parcel IDs
        navigate('/staff/shipment-management/manual-shipment-page');
        closeShipmentModal();
    };

    // Handle automatic shipment creation (standard or express)
    const createAutomaticShipment = async (type) => {
        try {
            // Make API call to create shipment
            const response = await fetch(`http://localhost:8000/shipments/process/${type}/67c41df8c2ca1289195def43`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parcelIds: selectedParcels
                }),
            });

            if (response.ok) {
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} shipment created successfully!`);

                // Remove selected parcels from the table
                setParcels(parcels.filter(parcel => !selectedParcels.includes(parcel._id)));
                setSelectedParcels([]);
            } else {
                alert('Failed to create shipment. Please try again.');
            }
        } catch (error) {
            console.error('Error creating shipment:', error);
            alert('An error occurred while creating the shipment');
        }

        closeAutoShipmentModal();
        closeShipmentModal();
    };

    // Toggle parcel selection - fixed implementation
    const toggleParcelSelection = (id, e) => {
        e.stopPropagation(); // This prevents the row click from handling the event

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

    // Select all parcels - fixed implementation
    const selectAllParcels = (e) => {
        e.stopPropagation(); // Prevent event propagation

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
           

            {/* Controls Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search parcels..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                    />
                    <button
                        onClick={fetchParcels}
                        className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-500"
                    >
                        Refresh
                    </button>
                </div>

                <button
                    onClick={openShipmentModal}
                    className="px-4 py-2 bg-[#1F818C] text-white rounded-md hover:bg-[#176872] focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                >
                    Make Shipment
                </button>
            </div>

            {/* Table Statistics */}
            <div className="text-sm text-gray-600 mb-2">
                Showing {filteredParcels.length} of {parcels.length} parcels | Selected: {selectedParcels.length}
            </div>

            {/* Parcels Table */}
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
                                    onClick={() => handleSort('pickupInformation.city')}
                                >
                                    From {sortConfig.key === 'pickupInformation.city' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('deliveryInformation.deliveryCity')}
                                >
                                    To {sortConfig.key === 'deliveryInformation.deliveryCity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.pickupInformation?.city}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.deliveryInformation?.deliveryCity}</td>
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
                                                <td colSpan="9" className="px-6 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-medium text-gray-700 mb-2">Package Details</h4>
                                                            <p><span className="font-medium">QR Code:</span> {parcel.qrCodeNo}</p>
                                                            <p><span className="font-medium">Item Size:</span> {parcel.itemSize}</p>
                                                            <p><span className="font-medium">Special Instructions:</span> {parcel.specialInstructions || 'None'}</p>
                                                           
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-700 mb-2">Delivery Details</h4>
                                                            <p><span className="font-medium">Submitting Type:</span> {parcel.submittingType}</p>
                                                            <p><span className="font-medium">Receiving Type:</span> {parcel.receivingType}</p>
                                                            <p><span className="font-medium">Pickup Address:</span> {parcel.pickupInformation?.address}, {parcel.pickupInformation?.city}</p>
                                                            <p><span className="font-medium">Delivery Address:</span> {parcel.deliveryInformation?.deliveryAddress}, {parcel.deliveryInformation?.deliveryCity}</p>
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

            {/* Shipment Creation Modal */}
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

            {/* Auto Shipment Type Selection Modal */}
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