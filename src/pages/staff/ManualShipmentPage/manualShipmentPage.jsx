import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const B2BShipmentCreationPage = () => {


    const navigate = useNavigate();

    // States
    const [parcels, setParcels] = useState([]);
    const [filteredParcels, setFilteredParcels] = useState([]);
    const [selectedParcels, setSelectedParcels] = useState([]);
    const [shipmentParcels, setShipmentParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
      
        to: '',
        size: '',
        itemType: '',
        shippingMethod: ''
    });
    const [shipmentData, setShipmentData] = useState({
        deliveryType: 'standard',
        sourceCenter: '',
        status: 'Pending',
        notes: ''
    });
    const [branches, setBranches] = useState([]);
    const [routeCalculated, setRouteCalculated] = useState(false);
    const [arrivalCalculated, setArrivalCalculated] = useState(false);
    const [routeInfo, setRouteInfo] = useState({
        route: [],
        totalDistance: 0,
        totalTime: 0,
        arrivalTimes: []
    });
    const [shipmentSummary, setShipmentSummary] = useState({
        weight: 0,
        volume: 0,
        count: 0
    });

    // Fetch data on component mount
    useEffect(() => {
        fetchUnassignedParcels();
        fetchBranches();
    }, []);

    // Update filtered parcels when parcels or filters change
    useEffect(() => {
        filterParcels();
    }, [parcels, filters]);

    // Fetch all parcels that are not assigned to a shipment
    const fetchUnassignedParcels = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/parcels/67c41df8c2ca1289195def43');

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const parcelArray = Array.isArray(data.parcels) ? data.parcels : Object.values(data.parcels);

            setParcels(parcelArray);
            setFilteredParcels(parcelArray);
        } catch (err) {
            console.error('Error fetching unassigned parcels:', err);
            setError('Failed to load parcels. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch all branches for dropdown selections
    const fetchBranches = async () => {
        try {
            const response = await fetch('http://localhost:8000/branches/all-branches');
            const data = await response.json();
            console.log('Branches data:', data); // Debugging line
            const branchArray = Array.isArray(data.branches) ? data.branches : Object.values(data.branches);
            setBranches(branchArray);
        } catch (err) {
            console.error('Error fetching branches:', err);
        }
    };

    // Filter parcels based on selected filters
    const filterParcels = () => {
        let filtered = [...parcels];

        

        if (filters.to) {
            filtered = filtered.filter(parcel =>
                parcel.to === filters.to
            );
        }

        if (filters.size) {
            filtered = filtered.filter(parcel => parcel.itemSize === filters.size);
        }

        if (filters.itemType) {
            filtered = filtered.filter(parcel => parcel.itemType === filters.itemType);
        }

        if (filters.shippingMethod) {
            filtered = filtered.filter(parcel => parcel.shippingMethod === filters.shippingMethod);
        }

        setFilteredParcels(filtered);
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            
            to: '',
            size: '',
            itemType: '',
            shippingMethod: ''
        });
    };

    // Handle shipment data input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShipmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Toggle parcel selection
    const toggleParcelSelection = (parcelId) => {
        setSelectedParcels(prev => {
            if (prev.includes(parcelId)) {
                return prev.filter(id => id !== parcelId);
            } else {
                return [...prev, parcelId];
            }
        });
    };

    // Add selected parcels to shipment
    const addToShipment = async () => {
        if (selectedParcels.length === 0) {
            alert('Please select at least one parcel to add to shipment');
            return;
        }

        try {
            const selectedParcelObjects = parcels.filter(parcel =>
                selectedParcels.includes(parcel._id)
            );

            // Update shipment parcels
            setShipmentParcels(prev => [...prev, ...selectedParcelObjects]);

            // Calculate shipment summary
            const totalWeight = selectedParcelObjects.reduce(
                (sum, parcel) => sum + parseFloat(parcel.weight || 0), 0
            ) + shipmentSummary.weight;

            const totalVolume = selectedParcelObjects.reduce(
                (sum, parcel) => sum + parseFloat(parcel.volume || 0), 0
            ) + shipmentSummary.volume;

            const totalCount = selectedParcels.length + shipmentSummary.count;

            // Update shipment summary
            setShipmentSummary({
                weight: parseFloat(totalWeight.toFixed(2)),
                volume: parseFloat(totalVolume.toFixed(2)),
                count: totalCount
            });

            // Clear selected parcels
            setSelectedParcels([]);

            // Remove added parcels from the list of available parcels
            setParcels(prev => prev.filter(parcel => !selectedParcels.includes(parcel._id)));

            // //update shipment details in backend
            // const response = await fetch('http://localhost:8000/api/shipments/update-details', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         parcels: selectedParcels,
            //         totalWeight,
            //         totalVolume,
            //         parcelCount: totalCount
            //     })
            // });
        } catch (err) {
            console.error('Error adding parcels to shipment:', err);
            alert('Failed to add parcels to shipment');
        }
    };

    // Calculate best route
    const calculateBestRoute = async () => {
        if (shipmentParcels.length === 0) {
            alert('Please add at least one parcel to shipment to calculate route');
            return;
        }

        if (!shipmentData.sourceCenter) {
            alert('Please select a source center');
            return;
        }

        setLoading(true);

        try {
            // Get IDs of parcels in shipment
            const parcelIds = shipmentParcels.map(parcel => parcel._id);

            const response = await fetch('http://localhost:8000/api/shipments/calculate-route', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parcelIds,
                    sourceCenter: shipmentData.sourceCenter,
                    deliveryType: shipmentData.deliveryType
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to calculate route');
            }

            const routeData = await response.json();
            setRouteInfo({
                ...routeData,
                arrivalTimes: [] // Clear arrival times when route changes
            });
            setRouteCalculated(true);
            setArrivalCalculated(false);
        } catch (err) {
            console.error('Error calculating route:', err);
            alert(`Failed to calculate route: ${err.message}`);

    
        } finally {
            setLoading(false);
        }
    };

    // Calculate arrival times
    const calculateArrivalTimes = async () => {
        if (!routeCalculated) {
            alert('Please calculate the route first');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/shipments/calculate-arrival-times', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    route: routeInfo.route,
                    totalDistance: routeInfo.totalDistance,
                    deliveryType: shipmentData.deliveryType
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to calculate arrival times');
            }

            const arrivalData = await response.json();
            setRouteInfo(prev => ({
                ...prev,
                totalTime: arrivalData.totalTime || prev.totalTime,
                arrivalTimes: arrivalData.arrivalTimes || []
            }));
            setArrivalCalculated(true);
        } catch (err) {
            console.error('Error calculating arrival times:', err);
            alert(`Failed to calculate arrival times: ${err.message}`);

            
        } finally {
            setLoading(false);
        }
    };

    // Create shipment
    const createShipment = async () => {
        if (shipmentParcels.length === 0) {
            alert('Please add at least one parcel to shipment');
            return;
        }

        if (!routeCalculated || !arrivalCalculated) {
            alert('Please calculate route and arrival times before creating shipment');
            return;
        }

        setLoading(true);

        try {
            const parcelIds = shipmentParcels.map(parcel => parcel._id);

            const response = await fetch('http://localhost:8000/api/shipments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parcels: parcelIds,
                    deliveryType: shipmentData.deliveryType,
                    sourceCenter: shipmentData.sourceCenter,
                    route: routeInfo.route,
                    totalTime: routeInfo.totalTime,
                    arrivalTimes: routeInfo.arrivalTimes,
                    totalDistance: routeInfo.totalDistance,
                    totalWeight: shipmentSummary.weight,
                    totalVolume: shipmentSummary.volume,
                    parcelCount: shipmentSummary.count,
                    status: shipmentData.status,
                    notes: shipmentData.notes
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create shipment');
            }

            const result = await response.json();
            alert('Shipment created successfully!');

            // Navigate back to shipment management
            navigate('/staff/shipment-management/parcel-table-page');

        } catch (err) {
            console.error('Error creating shipment:', err);
            alert(`Failed to create shipment: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Get branch name by ID
    const getBranchName = (branchId,line) => {
        const branch = branches.find(b => b._id === branchId);
        console.log('Branch ID:', branchId, 'Branch:', branch, 'Line',line); // Debugging line
        return branch ? branch.location : 'Unknown';
    };




    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Create B2B Shipment Manually</h1>

            {/* Back button */}
            <button
                onClick={() => navigate('/staff/shipment-management/parcel-table-page')}
                className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Shipment Management
            </button>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg flex items-center">
                        <svg className="animate-spin h-6 w-6 mr-3 text-[#1F818C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Filters and Shipment Details */}
                <div className="lg:col-span-1">
                    {/* Filters Card */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>

                    
                        {/* To Location Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To Location
                            </label>
                            <select
                                name="to"
                                value={filters.to}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1F818C] focus:border-[#1F818C]"
                            >
                                <option value="">All Destinations</option>
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Size Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Size
                            </label>
                            <select
                                name="size"
                                value={filters.size}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1F818C] focus:border-[#1F818C]"
                            >
                                <option value="">All Sizes</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>

                        {/* Item Type Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Item Type
                            </label>
                            <select
                                name="itemType"
                                value={filters.itemType}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1F818C] focus:border-[#1F818C]"
                            >
                                <option value="">All Types</option>
                                <option value="Document">Document</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Food">Food</option>
                                <option value="Glass">Glass</option>
                                <option value="Flowers">Flowers</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Shipping Method Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shipping Method
                            </label>
                            <select
                                name="shippingMethod"
                                value={filters.shippingMethod}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1F818C] focus:border-[#1F818C]"
                            >
                                <option value="">All Methods</option>
                                <option value="standard">Standard</option>
                                <option value="express">Express</option>
                            </select>
                        </div>

                        {/* Reset Filters Button */}
                        <button
                            onClick={resetFilters}
                            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Reset Filters
                        </button>
                    </div>

                    {/* Shipment Details Card */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipment Details</h2>

                        {/* Source Center */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Source Center
                            </label>
                            <select
                                name="sourceCenter"
                                value={shipmentData.sourceCenter}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1F818C] focus:border-[#1F818C]"
                                required
                            >
                                <option value="">Select Source Center</option>
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Delivery Type */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Type
                            </label>
                            <select
                                name="deliveryType"
                                value={shipmentData.deliveryType}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1F818C] focus:border-[#1F818C]"
                            >
                                <option value="standard">Standard</option>
                                <option value="express">Express</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={shipmentData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1F818C] focus:border-[#1F818C]"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Verified">Verified</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={shipmentData.notes}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1F818C] focus:border-[#1F818C]"
                                placeholder="Add any special handling instructions..."
                            ></textarea>
                        </div>

                        {/* Summary */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <div className="text-sm font-medium">Shipment Summary</div>
                            <div className="text-sm mt-1">Selected Parcels: {shipmentSummary.count}</div>
                            <div className="text-sm">Total Weight: {shipmentSummary.weight} kg</div>
                            <div className="text-sm">Total Volume: {shipmentSummary.volume} m³</div>
                        </div>

                        {/* Calculate Route Button */}
                        <button
                            onClick={calculateBestRoute}
                            className="w-full px-4 py-2 mb-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={shipmentParcels.length === 0}
                        >
                            Calculate Best Route
                        </button>

                        {/* Calculate Arrival Times Button */}
                        <button
                            onClick={calculateArrivalTimes}
                            className="w-full px-4 py-2 mb-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                            disabled={!routeCalculated}
                        >
                            Calculate Arrival Times
                        </button>

                        {/* Create Shipment Button */}
                        <button
                            onClick={createShipment}
                            className="w-full px-4 py-2 bg-[#1F818C] text-white rounded-md hover:bg-[#176872]"
                            disabled={!routeCalculated || !arrivalCalculated}
                        >
                            Create Shipment
                        </button>
                    </div>
                </div>

                {/* Right Panel - Parcels Table and Route Info */}
                <div className="lg:col-span-2">
                    {/* Route Information Card (shown only when route is calculated) */}
                    {routeCalculated && (
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Route Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="text-sm font-medium text-gray-700">Total Distance</div>
                                    <div className="text-lg font-semibold">{routeInfo.totalDistance.toFixed(2)} km</div>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="text-sm font-medium text-gray-700">Total Time</div>
                                    <div className="text-lg font-semibold">
                                        {routeInfo.totalTime ? `${Math.floor(routeInfo.totalTime / 60)}h ${routeInfo.totalTime % 60}m` : 'Not calculated'}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="text-sm font-medium text-gray-700">Number of Stops</div>
                                    <div className="text-lg font-semibold">{routeInfo.route.length}</div>
                                </div>
                            </div>

                            {arrivalCalculated && (
                                <>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Route Sequence</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Order
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Branch
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estimated Arrival
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {routeInfo.route.map((branchId, index) => {
                                                    const arrivalTime = routeInfo.arrivalTimes.find(at => at.center === branchId);
                                                    const timeInMinutes = arrivalTime ? arrivalTime.time : 0;
                                                    const hours = Math.floor(timeInMinutes / 60);
                                                    const minutes = timeInMinutes % 60;

                                                    return (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {getBranchName(branchId,683)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {index === 0 ? 'Start' : `${hours}h ${minutes}m`}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Available Parcels List Card */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Available Parcels ({filteredParcels.length})
                            </h2>

                            {selectedParcels.length > 0 && (
                                <button
                                    onClick={addToShipment}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Add {selectedParcels.length} to Shipment
                                </button>
                            )}
                        </div>

                        {error ? (
                            <div className="p-4 text-red-700 bg-red-100 rounded-md mb-4">
                                {error}
                            </div>
                        ) : (
                            <>
                                {/* Parcels in Shipment */}
                                {shipmentParcels.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Parcels in Shipment ({shipmentParcels.length})</h3>
                                        <div className="overflow-x-auto mb-6">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            ID
                                                        </th>
                                                      
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            To
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Type
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Size
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Weight
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                        {shipmentParcels.map((parcel) => (
                                                        
                                                        <tr key={parcel._id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {parcel.parcelId || 'N/A'}
                                                            </td>
                                                           
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {parcel.to ? getBranchName(parcel.to._id,761)  : 'Unknown'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {parcel.itemType || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {parcel.itemSize || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {parcel.weight ? `${parcel.weight} kg` : 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                        {/* Available Parcels Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedParcels(filteredParcels.map(p => p._id));
                                                    } else {
                                                        setSelectedParcels([]);
                                                    }
                                                }}
                                                checked={selectedParcels.length === filteredParcels.length && filteredParcels.length > 0}
                                                className="focus:ring-[#1F818C] h-4 w-4 text-[#1F818C] border-gray-300 rounded"
                                            />
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            To
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Weight
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredParcels.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                No parcels found. Try adjusting your filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredParcels.map((parcel) => (
                                            <tr
                                                key={parcel._id}
                                                className={`hover:bg-gray-50 cursor-pointer ${selectedParcels.includes(parcel._id) ? 'bg-blue-50' : ''}`}
                                                onClick={() => toggleParcelSelection(parcel._id)}
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedParcels.includes(parcel._id)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            toggleParcelSelection(parcel._id);
                                                        }}
                                                        className="focus:ring-[#1F818C] h-4 w-4 text-[#1F818C] border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {parcel.parcelId || parcel._id.substring(0, 8)}
                                                </td>
                                               
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {parcel.to ? getBranchName(parcel.to,851): 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {parcel.itemType || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                    {parcel.itemSize || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {parcel.weight ? `${parcel.weight} kg` : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                        )}
                </div>
            </div>
        </div>
        </div >
    );
};

export default B2BShipmentCreationPage;