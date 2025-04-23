import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ParcelTablePage = () => {
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
    const [isAutoShipmentModalOpen, setIsAutoShipmentModalOpen] = useState(false);
    const [selectedParcels, setSelectedParcels] = useState([]);

    const navigate = useNavigate();

    // Fetch parcels on component mount
    useEffect(() => {
        fetchParcels();
    }, []);

    // Function to fetch parcels from API
    const fetchParcels = async () => {
        try {
            setLoading(true);
            // Replace with actual API endpoint
            const response = await fetch('/api/parcels');
            const data = await response.json();
            setParcels(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching parcels:', error);
            setLoading(false);
            // For demo purposes, set some example data
            setParcels([
                {
                    id: 1,
                    trackingNumber: 'PCL-12345',
                    sender: 'ABC Electronics',
                    recipient: 'John Smith',
                    destination: '123 Main St, Boston, MA',
                    weight: 2.5,
                    status: 'Received',
                    isSelected: false
                },
                {
                    id: 2,
                    trackingNumber: 'PCL-23456',
                    sender: 'Global Imports',
                    recipient: 'Jane Doe',
                    destination: '456 Oak Ave, Chicago, IL',
                    weight: 1.8,
                    status: 'Received',
                    isSelected: false
                },
                {
                    id: 3,
                    trackingNumber: 'PCL-34567',
                    sender: 'TechCorp',
                    recipient: 'Mike Johnson',
                    destination: '789 Pine Rd, San Francisco, CA',
                    weight: 3.2,
                    status: 'Received',
                    isSelected: false
                }
            ]);
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
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    // Apply search filter to parcels
    const filteredParcels = sortedParcels.filter(parcel =>
        parcel.id.toString().includes(searchTerm) ||
        parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Open the shipment modal
    const openShipmentModal = () => {
        if (selectedParcels.length === 0) {
            alert('Please select at least one parcel to create a shipment');
            return;
        }
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
        navigate('/manual-shipment', {
            state: { selectedParcels }
        });
        closeShipmentModal();
    };

    // Handle automatic shipment creation (standard or express)
    const createAutomaticShipment = async (type) => {
        try {
            // Make API call to create shipment
            const response = await fetch('/api/shipments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parcelIds: selectedParcels,
                    shipmentType: type, // 'standard' or 'express'
                    createdBy: 'automatic'
                }),
            });

            if (response.ok) {
               // const result = await response.json();
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} shipment created successfully!`);

                // Remove selected parcels from the table
                setParcels(parcels.filter(parcel => !selectedParcels.includes(parcel.id)));
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

    // Toggle parcel selection
    const toggleParcelSelection = (id) => {
        // Update parcels array with selection state
        setParcels(parcels.map(parcel =>
            parcel.id === id ? { ...parcel, isSelected: !parcel.isSelected } : parcel
        ));

        // Update selected parcels array
        if (selectedParcels.includes(id)) {
            setSelectedParcels(selectedParcels.filter(parcelId => parcelId !== id));
        } else {
            setSelectedParcels([...selectedParcels, id]);
        }
    };

    // Select all parcels
    const selectAllParcels = () => {
        const allParcelIds = parcels.map(parcel => parcel.id);
        if (selectedParcels.length === parcels.length) {
            // If all are selected, deselect all
            setParcels(parcels.map(parcel => ({ ...parcel, isSelected: false })));
            setSelectedParcels([]);
        } else {
            // Otherwise, select all
            setParcels(parcels.map(parcel => ({ ...parcel, isSelected: true })));
            setSelectedParcels(allParcelIds);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">All Parcels</h1>

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
                                            checked={selectedParcels.length === parcels.length && parcels.length > 0}
                                            onChange={selectAllParcels}
                                            className="h-4 w-4 text-[#1F818C] focus:ring-[#1F818C] border-gray-300 rounded"
                                        />
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('id')}
                                >
                                    ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('trackingNumber')}
                                >
                                    Tracking # {sortConfig.key === 'trackingNumber' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('sender')}
                                >
                                    Sender {sortConfig.key === 'sender' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('recipient')}
                                >
                                    Recipient {sortConfig.key === 'recipient' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('destination')}
                                >
                                    Destination {sortConfig.key === 'destination' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('weight')}
                                >
                                    Weight (kg) {sortConfig.key === 'weight' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('status')}
                                >
                                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredParcels.length > 0 ? (
                                filteredParcels.map(parcel => (
                                    <tr
                                        key={parcel.id}
                                        className={`hover:bg-gray-50 ${parcel.isSelected ? 'bg-cyan-50' : ''}`}
                                        onClick={() => toggleParcelSelection(parcel.id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={parcel.isSelected || false}
                                                onChange={() => { }} // Handled by the row click
                                                className="h-4 w-4 text-[#1F818C] focus:ring-[#1F818C] border-gray-300 rounded"
                                                onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parcel.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.trackingNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.sender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.recipient}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.destination}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.weight}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {parcel.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
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
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Shipment</h2>
                        <p className="mb-4 text-gray-600">
                            How would you like to create the shipment for {selectedParcels.length} selected parcel(s)?
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