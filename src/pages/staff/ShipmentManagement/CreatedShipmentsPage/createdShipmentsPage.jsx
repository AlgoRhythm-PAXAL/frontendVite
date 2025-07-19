import { useState, useEffect } from 'react';
import { Check, X, Truck, AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp, Car, Package, Loader, Info, ArrowLeftRight } from 'lucide-react';

const ShipmentManagement = () => {
    // State management for shipments data and UI controls
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedShipments, setSelectedShipments] = useState(new Set());
    const [popup, setPopup] = useState(null);
    const [processingShipment, setProcessingShipment] = useState(null);
    const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('all'); // Filter for delivery type
    const [expandedShipmentId, setExpandedShipmentId] = useState(null); // For expandable rows
    const [expandedParcelId, setExpandedParcelId] = useState(null); // For expandable parcel details
    const [searchTerm, setSearchTerm] = useState(''); // Search functionality
    const [vehicleAssignmentModal,  setVehicleAssignmentModal] = useState(null); // For vehicle assignment modal
    const [assigningVehicle, setAssigningVehicle] = useState(false); // Loading state for vehicle assignment
    const [foundVehicle, setFoundVehicle] = useState(null); // Store found vehicle details
    const [findingVehicle, setFindingVehicle] = useState(false); // Loading state for vehicle search
    const [assignmentResult, setAssignmentResult] = useState(null); // Store assignment result
    // Reverse shipment states
    const [foundParcels, setFoundParcels] = useState(null);
    const [selectedParcelsForReverse, setSelectedParcelsForReverse] = useState([]);
    const [creatingReverseShipment, setCreatingReverseShipment] = useState(false);
    //const [findingParcels, setFindingParcels] = useState(false); // For loading state

    // Fetch shipments data on component mount
    useEffect(() => {
        fetchShipments();
    }, []);  

    // Function to fetch shipments from API
    const fetchShipments = async () => {
        try {
            setLoading(true);
            // Fetch only active shipments (Pending, Verified, In Transit) for the specific center
            const response = await fetch('http://localhost:8000/shipments/active/682e1059ce33c2a891c9b168');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Handle different response formats
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
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching shipments:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to show popup messages with auto-dismiss
    const showPopup = (type, message, duration = 3000) => {
        setPopup({ type, message });
        setTimeout(() => setPopup(null), duration);
    };

    // Handle individual shipment selection
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
        setProcessingShipment(shipmentId);
        try {
            const response = await fetch(`http://localhost:8000/shipments/${shipmentId}/verify`, {
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

            showPopup('success', 'Shipment verified and confirmed successfully!');
        } catch (err) {
            showPopup('error', `Error verifying shipment: ${err.message}`);
        } finally {
            setProcessingShipment(null);
        }
    };

    // Function to delete shipment - nullifies parcels and removes shipment
    const handleDeleteShipment = async (shipmentId) => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            'Are you sure you want to delete this shipment? This will also reset the associated parcels to PendingPickup status.'
        );

        if (!confirmed) {
            return;
        }

        setProcessingShipment(shipmentId);
        try {
            const response = await fetch(`http://localhost:8000/shipments/${shipmentId}`, {
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

            // Remove shipment from local state
            setShipments(prevShipments =>
                prevShipments.filter(shipment => (shipment._id || shipment.id) !== shipmentId)
            );

            // Remove from selected if it was selected
            const newSelected = new Set(selectedShipments);
            newSelected.delete(shipmentId);
            setSelectedShipments(newSelected);

            showPopup('success', `Shipment deleted successfully! ${data.updatedParcelsCount} parcels have been updated.`);
        } catch (err) {
            showPopup('error', `Error deleting shipment: ${err.message}`);
        } finally {
            setProcessingShipment(null);
        }
    };

    // Function to assign vehicle - only available for verified and confirmed shipments
    const handleAssignVehicle = async (shipmentId) => {
        const shipment = shipments.find(s => (s._id || s.id) === shipmentId);
        
        if (!shipment) {
            showPopup('error', 'Shipment not found');
            return;
        }

        if (!shipment.confirmed) {
            showPopup('error', 'Shipment must be verified and confirmed before assigning vehicle');
            return;
        }

        // Reset states
        setFoundVehicle(null);
        setAssignmentResult(null);

        // Show initial modal
        setVehicleAssignmentModal({
            shipmentId,
            shipment,
            deliveryType: shipment.deliveryType,
            step: 'initial' // initial, vehicleFound, assigned
        });
    };

    // Function to find available vehicle
    const findAvailableVehicle = async () => {
        if (!vehicleAssignmentModal) return;

        const { shipmentId, deliveryType } = vehicleAssignmentModal;
        
        setFindingVehicle(true);
        showPopup('info', 'Searching for available vehicles...', 5000);

        try {
            const response = await fetch(`http://localhost:8000/vehicles/findVehicleForShipment/${shipmentId}/${deliveryType}`, {
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
            showPopup('error', `❌ Failed to find vehicle: ${err.message}`, 6000);
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

            const response = await fetch(`http://localhost:8000/vehicles/findParcelsForReverseShipment?fromCenterId=${fromCenterId}&toCenterId=${toCenterId}&shipmentType=${deliveryType}&vehicleId=${vehicleId}`);
            
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

            const response = await fetch('http://localhost:8000/vehicles/createReverseShipmentWithParcels', {
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

            const response = await fetch(`http://localhost:8000/vehicles/assignVehicleToShipment/${shipmentId}/${deliveryType}`, {
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
                            status: data.data.success ? 'Vehicle Assigned' : shipment.status
                        }
                        : shipment
                )
            );

            // Show success message
            showPopup('success', '✅ Vehicle assigned successfully!', 7000);

            // Refresh shipments to get latest data
            setTimeout(() => {
                fetchShipments();
            }, 2000);

        } catch (err) {
            console.error('Error assigning vehicle:', err);
            showPopup('error', `❌ Failed to assign vehicle: ${err.message}`, 6000);
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

        try {
            const promises = pendingShipments.map(shipment =>
                fetch(`http://localhost:8000/shipments/${shipment._id || shipment.id}/verify`, {
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
                    showPopup('success', `${successCount} shipments verified and confirmed successfully!`);
                } else {
                    showPopup('warning', `${successCount} shipments verified successfully, ${failedCount} failed`);
                }
            } else {
                showPopup('error', 'All shipments failed to verify');
            }
        } catch (err) {
            showPopup('error', `Error in bulk verification: ${err.message}`);
        }
    };

    // Bulk delete operation for selected shipments
    const handleBulkDelete = async () => {
        const selectedShipmentIds = Array.from(selectedShipments);

        if (selectedShipmentIds.length === 0) {
            showPopup('warning', 'No shipments selected for deletion');
            return;
        }

        // Show confirmation dialog
        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedShipmentIds.length} shipment(s)? This will also reset the associated parcels.`
        );

        if (!confirmed) {
            return;
        }

        try {
            const promises = selectedShipmentIds.map(shipmentId =>
                fetch(`http://localhost:8000/shipments/${shipmentId}`, {
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
                    showPopup('success', `${successCount} shipments deleted successfully!`);
                } else {
                    showPopup('warning', `${successCount} shipments deleted successfully, ${failedCount} failed`);
                }
            } else {
                showPopup('error', 'All shipments failed to delete');
            }
        } catch (err) {
            showPopup('error', `Error in bulk deletion: ${err.message}`);
        }
    };

    // Filter shipments based on delivery type and search term
    const getFilteredShipments = () => {
        return shipments.filter(shipment => {
            const matchesDeliveryType = deliveryTypeFilter === 'all' || shipment.deliveryType === deliveryTypeFilter;
            const matchesSearch = searchTerm === '' ||
                (shipment.shipmentId && shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (shipment.status && shipment.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (shipment.sourceCenter?.location && shipment.sourceCenter.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (shipment.sourceCenter?.branchId && shipment.sourceCenter.branchId.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesDeliveryType && matchesSearch;
        });
    };

    // Get status badge styling
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'Vehicle Assigned': return 'bg-blue-100 text-blue-800';
            case 'In Transit': return 'bg-purple-100 text-purple-800';
            case 'Completed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get action buttons based on shipment status and confirmed state
    const getActionButtons = (shipment) => {
        const shipmentId = shipment._id || shipment.id;
        const isProcessing = processingShipment === shipmentId;

        // For pending shipments: show verify and delete buttons
        if (shipment.status === 'Pending') {
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
        // For verified shipments: check if confirmed before showing assign vehicle button
        else if (shipment.status === 'Verified') {
            if (shipment.confirmed) {
                // Check if vehicle is already assigned
                if (shipment.assignedVehicle) {
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <div className="text-center text-green-600 text-sm">
                                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="font-medium">Vehicle Assigned</span>
                                </div>
                                {shipment.assignedVehicle.vehicleId && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        Vehicle: {shipment.assignedVehicle.vehicleId}
                                    </div>
                                )}
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
        // For vehicle assigned or other statuses: show status text
        else {
            return (
                <div className="text-center text-gray-500 text-sm">
                    <div className="flex items-center justify-center gap-2">
                        {shipment.status === 'Vehicle Assigned' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            shipment.status === 'Vehicle Assigned' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {shipment.status}
                        </span>
                    </div>
                    {shipment.assignedVehicle?.vehicleId && (
                        <div className="text-xs text-gray-600 mt-1">
                            Vehicle: {shipment.assignedVehicle.vehicleId}
                        </div>
                    )}
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

            {/* Vehicle Assignment Confirmation Modal */}
            {vehicleAssignmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

                                                <div className="max-h-48 overflow-y-auto bg-white rounded-lg border border-amber-200">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="bg-amber-50 sticky top-0">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left text-amber-700 font-medium">Parcel ID</th>
                                                                <th className="px-3 py-2 text-left text-amber-700 font-medium">Weight</th>
                                                                <th className="px-3 py-2 text-left text-amber-700 font-medium">Volume</th>
                                                                <th className="px-3 py-2 text-left text-amber-700 font-medium">Type</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-amber-100">
                                                            {foundParcels.parcels.map((parcel, index) => (
                                                                <tr key={parcel._id || index} className="hover:bg-amber-25">
                                                                    <td className="px-3 py-2 text-amber-800 font-medium">{parcel.parcelId}</td>
                                                                    <td className="px-3 py-2 text-amber-700">{parcel.weight} kg</td>
                                                                    <td className="px-3 py-2 text-amber-700">{parcel.volume} m³</td>
                                                                    <td className="px-3 py-2 text-amber-700">{parcel.deliveryType}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
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
                        <option value="all">All Shipments</option>
                        <option value="express">Express</option>
                        <option value="standard">Standard</option>
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
                                <>
                                    <tr
                                        key={shipment._id || shipment.id}
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
                                            <td colSpan="7" className="p-0">
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
                                                                        <span className="font-medium text-gray-800">{shipment.createdByCenter?.location || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Created By Staff:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.createdByStaff?.name || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <span className="text-gray-600 w-36">Parcel Count:</span>
                                                                        <span className="font-medium text-gray-800">{shipment.parcelCount || shipment.parcels?.length || 0}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

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
                                                                <span className="font-medium">Parcel IDs:</span> {shipment.parcels.map(p => p.parcelId).join(', ')}
                                                            </div>
                                                            
                                                            {/* Detailed parcel information - collapsible */}
                                                            {expandedParcelId === (shipment._id || shipment.id) && (
                                                                <div className="space-y-4 mt-4">
                                                                    {shipment.parcels.map((parcel, index) => (
                                                                        <div key={parcel._id || index} className="bg-white rounded-lg p-4 border border-gray-200">
                                                                            <h5 className="font-semibold text-blue-700 mb-3">Parcel #{parcel.parcelId || index + 1}</h5>
                                                                            
                                                                            <div className="grid md:grid-cols-3 gap-4">
                                                                                {/* Basic Parcel Information */}
                                                                                <div className="space-y-2">
                                                                                    <h6 className="font-medium text-gray-800 border-b pb-1">Basic Information</h6>
                                                                                    <div className="text-sm space-y-1">
                                                                                        <div><span className="text-gray-600">Parcel ID:</span> <span className="font-medium">{parcel.parcelId || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Tracking No:</span> <span className="font-medium">{parcel.trackingNo || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">QR Code:</span> <span className="font-medium">{parcel.qrCodeNo || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Item Type:</span> <span className="font-medium">{parcel.itemType || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Item Size:</span> <span className="font-medium">{parcel.itemSize || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Shipping Method:</span> <span className="font-medium">{parcel.shippingMethod || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Status:</span> 
                                                                                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
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

                                                                                {/* Sender & Receiver Information */}
                                                                                <div className="space-y-2">
                                                                                    <h6 className="font-medium text-gray-800 border-b pb-1">Sender & Receiver</h6>
                                                                                    <div className="text-sm space-y-1">
                                                                                        <div><span className="text-gray-600">Sender Name:</span> <span className="font-medium">{parcel.senderId?.name || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Sender Email:</span> <span className="font-medium">{parcel.senderId?.email || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Sender Phone:</span> <span className="font-medium">{parcel.senderId?.phone || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Receiver Name:</span> <span className="font-medium">{parcel.receiverId?.name || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Receiver Email:</span> <span className="font-medium">{parcel.receiverId?.email || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Receiver Phone:</span> <span className="font-medium">{parcel.receiverId?.phone || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Payment Amount:</span> <span className="font-medium">{parcel.paymentId?.amount || 'N/A'}</span></div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Location & Delivery Information */}
                                                                                <div className="space-y-2">
                                                                                    <h6 className="font-medium text-gray-800 border-b pb-1">Location & Delivery</h6>
                                                                                    <div className="text-sm space-y-1">
                                                                                        <div><span className="text-gray-600">From Branch:</span> <span className="font-medium">{parcel.from?.location || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">To Branch:</span> <span className="font-medium">{parcel.to?.location || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Submitting Type:</span> <span className="font-medium">{parcel.submittingType || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Receiving Type:</span> <span className="font-medium">{parcel.receivingType || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Pickup Date:</span> <span className="font-medium">{parcel.pickupInformation?.pickupDate ? new Date(parcel.pickupInformation.pickupDate).toLocaleDateString() : 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Pickup Time:</span> <span className="font-medium">{parcel.pickupInformation?.pickupTime || 'N/A'}</span></div>
                                                                                        <div><span className="text-gray-600">Special Instructions:</span> <span className="font-medium">{parcel.specialInstructions || 'None'}</span></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Address Information */}
                                                                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                                                                                <div className="bg-blue-50 rounded p-3">
                                                                                    <h6 className="font-medium text-blue-800 mb-2">Pickup Address</h6>
                                                                                    <div className="text-sm text-blue-700">
                                                                                        <div>{parcel.pickupInformation?.address || 'N/A'}</div>
                                                                                        <div>{parcel.pickupInformation?.city}, {parcel.pickupInformation?.district}</div>
                                                                                        <div>{parcel.pickupInformation?.province}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="bg-green-50 rounded p-3">
                                                                                    <h6 className="font-medium text-green-800 mb-2">Delivery Address</h6>
                                                                                    <div className="text-sm text-green-700">
                                                                                        <div>{parcel.deliveryInformation?.deliveryAddress || 'N/A'}</div>
                                                                                        <div>{parcel.deliveryInformation?.deliveryCity}, {parcel.deliveryInformation?.deliveryDistrict}</div>
                                                                                        <div>{parcel.deliveryInformation?.deliveryProvince} - {parcel.deliveryInformation?.postalCode}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
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
                                                                        <span className="text-gray-600">{arrival.center?.location || arrival.center?.branchId || arrival.center}</span>
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
                                </>
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
                        <button
                            onClick={handleBulkVerify}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Bulk Verify
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Bulk Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShipmentManagement;