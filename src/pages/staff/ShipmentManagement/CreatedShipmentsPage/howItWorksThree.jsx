import React, { useState } from 'react';
import {
    ArrowLeft,
    Package,
    Truck,
    Search,
    CheckCircle,
    AlertCircle,
    Info,
    ChevronDown,
    ChevronUp,
    Settings,
    Target,
    Route,
    Activity,
    Database,
    RefreshCw,
    MapPin,
    Weight,
    Volume,
    Clock,
    FileText,
    Filter,
    Plus
} from 'lucide-react';

const AddParcelsProcessExplanation = () => {
    const [expandedStep, setExpandedStep] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const handleBack = () => {
        window.history.back();
    };

    const toggleStepExpansion = (stepIndex) => {
        setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
    };

    const constraints = {
        maxWeight: 2500, // kg
        maxVolume: 10,   // cubic meters
        weightMap: { small: 2, medium: 5, large: 10 },
        volumeMap: { small: 0.2, medium: 0.5, large: 1.0 }
    };

    const processSteps = [
      
        {
            id: 1,
            title: 'Route Analysis',
            description: 'Determine current position and remaining destinations in the route',
            details: [
                'Find current location in (Source Center)the shipment route',
                'Collect the remaining centers (destinations after current position)',
                
            ],
            
            icon: <Route className="w-6 h-6" />,
            color: 'bg-green-600',
            lightColor: 'bg-green-50'
        },
        {
            id: 2,
            title: 'Capacity Assessment',
            description: 'Calculate current shipment capacity and available space',
            details: [
                'Get current shipment weight and volume totals',
                'Calculate remaining capacity within system constraints',
                'Define parcel size-to-weight/volume using predefined values',
               
               
            ],
           
            icon: <Weight className="w-6 h-6" />,
            color: 'bg-purple-600',
            lightColor: 'bg-purple-50'
        },
        {
            id: 3,
            title: 'Parcel Search Process',
            description: 'Iterate through route centers to find eligible parcels',
            details: [
                'Loop through each center starting from current location',
                'For each center, identify remaining destinations it can serve',
                'Search for unassigned parcels at each center',
                'Apply multiple search filters to find parcels',
                'Process parcels with capacity constraint checking'
            ],
           
            icon: <Search className="w-6 h-6" />,
            color: 'bg-orange-600',
            lightColor: 'bg-orange-50'
        },
        {
            id: 4,
            title: 'Parcel Selection',
            description: 'Select parcels that fit within capacity constraints',
            details: [
                'For each found parcel, calculate weight and volume based on size',
                'Check if adding parcel would exceed shipment limits',
                'Add eligible parcels to selection list ',
                'Track cumulative weight and volume during selection',
                'Stop selection when capacity limits are approached'
            ],
           
            icon: <Filter className="w-6 h-6" />,
            color: 'bg-teal-600',
            lightColor: 'bg-teal-50'
        },
       
    ];

    const searchStrategies = [
        {
            title: 'Primary Search',
            description: 'Search with full criteria including status filter',
            criteria: [
                'from: current center',
                'to: remaining destinations',
                'shipmentId: null',
                'shippingMethod: "standard"',
                'status: ["ArrivedAtDistributionCenter", "OrderPlaced"]'
            ],
            color: 'text-blue-600'
        },
        {
            title: 'Fallback Search 1',
            description: 'Remove status filter if no parcels found',
            criteria: [
                'from: current center',
                'to: remaining destinations',
                'shipmentId: null',
                'shippingMethod: "standard"',
                '(no status filter)'
            ],
            color: 'text-green-600'
        },
        {
            title: 'Fallback Search 2',
            description: 'Case-insensitive shipping method matching',
            criteria: [
                'from: current center',
                'to: remaining destinations',
                'shipmentId: null',
                'shippingMethod: /^standard$/i',
                '(case-insensitive regex)'
            ],
            color: 'text-purple-600'
        }
    ];

    const exampleScenario = {
        shipment: {
            id: '68136d77f364769daccb4014',
            route: ['Colombo', 'Kandy', 'Galle', 'Matara'],
            currentLocation: 'Kandy',
            currentWeight: 50,
            currentVolume: 2.5,
            parcelCount: 15
        },
        availableParcels: [
            { center: 'Kandy', destination: 'Galle', count: 3, size: 'small' },
            { center: 'Kandy', destination: 'Matara', count: 2, size: 'medium' },
            { center: 'Galle', destination: 'Matara', count: 4, size: 'small' }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-[#1F818C] hover:text-[#176872] transition-colors duration-200 mb-6 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Shipment Management
                    </button>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Add More Parcels to Standard Shipments
                        </h1>
                        

                        <div className="bg-gradient-to-r from-[#1F818C] to-[#176872] rounded-lg p-6 text-white">
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                                <Plus className="w-6 h-6 mr-3" />
                                Dynamic Parcel Addition System
                            </h2>
                            <p className="text-blue-50 leading-relaxed">
                                This system allows adding more parcels to existing standard shipments that are already
                                in transit, optimizing vehicle capacity utilization by collecting additional parcels
                                along the planned route while respecting weight and volume constraints.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-8">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                        ? 'border-[#1F818C] text-[#1F818C]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Process Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('detailed')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'detailed'
                                        ? 'border-[#1F818C] text-[#1F818C]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Detailed Steps
                            </button>
                            <button
                                onClick={() => setActiveTab('example')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'example'
                                        ? 'border-[#1F818C] text-[#1F818C]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Example Scenario
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Function Purpose */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                <Target className="w-7 h-7 mr-3 text-[#1F818C]" />
                                This feature Constraints and Objectives
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    
                                    <ul className="space-y-2">
                                    <h3 className="font-semibold text-gray-900 mb-4">Objectives</h3>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Maximize vehicle capacity utilization</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Reduce operational costs by filling empty space</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Improve delivery efficiency for standard shipments with their high capcities</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">Maintain strict capacity and route constraints</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">System Constraints</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="bg-red-50 border border-red-200 rounded p-3">
                                            <div className="font-medium text-red-800">Weight Limit</div>
                                            <div className="text-red-700">{constraints.maxWeight} kg maximum</div>
                                        </div>
                                        <div className="bg-red-50 border border-red-200 rounded p-3">
                                            <div className="font-medium text-red-800">Volume Limit</div>
                                            <div className="text-red-700">{constraints.maxVolume} m³ maximum</div>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                            <div className="font-medium text-blue-800">Route Restriction</div>
                                            <div className="text-blue-700">Only parcels along planned route</div>
                                        </div>
                                        <div className="bg-green-50 border border-green-200 rounded p-3">
                                            <div className="font-medium text-green-800">Service Type</div>
                                            <div className="text-green-700">Standard shipments only</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                       

                        
                    </div>
                )}

                {/* Detailed Steps Tab */}
                {activeTab === 'detailed' && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Activity className="w-7 h-7 mr-3 text-[#1F818C]" />
                                Detailed Process Steps
                            </h2>

                            <div className="space-y-4">
                                {processSteps.map((step, index) => (
                                    <div key={step.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div
                                            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => toggleStepExpansion(index)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`${step.color} text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0`}>
                                                        {step.icon}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center mb-2">
                                                            <span className={`${step.color} text-white px-3 py-1 rounded-full text-xs font-semibold mr-3`}>
                                                                Step {step.id}
                                                            </span>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {step.title}
                                                            </h3>
                                                        </div>
                                                        <p className="text-gray-600">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {expandedStep === index ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {expandedStep === index && (
                                            <div className={`${step.lightColor} border-t border-gray-200 p-6`}>
                                                <div className="grid lg:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 mb-3">Process Details:</h4>
                                                        <ul className="space-y-2">
                                                            {step.details.map((detail, detailIndex) => (
                                                                <li key={detailIndex} className="flex items-start">
                                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-gray-700 text-sm">{detail}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                               
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                
                {/* Example Scenario Tab */}
                {activeTab === 'example' && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-7 h-7 mr-3 text-green-500" />
                                Example Scenario: Adding Parcels to Shipment
                            </h2>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                                <h3 className="font-semibold text-yellow-800 mb-3">Scenario Setup:</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-yellow-900 mb-2">Shipment Details</h4>
                                        <ul className="space-y-1 text-sm text-yellow-800">
                                            
                                            <li>• Route: {exampleScenario.shipment.route.join(' → ')}</li>
                                            <li>• Current Location: {exampleScenario.shipment.currentLocation}</li>
                                            <li>• Current Weight: {exampleScenario.shipment.currentWeight} kg</li>
                                            <li>• Current Volume: {exampleScenario.shipment.currentVolume} m³</li>
                                            <li>• Current Parcel Count: {exampleScenario.shipment.parcelCount}</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-yellow-900 mb-2">Available Capacity</h4>
                                        <ul className="space-y-1 text-sm text-yellow-800">
                                            <li>• Remaining Weight: {constraints.maxWeight - exampleScenario.shipment.currentWeight} kg</li>
                                            <li>• Remaining Volume: {constraints.maxVolume - exampleScenario.shipment.currentVolume} m³</li>
                                            <li>• Can add: ~{Math.floor((constraints.maxWeight - exampleScenario.shipment.currentWeight) / 2)} small parcels</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Execution</h3>

                                    <div className="space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-900 mb-2">Step 1: Route Analysis</h4>
                                            <p className="text-blue-800 text-sm mb-2">
                                                Current location: Kandy (index 1)(this alredy gone one itaration-Colombo(index 0)), <br/>Remaining destinations: Galle, Matara
                                            </p>
                                           
                                        </div>

                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-green-900 mb-2">Step 2: Search at Kandy</h4>
                                            <p className="text-green-800 text-sm mb-2">
                                                Assume: Found 5 parcels: 3 to Galle (small), 2 to Matara (medium)
                                            </p>
                                            <div className="space-y-1">
                                                {exampleScenario.availableParcels.filter(p => p.center === 'Kandy').map((parcel, index) => (
                                                    <div key={index} className="font-mono text-xs bg-green-100 p-2 rounded">
                                                        {parcel.count} {parcel.size} parcels → {parcel.destination}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-900 mb-2">Step 3: Capacity Check</h4>
                                            <div className="space-y-2 text-sm text-purple-800">
                                                <div>Small parcels (3): 3 × 2kg = 6kg, 3 × 0.2m³ = 0.6m³</div>
                                                <div>Medium parcels (2): 2 × 5kg = 10kg, 2 × 0.5m³ = 1.0m³</div>
                                                <div className="font-semibold">Total addition: 16kg, 1.6m³ ✓ (within limits)</div>
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-orange-900 mb-2">Step 4: Search at Galle</h4>
                                            <p className="text-orange-800 text-sm mb-2">
                                                Found 4 small parcels to Matara (final destination)
                                            </p>
                                            <div className="space-y-1">
                                                <div className="font-mono text-xs bg-orange-100 p-2 rounded">
                                                    4 small parcels → Matara (4 × 2kg = 8kg, 4 × 0.2m³ = 0.8m³)
                                                </div>
                                                <div className="text-sm text-orange-700">
                                                    New totals: 66kg + 24kg = 90kg, 2.5m³ + 2.4m³ = 4.9m³ ✓
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-red-900 mb-2">Step 5: Final Results</h4>
                                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <div className="font-medium text-red-800 mb-2">Parcels Added:</div>
                                                    <ul className="space-y-1 text-red-700">
                                                        <li>• From Kandy: 5 parcels</li>
                                                        <li>• From Galle: 4 parcels</li>
                                                        <li>• Total: 9 parcels added</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-red-800 mb-2">Final Capacity:</div>
                                                    <ul className="space-y-1 text-red-700">
                                                        <li>• Weight: 90kg / 2500kg (3.6%)</li>
                                                        <li>• Volume: 4.9m³ / 10m³ (49%)</li>
                                                        <li>• Parcels: 24 total</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                

                                
                            </div>
                        </div>
                    </div>
                )}

                

                
            </div>
        </div>
    );
};

export default AddParcelsProcessExplanation;