import React, { useState } from 'react';
import {
    ArrowLeft,
    Package,
    Truck,
    Route,
    Clock,
    Weight,
    MapPin,
    CheckCircle,
    AlertCircle,
    Info,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const PaxelShipmentGuide = () => {
    const [expandedStep, setExpandedStep] = useState(null);

    const handleBack = () => {
        window.history.back();
    };

    const toggleStepExpansion = (stepIndex) => {
        setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
    };

    const constraints = [
        {
            type: 'Express',
            maxDistance: '150 km',
            timeLimit: '24 hours',
            maxVolume: '5 m³',
            maxWeight: '1000 kg',
            color: 'bg-red-50 border-red-200',
            badge: 'bg-red-100 text-red-800'
        },
        {
            type: 'Standard',
            maxDistance: '300 km',
            timeLimit: '72 hours',
            maxVolume: '10 m³',
            maxWeight: '2500 kg',
            color: 'bg-blue-50 border-blue-200',
            badge: 'bg-blue-100 text-blue-800'
        }
    ];

    const steps = [
        {
            number: '1',
            title: 'Staff Selects parcels need to make shipments',
            description: 'Staff selects parcels that have arrived at a collection center.',
            details: [
                'Can choose any number of parcels',
                'System get the source center (Using the details where the shipments who creates)',
                'Can make shipments for express stnadard parcels',
                'if wants to create manually that also can do',
            ],
            icon: <Package className="w-6 h-6" />,
            color: 'bg-[#1F818C]',
            lightColor: 'bg-teal-50'
        },
        {
            number: '2',
            title: 'System Collects Information',
            description: 'The system gathers all necessary parcel data for processing.',
            details: [
                'Where each parcel is going (destination branch)',
                'Parcel size and weight specifications',
                'Whether these parcels are already in another shipment',
                'Validate parcel compatibility with selected service type'
            ],
            icon: <Info className="w-6 h-6" />,
            color: 'bg-green-600',
            lightColor: 'bg-green-50'
        },
        {
            number: '3',
            title: 'Make Groups of Parcels',
            description: 'Group parcels by their destination center.',
            details: [
                'Group all the parcels by their destination branch',
                'Calculate total size and weight for each group',
                
            ],
            icon: <CheckCircle className="w-6 h-6" />,
            color: 'bg-yellow-600',
            lightColor: 'bg-yellow-50'
        },
        {
            number: '4',
            title: 'Cheking constaints',
            description: 'Add parcel groups to shipments based on constraints.',
            details: [
                'getting the route informatins given by the staff( distnaces between centers)',
                'Find the closest branch to the source center',
                'Check the it will exceed the constraints. if not add that group to the shipment',
                'If it exceeds, create a new shipment and continue adding parcels',
            ],
            icon: <MapPin className="w-6 h-6" />,
            color: 'bg-purple-600',
            lightColor: 'bg-purple-50'
        },
        {
            number: '5',
            title: 'Route Optimization',
            description: 'After adding one group fora specific destination, optimize the route.',
            details: [
                'Using the given distances between centers it will find next closest destination to added group',
                'this process will repeat until constraints exceeds.',
                'this gived maximim exfficiecy traveling more centers in one shipment',
            ],
            icon: <Route className="w-6 h-6" />,
            color: 'bg-indigo-600',
            lightColor: 'bg-indigo-50'
        },
        {
            number: '6',
            title: 'Shipment Details Finalized',
            description: 'Complete shipment information is compiled and stored.',
            details: [
                'All assigned parcel IDs are recorded',
                'Complete route plan is generated',
                'Estimated delivery times are calculated',
                'Unique Shipment ID is assigned (e.g., EX-S001-Colombo)'
            ],
            icon: <Truck className="w-6 h-6" />,
            color: 'bg-teal-600',
            lightColor: 'bg-teal-50'
        },
        {
            number: '7',
            title: 'Arrival Times Calculated',
            description: 'Precise timing estimates with buffer periods for handling.',
            details: [
                'Travel times between branches are estimated',
                'First stop: 2 hours preparation buffer',
                'Middle stops: 1–2 hours handling buffer(1 hour for express, 2 hours for standard)',
                'Final delivery: 2 hours completion buffer'
            ],
            icon: <Clock className="w-6 h-6" />,
            color: 'bg-orange-600',
            lightColor: 'bg-orange-50'
        },
        {
            number: '8',
            title: 'Parcels Linked to Shipment',
            description: 'Final step updates parcel tracking information system-wide.',
            details: [
                'Every parcel shows which shipment it belongs to',
                'Parcel status changes to "Shipment Assigned"',
                'Tracking system is updated for real-time monitoring'
            ],
            icon: <CheckCircle className="w-6 h-6" />,
            color: 'bg-emerald-600',
            lightColor: 'bg-emerald-50'
        }
    ];

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
                            Paxel Shipment Creation Guide
                        </h1>

                        <div className="bg-gradient-to-r from-[#1F818C] to-[#176872] rounded-lg p-6 text-white">
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                                <Truck className="w-6 h-6 mr-3" />
                                What is Shipment Processing in Paxel?
                            </h2>
                            
                            <p className="text-blue-100 font-medium">
                                It's ensures for each shipment maximum distance, time, parcel size, and weight. So,
                                nothing is delayed or overloaded.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Constraints Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Weight className="w-7 h-7 mr-3 text-amber-500" />
                        Shipment Constraints & Limits
                    </h3>
                    <p className="text-gray-700 mb-6">
                        Each shipment must follow Paxel's safe and efficient delivery limits:
                    </p>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                                        Delivery Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                                        Max Distance
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                                        Time Limit
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                                        Max Volume
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border border-gray-300">
                                        Max Weight
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {constraints.map((constraint, index) => (
                                    <tr key={index} className={`${constraint.color}`}>
                                        <td className="px-6 py-4 border border-gray-300">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${constraint.badge}`}>
                                                {constraint.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 border border-gray-300 font-medium">
                                            {constraint.maxDistance}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 border border-gray-300 font-medium">
                                            {constraint.timeLimit}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 border border-gray-300 font-medium">
                                            {constraint.maxVolume}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 border border-gray-300 font-medium">
                                            {constraint.maxWeight}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-600" />
                            <div>
                                <h4 className="font-semibold text-amber-800 mb-1">Important Note:</h4>
                                <p className="text-amber-700">
                                    If these limits are reached, a new shipment is started automatically.
                                  
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Process Overview */}
                <div className="mb-12">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Route className="w-7 h-7 mr-3 text-[#1F818C]" />
                            Step-by-Step Process Overview
                        </h2>

                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div
                                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => toggleStepExpansion(index)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`${step.color} text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0`}>
                                                    {step.icon}
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <span className={`${step.color} text-white px-2 py-1 rounded-full text-xs font-semibold mr-3`}>
                                                            Step {step.number}
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
                                            <h4 className="font-semibold text-gray-900 mb-3">Detailed Process:</h4>
                                            <ul className="space-y-2">
                                                {step.details.map((detail, detailIndex) => (
                                                    <li key={detailIndex} className="flex items-start">
                                                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Route Optimization Example */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Route className="w-7 h-7 mr-3 text-[#1F818C]" />
                        Route Optimization Example
                    </h3>
                  

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Example Scenario:</h4>
                        <p className="text-gray-700 mb-6">
                            If your shipment starts at <span className="font-semibold text-[#1F818C]">Colombo</span>, and you need to deliver to:
                            Kandy, Kaluthara, Gampha
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        1
                                    </div>
                                    <span className="text-gray-800">Start at <strong>Colombo</strong></span>
                                </div>
                                <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        2
                                    </div>
                                    <span className="text-gray-800">Calculate distances to all destinations</span>
                                </div>
                                <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        3
                                    </div>
                                    <span className="text-gray-800">Select closest destination: <strong>Gampha</strong></span>
                                </div>
                                <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        4
                                    </div>
                                    <span className="text-gray-800">Repeat from Gampha to remaining destinations</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-[#1F818C] to-[#176872] rounded-lg p-6 text-white">
                                <h5 className="font-semibold mb-3">Optimized Route Result:</h5>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>Colombo (Start)</span>
                                    </div>
                                    <div className="flex items-center ml-4">
                                        <div className="w-px h-6 bg-blue-200"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>Gampha</span>
                                    </div>
                                    <div className="flex items-center ml-4">
                                        <div className="w-px h-6 bg-blue-200"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>Kaluthara</span>
                                    </div>
                                    <div className="flex items-center ml-4">
                                        <div className="w-px h-6 bg-blue-200"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>Kandy (End)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                

                
            </div>
        </div>
    );
};

export default PaxelShipmentGuide;