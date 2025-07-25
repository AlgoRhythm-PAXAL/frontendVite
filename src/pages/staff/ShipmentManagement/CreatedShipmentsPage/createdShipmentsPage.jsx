import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Truck, AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp, Car, Package, Loader, Info, ArrowLeftRight, MapPin, Plus, Edit, Zap, Search, Send } from 'lucide-react';

const ShipmentManagement = () => {
    // Core state management
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [popup, setPopup] = useState(null);
    
    // Confirmation modal state
    const [confirmationModal, setConfirmationModal] = useState({ 
        isOpen: false, 
        type: '', 
        title: '', 
        message: '', 
        action: null,
        processing: false
    });
    
    // UI state
    const [selectedShipments, setSelectedShipments] = useState(new Set());
    const [expandedShipmentId, setExpandedShipmentId] = useState(null);
    const [expandedParcelId, setExpandedParcelId] = useState(null);
    const [processingShipment, setProcessingShipment] = useState(null);
    
    // Filters and search
    const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Vehicle assignment state
    const [vehicleSelectionModal, setVehicleSelectionModal] = useState(null);
    const [vehicleAssignmentModal, setVehicleAssignmentModal] = useState(null);
    const [confirmingAssignment, setConfirmingAssignment] = useState(false);
    const [smartSearchResult, setSmartSearchResult] = useState(null);
    const [manualVehicleInput, setManualVehicleInput] = useState('');
    const [foundVehicle, setFoundVehicle] = useState(null);
    const [assignmentResult, setAssignmentResult] = useState(null);
    const [searchingVehicle, setSearchingVehicle] = useState(false);
    const [findingVehicle, setFindingVehicle] = useState(false);
    const [assigningVehicle, setAssigningVehicle] = useState(false);
    const [assignVehicleOnlyMode, setAssignVehicleOnlyMode] = useState(false);
    
    // Parcel management state
    const [selectedParcelGroups, setSelectedParcelGroups] = useState({});
    const [showParcelSelection, setShowParcelSelection] = useState(false);
    
    // Standard shipment add more parcels state
    const [standardParcelsModal, setStandardParcelsModal] = useState({ isOpen: false, shipmentId: null });
    const [loadingStandardParcels, setLoadingStandardParcels] = useState(false);
    const [addingStandardParcels, setAddingStandardParcels] = useState(false);
    
    // Enhanced add more parcels modal states
    const [addMoreParcelsModal, setAddMoreParcelsModal] = useState({ 
        isOpen: false, 
        shipmentId: null, 
        step: 'selection' // 'selection', 'manual', 'smart', 'smart-results'
    });
    const [manualParcelId, setManualParcelId] = useState('');
    const [validatingParcel, setValidatingParcel] = useState(false);
    const [smartParcelsResults, setSmartParcelsResults] = useState(null);
    const [processingSmart, setProcessingSmart] = useState(false);
    
    // Reverse shipment state
    const [foundParcels, setFoundParcels] = useState(null);
    const [selectedParcelsForReverse, setSelectedParcelsForReverse] = useState([]);
    const [creatingReverseShipment, setCreatingReverseShipment] = useState(false);

    // Staff information state
    const [staffInfo, setStaffInfo] = useState(null);
    const [staffBranchId, setStaffBranchId] = useState(null);
    
    // Branch cache state for dynamic branch name resolution
    const [branchCache, setBranchCache] = useState({});
    const [fetchingBranches, setFetchingBranches] = useState(false);

    // Function to fetch branch details from database
    const fetchBranchDetails = useCallback(async (branchIds) => {
        if (!branchIds || branchIds.length === 0) return {};
        
        // Filter out IDs that are already in cache
        const uncachedIds = branchIds.filter(id => !branchCache[id]);
        if (uncachedIds.length === 0) return branchCache;
        
        try {
            setFetchingBranches(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/branches/details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ branchIds: uncachedIds })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch branch details');
            }

            const data = await response.json();
            const newBranchData = {};
            
            if (data.success && data.branches) {
                data.branches.forEach(branch => {
                    newBranchData[branch._id] = branch.location;
                });
            }

            // Update cache
            setBranchCache(prev => ({ ...prev, ...newBranchData }));
            return { ...branchCache, ...newBranchData };
            
        } catch (error) {
            console.error('Error fetching branch details:', error);
            return branchCache;
        } finally {
            setFetchingBranches(false);
        }
    }, [branchCache]);

    // Synchronous version for immediate use (returns cached value or ID)
    const getCenterNameSync = (centerData) => {
        if (!centerData) return 'N/A';
        
        // If already a populated object with location
        if (typeof centerData === 'object' && centerData.location) {
            return centerData.location;
        }
        
        // If already a populated object with branchId as location name
        if (typeof centerData === 'object' && centerData.branchId) {
            return centerData.branchId;
        }
        
        // If it's an object but location is inside another property
        if (typeof centerData === 'object' && centerData.center?.location) {
            return centerData.center.location;
        }
        
        // If it's just a string (object ID), return cached value or ID
        if (typeof centerData === 'string') {
            return branchCache[centerData] || centerData;
        }
        
        return 'Unknown Center';
    };

    // Synchronous version for immediate use
    const getGroupDestinationNameSync = (group) => {
        // First try the destination field (which should be the location name)
        if (group.destination && typeof group.destination === 'string' && !group.destination.match(/^[0-9a-fA-F]{24}$/)) {
            return group.destination;
        }
        
        // If destination is an ObjectId, return cached value or ID
        if (group.destinationId) {
            return branchCache[group.destinationId] || group.destinationId;
        }
        
        // Fallback to the destination field
        return group.destination || 'Unknown Destination';
    };

    // Function to fetch staff information and get branch
    const fetchStaffInfo = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/staff/ui/get-staff-information`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch staff info: ${response.status}`);
            }
            
            const data = await response.json();
            setStaffInfo(data);
            setStaffBranchId(data.branchId?._id);
            return data.branchId?._id;
        } catch (err) {
            console.error('Error fetching staff info:', err);
            setError('Failed to fetch staff information');
            return null;
        }
    }, []);

    // Function to fetch shipments from API using staff's branch
    const fetchShipments = useCallback(async () => {
        try {
            setLoading(true);
            
            // Get staff branch if not already available
            let branchId = staffBranchId;
            if (!branchId) {
                branchId = await fetchStaffInfo();
            }
            
            if (!branchId) {
                throw new Error('Staff branch information not available');
            }

            const queryParams = new URLSearchParams();
            // Send 'all' parameter when All is selected, otherwise send the specific status
            if (statusFilter === 'All') {
                queryParams.append('all', 'true');
            } else {
                queryParams.append('status', statusFilter);
            }
            queryParams.append('branchId', branchId);
            
            // Try fetching shipments for the staff's branch
            let url = `${import.meta.env.VITE_BACKEND_URL}/vehicles/b2b/shipments/branch/${branchId}?${queryParams.toString()}`;
           // console.log('Fetching shipments from:', import.meta.env.VITE_BACKEND_URL);
            let response = await fetch(url);
            
            // Fallback to original endpoints if branch-specific endpoint doesn't exist
            if (response.status === 404) {
                // Use staff ID from staffInfo if available, otherwise use branch-based approach
                const staffId = staffInfo?._id || branchId;
                url = `${import.meta.env.VITE_BACKEND_URL}/vehicles/b2b/shipments/${staffId}?${queryParams.toString()}`;
                response = await fetch(url);
                
                if (response.status === 404) {
                    url = `${import.meta.env.VITE_BACKEND_URL}/shipments/active/${staffId}`;
                    response = await fetch(url);
                }
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let shipmentsData = [];
            
            if (data.success && data.shipments) {
                shipmentsData = data.shipments;
            } else if (Array.isArray(data)) {
                shipmentsData = data;
            } else if (data.shipments) {
                shipmentsData = Array.isArray(data.shipments) ? data.shipments : [data.shipments];
            } else {
                shipmentsData = [data];
            }

            setShipments(shipmentsData);
            
            // Extract all branch IDs from shipments data for pre-fetching
            const branchIds = new Set();
            shipmentsData.forEach(shipment => {
                // Extract from route
                if (shipment.route && Array.isArray(shipment.route)) {
                    shipment.route.forEach(routeItem => {
                        if (typeof routeItem === 'string') {
                            branchIds.add(routeItem);
                        } else if (routeItem && routeItem._id) {
                            branchIds.add(routeItem._id);
                        }
                    });
                }
                
                // Extract from sourceCenter
                if (typeof shipment.sourceCenter === 'string') {
                    branchIds.add(shipment.sourceCenter);
                } else if (shipment.sourceCenter && shipment.sourceCenter._id) {
                    branchIds.add(shipment.sourceCenter._id);
                }
                
                // Extract from arrivalTimes
                if (shipment.arrivalTimes && Array.isArray(shipment.arrivalTimes)) {
                    shipment.arrivalTimes.forEach(arrival => {
                        if (typeof arrival.center === 'string') {
                            branchIds.add(arrival.center);
                        } else if (arrival.center && arrival.center._id) {
                            branchIds.add(arrival.center._id);
                        }
                    });
                }
            });
            
            // Pre-fetch branch details for all found IDs
            if (branchIds.size > 0) {
                await fetchBranchDetails(Array.from(branchIds));
            }
            
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching shipments:', err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, staffBranchId, staffInfo, fetchStaffInfo, fetchBranchDetails]);

    // Fetch shipments data on component mount and when status filter changes
    useEffect(() => {
        fetchShipments();
    }, [fetchShipments]);

    const showPopup = (type, message, duration = 3000) => {
        setPopup({ type, message });
        setTimeout(() => setPopup(null), duration);
    };

    // Enhanced confirmation modal function
    const showConfirmation = (type, title, message, action) => {
        setConfirmationModal({
            isOpen: true,
            type,
            title,
            message,
            action,
            processing: false
        });
    };

    const closeConfirmation = () => {
        setConfirmationModal({
            isOpen: false,
            type: '',
            title: '',
            message: '',
            action: null,
            processing: false
        });
    };

    const executeConfirmedAction = async () => {
        if (confirmationModal.action) {
            setConfirmationModal(prev => ({ ...prev, processing: true }));
            try {
                await confirmationModal.action();
                closeConfirmation();
            } catch (error) {
                setConfirmationModal(prev => ({ ...prev, processing: false }));
                showPopup('error', `Action failed: ${error.message}`);
            }
        }
    };

    const handleSelectShipment = (shipmentId) => {
        const newSelected = new Set(selectedShipments);
        if (newSelected.has(shipmentId)) {
            newSelected.delete(shipmentId);
        } else {
            newSelected.add(shipmentId);
        }
        setSelectedShipments(newSelected);
    };

    // Handle select all shipments functionality
    const handleSelectAll = (e) => {
        e.stopPropagation();
        const filteredShipmentIds = getFilteredShipments().map(s => s._id || s.id);

        if (selectedShipments.size === filteredShipmentIds.length) {
            setSelectedShipments(new Set());
        } else {
            setSelectedShipments(new Set(filteredShipmentIds));
        }
    };

    // Function to verify shipment - updates status and confirmed flag
    const handleVerifyShipment = async (shipmentId) => {
        const shipment = shipments.find(s => (s._id || s.id) === shipmentId);
        
        // Show beautiful confirmation modal for individual verification
        showConfirmation(
            'verify',
            'Verify Shipment',
            `Are you sure you want to verify shipment "${shipment?.trackingNumber || shipmentId}"? This will confirm the shipment and update its status to "Verified".`,
            async () => await performSingleVerify(shipmentId)
        );
    };

    // Separated single verify logic
    const performSingleVerify = async (shipmentId) => {
        setProcessingShipment(shipmentId);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/${shipmentId}/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to verify shipment');
            }

            await response.json(); // Parse response to ensure request completed

            // Update local state with verified status and confirmed flag
            setShipments(prevShipments =>
                prevShipments.map(shipment =>
                    (shipment._id || shipment.id) === shipmentId
                        ? { ...shipment, status: 'Verified', confirmed: true }
                        : shipment
                )
            );

            showPopup('success', 'Shipment verified and confirmed successfully! Ready for processing.');
        } catch (err) {
            showPopup('error', `Error verifying shipment: ${err.message}`);
        } finally {
            setProcessingShipment(null);
        }
    };

    // Helper function to determine branch position in shipment route
    const getBranchPosition = (shipment, staffBranchId) => {
        if (!shipment.route || !Array.isArray(shipment.route) || !staffBranchId) {
            return null;
        }

        const route = shipment.route;
        const branchIndex = route.findIndex(branch => {
            const branchId = typeof branch === 'object' ? branch._id || branch.id : branch;
            return branchId === staffBranchId;
        });

        if (branchIndex === -1) return null; // Branch not in route

        if (branchIndex === 0) return 'first';
        if (branchIndex === route.length - 1) return 'last';
        return 'intermediate';
    };

    // Function to handle "Inform Dispatch" action
    const handleInformDispatch = async (shipmentId) => {
        try {
            setProcessingShipment(shipmentId);
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/${shipmentId}/dispatch`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'Dispatched' })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to dispatch shipment');
            }

            // Update the shipment in local state
            setShipments(prevShipments =>
                prevShipments.map(shipment =>
                    shipment._id === shipmentId || shipment.id === shipmentId
                        ? { ...shipment, status: 'Dispatched' }
                        : shipment
                )
            );

            showPopup('success', 'Shipment dispatched successfully! Parcels have been updated to InTransit status.');
            await fetchShipments(); // Refresh the list
        } catch (err) {
            showPopup('error', `Error dispatching shipment: ${err.message}`);
        } finally {
            setProcessingShipment(null);
        }
    };

    // Function to handle "Finish Delivery" action
    const handleFinishDelivery = async (shipmentId) => {
        try {
            setProcessingShipment(shipmentId);
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/${shipmentId}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'Completed' })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to complete shipment');
            }

            // Update the shipment in local state
            setShipments(prevShipments =>
                prevShipments.map(shipment =>
                    shipment._id === shipmentId || shipment.id === shipmentId
                        ? { ...shipment, status: 'Completed' }
                        : shipment
                )
            );

            showPopup('success', 'Shipment delivered successfully! Parcels have been updated to ArrivedAtCollectionCenter status.');
            await fetchShipments(); // Refresh the list
        } catch (err) {
            showPopup('error', `Error completing shipment: ${err.message}`);
        } finally {
            setProcessingShipment(null);
        }
    };

    const handleDeleteShipment = async (shipmentId) => {
        const shipment = shipments.find(s => (s._id || s.id) === shipmentId);
        
        // Prevent deletion of shipments in certain stages
        if (shipment && ['In Transit', 'Dispatched', 'Completed'].includes(shipment.status)) {
            showPopup('warning', `Cannot delete shipment in "${shipment.status}" status. Only Pending and Verified shipments can be deleted.`);
            return;
        }
        
        // Show beautiful confirmation modal for individual deletion
        showConfirmation(
            'delete',
            'Delete Shipment',
            `Are you sure you want to delete shipment "${shipment?.trackingNumber || shipmentId}"? This action cannot be undone and will reset the associated parcels to ArrivedAtCollectionCenter status.`,
            async () => await performSingleDelete(shipmentId)
        );
    };

    // Separated single delete logic
    const performSingleDelete = async (shipmentId) => {
        setProcessingShipment(shipmentId);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/${shipmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete shipment');
            }

            const data = await response.json();

            setShipments(prevShipments =>
                prevShipments.filter(shipment => (shipment._id || shipment.id) !== shipmentId)
            );

            const newSelected = new Set(selectedShipments);
            newSelected.delete(shipmentId);
            setSelectedShipments(newSelected);

            showPopup('success', `Shipment deleted successfully! ${data.updatedParcelsCount} parcels have been reset to ArrivedAtCollectionCenter status.`);
        } catch (err) {
            showPopup('error', `Error deleting shipment: ${err.message}`);
        } finally {
            setProcessingShipment(null);
        }
    };

    // PHASE 2 - Vehicle Assignment Function - Show selection modal (Manual vs Smart)
    const handleAssignVehicle = async (shipmentId) => {
        const shipment = shipments.find(s => (s._id || s.id) === shipmentId);
        
        if (!shipment) {
            showPopup('error', 'Shipment not found');
            return;
        }

        // Reset states
        setFoundVehicle(null);
        setAssignmentResult(null);
        setManualVehicleInput('');
        setSmartSearchResult(null);

        // Show initial selection modal (Manual or Smart)
        setVehicleSelectionModal({
            shipmentId,
            shipment,
            deliveryType: shipment.deliveryType
        });
    };

    // Handle manual vehicle assignment
    const handleManualAssignment = async () => {
        if (!vehicleSelectionModal || !manualVehicleInput.trim()) {
            showPopup('warning', 'Please enter vehicle registration number');
            return;
        }

        const { shipmentId } = vehicleSelectionModal;
        setSearchingVehicle(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vehicles/b2b/shipments/${shipmentId}/assign-vehicle/manual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vehicleRegistration: manualVehicleInput.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    showPopup('error', 'Vehicle not found with the provided registration number');
                } else if (response.status === 400 && data.message.includes('Vehicle Not Capable')) {
                    showPopup('error', `${data.message}: ${data.details.type === 'weight' ? 'Weight' : 'Volume'} capacity insufficient`);
                } else {
                    throw new Error(data.message || 'Failed to assign vehicle');
                }
                return;
            }

            if (data.success) {
                // Vehicle assigned successfully
                showPopup('success', 'Vehicle assigned successfully! Shipment is now In Transit and parcels updated to ShipmentAssigned status.');
                setVehicleSelectionModal(null);
                
                // Update local state with complete vehicle and driver information including current location
                setShipments(prevShipments =>
                    prevShipments.map(s =>
                        (s._id || s.id) === shipmentId
                            ? { 
                                ...s, 
                                status: data.data.shipment.status,
                                assignedVehicle: {
                                    ...data.data.shipment.assignedVehicle,
                                    currentLocation: data.data.vehicle.currentLocation,
                                    currentBranch: data.data.vehicle.currentBranch
                                },
                                assignedDriver: data.data.shipment.assignedDriver
                            }
                            : s
                    )
                );

                // Refresh data to get updated information
                fetchShipments();
            }

        } catch (error) {
            console.error('Error in manual vehicle assignment:', error);
            showPopup('error', `Failed to assign vehicle: ${error.message}`);
        } finally {
            setSearchingVehicle(false);
        }
    };

    // Smart vehicle assignment handler
    const handleEnhancedSmartAssignment = async () => {
        if (!vehicleSelectionModal) return;

        const { shipmentId } = vehicleSelectionModal;
        setSearchingVehicle(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vehicles/b2b/shipments/${shipmentId}/${vehicleSelectionModal.deliveryType}/enhanced-find-vehicle`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    showPopup('error', (data.message || 'No suitable vehicle available'), 5000);
                } else {
                    throw new Error(data.message || 'Failed to search for vehicles');
                }
                setVehicleSelectionModal(null);
                return;
            }

            if (data.success) {
                // Update the modal with enhanced search results
                setSmartSearchResult(data);
                
                if (data.step === 'vehicle_at_source') {
                    // Vehicle found at source - show direct assignment confirmation
                    setVehicleSelectionModal(prev => ({ 
                        ...prev, 
                        step: 'confirm_direct_assignment',
                        enhancedResult: data
                    }));
                    showPopup('success', 'Vehicle found at source location! Ready for assignment.');
                } else if (data.step === 'vehicle_from_other_center') {
                    // Vehicle found from another center - show parcel options
                    setVehicleSelectionModal(prev => ({ 
                        ...prev, 
                        step: 'parcel_selection_options',
                        enhancedResult: data
                    }));
                    showPopup('success', 'Vehicle found from another center! Choose assignment option.');
                }
            }

        } catch (error) {
            console.error('Error in enhanced vehicle search:', error);
            showPopup('error', `Failed to search for vehicle: ${error.message}`);
            setVehicleSelectionModal(null);
        } finally {
            setSearchingVehicle(false);
        }
    };

    // Handle "Assign Vehicle Only" option
    const handleAssignVehicleOnly = async () => {
        if (!vehicleSelectionModal?.enhancedResult) return;
        
        // Set the mode to indicate user chose "Assign Vehicle Only"
        setAssignVehicleOnlyMode(true);
        setConfirmingAssignment(true);
        
        try {
            const { shipmentId } = vehicleSelectionModal;
            const { vehicle } = vehicleSelectionModal.enhancedResult;
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vehicles/b2b/shipments/${shipmentId}/assign-vehicle/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    vehicleId: vehicle.vehicleId,
                    checkParcels: false
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to assign vehicle');
            }

            if (data.success) {
                showPopup('success', 'Vehicle assigned successfully! Shipment is now In Transit and parcels updated to ShipmentAssigned status.');
                setVehicleSelectionModal(null);
                setSmartSearchResult(null);
                setAssignVehicleOnlyMode(false);
                
                // Update local state
                updateShipmentInState(shipmentId, data.shipment);
                fetchShipments();
            }

        } catch (error) {
            console.error('ERROR: Error assigning vehicle only:', error);
            showPopup('error', `Failed to assign vehicle: ${error.message}`);
        } finally {
            setConfirmingAssignment(false);
            setAssignVehicleOnlyMode(false);
        }
    };

    // Handle "Check for Parcels" option
    const handleCheckForParcels = () => {
        if (!vehicleSelectionModal?.enhancedResult) return;
        
        // Move to parcel selection view
        setVehicleSelectionModal(prev => ({
            ...prev,
            step: 'parcel_group_selection'
        }));
        
        // Reset selection states
        setSelectedParcelGroups({});
    };

    // Calculate selected parcels summary
    const calculateSelectedParcelsSummary = () => {
        if (!vehicleSelectionModal?.enhancedResult?.availableParcelGroups || Object.keys(selectedParcelGroups).length === 0) {
            return { totalParcels: 0, totalWeight: 0, totalVolume: 0 };
        }

        // SAFE EXTRACTION: Get parcel groups with multiple fallback strategies
        let parcelGroups = null;
        const result = vehicleSelectionModal.enhancedResult;
        
        if (result.availableParcelGroups?.parcelGroups) {
            parcelGroups = result.availableParcelGroups.parcelGroups;
        } else if (result.availableParcelGroups && typeof result.availableParcelGroups === 'object') {
            const keys = Object.keys(result.availableParcelGroups);
            const groupKeys = keys.filter(key => key !== 'totalParcels' && key !== 'summary');
            if (groupKeys.length > 0) {
                parcelGroups = result.availableParcelGroups;
            }
        } else if (result.parcelGroups) {
            parcelGroups = result.parcelGroups;
        }

        if (!parcelGroups) {
            return { totalParcels: 0, totalWeight: 0, totalVolume: 0 };
        }

        let totalParcels = 0;
        let totalWeight = 0;
        let totalVolume = 0;

        Object.entries(selectedParcelGroups).forEach(([groupId, isSelected]) => {
            if (isSelected && parcelGroups[groupId]) {
                const group = parcelGroups[groupId];
                totalParcels += group.parcelCount;
                totalWeight += group.totalWeight;
                totalVolume += group.totalVolume;
            }
        });

        return { totalParcels, totalWeight, totalVolume };
    };

    // Handle adding parcels to current shipment
    const handleAddParcelsToCurrentShipment = async () => {
        if (!vehicleSelectionModal?.enhancedResult) return;
        
        setConfirmingAssignment(true);
        
        try {
            const { shipmentId } = vehicleSelectionModal;
            const { vehicle } = vehicleSelectionModal.enhancedResult;
            
            // Safe extraction: Handle different parcel group structures
            let parcelGroups = null;
            const result = vehicleSelectionModal.enhancedResult;
            
            if (result.availableParcelGroups?.parcelGroups) {
                parcelGroups = result.availableParcelGroups.parcelGroups;
            } else if (result.availableParcelGroups && typeof result.availableParcelGroups === 'object') {
                const keys = Object.keys(result.availableParcelGroups);
                const groupKeys = keys.filter(key => key !== 'totalParcels' && key !== 'summary' && key !== 'constraints' && key !== 'totalGroupsFound' && key !== 'totalParcelsFound');
                
                if (groupKeys.length > 0) {
                    const filteredGroups = {};
                    groupKeys.forEach(key => {
                        filteredGroups[key] = result.availableParcelGroups[key];
                    });
                    parcelGroups = filteredGroups;
                }
            } else if (result.parcelGroups) {
                parcelGroups = result.parcelGroups;
            }
            
            if (!parcelGroups) {
                throw new Error('No parcel groups found in the enhanced result');
            }
            
            // Collect selected parcel IDs
            const selectedParcelIds = [];
            
            Object.entries(selectedParcelGroups).forEach(([groupId, isSelected]) => {
                if (isSelected && parcelGroups[groupId]) {
                    if (parcelGroups[groupId].parcels && Array.isArray(parcelGroups[groupId].parcels)) {
                        parcelGroups[groupId].parcels.forEach(parcel => {
                            const parcelId = parcel._id || parcel.id;
                            if (parcelId) {
                                selectedParcelIds.push(parcelId);
                            }
                        });
                    }
                }
            });
            
            if (selectedParcelIds.length === 0) {
                throw new Error('No parcels selected for addition to shipment');
            }
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vehicles/b2b/shipments/${shipmentId}/add-parcels-to-current`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedParcelIds: selectedParcelIds,
                    vehicleId: vehicle.vehicleId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add parcels to current shipment');
            }

            if (data.success) {
                const summary = calculateSelectedParcelsSummary();
                
                showPopup('success', `Successfully added ${summary.totalParcels} parcels to shipment! New totals: ${data.data.updatedTotals.totalWeight}kg, ${data.data.updatedTotals.totalVolume}m³`);
                
                setVehicleSelectionModal(null);
                setSmartSearchResult(null);
                setSelectedParcelGroups({});
                
                // Update local state
                updateShipmentInState(shipmentId, {
                    status: 'In Transit',
                    assignedVehicle: vehicle,
                    totalWeight: data.data.updatedTotals.totalWeight,
                    totalVolume: data.data.updatedTotals.totalVolume,
                    parcelCount: data.data.updatedTotals.parcelCount
                });
                
                fetchShipments();
            }

        } catch (error) {
            console.error('ERROR: Error adding parcels to current shipment:', error);
            showPopup('error', `Failed to add parcels: ${error.message}`);
        } finally {
            setConfirmingAssignment(false);
        }
    };

    // Helper function to update shipment in state
    const updateShipmentInState = (shipmentId, updatedShipment) => {
        setShipments(prevShipments =>
            prevShipments.map(s =>
                (s._id || s.id) === shipmentId ? { ...s, ...updatedShipment } : s
            )
        );
    };

    // Parcel group selection handlers
    const handleParcelGroupSelection = (groupId, selected) => {
        setSelectedParcelGroups(prev => ({
            ...prev,
            [groupId]: selected
        }));
    };

    const toggleParcelSelectionView = () => {
        setShowParcelSelection(!showParcelSelection);
        setSelectedParcelGroups({});
    };

    // Confirm smart vehicle assignment
    const confirmSmartAssignment = async (checkParcels = false) => {
        if (!vehicleSelectionModal || !smartSearchResult) return;

        // Set the mode when user chooses "Assign Only"
        if (!checkParcels) {
            setAssignVehicleOnlyMode(true);
        }

        if (checkParcels && !showParcelSelection) {
            // First time clicking "Check for Parcels" - show parcel selection UI
            setShowParcelSelection(true);
            return;
        }

        const { shipmentId } = vehicleSelectionModal;
        const { vehicle } = smartSearchResult;
        
        setConfirmingAssignment(true);

        try {
            // Collect selected parcel IDs from selected groups
            const selectedParcelIds = [];
            if (checkParcels && smartSearchResult.availableParcelGroups) {
                Object.entries(selectedParcelGroups).forEach(([groupId, isSelected]) => {
                    if (isSelected && smartSearchResult.availableParcelGroups.parcelGroups[groupId]) {
                        const parcels = smartSearchResult.availableParcelGroups.parcelGroups[groupId].parcels;
                        selectedParcelIds.push(...parcels.map(p => p._id));
                    }
                });
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vehicles/b2b/shipments/${shipmentId}/assign-vehicle/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    vehicleId: vehicle.vehicleId || vehicle._id,
                    selectedParcelIds: selectedParcelIds,
                    checkParcels: checkParcels
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to confirm vehicle assignment');
            }

            if (data.success) {
                showPopup('success', 'Vehicle assigned successfully! Shipment is now In Transit and parcels updated to ShipmentAssigned status.');
                setVehicleSelectionModal(null);
                
                // Update local state with complete vehicle and driver information including current location
                setShipments(prevShipments =>
                    prevShipments.map(s =>
                        (s._id || s.id) === shipmentId
                            ? { 
                                ...s, 
                                status: data.data.shipmentDetails.status,
                                assignedVehicle: {
                                    ...data.data.shipmentDetails.assignedVehicle,
                                    currentLocation: data.data.vehicle.currentLocation,
                                    currentBranch: data.data.vehicle.currentBranch
                                },
                                assignedDriver: data.data.shipmentDetails.assignedDriver
                            }
                            : s
                    )
                );

                // Refresh data to get updated information
                fetchShipments();

                // Show reverse shipment details if created
                if (data.data.reverseShipment) {
                    showPopup('info', `Reverse shipment created with ID: ${data.data.reverseShipment.reverseShipmentId}`, 7000);
                }
            }

        } catch (error) {
            console.error('Error confirming vehicle assignment:', error);
            showPopup('error', `Failed to confirm assignment: ${error.message}`);
        } finally {
            setConfirmingAssignment(false);
            setAssignVehicleOnlyMode(false);
        }
    };

    // Close vehicle selection modal
    const closeVehicleSelectionModal = () => {
        setVehicleSelectionModal(null);
        setManualVehicleInput('');
        setSmartSearchResult(null);
        setSearchingVehicle(false);
        setConfirmingAssignment(false);
        setSelectedParcelGroups([]);
        setShowParcelSelection(false);
        setAssignVehicleOnlyMode(false); // Reset the "Assign Vehicle Only" mode
    };

    // === STANDARD SHIPMENT FUNCTIONS ===

    // Show standard shipment find more parcels functionality
    const showStandardParcelsModal = async (shipmentId) => {
        const shipment = shipments.find(s => (s._id || s.id) === shipmentId);
        if (!shipment) {
            showPopup('error', 'Shipment not found');
            return;
        }

        // Check if it's a standard shipment
        if (shipment.deliveryType?.toLowerCase() !== 'standard') {
            showPopup('error', 'This feature is only available for Standard shipments');
            return;
        }

        // Check if it's in transit
        if (shipment.status !== 'In Transit') {
            showPopup('error', 'Can only add parcels to shipments that are In Transit');
            return;
        }

        // Check if vehicle is assigned
        if (!shipment.assignedVehicle) {
            showPopup('error', 'Vehicle must be assigned before adding additional parcels');
            return;
        }

        // Open the enhanced add more parcels modal
        setAddMoreParcelsModal({ 
            isOpen: true, 
            shipmentId,
            step: 'selection'
        });
    };

    // Add more parcels to standard shipment
    const addMoreParcelsToStandardShipment = async (shipmentId) => {
        setAddingStandardParcels(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/b2b/standard-shipments/${shipmentId}/add-more`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add more parcels');
            }

            if (data.success) {
                showPopup('success', `${data.message}`);
                
                // Update local shipment state with new totals
                setShipments(prevShipments =>
                    prevShipments.map(s =>
                        (s._id || s.id) === shipmentId
                            ? {
                                ...s,
                                totalWeight: data.data.newTotals.weight,
                                totalVolume: data.data.newTotals.volume,
                                parcelCount: data.data.newTotals.parcelCount
                            }
                            : s
                    )
                );

                // Close modal and refresh data
                closeStandardParcelsModal();
                fetchShipments();
                
                // Show detailed information about added parcels
                const addedInfo = data.data.addedParcels.map(p => 
                    `${p.parcelId} (${p.from} → ${p.to})`
                ).join(', ');
                
                if (addedInfo) {
                    setTimeout(() => {
                        showPopup('info', `Added parcels: ${addedInfo}`, 5000);
                    }, 1000);
                }
            }

        } catch (error) {
            console.error('Error adding more parcels to standard shipment:', error);
            showPopup('error', `Failed to add more parcels: ${error.message}`);
        } finally {
            setAddingStandardParcels(false);
        }
    };

    // Validate and add manual parcel
    const validateAndAddManualParcel = async () => {
        if (!manualParcelId.trim()) {
            showPopup('warning', 'Please enter a parcel ID');
            return;
        }

        setValidatingParcel(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/parcels/validate-for-shipment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parcelId: manualParcelId.trim(),
                    shipmentId: addMoreParcelsModal.shipmentId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to validate parcel');
            }

            if (data.success) {
                // Add the validated parcel to the shipment
                await addManualParcelToShipment(data.parcel._id);
            }

        } catch (error) {
            console.error('Error validating parcel:', error);
            showPopup('error', `Validation failed: ${error.message}`);
        } finally {
            setValidatingParcel(false);
        }
    };

    // Add manual parcel to shipment
    const addManualParcelToShipment = async (parcelId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/b2b/standard-shipments/${addMoreParcelsModal.shipmentId}/add-manual-parcel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parcelId: parcelId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add parcel');
            }

            if (data.success) {
                showPopup('success', `Parcel added successfully!`);
                
                // Update local shipment state
                setShipments(prevShipments =>
                    prevShipments.map(s =>
                        (s._id || s.id) === addMoreParcelsModal.shipmentId
                            ? {
                                ...s,
                                totalWeight: data.data.newTotals.weight,
                                totalVolume: data.data.newTotals.volume,
                                parcelCount: data.data.newTotals.parcelCount
                            }
                            : s
                    )
                );

                // Close modal and refresh data
                closeAddMoreParcelsModal();
                fetchShipments();
            }

        } catch (error) {
            console.error('Error adding manual parcel:', error);
            showPopup('error', `Failed to add parcel: ${error.message}`);
        }
    };

    // Process smart parcel assignment
    const processSmartParcelAssignment = async () => {
        setProcessingSmart(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/b2b/standard-shipments/${addMoreParcelsModal.shipmentId}/add-more`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    searchOnly: true // Only search for parcels, don't update shipment IDs yet
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to find parcels');
            }

            if (data.success) {
                setSmartParcelsResults(data.data);
                setAddMoreParcelsModal(prev => ({ ...prev, step: 'smart-results' }));
            }

        } catch (error) {
            console.error('Error processing smart assignment:', error);
            showPopup('error', `Failed to find parcels: ${error.message}`);
        } finally {
            setProcessingSmart(false);
        }
    };

    // Confirm smart parcels addition
    const confirmSmartParcelsAddition = async () => {
        try {
            // Make the actual API call to update shipment IDs
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/b2b/standard-shipments/${addMoreParcelsModal.shipmentId}/add-more`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    searchOnly: false, // Actually update shipment IDs
                    parcelIds: smartParcelsResults.addedParcels?.map(p => p._id) || []
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add parcels');
            }

            showPopup('success', `Successfully added ${smartParcelsResults.addedParcels.length} parcels!`);
            
            // Update local shipment state
            setShipments(prevShipments =>
                prevShipments.map(s =>
                    (s._id || s.id) === addMoreParcelsModal.shipmentId
                        ? {
                            ...s,
                            totalWeight: smartParcelsResults.newTotals.weight,
                            totalVolume: smartParcelsResults.newTotals.volume,
                            parcelCount: smartParcelsResults.newTotals.parcelCount
                        }
                        : s
                )
            );

            // Close modal and refresh data
            closeAddMoreParcelsModal();
            fetchShipments();

        } catch (error) {
            console.error('Error confirming smart parcels:', error);
            showPopup('error', `Failed to confirm parcels: ${error.message}`);
        }
    };

    // Close add more parcels modal
    const closeAddMoreParcelsModal = () => {
        setAddMoreParcelsModal({ isOpen: false, shipmentId: null, step: 'selection' });
        setManualParcelId('');
        setSmartParcelsResults(null);
        setValidatingParcel(false);
        setProcessingSmart(false);
        setAddingStandardParcels(false);
    };

    // Close standard parcels modal
    const closeStandardParcelsModal = () => {
        setStandardParcelsModal({ isOpen: false, shipmentId: null });
        setLoadingStandardParcels(false);
        setAddingStandardParcels(false);
    };

    // Function to find available vehicle
    const findAvailableVehicle = async () => {
        if (!vehicleAssignmentModal) return;

        const { shipmentId, deliveryType } = vehicleAssignmentModal;
        
        setFindingVehicle(true);
        showPopup('info', 'Searching for available vehicles...', 5000);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vehicles/findVehicleForShipment/${shipmentId}/${deliveryType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to find vehicle');
            }

            if (!data.success) {
                showPopup('error', data.message || 'No suitable vehicle found');
                setVehicleAssignmentModal(null);
                return;
            }

            // Store found vehicle and update modal step
            setFoundVehicle(data.data);
            setVehicleAssignmentModal(prev => ({ ...prev, step: 'vehicleFound' }));
            showPopup('success', 'Vehicle found! Please review and confirm assignment.', 5000);

        } catch (err) {
            console.error('Error finding vehicle:', err);
            showPopup('error', `Failed to find vehicle: ${err.message}`, 6000);
            setVehicleAssignmentModal(null);
        } finally {
            setFindingVehicle(false);
        }
    };

    // Function to confirm and execute vehicle assignment
    const confirmVehicleAssignment = async () => {
        if (!vehicleAssignmentModal || !foundVehicle) return;

        // Check if vehicle needs transport (not at source)
        if (foundVehicle.vehicle && !foundVehicle.vehicle.isAtSource) {
            // Vehicle is from another center - find parcels for reverse shipment
            await findParcelsForReverseShipment();
        } else {
            // Vehicle is at source - proceed with direct assignment
            await executeVehicleAssignment(false);
        }
    };

    // Function to find parcels for reverse shipment
    const findParcelsForReverseShipment = async () => {
        if (!vehicleAssignmentModal || !foundVehicle) return;

        const { deliveryType } = vehicleAssignmentModal;
        const { vehicle } = foundVehicle;
        
       // setFindingParcels(true);
        
        try {
            showPopup('info', 'Finding parcels for reverse shipment...', 3000);

            // Get centers: vehicle current location -> shipment source
            const fromCenterId = vehicle.currentBranch; // Where vehicle currently is
            const toCenterId = foundVehicle.shipmentDetails.sourceCenter._id; // Where shipment is (destination for vehicle)
            const vehicleId = vehicle._id;

            console.log('Finding parcels with params:', {
                fromCenterId: `${fromCenterId} (${vehicle.currentLocation})`,
                toCenterId: `${toCenterId} (${foundVehicle.shipmentDetails.sourceCenter.location})`,
                deliveryType,
                vehicleId,
                note: 'Looking for parcels that need to go in same direction as vehicle movement'
            });

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vehicles/findParcelsForReverseShipment?fromCenterId=${fromCenterId}&toCenterId=${toCenterId}&shipmentType=${deliveryType}&vehicleId=${vehicleId}`);
            
            const data = await response.json();
            console.log('Parcel finding response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to find parcels for reverse shipment');
            }

            setFoundParcels(data);
            
            if (data.success) {
                if (data.parcels && data.parcels.length > 0) {
                    // Show parcels found - let user confirm
                    setVehicleAssignmentModal(prev => ({ ...prev, step: 'parcels-found' }));
                    setSelectedParcelsForReverse(data.parcels.map(p => p._id)); // Select all by default
                    showPopup('success', `Found ${data.parcels.length} parcels for reverse shipment!`, 4000);
                } else {
                    // No parcels found or none can fit - show option to proceed or cancel
                    setVehicleAssignmentModal(prev => ({ ...prev, step: 'parcels-found' }));
                    showPopup('info', data.message || 'No parcels found for reverse shipment', 4000);
                }
            } else {
                // Error case - show option to proceed without reverse shipment
                showPopup('warning', data.message || 'Could not find parcels for reverse shipment', 4000);
                setVehicleAssignmentModal(prev => ({ ...prev, step: 'parcels-found' }));
            }
        } catch (error) {
            console.error('Error finding parcels for reverse shipment:', error);
            showPopup('error', `Error finding parcels: ${error.message}`, 5000);
            // Show option to proceed without reverse shipment
            setVehicleAssignmentModal(prev => ({ ...prev, step: 'parcels-found' }));
        } finally {
            //setFindingParcels(false);
        }
    };

    // Function to handle reverse shipment decision
    const handleReverseShipmentDecision = async (createReverse) => {
        if (createReverse && foundParcels && foundParcels.parcels?.length > 0) {
            // User wants to create reverse shipment with found parcels
            await confirmReverseShipmentCreation();
        } else {
            // User chose to proceed without reverse shipment
            await executeVehicleAssignment(false);
        }
    };

    // Function to confirm reverse shipment creation
    const confirmReverseShipmentCreation = async () => {
        if (!foundParcels || selectedParcelsForReverse.length === 0) {
            showPopup('warning', 'Please select at least one parcel for reverse shipment.', 4000);
            return;
        }

        setCreatingReverseShipment(true);
        
        try {
            showPopup('info', 'Creating reverse shipment...', 3000);

            const { deliveryType, shipmentId } = vehicleAssignmentModal;
            const { vehicle } = foundVehicle;

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vehicles/createReverseShipmentWithParcels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vehicleId: vehicle._id,
                    fromCenterId: vehicle.currentBranch, // Where vehicle currently is
                    toCenterId: foundVehicle.shipmentDetails.sourceCenter._id, // Where shipment is (destination for vehicle)
                    shipmentType: deliveryType,
                    selectedParcelIds: selectedParcelsForReverse,
                    originalShipmentId: shipmentId,
                    createdByCenter: foundVehicle.shipmentDetails.sourceCenter._id // Center that requested the vehicle
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create reverse shipment');
            }

            // Now proceed with main vehicle assignment
            await executeVehicleAssignment(true, data);
        } catch (error) {
            console.error('Error creating reverse shipment:', error);
            showPopup('error', `Error creating reverse shipment: ${error.message}`, 5000);
            // Proceed with assignment without reverse shipment
            await executeVehicleAssignment(false);
        } finally {
            setCreatingReverseShipment(false);
        }
    };

    // Function to skip reverse shipment
    // Function to execute the actual vehicle assignment
    const executeVehicleAssignment = async (withReverseShipment = false, reverseShipmentData = null) => {
        if (!vehicleAssignmentModal || !foundVehicle) return;

        const { shipmentId, deliveryType } = vehicleAssignmentModal;
        
        setAssigningVehicle(true);
        setProcessingShipment(shipmentId);

        try {
            showPopup('info', 'Assigning vehicle to shipment...', 5000);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/vehicles/assignVehicleToShipment/${shipmentId}/${deliveryType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to assign vehicle');
            }

            // Combine assignment result with reverse shipment data
            const combinedResult = {
                ...data.data,
                reverseShipment: reverseShipmentData || null,
                reverseShipmentCreated: withReverseShipment
            };

            // Store assignment result and update modal step
            setAssignmentResult(combinedResult);
            setVehicleAssignmentModal(prev => ({ ...prev, step: 'assigned' }));

            // Update local shipment state
            setShipments(prevShipments =>
                prevShipments.map(shipment =>
                    (shipment._id || shipment.id) === shipmentId
                        ? { 
                            ...shipment, 
                            assignedVehicle: data.data.vehicle,
                            status: data.data.success ? 'In Transit' : shipment.status
                        }
                        : shipment
                )
            );

            // Show success message
            showPopup('success', 'Vehicle assigned successfully! Shipment is now In Transit and parcels updated to ShipmentAssigned status.', 7000);

            // Refresh shipments to get latest data
            setTimeout(() => {
                fetchShipments();
            }, 2000);

        } catch (err) {
            console.error('Error assigning vehicle:', err);
            showPopup('error', `Failed to assign vehicle: ${err.message}`, 6000);
            setVehicleAssignmentModal(null);
        } finally {
            setAssigningVehicle(false);
            setProcessingShipment(null);
        }
    };

    // Function to close assignment modal and reset states
    const closeAssignmentModal = () => {
        setVehicleAssignmentModal(null);
        setFoundVehicle(null);
        setAssignmentResult(null);
        setFindingVehicle(false);
        setAssigningVehicle(false);
    };

    // Bulk verify operation for selected shipments
    const handleBulkVerify = async () => {
        const pendingShipments = shipments.filter(s =>
            selectedShipments.has(s._id || s.id) && s.status === 'Pending' 
        );

        if (pendingShipments.length === 0) {
            showPopup('warning', 'No pending shipments selected for verification');
            return;
        }

        // Show beautiful confirmation modal
        showConfirmation(
            'verify',
            'Bulk Verify Shipments',
            `Are you sure you want to verify ${pendingShipments.length} pending shipment${pendingShipments.length > 1 ? 's' : ''}? This action will confirm these shipments and update their status to "Verified".`,
            async () => await performBulkVerify(pendingShipments)
        );
    };

    // Separated bulk verify logic
    const performBulkVerify = async (pendingShipments) => {
        try {
            const promises = pendingShipments.map(shipment =>
                fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/${shipment._id || shipment.id}/verify`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                })
            );

            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.ok).length;
            const failedCount = results.length - successCount;

            if (successCount > 0) {
                // Update local state for all verified shipments
                setShipments(prevShipments =>
                    prevShipments.map(shipment =>
                        selectedShipments.has(shipment._id || shipment.id) && shipment.status === 'Pending'
                            ? { ...shipment, status: 'Verified', confirmed: true }
                            : shipment
                    )
                );

                if (failedCount === 0) {
                    showPopup('success', `🎉 Successfully verified ${successCount} shipment${successCount > 1 ? 's' : ''}! All shipments are now confirmed and ready for processing.`);
                } else {
                    showPopup('warning', `✅ ${successCount} shipment${successCount > 1 ? 's' : ''} verified successfully, ❌ ${failedCount} failed to verify.`);
                }
                
                // Clear selections after successful operation
                setSelectedShipments(new Set());
            } else {
                showPopup('error', '❌ All shipments failed to verify. Please check your connection and try again.');
            }
        } catch (err) {
            showPopup('error', `❌ Error in bulk verification: ${err.message}`);
        }
    };

    // Bulk delete operation for selected shipments
    const handleBulkDelete = async () => {
        const selectedShipmentIds = Array.from(selectedShipments);

        if (selectedShipmentIds.length === 0) {
            showPopup('warning', 'No shipments selected for deletion');
            return;
        }

        // Check if any selected shipments are in protected stages
        const protectedShipments = shipments.filter(s => 
            selectedShipments.has(s._id || s.id) && 
            ['In Transit', 'Dispatched', 'Completed'].includes(s.status)
        );

        if (protectedShipments.length > 0) {
            const protectedStatuses = [...new Set(protectedShipments.map(s => s.status))].join(', ');
            showPopup('warning', `⚠️ Cannot delete ${protectedShipments.length} shipment(s) in "${protectedStatuses}" status. Only Pending and Verified shipments can be deleted.`);
            return;
        }

        // Show beautiful confirmation modal
        showConfirmation(
            'delete',
            'Delete Shipments',
            `Are you sure you want to delete ${selectedShipmentIds.length} shipment${selectedShipmentIds.length > 1 ? 's' : ''}? This action cannot be undone and will reset the associated parcels to ArrivedAtCollectionCenter status.`,
            async () => await performBulkDelete(selectedShipmentIds)
        );
    };

    // Separated bulk delete logic
    const performBulkDelete = async (selectedShipmentIds) => {
        try {
            const promises = selectedShipmentIds.map(shipmentId =>
                fetch(`${import.meta.env.VITE_BACKEND_URL}/shipments/${shipmentId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })
            );

            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.ok).length;
            const failedCount = results.length - successCount;

            if (successCount > 0) {
                // Remove deleted shipments from local state
                setShipments(prevShipments =>
                    prevShipments.filter(shipment => !selectedShipments.has(shipment._id || shipment.id))
                );
                setSelectedShipments(new Set());

                if (failedCount === 0) {
                    showPopup('success', `Successfully deleted ${successCount} shipment${successCount > 1 ? 's' : ''}! Associated parcels have been reset.`);
                } else {
                    showPopup('warning', `${successCount} shipment${successCount > 1 ? 's' : ''} deleted successfully, ❌ ${failedCount} failed to delete.`);
                }
            } else {
                showPopup('error', 'All shipments failed to delete. Please check your connection and try again.');
            }
        } catch (err) {
            showPopup('error', `Error in bulk deletion: ${err.message}`);
        }
    };

    // Filter shipments based on delivery type, status, and search term
    const getFilteredShipments = () => {
        return shipments.filter(shipment => {
            const matchesDeliveryType = deliveryTypeFilter === 'all' || shipment.deliveryType === deliveryTypeFilter;
            const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;
            const matchesSearch = searchTerm === '' ||
                (shipment.shipmentId && shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (shipment.status && shipment.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (shipment.sourceCenter?.location && shipment.sourceCenter.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (shipment.sourceCenter?.branchId && shipment.sourceCenter.branchId.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesDeliveryType && matchesStatus && matchesSearch;
        });
    };

    // Get status badge styling
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'In Transit': return 'bg-blue-100 text-blue-800';
            case 'Dispatched': return 'bg-orange-100 text-orange-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get action buttons based on shipment status, branch position, and delivery type
    const getActionButtons = (shipment) => {
        const shipmentId = shipment._id || shipment.id;
        const isProcessing = processingShipment === shipmentId;
        const branchPosition = getBranchPosition(shipment, staffBranchId);
        const deliveryType = shipment.deliveryType?.toLowerCase() || 'express';

        // For pending shipments: show verify and delete buttons (existing behavior)
        if (shipment.status === 'Pending') {
            if (shipment.assignedVehicle) {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <div className="text-center text-green-600 text-sm">
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-medium">Vehicle & Driver Assigned</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1 space-y-1">
                                {shipment.assignedVehicle.vehicleId && (
                                    <div>Vehicle: {shipment.assignedVehicle.vehicleId}</div>
                                )}
                                {shipment.assignedVehicle.registrationNo && (
                                    <div>Reg: {shipment.assignedVehicle.registrationNo}</div>
                                )}
                                {shipment.assignedDriver?.name && (
                                    <div>Driver: {shipment.assignedDriver.name}</div>
                                )}
                                {shipment.assignedDriver?.contactNo && (
                                    <div>Contact: {shipment.assignedDriver.contactNo}</div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => handleVerifyShipment(shipmentId)}
                            disabled={isProcessing}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
                            title="Verify Shipment"
                        >
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Verify</span>
                        </button>
                        <button
                            onClick={() => handleDeleteShipment(shipmentId)}
                            disabled={isProcessing}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
                            title="Delete Shipment"
                        >
                            <X className="w-4 h-4" />
                            <span className="text-sm font-medium">Delete</span>
                        </button>
                    </div>
                );
            }
        }
        // For verified shipments: check if confirmed before showing assign vehicle button
        else if (shipment.status === 'Verified') {
            if (shipment.confirmed) {
                if (shipment.assignedVehicle) {
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <div className="text-center text-green-600 text-sm">
                                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="font-medium">Vehicle & Driver Assigned</span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1 space-y-1">
                                    {shipment.assignedVehicle.vehicleId && (
                                        <div>Vehicle: {shipment.assignedVehicle.vehicleId}</div>
                                    )}
                                    {shipment.assignedVehicle.registrationNo && (
                                        <div>Reg: {shipment.assignedVehicle.registrationNo}</div>
                                    )}
                                    {shipment.assignedDriver?.name && (
                                        <div>Driver: {shipment.assignedDriver.name}</div>
                                    )}
                                    {shipment.assignedDriver?.contactNo && (
                                        <div>Contact: {shipment.assignedDriver.contactNo}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => handleAssignVehicle(shipmentId)}
                                disabled={isProcessing}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                                title="Assign Vehicle & Driver"
                            >
                                {isProcessing ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Truck className="w-4 h-4" />
                                )}
                                <span className="text-sm font-medium">
                                    {isProcessing ? 'Processing...' : 'Assign Vehicle'}
                                </span>
                            </button>
                        </div>
                    );
                }
            } else {
                return (
                    <div className="text-center text-gray-500 text-sm">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            Awaiting Confirmation
                        </span>
                    </div>
                );
            }
        }
        // Route-based actions for In Transit, Dispatched, and Completed statuses
        else if (['In Transit', 'Dispatched', 'Completed'].includes(shipment.status)) {
            
            // Check if this branch is part of the shipment route
            if (!branchPosition) {
                return (
                    <div className="text-center text-gray-500 text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            Not in Route
                        </span>
                    </div>
                );
            }

            // Status display section
            const statusDisplay = (
                <div className="flex items-center justify-center gap-2 mb-2">
                    {shipment.status === 'In Transit' && <CheckCircle className="w-4 h-4 text-blue-600" />}
                    {shipment.status === 'Dispatched' && <CheckCircle className="w-4 h-4 text-orange-600" />}
                    {shipment.status === 'Completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                    </span>
                </div>
            );

            // FIRST BRANCH ACTIONS
            if (branchPosition === 'first') {
                if (shipment.status === 'In Transit') {
                    // Express: Only "Inform Dispatch"
                    // Standard: "Find More Parcels" + "Inform Dispatch"
                    return (
                        <div className="text-center text-gray-500 text-sm">
                            {statusDisplay}
                            <div className="flex flex-col gap-2">
                                {deliveryType === 'standard' && (
                                    <button
                                        onClick={() => showStandardParcelsModal(shipmentId)}
                                        disabled={isProcessing || addingStandardParcels}
                                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1 transition-colors text-xs"
                                        title="Find More Parcels for Standard Shipment"
                                    >
                                        {addingStandardParcels ? (
                                            <Loader className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Plus className="w-3 h-3" />
                                        )}
                                        <span>{addingStandardParcels ? 'Finding...' : 'Find More Parcels'}</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => handleInformDispatch(shipmentId)}
                                    disabled={isProcessing}
                                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-1 transition-colors text-xs"
                                    title="Inform Dispatch"
                                >
                                    {isProcessing ? (
                                        <Loader className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Send className="w-3 h-3" />
                                    )}
                                    <span>Inform Dispatch</span>
                                </button>
                            </div>
                        </div>
                    );
                }
            }
            
            // INTERMEDIATE BRANCH ACTIONS
            else if (branchPosition === 'intermediate') {
                return (
                    <div className="text-center text-gray-500 text-sm">
                        {statusDisplay}
                        <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-xs">
                            Shipment Ongoing
                        </div>
                    </div>
                );
            }
            
            // LAST BRANCH ACTIONS  
            else if (branchPosition === 'last') {
                if (['In Transit', 'Dispatched'].includes(shipment.status)) {
                    return (
                        <div className="text-center text-gray-500 text-sm">
                            {statusDisplay}
                            <button
                                onClick={() => handleFinishDelivery(shipmentId)}
                                disabled={isProcessing}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1 transition-colors text-xs"
                                title="Finish Delivery"
                            >
                                {isProcessing ? (
                                    <Loader className="w-3 h-3 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-3 h-3" />
                                )}
                                <span>Finish Delivery</span>
                            </button>
                        </div>
                    );
                }
            }

            // Default status display with vehicle info
            return (
                <div className="text-center text-gray-500 text-sm">
                    {statusDisplay}
                    {shipment.assignedVehicle && (
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                            {(shipment.assignedVehicle.vehicleId || shipment.assignedVehicle.registrationNo) && (
                                <div>
                                    Vehicle: {shipment.assignedVehicle.vehicleId || shipment.assignedVehicle.registrationNo}
                                </div>
                            )}
                            {shipment.assignedDriver?.name && (
                                <div>Driver: {shipment.assignedDriver.name}</div>
                            )}
                            {shipment.assignedDriver?.contactNo && (
                                <div>Contact: {shipment.assignedDriver.contactNo}</div>
                            )}
                        </div>
                    )}
                </div>
            );
        }
        
        // Default fallback
        else {
            return (
                <div className="text-center text-gray-500 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                    </span>
                </div>
            );
        }
    };

    // Toggle row expansion for detailed view
    const toggleRowExpansion = (id, e) => {
        e.stopPropagation();
        setExpandedShipmentId(expandedShipmentId === id ? null : id);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredShipments = getFilteredShipments();

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg font-medium text-gray-500">Loading shipments...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-700 font-medium">Error loading shipments:</div>
                <div className="text-red-600">{error}</div>
                <button
                    onClick={fetchShipments}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Loading Overlay for Vehicle Assignment */}
            {assigningVehicle && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
                    <div className="bg-white rounded-xl p-8 flex items-center gap-4 shadow-2xl">
                        <Loader className="w-8 h-8 animate-spin text-blue-600" />
                        <div>
                            <div className="font-semibold text-gray-900">Assigning Vehicle</div>
                            <div className="text-sm text-gray-600">Please wait while we find and assign a suitable vehicle...</div>
                        </div>
                    </div>
                </div>
            )}

            {/* PHASE 2 - Vehicle Selection Modal (Manual vs Smart) */}
            {vehicleSelectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {!vehicleSelectionModal.step ? 'Assign Vehicle to Shipment' :
                                             vehicleSelectionModal.step === 'manual' ? 'Manual Vehicle Assignment' :
                                             vehicleSelectionModal.step === 'smart' ? 'Smart Vehicle Assignment' :
                                             'Confirm Vehicle Assignment'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {!vehicleSelectionModal.step ? 'Choose manual entry or smart search' :
                                             vehicleSelectionModal.step === 'manual' ? 'Enter vehicle registration number' :
                                             vehicleSelectionModal.step === 'smart' ? 'Using 3-step search algorithm' :
                                             'Review and confirm the found vehicle'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeVehicleSelectionModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    disabled={searchingVehicle || confirmingAssignment}
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-6">
                            {/* Shipment Information - Always shown */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5 mb-6">
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Shipment Details
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Shipment ID:</span>
                                            <span className="font-semibold text-gray-800 bg-white px-3 py-1 rounded-full">
                                                {vehicleSelectionModal.shipment.shipmentId}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Delivery Type:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                vehicleSelectionModal.deliveryType === 'express' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {vehicleSelectionModal.deliveryType?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Status:</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                                {vehicleSelectionModal.shipment.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Total Weight:</span>
                                            <span className="font-semibold text-gray-800">
                                                {vehicleSelectionModal.shipment.totalWeight || 'N/A'} kg
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Total Volume:</span>
                                            <span className="font-semibold text-gray-800">
                                                {vehicleSelectionModal.shipment.totalVolume || 'N/A'} m³
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Parcel Count:</span>
                                            <span className="font-semibold text-gray-800">
                                                {vehicleSelectionModal.shipment.parcelCount || vehicleSelectionModal.shipment.parcels?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Initial Selection - Manual vs Smart */}
                            {!vehicleSelectionModal.step && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5 mb-6">
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-amber-600" />
                                            Choose Assignment Method
                                        </h4>
                                        <p className="text-sm text-gray-700 mb-4">
                                            Select how you want to assign a vehicle to this shipment:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setVehicleSelectionModal(prev => ({ ...prev, step: 'manual' }))}
                                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="p-3 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                                                        <Car className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <h5 className="font-semibold text-gray-800 mb-2">Manual Assignment</h5>
                                                    <p className="text-sm text-gray-600">
                                                        Enter a specific vehicle registration number to assign directly
                                                    </p>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => setVehicleSelectionModal(prev => ({ ...prev, step: 'smart' }))}
                                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group"
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="p-3 bg-green-100 rounded-full mb-3 group-hover:bg-green-200 transition-colors">
                                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                                    </div>
                                                    <h5 className="font-semibold text-gray-800 mb-2">Smart Assignment</h5>
                                                    <p className="text-sm text-gray-600">
                                                        Automatically find the best available vehicle using intelligent search
                                                    </p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 3-Step Search Description */}
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5">
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-blue-600" />
                                            Smart Search Process (3-Step Algorithm)
                                        </h4>
                                        <div className="space-y-3 text-sm text-gray-700">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-700">1</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-800">Available Local Vehicle:</span>
                                                    <p>Search for vehicles currently at your center with sufficient capacity</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-700">2</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-800">Vehicle from Other Centers (Owned by Current Center):</span>
                                                    <p>Find vehicles belonging to your center but located at other centers</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-blue-700">3</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-800">Vehicle from Nearest 3 Centers:</span>
                                                    <p>Search the closest 3 centers for available vehicles with required capacity</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Manual Assignment Step */}
                            {vehicleSelectionModal.step === 'manual' && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5">
                                        <h4 className="font-semibold text-gray-800 mb-4">Enter Vehicle Registration Number</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Vehicle Registration Number *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={manualVehicleInput}
                                                    onChange={(e) => setManualVehicleInput(e.target.value)}
                                                    placeholder="Enter vehicle registration number (e.g., ABC-1234)"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    disabled={searchingVehicle}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                System will check if the vehicle exists, is available, and has sufficient weight/volume capacity.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Smart Assignment Step */}
                            {vehicleSelectionModal.step === 'smart' && !smartSearchResult && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5">
                                    <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        Ready to Search for Best Vehicle
                                    </h4>
                                    <p className="text-sm text-green-700 mb-4">
                                        The system will automatically search through the 3-step process to find the most suitable vehicle for your shipment.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-green-800">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Requirements: {vehicleSelectionModal.shipment.totalWeight} kg weight, {vehicleSelectionModal.shipment.totalVolume} m³ volume</span>
                                    </div>
                                </div>
                            )}

                            {/* Smart Search Result */}
                            {vehicleSelectionModal.step === 'confirm' && smartSearchResult && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                                        <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            Vehicle Found - Step {smartSearchResult.searchResult.step}
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-green-800 border-b border-green-200 pb-1">Vehicle Details</h5>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Vehicle ID:</span>
                                                        <span className="font-semibold text-green-900">{smartSearchResult.vehicle.vehicleId}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Registration:</span>
                                                        <span className="font-semibold text-green-900">{smartSearchResult.vehicle.registrationNo}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Type:</span>
                                                        <span className="font-semibold text-green-900">{smartSearchResult.vehicle.vehicleType}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Weight Capacity:</span>
                                                        <span className="font-semibold text-green-900">{smartSearchResult.vehicle.capacity.weight} kg</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Volume Capacity:</span>
                                                        <span className="font-semibold text-green-900">{smartSearchResult.vehicle.capacity.volume} m³</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-green-800 border-b border-green-200 pb-1">Location & Transport</h5>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Current Location:</span>
                                                        <span className="font-semibold text-green-900">{smartSearchResult.vehicle.currentLocation}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Source Location:</span>
                                                        <span className="font-semibold text-green-900">{smartSearchResult.vehicle.sourceLocation}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">At Source:</span>
                                                        <span className={`font-semibold ${smartSearchResult.vehicle.isAtSource ? 'text-green-900' : 'text-orange-600'}`}>
                                                            {smartSearchResult.vehicle.isAtSource ? 'Yes' : 'No'}
                                                        </span>
                                                    </div>
                                                    {!smartSearchResult.vehicle.isAtSource && (
                                                        <>
                                                            <div className="flex justify-between">
                                                                <span className="text-green-700">Distance:</span>
                                                                <span className="font-semibold text-green-900">{smartSearchResult.vehicle.distance} km</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-green-700">Est. Time:</span>
                                                                <span className="font-semibold text-green-900">{smartSearchResult.vehicle.estimatedTime} hours</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {smartSearchResult.vehicle.driver && (
                                                <div className="space-y-3">
                                                    <h5 className="font-medium text-green-800 border-b border-green-200 pb-1">Driver Information</h5>
                                                    <div className="space-y-2 text-sm">
                                                        {smartSearchResult.vehicle.driver.name && (
                                                            <div className="flex justify-between">
                                                                <span className="text-green-700">Name:</span>
                                                                <span className="font-semibold text-green-900">{smartSearchResult.vehicle.driver.name}</span>
                                                            </div>
                                                        )}
                                                        {smartSearchResult.vehicle.driver.driverId && (
                                                            <div className="flex justify-between">
                                                                <span className="text-green-700">Driver ID:</span>
                                                                <span className="font-semibold text-green-900">{smartSearchResult.vehicle.driver.driverId}</span>
                                                            </div>
                                                        )}
                                                        {smartSearchResult.vehicle.driver.contactNo && (
                                                            <div className="flex justify-between">
                                                                <span className="text-green-700">Contact:</span>
                                                                <span className="font-semibold text-green-900">{smartSearchResult.vehicle.driver.contactNo}</span>
                                                            </div>
                                                        )}
                                                        {smartSearchResult.vehicle.driver.licenseId && (
                                                            <div className="flex justify-between">
                                                                <span className="text-green-700">License ID:</span>
                                                                <span className="font-semibold text-green-900">{smartSearchResult.vehicle.driver.licenseId}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {smartSearchResult.needsTransport && (
                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-200">
                                            <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                                <Info className="w-5 h-5 text-amber-600" />
                                                Transport Required
                                            </h4>
                                            <p className="text-sm text-amber-700 mb-3">
                                                This vehicle is currently at <strong>{smartSearchResult.vehicle.currentLocation}</strong> and needs to be 
                                                transported to <strong>{smartSearchResult.vehicle.sourceLocation}</strong>.
                                            </p>
                                            <p className="text-sm text-amber-700">
                                                Would you like to check for available parcels along the route to optimize the transport?
                                            </p>
                                        </div>
                                    )}

                                    {/* Parcel Group Selection UI */}
                                    {showParcelSelection && smartSearchResult?.availableParcelGroups?.length > 0 && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                                            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                                <Package className="w-5 h-5 text-blue-600" />
                                                Available Parcels for Collection
                                            </h4>
                                            <p className="text-sm text-blue-700 mb-4">
                                                Select parcel groups to collect along the route. Each group goes to the same destination.
                                            </p>
                                            
                                            <div className="space-y-4">
                                                {smartSearchResult.availableParcelGroups.map((group, index) => (
                                                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`parcel-group-${index}`}
                                                                    checked={selectedParcelGroups.includes(index)}
                                                                    onChange={() => handleParcelGroupSelection(index)}
                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                                />
                                                                <label htmlFor={`parcel-group-${index}`} className="flex items-center gap-2 cursor-pointer">
                                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                                    <span className="font-medium text-blue-800">
                                                                        To: {group.destination}
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-sm font-medium text-blue-700">
                                                                    {group.parcels.length} parcel{group.parcels.length !== 1 ? 's' : ''}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                                            <div className="bg-gray-50 rounded p-2">
                                                                <span className="text-gray-600">Total Weight:</span>
                                                                <span className="font-semibold text-gray-800 ml-2">
                                                                    {group.totalWeight.toFixed(1)} kg
                                                                </span>
                                                            </div>
                                                            <div className="bg-gray-50 rounded p-2">
                                                                <span className="text-gray-600">Total Volume:</span>
                                                                <span className="font-semibold text-gray-800 ml-2">
                                                                    {group.totalVolume.toFixed(2)} m³
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Show individual parcels in this group */}
                                                        <div className="border-t border-gray-200 pt-2">
                                                            <details className="text-sm">
                                                                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                                                    View parcels in this group
                                                                </summary>
                                                                <div className="mt-2 space-y-1 pl-4">
                                                                    {group.parcels.map((parcel, pIndex) => (
                                                                        <div key={pIndex} className="flex justify-between text-xs text-gray-600">
                                                                            <span>Parcel {parcel.parcelId}</span>
                                                                            <span>{parcel.weight}kg, {parcel.volume}m³</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </details>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Capacity Summary */}
                                                {selectedParcelGroups.length > 0 && (
                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                                        <h5 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Selected Parcels Summary
                                                        </h5>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-green-700">Total Additional Weight:</span>
                                                                <span className="font-semibold text-green-800 ml-2">
                                                                    {selectedParcelGroups.reduce((total, index) => 
                                                                        total + smartSearchResult.availableParcelGroups[index].totalWeight, 0
                                                                    ).toFixed(1)} kg
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-green-700">Total Additional Volume:</span>
                                                                <span className="font-semibold text-green-800 ml-2">
                                                                    {selectedParcelGroups.reduce((total, index) => 
                                                                        total + smartSearchResult.availableParcelGroups[index].totalVolume, 0
                                                                    ).toFixed(2)} m³
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    onClick={toggleParcelSelectionView}
                                                    className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                >
                                                    Hide Parcel Selection
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
                            {/* Initial Step Buttons */}
                            {!vehicleSelectionModal.step && (
                                <>
                                    <button
                                        onClick={closeVehicleSelectionModal}
                                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}

                            {/* Manual Assignment Buttons */}
                            {vehicleSelectionModal.step === 'manual' && (
                                <>
                                    <button
                                        onClick={() => setVehicleSelectionModal(prev => ({ ...prev, step: null }))}
                                        disabled={searchingVehicle}
                                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleManualAssignment}
                                        disabled={searchingVehicle || !manualVehicleInput.trim()}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                                    >
                                        {searchingVehicle ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Assigning...
                                            </>
                                        ) : (
                                            <>
                                                <Car className="w-4 h-4" />
                                                Assign Vehicle
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {/* Smart Assignment Buttons */}
                            {vehicleSelectionModal.step === 'smart' && !smartSearchResult && (
                                <>
                                    <button
                                        onClick={() => setVehicleSelectionModal(prev => ({ ...prev, step: null }))}
                                        disabled={searchingVehicle}
                                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleEnhancedSmartAssignment}
                                        disabled={searchingVehicle}
                                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                                    >
                                        {searchingVehicle ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Find Best Vehicle
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {/* ENHANCED WORKFLOW - Step 3: Vehicle Found from Another Center */}
                            {vehicleSelectionModal.step === 'parcel_selection_options' && vehicleSelectionModal.enhancedResult && (
                                <>
                                    <div className="mb-6">
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mb-4 border border-blue-200">
                                            <h4 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                                <Truck className="w-5 h-5 text-blue-600" />
                                                Vehicle Found from Another Center
                                            </h4>
                                            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <h5 className="font-medium text-blue-800 border-b border-blue-200 pb-2">Vehicle Details</h5>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-blue-700">Vehicle ID:</span>
                                                            <span className="font-semibold text-blue-900">{vehicleSelectionModal.enhancedResult.vehicle.vehicleId}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-blue-700">Currently at:</span>
                                                            <span className="font-semibold text-orange-600">{vehicleSelectionModal.enhancedResult.vehicle.currentLocation}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-blue-700">Needs to go to:</span>
                                                            <span className="font-semibold text-green-600">{vehicleSelectionModal.enhancedResult.vehicle.sourceLocation}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h5 className="font-medium text-blue-800 border-b border-blue-200 pb-2">Vehicle Capacity</h5>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-blue-700">Weight:</span>
                                                            <span className="font-semibold text-blue-900">{vehicleSelectionModal.enhancedResult.vehicle.capableWeight}kg</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-blue-700">Volume:</span>
                                                            <span className="font-semibold text-blue-900">{vehicleSelectionModal.enhancedResult.vehicle.capableVolume}m³</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h5 className="font-medium text-blue-800 border-b border-blue-200 pb-2">Transport Status</h5>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                            <span className="text-blue-700">Requires repositioning</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <span className="text-blue-700">Available for assignment</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {vehicleSelectionModal.enhancedResult.availableParcelGroups && vehicleSelectionModal.enhancedResult.availableParcelGroups.totalParcels > 0 && (
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                                                <h4 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                                                    <Package className="w-5 h-5 text-green-600" />
                                                    Available Parcels Found
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-6">
                                                    Found {vehicleSelectionModal.enhancedResult.availableParcelGroups.totalParcels} parcels that can be carried along the route.
                                                </p>
                                                
                                                {/* Enhanced Parcel Groups Table with Better Spacing */}
                                                <div className="bg-white rounded-lg border border-green-200 overflow-hidden shadow-sm">
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full">
                                                            <thead className="bg-green-50">
                                                                <tr>
                                                                    <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Destination</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Parcels</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Weight</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Volume</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Capacity Usage</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-green-100">
                                                                {Object.entries(vehicleSelectionModal.enhancedResult.availableParcelGroups.parcelGroups).map(([groupId, group]) => (
                                                                    <tr key={groupId} className="hover:bg-green-25 transition-colors">
                                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{getGroupDestinationNameSync(group)}</td>
                                                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{group.parcelCount}</td>
                                                                        <td className="px-6 py-4 text-sm text-gray-700">{group.totalWeight}kg</td>
                                                                        <td className="px-6 py-4 text-sm text-gray-700">{group.totalVolume}m³</td>
                                                                        <td className="px-6 py-4">
                                                                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                                Available
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                                    <div 
                                                                                        className="bg-green-500 h-2 rounded-full" 
                                                                                        style={{width: `${Math.min((group.totalWeight / vehicleSelectionModal.enhancedResult.vehicle.capableWeight) * 100, 100)}%`}}
                                                                                    ></div>
                                                                                </div>
                                                                                <span className="text-xs text-gray-500">
                                                                                    {Math.round((group.totalWeight / vehicleSelectionModal.enhancedResult.vehicle.capableWeight) * 100)}%
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={closeVehicleSelectionModal}
                                            disabled={confirmingAssignment}
                                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAssignVehicleOnly}
                                            disabled={confirmingAssignment}
                                            className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 flex items-center gap-2 transition-all"
                                        >
                                            {confirmingAssignment ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Truck className="w-4 h-4" />
                                            )}
                                            Assign Vehicle Only
                                        </button>
                                        {/* Check for Parcels Button - Only show if not in "Assign Vehicle Only" mode */}
                                        {!assignVehicleOnlyMode && vehicleSelectionModal.enhancedResult.availableParcelGroups && vehicleSelectionModal.enhancedResult.availableParcelGroups.totalParcelsFound > 0 && (
                                            <button
                                                onClick={handleCheckForParcels}
                                                disabled={confirmingAssignment}
                                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center gap-2 transition-all"
                                            >
                                                <Package className="w-4 h-4" />
                                                Check for Parcels
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* ENHANCED WORKFLOW - Step 4: Direct Assignment Confirmation */}
                            {vehicleSelectionModal.step === 'confirm_direct_assignment' && vehicleSelectionModal.enhancedResult && (
                                <>
                                    <div className="mb-6">
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                                            <h4 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                Vehicle Ready at Source Location
                                            </h4>
                                            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <h5 className="font-medium text-green-800 border-b border-green-200 pb-2">Vehicle Details</h5>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-green-700">Vehicle ID:</span>
                                                            <span className="font-semibold text-green-900">{vehicleSelectionModal.enhancedResult.vehicle.vehicleId}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-green-700">Located at source:</span>
                                                            <span className="font-semibold text-green-900">{vehicleSelectionModal.enhancedResult.vehicle.currentLocation}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h5 className="font-medium text-green-800 border-b border-green-200 pb-2">Perfect Match</h5>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                            <span className="text-green-700">No transport required</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                            <span className="text-green-700">Ready for immediate assignment</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={closeVehicleSelectionModal}
                                            disabled={confirmingAssignment}
                                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAssignVehicleOnly}
                                            disabled={confirmingAssignment}
                                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                                        >
                                            {confirmingAssignment ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    Assigning...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    Confirm Assignment
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* ENHANCED WORKFLOW - Step 5: Parcel Group Selection */}
                            {vehicleSelectionModal.step === 'parcel_group_selection' && vehicleSelectionModal.enhancedResult && (
                                <>
                                    <div className="mb-6">
                                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6 border border-purple-200">
                                            <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                                                <Package className="w-5 h-5 text-purple-600" />
                                                Select Parcel Groups to Include
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Choose which parcel groups to include in the shipment. Each group represents parcels going to the same destination.
                                            </p>
                                        </div>

                                        {/* Show parcel groups if available - Handle multiple data structures */}
                                        {(() => {
                                            const result = vehicleSelectionModal.enhancedResult;
                                            let parcelGroups = null;
                                            
                                            // Try different possible data structures
                                            if (result.availableParcelGroups?.parcelGroups) {
                                                parcelGroups = result.availableParcelGroups.parcelGroups;
                                            } else if (result.availableParcelGroups && typeof result.availableParcelGroups === 'object') {
                                                // Check if availableParcelGroups itself contains the groups
                                                const keys = Object.keys(result.availableParcelGroups);
                                                if (keys.some(key => key !== 'totalParcels' && key !== 'summary')) {
                                                    parcelGroups = result.availableParcelGroups;
                                                }
                                            } else if (result.parcelGroups) {
                                                parcelGroups = result.parcelGroups;
                                            }
                                            
                                            return parcelGroups && Object.keys(parcelGroups).length > 0 ? (
                                                <div className="space-y-6">                                                    
                                                    {Object.entries(parcelGroups).map(([groupId, group]) => (
                                                        <div key={groupId} className={selectedParcelGroups[groupId] ? 'border-2 rounded-xl p-6 transition-all duration-200 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg' : 'border-2 rounded-xl p-6 transition-all duration-200 border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'}>
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex items-start gap-4">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedParcelGroups[groupId] || false}
                                                                        onChange={(e) => handleParcelGroupSelection(groupId, e.target.checked)}
                                                                        className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-4 mb-2">
                                                                            <h5 className="font-semibold text-gray-800 text-lg">{getGroupDestinationNameSync(group)}</h5>
                                                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                                                                                Available
                                                                            </span>
                                                                        </div>
                                                                        <div className="grid grid-cols-3 gap-6 text-sm">
                                                                            <div className="flex items-center gap-2">
                                                                                <Package className="w-4 h-4 text-blue-600" />
                                                                                <span className="text-gray-600">Parcels:</span>
                                                                                <span className="font-semibold text-gray-800">{group.parcelCount || group.parcels?.length || 'Unknown'}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                                                                    <span className="text-white text-xs font-bold">W</span>
                                                                                </div>
                                                                                <span className="text-gray-600">Weight:</span>
                                                                                <span className="font-semibold text-gray-800">{group.totalWeight || 'Unknown'}kg</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                                                                    <span className="text-white text-xs font-bold">V</span>
                                                                                </div>
                                                                                <span className="text-gray-600">Volume:</span>
                                                                                <span className="font-semibold text-gray-800">{group.totalVolume || 'Unknown'}m³</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {selectedParcelGroups[groupId] && group.parcels && (
                                                                <div className="mt-5 pt-5 border-t border-blue-200">
                                                                    <h6 className="font-semibold text-sm text-gray-800 mb-4 flex items-center gap-2">
                                                                        <Info className="w-4 h-4 text-blue-600" />
                                                                        Parcels in this group:
                                                                    </h6>
                                                                    <div className="bg-white rounded-lg border border-blue-200 overflow-hidden shadow-sm">
                                                                        <div className="overflow-x-auto">
                                                                            <table className="min-w-full">
                                                                                <thead className="bg-blue-50">
                                                                                    <tr>
                                                                                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Parcel ID</th>
                                                                                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Type</th>
                                                                                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Size</th>
                                                                                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Weight</th>
                                                                                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">From</th>
                                                                                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">To</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="bg-white divide-y divide-blue-100">
                                                                                    {group.parcels.map((parcel) => (
                                                                                        <tr key={parcel._id || parcel.parcelId} className="hover:bg-blue-25 transition-colors">
                                                                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{parcel.parcelId}</td>
                                                                                            <td className="px-6 py-4 text-sm text-gray-700">{parcel.itemType || 'Item'}</td>
                                                                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                                                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                                                                    {parcel.itemSize || 'N/A'}
                                                                                                </span>
                                                                                            </td>
                                                                                            <td className="px-6 py-4 text-sm font-medium text-gray-700">{parcel.weight}kg</td>
                                                                                            <td className="px-6 py-4 text-sm text-gray-700">{getCenterNameSync(parcel.from)}</td>
                                                                                            <td className="px-6 py-4 text-sm text-gray-700">{getCenterNameSync(parcel.to)}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                    <h5 className="font-medium text-yellow-800 mb-2">No Parcel Groups Found</h5>
                                                    <p className="text-sm text-yellow-700">
                                                        No additional parcels are available for this route.
                                                    </p>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setVehicleSelectionModal(prev => ({ ...prev, step: 'parcel_selection_options' }))}
                                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleAssignVehicleOnly}
                                            disabled={confirmingAssignment}
                                            className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 transition-all"
                                        >
                                            {confirmingAssignment ? 'Processing...' : 'Only Assign Vehicle'}
                                        </button>
                                        <button
                                            onClick={handleAddParcelsToCurrentShipment}
                                            disabled={confirmingAssignment}
                                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all"
                                        >
                                            {confirmingAssignment ? 'Adding Parcels...' : 'Add to Current Shipment'}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* ENHANCED WORKFLOW - Direct Assignment Modal - Clean Version
                            {vehicleSelectionModal.step === 'confirm_direct_assignment' && vehicleSelectionModal.enhancedResult && (
                                <div>
                                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">Vehicle Found at Source Location</h4>
                                        <p>Vehicle {vehicleSelectionModal.enhancedResult.vehicle.vehicleId} is ready at {vehicleSelectionModal.enhancedResult.vehicle.currentLocation}</p>
                                    </div>
                                    
                                    <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                                        <h5 className="font-medium text-yellow-800 mb-2">Additional Parcels Available</h5>
                                        <p className="text-sm text-yellow-700">The backend found parcel groups that can be added to this shipment.</p>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={closeVehicleSelectionModal}
                                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAssignVehicleOnly}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                        >
                                            Assign Vehicle Only
                                        </button>
                                    </div>
                                </div>
                            )} */}

                            {/* LEGACY - Keep existing confirm step for compatibility */}
                            {vehicleSelectionModal.step === 'confirm' && smartSearchResult && (
                                <>
                                    <button
                                        onClick={closeVehicleSelectionModal}
                                        disabled={confirmingAssignment}
                                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    {smartSearchResult.needsTransport ? (
                                        <>
                                            <button
                                                onClick={() => confirmSmartAssignment(false)}
                                                disabled={confirmingAssignment}
                                                className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 flex items-center gap-2 transition-all"
                                            >
                                                {confirmingAssignment ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Truck className="w-4 h-4" />
                                                )}
                                                Assign Only
                                            </button>
                                            {!assignVehicleOnlyMode && (
                                                <button
                                                    onClick={() => confirmSmartAssignment(true)}
                                                    disabled={confirmingAssignment}
                                                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                                                >
                                                    {confirmingAssignment ? (
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Package className="w-4 h-4" />
                                                    )}
                                                    Check for Parcels
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => confirmSmartAssignment(false)}
                                            disabled={confirmingAssignment}
                                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                                        >
                                            {confirmingAssignment ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    Confirming...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    Confirm Assignment
                                                </>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Vehicle Assignment Confirmation Modal */}
            {vehicleAssignmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {vehicleAssignmentModal.step === 'initial' && 'Find Vehicle for Shipment'}
                                            {vehicleAssignmentModal.step === 'vehicleFound' && 'Confirm Vehicle Assignment'}
                                            {vehicleAssignmentModal.step === 'parcels-found' && 'Reverse Shipment Required'}
                                            {vehicleAssignmentModal.step === 'assigned' && 'Assignment Complete'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {vehicleAssignmentModal.step === 'initial' && 'Search for available vehicles'}
                                            {vehicleAssignmentModal.step === 'vehicleFound' && 'Review found vehicle and confirm assignment'}
                                            {vehicleAssignmentModal.step === 'parcels-found' && 'Review parcels found for reverse shipment and decide whether to create it'}
                                            {vehicleAssignmentModal.step === 'assigned' && 'Vehicle assignment successful - view details'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeAssignmentModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    disabled={findingVehicle || assigningVehicle}
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-6">
                            {/* Shipment Information - Always shown */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5 mb-6">
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Shipment Details
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Shipment ID:</span>
                                            <span className="font-semibold text-gray-800 bg-white px-3 py-1 rounded-full">
                                                {vehicleAssignmentModal.shipment.shipmentId}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Delivery Type:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                vehicleAssignmentModal.deliveryType === 'express' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {vehicleAssignmentModal.deliveryType?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Status:</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                                {vehicleAssignmentModal.shipment.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Total Weight:</span>
                                            <span className="font-semibold text-gray-800">
                                                {vehicleAssignmentModal.shipment.totalWeight || 'N/A'} kg
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Total Volume:</span>
                                            <span className="font-semibold text-gray-800">
                                                {vehicleAssignmentModal.shipment.totalVolume || 'N/A'} m³
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Parcel Count:</span>
                                            <span className="font-semibold text-gray-800">
                                                {vehicleAssignmentModal.shipment.parcelCount || vehicleAssignmentModal.shipment.parcels?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step Content */}
                            {vehicleAssignmentModal.step === 'initial' && (
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-amber-600" />
                                        Vehicle Search Process
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-amber-700">1</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Local Search:</span> Find vehicles at the source center
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-amber-700">2</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Regional Search:</span> Find vehicles from nearby centers
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-amber-700">3</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Capacity Check:</span> Verify weight and volume requirements
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Found Vehicle Details */}
                            {vehicleAssignmentModal.step === 'vehicleFound' && foundVehicle && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                                        <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            Vehicle Found
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-green-800 border-b border-green-200 pb-1">Vehicle Details</h5>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Vehicle ID:</span>
                                                        <span className="font-semibold text-green-900">{foundVehicle.vehicle.vehicleId}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Type:</span>
                                                        <span className="font-semibold text-green-900">{foundVehicle.vehicle.vehicleType}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Weight Capacity:</span>
                                                        <span className="font-semibold text-green-900">{foundVehicle.vehicle.capableWeight} kg</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Volume Capacity:</span>
                                                        <span className="font-semibold text-green-900">{foundVehicle.vehicle.capableVolume} m³</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-green-800 border-b border-green-200 pb-1">Location & Transport</h5>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Current Location:</span>
                                                        <span className="font-semibold text-green-900">{foundVehicle.vehicle.currentLocation}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Source Location:</span>
                                                        <span className="font-semibold text-green-900">{foundVehicle.vehicle.sourceLocation}</span>
                                                    </div>
                                                    {!foundVehicle.vehicle.isAtSource && (
                                                        <>
                                                            <div className="flex justify-between">
                                                                <span className="text-green-700">Distance:</span>
                                                                <span className="font-semibold text-green-900">{foundVehicle.vehicle.distance || 'N/A'} km</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-green-700">Est. Time:</span>
                                                                <span className="font-semibold text-green-900">{foundVehicle.vehicle.estimatedTime || 'N/A'} hours</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {foundVehicle.needsTransport && (
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
                                            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                                <Info className="w-5 h-5 text-blue-600" />
                                                Transport Required
                                            </h4>
                                            <p className="text-sm text-blue-700">
                                                This vehicle is currently at <strong>{foundVehicle.vehicle.currentLocation}</strong> and needs to be 
                                                transported to <strong>{foundVehicle.vehicle.sourceLocation}</strong>. A reverse shipment will be 
                                                created to bring the vehicle to the source center, and any available parcels along the route 
                                                will be included to optimize efficiency.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Parcels Found for Reverse Shipment */}
                            {vehicleAssignmentModal.step === 'parcels-found' && foundParcels && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Package className="w-6 h-6 text-amber-600" />
                                            <h4 className="text-lg font-semibold text-amber-800">Parcels Found for Reverse Shipment</h4>
                                        </div>
                                        
                                        <div className="mb-4 p-3 bg-amber-100 rounded-lg">
                                            <p className="text-sm text-amber-700">
                                                {foundParcels.parcels && foundParcels.parcels.length > 0 ? (
                                                    <>
                                                        <strong>Found {foundParcels.parcels.length} parcels</strong> at {foundParcels.fromCenter} that need to be shipped to {foundParcels.toCenter}.
                                                        These parcels are currently unassigned and can be grouped into a reverse shipment.
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>No suitable parcels found</strong> for the route from {foundParcels.fromCenter} to {foundParcels.toCenter}.
                                                        {foundParcels.message && (
                                                            <><br/><em>{foundParcels.message}</em></>
                                                        )}
                                                    </>
                                                )}
                                            </p>
                                        </div>

                                        {foundParcels.parcels && foundParcels.parcels.length > 0 && (
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-amber-800 border-b border-amber-300 pb-2">Parcel Summary</h5>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div className="p-3 bg-white rounded-lg border border-amber-200">
                                                        <div className="text-amber-600 text-xs uppercase tracking-wide">Total Parcels</div>
                                                        <div className="text-xl font-bold text-amber-800">{foundParcels.summary?.totalParcels || 0}</div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-lg border border-amber-200">
                                                        <div className="text-amber-600 text-xs uppercase tracking-wide">Total Weight</div>
                                                        <div className="text-xl font-bold text-amber-800">{foundParcels.summary?.totalWeight || 0} kg</div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-lg border border-amber-200">
                                                        <div className="text-amber-600 text-xs uppercase tracking-wide">Total Volume</div>
                                                        <div className="text-xl font-bold text-amber-800">{foundParcels.summary?.totalVolume || 0} m³</div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-lg border border-amber-200">
                                                        <div className="text-amber-600 text-xs uppercase tracking-wide">Distance</div>
                                                        <div className="text-xl font-bold text-amber-800">{foundParcels.summary?.totalDistance || 0} km</div>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full text-sm">
                                                            <thead className="bg-amber-50 sticky top-0">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Parcel ID</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Item Type</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Size</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Weight</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Volume</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Delivery Type</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-amber-100">
                                                                {foundParcels.parcels.map((parcel, index) => (
                                                                    <tr key={parcel._id || index} className="hover:bg-amber-25">
                                                                        <td className="px-4 py-3 text-amber-800 font-medium">{parcel.parcelId}</td>
                                                                        <td className="px-4 py-3 text-amber-700">{parcel.itemType || 'N/A'}</td>
                                                                        <td className="px-4 py-3 text-amber-700">{parcel.itemSize || 'N/A'}</td>
                                                                        <td className="px-4 py-3 text-amber-700">{parcel.weight} kg</td>
                                                                        <td className="px-4 py-3 text-amber-700">{parcel.volume} m³</td>
                                                                        <td className="px-4 py-3 text-amber-700">{parcel.deliveryType}</td>
                                                                        <td className="px-4 py-3">
                                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                                                                                {parcel.status}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Assignment Result */}
                            {vehicleAssignmentModal.step === 'assigned' && assignmentResult && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                                        <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            Assignment Successful
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-green-800 border-b border-green-200 pb-1">Assigned Vehicle</h5>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Vehicle ID:</span>
                                                        <span className="font-semibold text-green-900">{assignmentResult.vehicle.vehicleId}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Current Location:</span>
                                                        <span className="font-semibold text-green-900">{assignmentResult.vehicle.currentLocation}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">At Source:</span>
                                                        <span className={`font-semibold ${assignmentResult.vehicle.isAtSource ? 'text-green-900' : 'text-orange-600'}`}>
                                                            {assignmentResult.vehicle.isAtSource ? 'Yes' : 'No'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-green-800 border-b border-green-200 pb-1">Shipment Status</h5>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Shipment ID:</span>
                                                        <span className="font-semibold text-green-900">{assignmentResult.shipmentDetails.shipmentId}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Status:</span>
                                                        <span className="font-semibold text-green-900">{assignmentResult.shipmentDetails.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reverse Shipment Details */}
                                    {assignmentResult.reverseShipment && (
                                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-200">
                                            <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                                                <Truck className="w-5 h-5 text-purple-600" />
                                                Reverse Shipment Created
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <h5 className="font-medium text-purple-800 border-b border-purple-200 pb-1">Shipment Details</h5>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-purple-700">Shipment ID:</span>
                                                            <span className="font-semibold text-purple-900">{assignmentResult.reverseShipment.reverseShipmentId}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-purple-700">Route:</span>
                                                            <span className="font-semibold text-purple-900">
                                                                {assignmentResult.reverseShipment.vehicleDetails.from} → {assignmentResult.reverseShipment.vehicleDetails.to}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-purple-700">Status:</span>
                                                            <span className="font-semibold text-purple-900">{assignmentResult.reverseShipment.shipmentDetails.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <h5 className="font-medium text-purple-800 border-b border-purple-200 pb-1">Cargo Details</h5>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-purple-700">Parcels Included:</span>
                                                            <span className="font-semibold text-purple-900">{assignmentResult.reverseShipment.parcelsIncluded}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-purple-700">Total Weight:</span>
                                                            <span className="font-semibold text-purple-900">{assignmentResult.reverseShipment.shipmentDetails.totalWeight} kg</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-purple-700">Total Volume:</span>
                                                            <span className="font-semibold text-purple-900">{assignmentResult.reverseShipment.shipmentDetails.totalVolume} m³</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-purple-700">Distance:</span>
                                                            <span className="font-semibold text-purple-900">{assignmentResult.reverseShipment.shipmentDetails.totalDistance} km</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                                                <p className="text-sm text-purple-700">
                                                    <strong>Note:</strong> {assignmentResult.reverseShipment.message}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
                            {vehicleAssignmentModal.step === 'initial' && (
                                <>
                                    <button
                                        onClick={closeAssignmentModal}
                                        disabled={findingVehicle}
                                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={findAvailableVehicle}
                                        disabled={findingVehicle}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                                    >
                                        {findingVehicle ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Car className="w-4 h-4" />
                                                Find Vehicle
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {vehicleAssignmentModal.step === 'parcels-found' && (
                                <>
                                    <button
                                        onClick={() => handleReverseShipmentDecision(false)}
                                        disabled={creatingReverseShipment}
                                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        {foundParcels?.parcels?.length > 0 ? 'Skip Reverse Shipment' : 'Continue Without Reverse Shipment'}
                                    </button>
                                    {foundParcels?.parcels?.length > 0 && (
                                        <button
                                            onClick={() => handleReverseShipmentDecision(true)}
                                            disabled={creatingReverseShipment}
                                            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                                        >
                                            {creatingReverseShipment ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowLeftRight className="w-4 h-4" />
                                                    Create Reverse Shipment
                                                </>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}

                            {vehicleAssignmentModal.step === 'vehicleFound' && (
                                <>
                                    <button
                                        onClick={closeAssignmentModal}
                                        disabled={assigningVehicle}
                                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmVehicleAssignment}
                                        disabled={assigningVehicle}
                                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                                    >
                                        {assigningVehicle ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Assigning...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Confirm Assignment
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {vehicleAssignmentModal.step === 'assigned' && (
                                <button
                                    onClick={closeAssignmentModal}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2 transition-all"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Done
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Standard Shipment Find More Parcels Modal */}
            {standardParcelsModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <Plus className="w-6 h-6 text-green-600" />
                                Find More Parcels for Standard Shipment
                            </h2>
                            <button
                                onClick={closeStandardParcelsModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="text-center py-8">
                            <div className="mb-6">
                                <div className="bg-green-50 rounded-lg p-6 mb-4">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Automated Parcel Search</h3>
                                    <p className="text-green-700 text-sm">
                                        This feature will automatically search for unassigned parcels on the same route 
                                        and add them to your standard shipment if capacity constraints are met.
                                    </p>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-2 text-blue-800 text-sm">
                                        <Info className="w-4 h-4" />
                                        <span className="font-medium">How it works:</span>
                                    </div>
                                    <ul className="text-blue-700 text-xs mt-2 list-disc list-inside space-y-1">
                                        <li>Searches for parcels at the same centers along your route</li>
                                        <li>Only adds parcels that fit within weight and volume limits (5000kg, 20m³)</li>
                                        <li>Automatically updates shipment totals and parcel statuses</li>
                                        <li>Shows detailed information about added parcels</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => addMoreParcelsToStandardShipment(standardParcelsModal.shipmentId)}
                                    disabled={addingStandardParcels}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
                                >
                                    {addingStandardParcels ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            <span>Searching and Adding Parcels...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            <span>Find and Add More Parcels</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={closeStandardParcelsModal}
                                    disabled={addingStandardParcels}
                                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Add More Parcels Modal */}
            {addMoreParcelsModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
                        
                        {/* Step 1: Selection */}
                        {addMoreParcelsModal.step === 'selection' && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <Plus className="w-6 h-6 text-green-600" />
                                        Add More Parcels to Standard Shipment
                                    </h2>
                                    <button
                                        onClick={closeAddMoreParcelsModal}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>

                                <div className="text-center py-4">
                                    <p className="text-gray-600 mb-8">Choose how you want to add more parcels to this shipment:</p>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Manual Assignment Option */}
                                        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
                                             onClick={() => setAddMoreParcelsModal(prev => ({ ...prev, step: 'manual' }))}>
                                            <div className="text-blue-600 mb-4">
                                                <Edit className="w-12 h-12 mx-auto" />
                                            </div>
                                            <h3 className="text-xl font-bold text-blue-800 mb-3">Manual Assignment</h3>
                                            <div className="text-blue-700 text-sm text-left">
                                                <p className="mb-2">Add specific parcels by entering their ID:</p>
                                                <ul className="list-disc list-inside space-y-1 text-xs">
                                                    <li>Enter parcel ID manually</li>
                                                    <li>System validates eligibility</li>
                                                    <li>Checks delivery type (Standard)</li>
                                                    <li>Verifies parcel availability</li>
                                                    <li>Instant capacity validation</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Smart Assignment Option */}
                                        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer"
                                             onClick={() => setAddMoreParcelsModal(prev => ({ ...prev, step: 'smart' }))}>
                                            <div className="text-green-600 mb-4">
                                                <Zap className="w-12 h-12 mx-auto" />
                                            </div>
                                            <h3 className="text-xl font-bold text-green-800 mb-3">PAXAL Smart Assign</h3>
                                            <div className="text-green-700 text-sm text-left">
                                                <p className="mb-2">Automated intelligent parcel discovery:</p>
                                                <ul className="list-disc list-inside space-y-1 text-xs">
                                                    <li>Searches entire route automatically</li>
                                                    <li>Finds parcels at each center in sequence</li>
                                                    <li>Respects 2500kg / 10m³ capacity limits</li>
                                                    <li>Optimizes for maximum efficiency</li>
                                                    <li>Shows detailed selection preview</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            onClick={closeAddMoreParcelsModal}
                                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 2: Manual Assignment */}
                        {addMoreParcelsModal.step === 'manual' && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <Edit className="w-6 h-6 text-blue-600" />
                                        Manual Parcel Assignment
                                    </h2>
                                    <button
                                        onClick={closeAddMoreParcelsModal}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>

                                <div className="py-4">
                                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-3">Manual Parcel Entry</h3>
                                        <p className="text-blue-700 text-sm mb-4">
                                            Enter the parcel ID to add it to this standard shipment. The system will validate that:
                                        </p>
                                        <ul className="text-blue-700 text-xs list-disc list-inside space-y-1">
                                            <li>Parcel exists in the system</li>
                                            <li>Parcel is not already assigned to another shipment</li>
                                            <li>Parcel delivery type is Standard (case-insensitive)</li>
                                            <li>Adding the parcel will not exceed capacity limits (2500kg / 10m³)</li>
                                        </ul>
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="parcelId" className="block text-sm font-medium text-gray-700 mb-2">
                                            Parcel ID
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                id="parcelId"
                                                value={manualParcelId}
                                                onChange={(e) => setManualParcelId(e.target.value)}
                                                placeholder="Enter parcel ID (e.g., PARCEL001)"
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                disabled={validatingParcel}
                                            />
                                            <button
                                                onClick={validateAndAddManualParcel}
                                                disabled={validatingParcel || !manualParcelId.trim()}
                                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                                            >
                                                {validatingParcel ? (
                                                    <>
                                                        <Loader className="w-5 h-5 animate-spin" />
                                                        <span>Validating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-5 h-5" />
                                                        <span>Add Parcel</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => setAddMoreParcelsModal(prev => ({ ...prev, step: 'selection' }))}
                                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={closeAddMoreParcelsModal}
                                            className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 3: Smart Assignment Processing */}
                        {addMoreParcelsModal.step === 'smart' && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <Zap className="w-6 h-6 text-green-600" />
                                        PAXAL Smart Assignment
                                    </h2>
                                    <button
                                        onClick={closeAddMoreParcelsModal}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>

                                <div className="text-center py-8">
                                    <div className="bg-green-50 rounded-lg p-6 mb-6">
                                        <h3 className="text-lg font-semibold text-green-800 mb-3">Intelligent Parcel Discovery</h3>
                                        <p className="text-green-700 text-sm mb-4">
                                            Our smart system will automatically search for available parcels along your shipment route:
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4 text-xs text-green-700">
                                            <div className="text-left">
                                                <h4 className="font-semibold mb-2">Search Process:</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Iterate through each center in route</li>
                                                    <li>Find parcels going to remaining destinations</li>
                                                    <li>Check capacity constraints (2500kg / 10m³)</li>
                                                    <li>Validate delivery type compatibility</li>
                                                </ul>
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-semibold mb-2">Benefits:</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Maximum efficiency optimization</li>
                                                    <li>Automatic capacity management</li>
                                                    <li>Route-aware parcel selection</li>
                                                    <li>Detailed preview before confirmation</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={processSmartParcelAssignment}
                                            disabled={processingSmart}
                                            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium transition-colors text-lg"
                                        >
                                            {processingSmart ? (
                                                <>
                                                    <Loader className="w-6 h-6 animate-spin" />
                                                    <span>Searching for Parcels...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Search className="w-6 h-6" />
                                                    <span>Start Smart Search</span>
                                                </>
                                            )}
                                        </button>

                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => setAddMoreParcelsModal(prev => ({ ...prev, step: 'selection' }))}
                                                disabled={processingSmart}
                                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 font-medium transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={closeAddMoreParcelsModal}
                                                disabled={processingSmart}
                                                className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 4: Smart Assignment Results */}
                        {addMoreParcelsModal.step === 'smart-results' && smartParcelsResults && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                        Smart Search Results
                                    </h2>
                                    <button
                                        onClick={closeAddMoreParcelsModal}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>

                                <div className="py-4">
                                    {/* Summary Cards */}
                                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-green-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-green-800">{smartParcelsResults.addedParcels?.length || 0}</div>
                                            <div className="text-sm text-green-600">Parcels Found</div>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-800">{smartParcelsResults.summary?.weightAdded || 0}kg</div>
                                            <div className="text-sm text-blue-600">Total Weight</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-800">{smartParcelsResults.summary?.volumeAdded || 0}m³</div>
                                            <div className="text-sm text-purple-600">Total Volume</div>
                                        </div>
                                    </div>

                                    {/* Centers Processed */}
                                    {smartParcelsResults.summary?.centersProcessed && (
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-800 mb-3">Centers Processed:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {smartParcelsResults.summary.centersProcessed.map((center, index) => (
                                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                        {center}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Parcels List */}
                                    {smartParcelsResults.addedParcels && smartParcelsResults.addedParcels.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-800 mb-3">Found Parcels:</h4>
                                            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                                <div className="space-y-2">
                                                    {smartParcelsResults.addedParcels.map((parcel, index) => (
                                                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-medium text-blue-600">{parcel.parcelId}</span>
                                                                <span className="text-sm text-gray-600">{parcel.from} → {parcel.to}</span>
                                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{parcel.itemSize}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {parcel.weight}kg, {parcel.volume}m³
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => setAddMoreParcelsModal(prev => ({ ...prev, step: 'smart' }))}
                                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors"
                                        >
                                            Back to Search
                                        </button>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={closeAddMoreParcelsModal}
                                                className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmSmartParcelsAddition}
                                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center gap-2"
                                            >
                                                <Check className="w-5 h-5" />
                                                <span>Add These Parcels</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Popup Messages */}
            {popup && (
                <div className={`fixed top-4 right-4 p-6 rounded-xl shadow-2xl z-50 flex items-start gap-3 min-w-[350px] max-w-[500px] border-l-4 ${
                        popup.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
                        popup.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                        popup.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                        'bg-blue-50 border-blue-400 text-blue-800'
                    }`}>
                    <div className="flex-shrink-0 mt-0.5">
                        {popup.type === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
                        {popup.type === 'error' && <XCircle className="w-6 h-6 text-red-600" />}
                        {popup.type === 'warning' && <AlertCircle className="w-6 h-6 text-yellow-600" />}
                        {popup.type === 'info' && <Info className="w-6 h-6 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold mb-1">
                            {popup.type === 'success' ? 'Success' :
                             popup.type === 'error' ? 'Error' :
                             popup.type === 'warning' ? 'Warning' : 'Information'}
                        </div>
                        <div className="text-sm whitespace-pre-line leading-relaxed">
                            {popup.message}
                        </div>
                    </div>
                    <button
                        onClick={() => setPopup(null)}
                        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Controls Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search by shipment ID, status, or center..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                    />

                    {/* Delivery Type Filter */}
                    <select
                        value={deliveryTypeFilter}
                        onChange={(e) => setDeliveryTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                    >
                        <option value="all">All Types</option>
                        <option value="express">Express</option>
                        <option value="standard">Standard</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-cyan-600"
                    >
                        <option value="All">All Stages</option>
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Completed">Delivered</option>
                    </select>

                    {/* Refresh Button */}
                    <button
                        onClick={fetchShipments}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-500"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table Statistics */}
            <div className="text-sm text-gray-600 mb-2">
                Showing {filteredShipments.length} of {shipments.length} shipments | Selected: {selectedShipments.size}
            </div>

            {/* Shipments Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filteredShipments.length > 0 && selectedShipments.size === filteredShipments.length}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-[#1F818C] focus:ring-[#1F818C] border-gray-300 rounded"
                                    />
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shipment ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Delivery Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Weight (kg)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Volume (m³)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Parcel Count
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredShipments.length > 0 ? (
                            filteredShipments.map((shipment) => (
                                <React.Fragment key={shipment._id || shipment.id}>
                                    <tr
                                        className={`hover:bg-gray-50 ${selectedShipments.has(shipment._id || shipment.id) ? 'bg-cyan-50' : ''}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedShipments.has(shipment._id || shipment.id)}
                                                onChange={() => handleSelectShipment(shipment._id || shipment.id)}
                                                className="h-4 w-4 text-[#1F818C] focus:ring-[#1F818C] border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {shipment.shipmentId || shipment.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${shipment.deliveryType === 'express' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {shipment.deliveryType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {shipment.totalWeight || shipment.weight}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {shipment.totalVolume || shipment.volume || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {shipment.parcelCount || shipment.parcels?.length || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                                                {shipment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center gap-2">
                                                {getActionButtons(shipment)}
                                                <button
                                                    onClick={(e) => toggleRowExpansion(shipment._id || shipment.id, e)}
                                                    className="text-[#1F818C] hover:text-[#176872] focus:outline-none focus:underline flex items-center"
                                                >
                                                    View More
                                                    {expandedShipmentId === (shipment._id || shipment.id) ?
                                                        <ChevronUp className="ml-1 w-4 h-4" /> :
                                                        <ChevronDown className="ml-1 w-4 h-4" />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Expanded Row - Show detailed shipment information */}
                                    {expandedShipmentId === (shipment._id || shipment.id) && (
                                        <tr className="bg-gray-50">
                                            <td colSpan="8" className="p-0">
                                                <div className="rounded-lg shadow-inner bg-white m-2 p-6 border border-gray-200">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-lg font-semibold text-blue-700">
                                                            Shipment Details - {shipment.shipmentId || shipment.id}
                                                        </h3>
                                                    </div>

                                                    {/* Complete Shipment & Parcels Information */}
                                                    <div className="grid md:grid-cols-1 gap-6 mb-6">
                                                        {/* Full Shipment Details */}
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <h4 className="font-semibold text-gray-800 mb-3">Complete Shipment Information</h4>
                                                            <div className="grid md:grid-cols-3 gap-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Shipment ID:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.shipmentId || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Delivery Type:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.deliveryType || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Status:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.status || 'N/A'}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Total Weight:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.totalWeight || 'N/A'} kg</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Total Volume:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.totalVolume || 'N/A'} m³</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Total Distance:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.totalDistance || 'N/A'} km</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Total Time:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.totalTime || 'N/A'} hours</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Created At:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString() : 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Created By Center:</span>
                                                                        <span className="font-medium text-gray-800">
                                                                            {shipment.createdByCenter?.location || 
                                                                             getCenterNameSync(shipment.createdByCenter) || 
                                                                             'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Created By Staff:</span>
                                                                        <span className="font-medium text-gray-800">
                                                                            {shipment.createdByStaff?.name || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Parcel Count:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.parcelCount || shipment.parcels?.length || 0}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Vehicle & Driver Assignment Information */}
                                                    {(shipment.assignedVehicle || shipment.assignedDriver) && (
                                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
                                                            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                                                <Truck className="w-5 h-5 text-blue-600" />
                                                                Assigned Vehicle & Driver
                                                            </h4>
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                {shipment.assignedVehicle && (
                                                                    <div className="bg-white rounded-lg p-3">
                                                                        <h5 className="font-medium text-blue-800 mb-2">Vehicle Information</h5>
                                                                        <div className="space-y-1 text-sm">
                                                                            {shipment.assignedVehicle.vehicleId && (
                                                                                <div>
                                                                                    <span className="text-blue-700 font-medium">Vehicle ID:</span> 
                                                                                    <span className="ml-2 text-gray-800">{shipment.assignedVehicle.vehicleId}</span>
                                                                                </div>
                                                                            )}
                                                                            {shipment.assignedVehicle.registrationNo && (
                                                                                <div>
                                                                                    <span className="text-blue-700 font-medium">Registration No:</span> 
                                                                                    <span className="ml-2 text-gray-800">{shipment.assignedVehicle.registrationNo}</span>
                                                                                </div>
                                                                            )}
                                                                            {(shipment.assignedVehicle.currentBranch || shipment.assignedVehicle.currentLocation) && (
                                                                                <div>
                                                                                    <span className="text-blue-700 font-medium">Current Location:</span> 
                                                                                    <span className="ml-2 text-gray-800">
                                                                                        {shipment.assignedVehicle.currentBranch?.location || 
                                                                                         shipment.assignedVehicle.currentBranch?.branchName ||
                                                                                         shipment.assignedVehicle.currentLocation ||
                                                                                         'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {shipment.assignedDriver && (
                                                                    <div className="bg-white rounded-lg p-3">
                                                                        <h5 className="font-medium text-blue-800 mb-2">Driver Information</h5>
                                                                        <div className="space-y-1 text-sm">
                                                                            {shipment.assignedDriver.name && (
                                                                                <div>
                                                                                    <span className="text-blue-700 font-medium">Name:</span> 
                                                                                    <span className="ml-2 text-gray-800">{shipment.assignedDriver.name}</span>
                                                                                </div>
                                                                            )}
                                                                            {shipment.assignedDriver.driverId && (
                                                                                <div>
                                                                                    <span className="text-blue-700 font-medium">Driver ID:</span> 
                                                                                    <span className="ml-2 text-gray-800">{shipment.assignedDriver.driverId}</span>
                                                                                </div>
                                                                            )}
                                                                            {shipment.assignedDriver.contactNo && (
                                                                                <div>
                                                                                    <span className="text-blue-700 font-medium">Contact:</span> 
                                                                                    <span className="ml-2 text-gray-800">{shipment.assignedDriver.contactNo}</span>
                                                                                </div>
                                                                            )}
                                                                            {shipment.assignedDriver.licenseId && (
                                                                                <div>
                                                                                    <span className="text-blue-700 font-medium">License ID:</span> 
                                                                                    <span className="ml-2 text-gray-800">{shipment.assignedDriver.licenseId}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Route Information */}
                                                    {shipment.route && shipment.route.length > 0 && (
                                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                                            <h4 className="font-semibold text-gray-800 mb-3">Route Information</h4>
                                                            <div className="text-sm text-gray-600">
                                                                <span className="font-medium">Route:</span> {shipment.route.map(branch => branch.location || branch.branchId || branch).join(' → ')}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Parcels Information - Collapsible */}
                                                    {shipment.parcels && shipment.parcels.length > 0 && (
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <h4 className="font-semibold text-gray-800">Parcels Information ({shipment.parcels.length} parcels)</h4>
                                                                <button
                                                                    onClick={() => setExpandedParcelId(expandedParcelId === (shipment._id || shipment.id) ? null : (shipment._id || shipment.id))}
                                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                                                                >
                                                                    {expandedParcelId === (shipment._id || shipment.id) ? 'Hide Details' : 'View Details'}
                                                                    {expandedParcelId === (shipment._id || shipment.id) ? 
                                                                        <ChevronUp className="w-4 h-4" /> : 
                                                                        <ChevronDown className="w-4 h-4" />
                                                                    }
                                                                </button>
                                                            </div>
                                                            
                                                            {/* Basic parcel summary always visible */}
                                                            <div className="text-sm text-gray-600 mb-2">
                                                                <span className="font-medium">Parcel IDs:</span> {
                                                                    shipment.parcels && shipment.parcels.length > 0 
                                                                        ? shipment.parcels.map((p, index) => 
                                                                            p.parcelId || p._id || p.id || `Parcel-${index + 1}`
                                                                          ).join(', ')
                                                                        : 'No parcels'
                                                                }
                                                            </div>
                                                            
                                                            {/* Detailed parcel information - collapsible */}
                                                            {expandedParcelId === (shipment._id || shipment.id) && (
                                                                <div className="space-y-4 mt-4">
                                                                    {shipment.parcels && shipment.parcels.length > 0 ? (
                                                                        shipment.parcels.map((parcel, index) => {
                                                                            // Check if parcel is fully populated with actual parcel data
                                                                            // A populated parcel should have fields like parcelId, trackingNo, etc.
                                                                            // An unpopulated parcel will only have _id field
                                                                            const isFullyPopulated = typeof parcel === 'object' && parcel !== null && 
                                                                                (parcel.parcelId || parcel.trackingNo || parcel.itemType || Object.keys(parcel).length > 1);
                                                                            
                                                                            if (!isFullyPopulated) {
                                                                                // If not populated, show a message about unpopulated data
                                                                                return (
                                                                                    <div key={parcel._id || parcel || index} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                                                                        <h5 className="font-semibold text-yellow-700 mb-2">
                                                                                            Parcel #{index + 1}
                                                                                        </h5>
                                                                                        <div className="text-sm text-yellow-600">
                                                                                            <p><strong>Parcel Reference:</strong> {typeof parcel === 'string' ? parcel : (parcel?._id || parcel?.id || 'Unknown')}</p>
                                                                                            <p className="mt-2 italic bg-yellow-100 p-2 rounded">
                                                                                                 <strong>API Issue:</strong> Parcel details are not populated. The backend API needs to use .populate(&apos;parcels&apos;) to show detailed parcel information.
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                            
                                                                            // If populated, show full parcel details based on parcel schema
                                                                            return (
                                                                                <div key={parcel._id || parcel.id || index} className="bg-white rounded-lg p-4 border border-gray-200">
                                                                                    <h5 className="font-semibold text-blue-700 mb-3">
                                                                                        Parcel #{index + 1} {parcel.parcelId && `(${parcel.parcelId})`}
                                                                                    </h5>
                                                                            
                                                                                    <div className="grid md:grid-cols-2 gap-4">
                                                                                        {/* Basic Parcel Information */}
                                                                                        <div className="space-y-2">
                                                                                            <h6 className="font-medium text-gray-800 border-b pb-1">Basic Information</h6>
                                                                                            <div className="text-sm space-y-1">
                                                                                                <div><span className="text-gray-600">Parcel ID:</span> <span className="font-medium">{parcel.parcelId || 'N/A'}</span></div>
                                                                                                <div><span className="text-gray-600">Tracking No:</span> <span className="font-medium">{parcel.trackingNo || 'N/A'}</span></div>
                                                                                                <div><span className="text-gray-600">QR Code:</span> 
                                                                                                    {parcel.qrCodeNo ? (
                                                                                                        parcel.qrCodeNo.startsWith('data:image/') ? (
                                                                                                            <div className="mt-2">
                                                                                                                <img 
                                                                                                                    src={parcel.qrCodeNo} 
                                                                                                                    alt="QR Code" 
                                                                                                                    className="w-16 h-16 border border-gray-300 rounded"
                                                                                                                />
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <span className="font-medium ml-2">{parcel.qrCodeNo}</span>
                                                                                                        )
                                                                                                    ) : (
                                                                                                        <span className="font-medium ml-2">N/A</span>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div><span className="text-gray-600">Item Type:</span> <span className="font-medium">{parcel.itemType || 'N/A'}</span></div>
                                                                                                <div><span className="text-gray-600">Item Size:</span> <span className="font-medium">{parcel.itemSize || 'N/A'}</span></div>
                                                                                                <div><span className="text-gray-600">Shipping Method:</span> <span className="font-medium">{parcel.shippingMethod || 'N/A'}</span></div>
                                                                                                <div><span className="text-gray-600">Status:</span> 
                                                                                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                                                                                        parcel.status === 'ArrivedAtCollectionCenter' ? 'bg-green-100 text-green-800' :
                                                                                                        'bg-gray-100 text-gray-800'
                                                                                                    }`}>
                                                                                                        {parcel.status || 'N/A'}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Delivery Information */}
                                                                                        <div className="space-y-2">
                                                                                            <h6 className="font-medium text-gray-800 border-b pb-1">Delivery Details</h6>
                                                                                            <div className="text-sm space-y-1">
                                                                                                <div><span className="text-gray-600">Submitting Type:</span> <span className="font-medium">{parcel.submittingType || 'N/A'}</span></div>
                                                                                                <div><span className="text-gray-600">Receiving Type:</span> <span className="font-medium">{parcel.receivingType || 'N/A'}</span></div>
                                                                                                <div><span className="text-gray-600">Special Instructions:</span> <span className="font-medium">{parcel.specialInstructions || 'None'}</span></div>
                                                                                                <div><span className="text-gray-600">Pickup Date:</span> <span className="font-medium">{parcel.pickupInformation?.pickupDate ? new Date(parcel.pickupInformation.pickupDate).toLocaleDateString() : 'N/A'}</span></div>
                                                                                                <div><span className="text-gray-600">Pickup Time:</span> <span className="font-medium">{parcel.pickupInformation?.pickupTime || 'N/A'}</span></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Address Information - Only show if data exists */}
                                                                                    {(parcel.pickupInformation?.address || parcel.deliveryInformation?.deliveryAddress) && (
                                                                                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                                                                                            {parcel.pickupInformation?.address && (
                                                                                                <div className="bg-blue-50 rounded p-3">
                                                                                                    <h6 className="font-medium text-blue-800 mb-2">Pickup Address</h6>
                                                                                                    <div className="text-sm text-blue-700">
                                                                                                        <div>{parcel.pickupInformation.address}</div>
                                                                                                        <div>{parcel.pickupInformation.city}, {parcel.pickupInformation.district}</div>
                                                                                                        <div>{parcel.pickupInformation.province}</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                            {parcel.deliveryInformation?.deliveryAddress && (
                                                                                                <div className="bg-green-50 rounded p-3">
                                                                                                    <h6 className="font-medium text-green-800 mb-2">Delivery Address</h6>
                                                                                                    <div className="text-sm text-green-700">
                                                                                                        <div>{parcel.deliveryInformation.deliveryAddress}</div>
                                                                                                        <div>{parcel.deliveryInformation.deliveryCity}, {parcel.deliveryInformation.deliveryDistrict}</div>
                                                                                                        <div>{parcel.deliveryInformation.deliveryProvince} - {parcel.deliveryInformation.postalCode}</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <div className="text-center py-4 text-gray-500">
                                                                            No parcel details available
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Arrival Times */}
                                                    {shipment.arrivalTimes && shipment.arrivalTimes.length > 0 && (
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <h4 className="font-semibold text-gray-800 mb-3">Arrival Times</h4>
                                                            <div className="space-y-1">
                                                                {shipment.arrivalTimes.map((arrival, index) => (
                                                                    <div key={index} className="flex justify-between text-sm">
                                                                        <span className="text-gray-600">
                                                                            {getCenterNameSync(arrival.center || arrival.branchId || arrival)}
                                                                        </span>
                                                                        <span className="font-medium text-gray-800">{arrival.time} hours</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    No shipments found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bulk Actions */}
            {selectedShipments.size > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-700 font-medium">
                        {selectedShipments.size} shipment(s) selected
                    </div>
                    <div className="mt-2 flex gap-2">
                        {/* Only show Bulk Verify for Pending status or All status with pending shipments selected */}
                        {(statusFilter === 'Pending' || (statusFilter === 'All' && 
                          shipments.some(s => selectedShipments.has(s._id || s.id) && s.status === 'Pending'))) && (
                            <button
                                onClick={handleBulkVerify}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Bulk Verify
                            </button>
                        )}
                        {/* Only show Bulk Delete if there are deletable shipments (Pending or Verified) */}
                        {shipments.some(s => 
                            selectedShipments.has(s._id || s.id) && 
                            ['Pending', 'Verified'].includes(s.status)
                        ) && (
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Bulk Delete
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Beautiful Confirmation Modal */}
            {confirmationModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all">
                        <div className="text-center">
                            {/* Icon based on confirmation type */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4">
                                {confirmationModal.type === 'verify' && (
                                    <div className="bg-green-100 rounded-full p-3">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                )}
                                {confirmationModal.type === 'delete' && (
                                    <div className="bg-red-100 rounded-full p-3">
                                        <XCircle className="w-10 h-10 text-red-600" />
                                    </div>
                                )}
                                {confirmationModal.type === 'warning' && (
                                    <div className="bg-yellow-100 rounded-full p-3">
                                        <AlertCircle className="w-10 h-10 text-yellow-600" />
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {confirmationModal.title}
                            </h3>

                            {/* Message */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {confirmationModal.message}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={closeConfirmation}
                                    disabled={confirmationModal.processing}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeConfirmedAction}
                                    disabled={confirmationModal.processing}
                                    className={`px-6 py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 transition-all disabled:opacity-50 flex items-center gap-2 ${
                                        confirmationModal.type === 'verify' 
                                            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-200' 
                                            : confirmationModal.type === 'delete' 
                                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-200'
                                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200'
                                    }`}
                                >
                                    {confirmationModal.processing && (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    )}
                                    {confirmationModal.processing ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShipmentManagement;