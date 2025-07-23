import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, MapPin, ArrowRight, Check, RotateCcw } from 'lucide-react';

const districtDistanceMatrix = {
    'Colombo': { 'Gampaha': 25, 'Kalutara': 45, 'Kandy': 120, 'Galle': 115, 'Hambantota': 160, 'Matale': 140, 'Batticaloa': 280, 'Nuwara Eliya': 150, 'Monaragala': 270 },
    'Gampaha': { 'Colombo': 25, 'Kalutara': 35, 'Kandy': 110, 'Galle': 130, 'Hambantota': 180, 'Matale': 130, 'Batticaloa': 300, 'Nuwara Eliya': 140, 'Monaragala': 290 },
    'Kalutara': { 'Colombo': 45, 'Gampaha': 35, 'Kandy': 90, 'Galle': 100, 'Hambantota': 140, 'Matale': 120, 'Batticaloa': 320, 'Nuwara Eliya': 160, 'Monaragala': 250 },
    'Kandy': { 'Colombo': 120, 'Gampaha': 110, 'Kalutara': 90, 'Galle': 150, 'Hambantota': 200, 'Matale': 30, 'Batticaloa': 160, 'Nuwara Eliya': 35, 'Monaragala': 120 },
    'Galle': { 'Colombo': 115, 'Gampaha': 130, 'Kalutara': 100, 'Kandy': 150, 'Hambantota': 70, 'Matale': 170, 'Batticaloa': 300, 'Nuwara Eliya': 180, 'Monaragala': 190 },
    'Hambantota': { 'Colombo': 160, 'Gampaha': 180, 'Kalutara': 140, 'Kandy': 200, 'Galle': 70, 'Matale': 220, 'Batticaloa': 250, 'Nuwara Eliya': 230, 'Monaragala': 90 },
    'Matale': { 'Colombo': 140, 'Gampaha': 130, 'Kalutara': 120, 'Kandy': 30, 'Galle': 170, 'Hambantota': 220, 'Batticaloa': 140, 'Nuwara Eliya': 50, 'Monaragala': 110 },
    'Batticaloa': { 'Colombo': 280, 'Gampaha': 300, 'Kalutara': 320, 'Kandy': 160, 'Galle': 300, 'Hambantota': 250, 'Matale': 140, 'Nuwara Eliya': 190, 'Monaragala': 130 },
    'Nuwara Eliya': { 'Colombo': 150, 'Gampaha': 140, 'Kalutara': 160, 'Kandy': 35, 'Galle': 180, 'Hambantota': 230, 'Matale': 50, 'Batticaloa': 190, 'Monaragala': 130 },
    'Monaragala': { 'Colombo': 270, 'Gampaha': 290, 'Kalutara': 250, 'Kandy': 120, 'Galle': 190, 'Hambantota': 90, 'Matale': 110, 'Batticaloa': 130, 'Nuwara Eliya': 130 }
};

const districtTimeMatrix = {
    'Colombo': { 'Gampaha': 1, 'Kalutara': 1.5, 'Kandy': 3, 'Galle': 3.5, 'Hambantota': 4.5, 'Matale': 3.5, 'Batticaloa': 7, 'Nuwara Eliya': 4, 'Monaragala': 6.5 },
    'Gampaha': { 'Colombo': 1, 'Kalutara': 1.2, 'Kandy': 2.8, 'Galle': 3.2, 'Hambantota': 5, 'Matale': 3.2, 'Batticaloa': 7.5, 'Nuwara Eliya': 3.7, 'Monaragala': 7, 'Badulla': 7 },
    'Kalutara': { 'Colombo': 1.5, 'Gampaha': 1.2, 'Kandy': 2.5, 'Galle': 2.8, 'Hambantota': 3.8, 'Matale': 3, 'Batticaloa': 8, 'Nuwara Eliya': 4.2, 'Monaragala': 6 },
    'Kandy': { 'Colombo': 3, 'Gampaha': 2.8, 'Kalutara': 2.5, 'Galle': 3.5, 'Hambantota': 5.5, 'Matale': 0.8, 'Batticaloa': 4, 'Nuwara Eliya': 1, 'Monaragala': 3 },
    'Galle': { 'Colombo': 3.5, 'Gampaha': 3.2, 'Kalutara': 2.8, 'Kandy': 3.5, 'Hambantota': 1.8, 'Matale': 4.5, 'Batticaloa': 7.5, 'Nuwara Eliya': 4.8, 'Monaragala': 4.5 },
    'Hambantota': { 'Colombo': 4.5, 'Gampaha': 5, 'Kalutara': 3.8, 'Kandy': 5.5, 'Galle': 1.8, 'Matale': 6, 'Batticaloa': 6.5, 'Nuwara Eliya': 6.2, 'Monaragala': 2.2 },
    'Matale': { 'Colombo': 3.5, 'Gampaha': 3.2, 'Kalutara': 3, 'Kandy': 0.8, 'Galle': 4.5, 'Hambantota': 6, 'Batticaloa': 3.5, 'Nuwara Eliya': 1.3, 'Monaragala': 2.8 },
    'Batticaloa': { 'Colombo': 7, 'Gampaha': 7.5, 'Kalutara': 8, 'Kandy': 4, 'Galle': 7.5, 'Hambantota': 6.5, 'Matale': 3.5, 'Nuwara Eliya': 5, 'Monaragala': 3.2 },
    'Nuwara Eliya': { 'Colombo': 4, 'Gampaha': 3.7, 'Kalutara': 4.2, 'Kandy': 1, 'Galle': 4.8, 'Hambantota': 6.2, 'Matale': 1.3, 'Batticaloa': 5, 'Monaragala': 3.2 },
    'Monaragala': { 'Colombo': 6.5, 'Gampaha': 7, 'Kalutara': 6, 'Kandy': 3, 'Galle': 4.5, 'Hambantota': 2.2, 'Matale': 2.8, 'Batticaloa': 3.2, 'Nuwara Eliya': 3.2 }
};

// Buffer times configuration based on position in route
const bufferTimeConfig = {
    express: {
        first: 2,
        intermediate: 1,
        last: 2
    },
    standard: {
        first: 2,
        intermediate: 2,
        last: 2
    }
};

const B2BShipmentCreationPage = () => {
    const navigate = useNavigate();

    // States
    const [parcels, setParcels] = useState([]);
    const [filteredParcels, setFilteredParcels] = useState([]);
    const [selectedParcels, setSelectedParcels] = useState([]);
    const [shipmentParcels, setShipmentParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedParcelId, setExpandedParcelId] = useState(null);
    const [filters, setFilters] = useState({
        to: '',
        size: '',
        itemType: '',
        shippingMethod: ''
    });
    const [shipmentData, setShipmentData] = useState({
        deliveryType: 'standard',
        sourceCenter: ''
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
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [availableCenters, setAvailableCenters] = useState([]);
    const [routeSequence, setRouteSequence] = useState({});
    const [finalizedRoute, setFinalizedRoute] = useState([]);
    const [arrivalTimeMethod, setArrivalTimeMethod] = useState('smart'); // 'smart' or 'simple'
    const [simpleArrivalTime, setSimpleArrivalTime] = useState('');
    const [showArrivalTimeModal, setShowArrivalTimeModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    // Fetch all parcels that are not assigned to a shipment
    const fetchUnassignedParcels = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/parcels/682e1059ce33c2a891c9b168');
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Fetched parcels:', data);
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
            const response = await fetch('http://localhost:8000/api/branches/all-branches');
            if (!response.ok) {
                throw new Error('Failed to fetch branches');
            }
            const data = await response.json();
            console.log('Fetched branches:', data); // Debugging output

            const branchArray = Array.isArray(data.branches) ? data.branches : Object.values(data.branches || {});
            console.log('Processed branches:', branchArray); // Debugging output
            if (branchArray.length === 0) {
                console.warn('No branches found');
            }
            setBranches(branchArray);

        } catch (err) {
            console.error('Error fetching branches:', err);
            // Handle error state or retry logic if needed
        }
    };

    // Filter parcels based on selected filters
    const filterParcels = useCallback(() => {
        let filtered = [...parcels];
        
        if (filters.to) {
            filtered = filtered.filter(parcel => Object.values(parcel.to).includes(filters.to));
        }
        if (filters.size) {
            // Case-insensitive comparison for size
            filtered = filtered.filter(parcel => 
                parcel.itemSize && 
                parcel.itemSize.toLowerCase() === filters.size.toLowerCase()
            );
        }
        if (filters.itemType) {
            // Case-insensitive comparison for item type
            filtered = filtered.filter(parcel => 
                parcel.itemType && 
                parcel.itemType.toLowerCase() === filters.itemType.toLowerCase()
            );
        }
        if (filters.shippingMethod) {
            // Case-insensitive comparison for shipping method
            filtered = filtered.filter(parcel => 
                parcel.shippingMethod && 
                parcel.shippingMethod.toLowerCase() === filters.shippingMethod.toLowerCase()
            );
        }

        setFilteredParcels(filtered);
    }, [parcels, filters]);

    // Fetch data on component mount
    useEffect(() => {
        fetchUnassignedParcels();
        fetchBranches();
    }, []);

    // Update filtered parcels when parcels or filters change
    useEffect(() => {
        filterParcels();
    }, [parcels, filters, filterParcels]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Toggle row expansion
    const toggleRowExpansion = (id, e) => {
        e.stopPropagation();
        setExpandedParcelId(expandedParcelId === id ? null : id);
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
            showNotificationMessage('Please select at least one parcel to add to shipment', 'error');
            return;
        }

        try {
            const selectedParcelObjects = parcels.filter(parcel => selectedParcels.includes(parcel._id));
            setShipmentParcels(prev => [...prev, ...selectedParcelObjects]);

            const sizeSpecs = {
                small: { weight: 2, volume: 0.2 },
                medium: { weight: 5, volume: 0.5 },
                large: { weight: 10, volume: 1 }
            };

            let totalWeight = parseFloat(shipmentSummary.weight);
            selectedParcelObjects.forEach(parcel => {
                const spec = sizeSpecs[parcel.itemSize.toLowerCase()] || { weight: 0 };
                totalWeight += parseFloat(spec.weight);
            });

            let totalVolume = parseFloat(shipmentSummary.volume);
            selectedParcelObjects.forEach(parcel => {
                const spec = sizeSpecs[parcel.itemSize.toLowerCase()] || { volume: 0 };
                totalVolume += parseFloat(spec.volume);
            });

            const totalCount = selectedParcels.length + shipmentSummary.count;
            setShipmentSummary({
                weight: parseFloat(totalWeight.toFixed(2)),
                volume: parseFloat(totalVolume.toFixed(2)),
                count: totalCount
            });

            setSelectedParcels([]);
            setParcels(prev => prev.filter(parcel => !selectedParcels.includes(parcel._id)));
        } catch (err) {
            console.error('Error adding parcels to shipment:', err);
            showNotificationMessage('Failed to add parcels to shipment', 'error');
        }
    };

    // Show notification function
    const showNotificationMessage = (message, type = 'success') => {
        if (type === 'success') {
            setSuccessMessage(message);
            setErrorMessage('');
        } else {
            setErrorMessage(message);
            setSuccessMessage('');
        }
        setShowNotification(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            setShowNotification(false);
            setSuccessMessage('');
            setErrorMessage('');
        }, 5000);
    };

    // Handle finding best route
    const handleFindBestRoute = () => {
        if (shipmentParcels.length === 0) {
            showNotificationMessage('Please add at least one parcel to shipment', 'error');
            return;
        }
        if (!shipmentData.sourceCenter) {
            showNotificationMessage('Please select a source center', 'error');
            return;
        }

        // Get unique destination center IDs
        const uniqueCenterIds = [...new Set(shipmentParcels.map(parcel => parcel.to._id))];
        console.log('Available centers:', uniqueCenterIds);
        console.log('All branches:', branches);
        setAvailableCenters(uniqueCenterIds);
        setRouteSequence({}); // Reset route sequence for new modal
        setShowRouteModal(true);
    };

    // Calculate total distance for the selected route
    const calculateRouteDistance = (route) => {
        let totalDistance = 0;
        const sourceLocation = branches.find(b => b._id === shipmentData.sourceCenter)?.location;
        if (!sourceLocation) return 0;

        // Calculate from source to first center
        totalDistance += districtDistanceMatrix[sourceLocation]?.[branches.find(b => b._id === route[0])?.location] || 0;

        // Calculate between consecutive centers
        for (let i = 0; i < route.length - 1; i++) {
            const fromLocation = branches.find(b => b._id === route[i])?.location;
            const toLocation = branches.find(b => b._id === route[i + 1])?.location;
            totalDistance += districtDistanceMatrix[fromLocation]?.[toLocation] || 0;
        }

        return totalDistance;
    };

    // Handle sequence number input
    const handleSequenceChange = (centerId, sequence) => {
        const newSequence = { ...routeSequence };
        
        // Remove this sequence number from other centers
        Object.keys(newSequence).forEach(key => {
            if (newSequence[key] === parseInt(sequence)) {
                delete newSequence[key];
            }
        });
        
        // Set new sequence for this center
        if (sequence && sequence !== '') {
            newSequence[centerId] = parseInt(sequence);
        } else {
            delete newSequence[centerId];
        }
        
        setRouteSequence(newSequence);
    };

    // Reset route sequence
    const resetRouteSequence = () => {
        setRouteSequence({});
    };

    // Generate route order based on sequence numbers
    const generateRouteOrder = () => {
        const sortedEntries = Object.entries(routeSequence).sort((a, b) => a[1] - b[1]);
        return sortedEntries.map(([centerId]) => 
            branches.find(branch => branch._id === centerId)
        ).filter(Boolean);
    };

    // Check if route is complete
    const isRouteComplete = () => {
        const sequenceValues = Object.values(routeSequence);
        const uniqueSequences = new Set(sequenceValues);
        return sequenceValues.length === availableCenters.length && 
               uniqueSequences.size === availableCenters.length &&
               sequenceValues.every(seq => seq >= 1 && seq <= availableCenters.length);
    };

    // Finalize route
    const finalizeRoute = () => {
        if (isRouteComplete()) {
            const orderedRoute = generateRouteOrder();
            const sourceCenter = branches.find(b => b._id === shipmentData.sourceCenter);
            setFinalizedRoute([sourceCenter, ...orderedRoute]);
            
            // Calculate route distance
            const routeIds = orderedRoute.map(center => center._id);
            const totalDistance = calculateRouteDistance(routeIds);
            setRouteInfo({
                route: routeIds,
                totalDistance,
                totalTime: 0,
                arrivalTimes: []
            });
            setRouteCalculated(true);
            setArrivalCalculated(false);
            setShowRouteModal(false);
        } else {
            showNotificationMessage('Please complete the route sequence for all centers', 'error');
        }
    };

    // Get available sequence numbers
    const getAvailableNumbers = (currentCenterId) => {
        const usedNumbers = Object.entries(routeSequence)
            .filter(([centerId]) => centerId !== currentCenterId)
            .map(([, sequence]) => sequence);
        
        return Array.from({ length: availableCenters.length }, (_, i) => i + 1)
            .filter(num => !usedNumbers.includes(num));
    };

    // Smart arrival time calculation
    const calculateSmartArrivalTimes = () => {
        if (!routeCalculated) {
            showNotificationMessage('Please calculate the route first', 'error');
            return;
        }

        if (!shipmentData.deliveryType) {
            showNotificationMessage('Please select a delivery type (express/standard) for smart calculation', 'error');
            return;
        }

        const route = routeInfo.route;
        const deliveryType = shipmentData.deliveryType;
        const bufferConfig = bufferTimeConfig[deliveryType];
        
        if (!bufferConfig) {
            showNotificationMessage('Invalid delivery type for smart calculation', 'error');
            return;
        }

        const sourceLocation = branches.find(b => b._id === shipmentData.sourceCenter)?.location;
        if (!sourceLocation) {
            showNotificationMessage('Source center not found', 'error');
            return;
        }

        let cumulativeTime = 0;
        const arrivalTimes = [];

        // Add initial buffer time at source center (preparation time)
        cumulativeTime += bufferConfig.first;

        // Calculate time for each segment
        for (let i = 0; i < route.length; i++) {
            const currentCenterId = route[i];
            const currentBranch = branches.find(b => b._id === currentCenterId);
            
            if (!currentBranch) continue;

            let travelTime = 0;
            let bufferTime = 0;

            // Calculate travel time to this destination
            if (i === 0) {
                // First destination from source
                travelTime = districtTimeMatrix[sourceLocation]?.[currentBranch.location] || 0;
                bufferTime = bufferConfig.intermediate; // Use intermediate buffer time for first destination
            } else {
                // Travel from previous destination
                const previousBranch = branches.find(b => b._id === route[i - 1]);
                travelTime = districtTimeMatrix[previousBranch?.location]?.[currentBranch.location] || 0;
                
                // Determine buffer time based on position
                if (i === route.length - 1) {
                    // Last destination
                    bufferTime = bufferConfig.last;
                } else {
                    // Intermediate destinations
                    bufferTime = bufferConfig.intermediate;
                }
            }

            // Add travel time and buffer time to cumulative time
            cumulativeTime += travelTime + bufferTime;

            arrivalTimes.push({
                center: currentCenterId,
                centerName: currentBranch.location,
                travelTime: travelTime,
                bufferTime: bufferTime,
                segmentTime: travelTime + bufferTime,
                cumulativeTime: cumulativeTime
            });
        }

        // Update route info
        setRouteInfo(prev => ({
            ...prev,
            totalTime: cumulativeTime,
            arrivalTimes: arrivalTimes
        }));
        setArrivalCalculated(true);
        
        console.log('Smart arrival times calculated:', {
            totalTime: cumulativeTime,
            arrivalTimes,
            deliveryType
        });
    };

    // Simple arrival time calculation
    const calculateSimpleArrivalTimes = (userDefinedTime) => {
        if (!routeCalculated) {
            showNotificationMessage('Please calculate the route first', 'error');
            return;
        }

        const totalTime = parseFloat(userDefinedTime);
        if (isNaN(totalTime) || totalTime <= 0) {
            showNotificationMessage('Please enter a valid time in hours', 'error');
            return;
        }

        const route = routeInfo.route;
        const timePerSegment = totalTime / route.length;
        const arrivalTimes = [];

        // Calculate equal time for each segment
        for (let i = 0; i < route.length; i++) {
            const currentCenterId = route[i];
            const currentBranch = branches.find(b => b._id === currentCenterId);
            
            if (!currentBranch) continue;

            const cumulativeTime = (i + 1) * timePerSegment;

            arrivalTimes.push({
                center: currentCenterId,
                centerName: currentBranch.location,
                travelTime: timePerSegment,
                bufferTime: 0,
                segmentTime: timePerSegment,
                cumulativeTime: cumulativeTime
            });
        }

        // Update route info
        setRouteInfo(prev => ({
            ...prev,
            totalTime: totalTime,
            arrivalTimes: arrivalTimes
        }));
        setArrivalCalculated(true);
        
        console.log('Simple arrival times calculated:', {
            totalTime,
            arrivalTimes,
            timePerSegment
        });
    };

    // Handle arrival time calculation method selection
    const handleArrivalTimeCalculation = () => {
        if (!routeCalculated) {
            showNotificationMessage('Please calculate the route first', 'error');
            return;
        }
        setShowArrivalTimeModal(true);
    };

    // Calculate arrival times based on selected method
    const processArrivalTimeCalculation = () => {
        if (arrivalTimeMethod === 'smart') {
            calculateSmartArrivalTimes();
        } else if (arrivalTimeMethod === 'simple') {
            if (!simpleArrivalTime) {
                showNotificationMessage('Please enter total time for simple calculation', 'error');
                return;
            }
            calculateSimpleArrivalTimes(simpleArrivalTime);
        }
        setShowArrivalTimeModal(false);
    };

    // Create shipment
    const createShipment = async () => {
        if (shipmentParcels.length === 0) {
            showNotificationMessage('Please add at least one parcel to shipment', 'error');
            return;
        }

        if (!routeCalculated || !arrivalCalculated) {
            showNotificationMessage('Please calculate route and arrival times before creating shipment', 'error');
            return;
        }

        if (!shipmentData.sourceCenter) {
            showNotificationMessage('Please select a source center', 'error');
            return;
        }

        setLoading(true);

        try {
            // Prepare parcel IDs
            const parcelIds = shipmentParcels.map(parcel => parcel._id);
            
            // Transform arrival times to match schema format
            const transformedArrivalTimes = routeInfo.arrivalTimes.map(arrivalTime => ({
                center: arrivalTime.center,
                time: arrivalTime.cumulativeTime
            }));

            // Prepare shipment data according to B2BShipment schema
            // Note: shipmentId will be generated by the backend
            const shipmentPayload = {
                deliveryType: shipmentData.deliveryType,
                sourceCenter: shipmentData.sourceCenter,
                route: routeInfo.route,
                totalTime: routeInfo.totalTime,
                arrivalTimes: transformedArrivalTimes,
                totalDistance: routeInfo.totalDistance,
                totalWeight: shipmentSummary.weight,
                totalVolume: shipmentSummary.volume,
                parcelCount: shipmentSummary.count,
                parcels: parcelIds,
                status: 'Pending',
                createdByCenter: shipmentData.sourceCenter, // Using source center as created by center
                confirmed: false,
                createdAt: new Date()
            };

            console.log('=== FRONTEND SHIPMENT CREATION ===');
            console.log('Shipment payload being sent:', JSON.stringify(shipmentPayload, null, 2));
            console.log('Delivery Type:', shipmentPayload.deliveryType);
            console.log('Source Center:', shipmentPayload.sourceCenter);
            console.log('Parcels count:', shipmentPayload.parcels.length);

            const response = await fetch('http://localhost:8000/shipments/create', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies for staff authentication
                body: JSON.stringify(shipmentPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create shipment');
            }

            const result = await response.json();
            console.log('Shipment created successfully:', result);
            
            const createdShipmentId = result.shipment?.shipmentId || 'Unknown';
            showNotificationMessage(`Shipment created successfully! Shipment ID: ${createdShipmentId}`, 'success');
            
            // Navigate after a short delay to allow user to see the success message
            setTimeout(() => {
                navigate('/staff/shipment-management/parcel-table-page');
            }, 2000);
        } catch (err) {
            console.error('Error creating shipment:', err);
            showNotificationMessage(`Failed to create shipment: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };


    const getBranchName = (branchId) => {
        if (!branchId) return 'Unknown';
        const branch = branches.find(b => b._id === branchId);
        return branch ? branch.location : 'Unknown';
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

            {/* Route Selection Modal */}
            {showRouteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Create Route Sequence</h2>
                        
                        {/* Starting Center */}
                        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="text-lg font-medium mb-2 text-green-800">Starting Center</h3>
                            <div className="flex items-center bg-green-100 px-4 py-2 rounded-lg">
                                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                                <span className="font-medium text-green-800">
                                    {getBranchName(shipmentData.sourceCenter)}
                                </span>
                                <span className="ml-2 text-sm text-green-600">(Starting Point)</span>
                            </div>
                        </div>

                        {/* Destination Centers */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-4">Destination Centers</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Assign sequence numbers (1 to {availableCenters.length}) to create your route:
                            </p>
                            
                            <div className="space-y-3">
                                {availableCenters.map((centerId) => (
                                    <div key={centerId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                            <span className="font-medium">{getBranchName(centerId)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Sequence:</label>
                                            <select
                                                value={routeSequence[centerId] || ''}
                                                onChange={(e) => handleSequenceChange(centerId, e.target.value)}
                                                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select</option>
                                                {getAvailableNumbers(centerId).map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Route Preview */}
                        {Object.keys(routeSequence).length > 0 && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium mb-2 text-blue-800">Route Preview:</h4>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                                        <span className="text-sm font-medium text-green-800">
                                            {getBranchName(shipmentData.sourceCenter)}
                                        </span>
                                    </div>
                                    {generateRouteOrder().map((center) => (
                                        <div key={center._id} className="flex items-center">
                                            <ArrowRight className="w-4 h-4 text-blue-600 mx-1" />
                                            <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                                                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full mr-2">
                                                    {routeSequence[center._id]}
                                                </span>
                                                <span className="text-sm font-medium text-blue-800">
                                                    {center.location}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={resetRouteSequence}
                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Reset
                            </button>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowRouteModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={finalizeRoute}
                                    disabled={!isRouteComplete()}
                                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                                        isRouteComplete()
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    Finalize Route
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Arrival Time Calculation Modal */}
            {showArrivalTimeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">Calculate Arrival Times</h2>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Calculation Method:
                            </label>
                            
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="arrivalTimeMethod"
                                        value="smart"
                                        checked={arrivalTimeMethod === 'smart'}
                                        onChange={(e) => setArrivalTimeMethod(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Smart Calculation</span>
                                </label>
                                <p className="text-xs text-gray-500 ml-6">
                                    Uses delivery type, buffer times, and travel time matrix
                                </p>
                                
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="arrivalTimeMethod"
                                        value="simple"
                                        checked={arrivalTimeMethod === 'simple'}
                                        onChange={(e) => setArrivalTimeMethod(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Simple Calculation</span>
                                </label>
                                <p className="text-xs text-gray-500 ml-6">
                                    Enter total time and divide equally among all stops
                                </p>
                            </div>
                        </div>

                        {/* Smart Calculation Info */}
                        {arrivalTimeMethod === 'smart' && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-2">Smart Calculation Details:</h4>
                                <p className="text-sm text-blue-700">
                                    Delivery Type: <span className="font-semibold">{shipmentData.deliveryType || 'Not Selected'}</span>
                                </p>
                                {shipmentData.deliveryType && (
                                    <div className="text-xs text-blue-600 mt-1">
                                        Buffer Times: First={bufferTimeConfig[shipmentData.deliveryType]?.first}h, 
                                        Intermediate={bufferTimeConfig[shipmentData.deliveryType]?.intermediate}h, 
                                        Last={bufferTimeConfig[shipmentData.deliveryType]?.last}h
                                    </div>
                                )}
                                {!shipmentData.deliveryType && (
                                    <p className="text-xs text-red-600 mt-1">
                                        Please select delivery type in shipment details
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Simple Calculation Input */}
                        {arrivalTimeMethod === 'simple' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Shipment Time (hours):
                                </label>
                                <input
                                    type="number"
                                    value={simpleArrivalTime}
                                    onChange={(e) => setSimpleArrivalTime(e.target.value)}
                                    placeholder="Enter total time in hours"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    step="0.1"
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowArrivalTimeModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processArrivalTimeCalculation}
                                disabled={arrivalTimeMethod === 'smart' && !shipmentData.deliveryType}
                                className={`px-4 py-2 rounded-md transition-colors ${
                                    (arrivalTimeMethod === 'smart' && !shipmentData.deliveryType)
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                Calculate
                            </button>
                        </div>
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
                        {/* Delivery Type Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Type
                            </label>
                            <select
                                name="shippingMethod"
                                value={filters.shippingMethod}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1F818C] focus:border-[#1F818C]"
                            >
                                <option value="">All Types</option>
                                <option value="standard">Standard</option>
                                <option value="express">Express</option>
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
                            >
                                <option value="">Select Source Center</option>
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.location}
                                    </option>
                                ))}
                            </select>
                        </div>
                       
                        
                        {/* Summary */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <div className="text-sm font-medium">Shipment Summary</div>
                            <div className="text-sm mt-1">Selected Parcels: {shipmentSummary.count}</div>
                            <div className="text-sm">Total Weight: {shipmentSummary.weight} kg</div>
                            <div className="text-sm">Total Volume: {shipmentSummary.volume} m³</div>
                        </div>
                        {/* Create Route Button */}
                        <button
                            onClick={handleFindBestRoute}
                            className="w-full px-4 py-2 mb-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={shipmentParcels.length === 0 || !shipmentData.sourceCenter}
                        >
                            {finalizedRoute.length > 0 ? 'Modify Route' : 'Create Route'}
                        </button>
                        {/* Calculate Arrival Times Button */}
                        <button
                            onClick={handleArrivalTimeCalculation}
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
                    {/* Current Route Display */}
                    {finalizedRoute.length > 0 && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Current Route</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                {finalizedRoute.map((center, index) => (
                                    <div key={center._id || center.id} className="flex items-center">
                                        <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                                            <MapPin className="w-4 h-4 mr-1 text-green-600" />
                                            <span className="text-sm font-medium text-green-800">
                                                {center.location || center.name}
                                            </span>
                                        </div>
                                        {index < finalizedRoute.length - 1 && (
                                            <ArrowRight className="w-4 h-4 text-green-600 mx-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Route Information Card */}
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
                                        {routeInfo.totalTime ? 
                                            `${Math.floor(routeInfo.totalTime)}h ${Math.round((routeInfo.totalTime - Math.floor(routeInfo.totalTime)) * 60)}m` 
                                            : 'Not calculated'
                                        }
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="text-sm font-medium text-gray-700">Number of Stops</div>
                                    <div className="text-lg font-semibold">{routeInfo.route.length}</div>
                                </div>
                            </div>
                            {arrivalCalculated && (
                                <>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Route Sequence & Arrival Times</h3>
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
                                                        Travel Time
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Buffer Time
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Cumulative Time
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {routeInfo.arrivalTimes.map((arrivalTime, index) => {
                                                    const hours = Math.floor(arrivalTime.cumulativeTime);
                                                    const minutes = Math.round((arrivalTime.cumulativeTime - hours) * 60);
                                                    const travelHours = Math.floor(arrivalTime.travelTime);
                                                    const travelMinutes = Math.round((arrivalTime.travelTime - travelHours) * 60);
                                                    const bufferHours = Math.floor(arrivalTime.bufferTime);
                                                    const bufferMinutes = Math.round((arrivalTime.bufferTime - bufferHours) * 60);
                                                    
                                                    return (
                                                        <tr key={arrivalTime.center}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {arrivalTime.centerName}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {travelHours > 0 ? `${travelHours}h ` : ''}{travelMinutes}m
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {bufferHours > 0 ? `${bufferHours}h ` : ''}{bufferMinutes}m
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {hours > 0 ? `${hours}h ` : ''}{minutes}m
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
                            <div>

                                <div className="mb-4 p-3 rounded-md">
                                    <div className="text-lg font-medium text-gray-800 mb-3">Shipment Summary For Selected ({shipmentSummary.count}) Parcels</div>
                                    <div className="text-sm">Total Weight: {shipmentSummary.weight} kg</div>
                                    <div className="text-sm">Total Volume: {shipmentSummary.volume} m³</div>
                                </div>
                            </div>


                            <div>
                                <button
                                    onClick={addToShipment}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Add {selectedParcels.length} to Shipment
                                </button>
                            </div>

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
                                                            Delivery Type
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {shipmentParcels.map((parcel) => (
                                                        <React.Fragment key={parcel._id}>
                                                            <tr className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {parcel.parcelId || 'N/A'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {parcel.to ? getBranchName(parcel.to._id) : 'Unknown'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {parcel.itemType || 'N/A'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {parcel.itemSize || 'N/A'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                        parcel.shippingMethod?.toLowerCase() === 'express' 
                                                                            ? 'bg-red-100 text-red-800' 
                                                                            : 'bg-green-100 text-green-800'
                                                                    }`}>
                                                                        {parcel.shippingMethod || 'N/A'}
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
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                {/* Available Parcels Table */}
                                <div className="overflow-x-auto">
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Parcels Avilable ({filteredParcels.length})</h3>
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
                                                    Delivery Type
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
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
                                                    <React.Fragment key={parcel._id}>
                                                        <tr
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
                                                                {parcel.to ? getBranchName(parcel.to._id) : 'Unknown'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {parcel.itemType || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                                {parcel.itemSize || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                    parcel.shippingMethod?.toLowerCase() === 'express' 
                                                                        ? 'bg-red-100 text-red-800' 
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                    {parcel.shippingMethod || 'N/A'}
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
                                                    </React.Fragment>
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
        </div>
    );
};

export default B2BShipmentCreationPage;