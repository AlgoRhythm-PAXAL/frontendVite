import React, { useState } from 'react';
import {
    ArrowLeft,
    Package,
    Truck,
    Search,
    Clock,
    Weight,
    MapPin,
    CheckCircle,
    AlertCircle,
    Info,
    ChevronDown,
    ChevronUp,
    Settings,
    Target,
    Zap,
    Route,
    Activity
} from 'lucide-react';

const PaxelLogisticsSystem = () => {
    const [expandedStep, setExpandedStep] = useState(null);
    const [activeTab, setActiveTab] = useState('workflow');

    const handleBack = () => {
        window.history.back();
    };

    const toggleStepExpansion = (stepIndex) => {
        setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
    };

    const workflowSteps = [
        {
            id: 1,
            title: 'Search Vehicles at Source Branch',
            description: 'System searches for available vehicles at the shipment origin location',
            details: [
                'Vehicle must be physically located at source branch (e.g., Colombo)',
                'Vehicle must be owned by the source branch',
                'Vehicle status must be marked as available (not in use)',
                'Vehicle must have sufficient weight and volume capacity to handle the shipment',
                'If no suitable vehicles found, proceed to Step 2'
                
            ],
            example: {
                location: 'Colombo Branch',
                requirements: '2 kg weight, 0.2 m³ volume',
                result: 'No suitable vehicles found',
                status: 'Proceeding to Step 2'
            },
            icon: <Search className="w-6 h-6" />,
            color: 'bg-blue-600',
            lightColor: 'bg-blue-50'
        },
        {
            id: 2,
            title: 'Search Branch-Owned Vehicles at Other Locations',
            description: 'System locates vehicles owned by source branch but stationed elsewhere',
            details: [
                'Searches for vehicles belonging to source branch',
                'Vehicles may be currently located at different centers',
                'Vehicle must be available and not assigned to other tasks',
                'Vehicle must meet shipment weight and volume requirements',
                'This do to keep center owned vehicles in use',
                'If no suitable vehicles found, proceed to Step 3'
            ],
            example: {
                vehicle: 'VEHICLE005',
                currentLocation: 'Kalutara Branch',
                owner: 'Colombo Branch',
                status: 'Available',
                result: 'Vehicle selected for assignment'
            },
            icon: <Route className="w-6 h-6" />,
            color: 'bg-green-600',
            lightColor: 'bg-green-50'
        },
        {
            id: 3,
            title: 'Fallback Search in Nearest Centers',
            description: 'Final attempt to locate suitable vehicles in geographically nearby branches',
            details: [
                'Identifies 3 geographically nearest branches to source',
                'Searches for any available vehicles meeting requirements(belongs center and current center need to same)',
                'Vehicle must be available and not assigned to other tasks',
                'Vehicle must meet shipment weight and volume requirements',
                'If no suitable vehicles found , have to wait untill vehicle avilable',
    
            ],
            example: {
                nearestCenters: 'Gampaha, Kalutara, Negombo',
                searchScope: 'All available vehicles',
                criteria: 'Capacity and availability',
                fallbackStatus: 'Applied when Step 2 fails'
            },
            icon: <Target className="w-6 h-6" />,
            color: 'bg-purple-600',
            lightColor: 'bg-purple-50'
        }
    ];

    const optimizationFeatures = [
        {
            title: 'Parcel Matching Criteria(when vehicle found another center)',
            description: 'Express/Stnadard parcels at vehicle location to source branch',
            icon: <Package className="w-5 h-5" />,
            color: 'text-blue-600'
        },
        {
            title: 'Capacity Management and all the parcels tracking shipment route',
            description: 'here syttem shows you all the parcels that can be loaded into the vehicle without exceeding its remaining weight and volume limits. for example think sbout route Colmbo-> Gampaha-> Kaluthara->Kandy and vehicle found from kaluthara. here system finds all the parcels from kaluthara to remain centers in the route.kaluthara to colombo, kaluthara to gampaha, kaluthara to kandy,kaluthata to kaluthara (ignore). And you can add those parcels to the shipment untill constaints exceeds if you like.. ',
            icon: <Weight className="w-5 h-5" />,
            color: 'text-green-600'
        },
        {
            title: 'Route Efficiency and delivery efficiency',
            description: 'Optimizes vehicle journey to reduce empty runs and maximize delivery efficiency',
            icon: <Route className="w-5 h-5" />,
            color: 'text-purple-600'
        },
        {
            title: 'After Vehicle Assignment you can dispatch the shipment',
            description: 'after vehicle assignment, you can dispatch the shipment with predicted arrival times and through the defined route. The system will track the vehicle and update the shipment status in real-time.',
            icon: <CheckCircle className="w-5 h-5" />,
            color: 'text-orange-600'
        }
    ];

    const systemBenefits = [
        {
            category: 'Operational Efficiency',
            benefits: [
                'Multi-level vehicle search increases success rate',
                'Automated parcel optimization reduces empty runs',
                'Real-time capacity tracking prevents overloads',
                'Smart routing algorithms minimize delivery time'
            ]
        },
        {
            category: 'Resource Management',
            benefits: [
                'Maximizes utilization of available vehicles',
                'Reduces fuel costs through route optimization',
                'Minimizes manual intervention in assignments',
                'Enables scalable logistics operations'
            ]
        },
        {
            category: 'Service Quality',
            benefits: [
                'Consistent delivery performance standards',
                'Real-time notifications keep stakeholders informed',
                'Transparent process with clear decision points',
                'Automated fallback mechanisms ensure reliability'
            ]
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
                            Paxel Vehicle Assign Guide
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Vehicle Assignment while adding more parcels.
                        </p>

                       
                    </div>
                    {/* Process Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Process in brief:</h4>
                                    <ol className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start">
                                            <span className="bg-[#1F818C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                                            Shipment creation triggers vehicle assignment process
                                        </li>
                                        <li className="flex items-start">
                                            <span className="bg-[#1F818C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                                            Three-step search algorithm locates suitable vehicle
                                        </li>
                                        <li className="flex items-start">
                                            <span className="bg-[#1F818C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                                            System optimizes vehicle loading with additional parcels
                                        </li>
                                        <li className="flex items-start">
                                            <span className="bg-[#1F818C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                                            Real-time notifications sent to all stakeholders
                                        </li>
                                        <li className="flex items-start">
                                            <span className="bg-[#1F818C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">5</span>
                                            Shipment proceeds with optimized delivery plan
                                        </li>
                                    </ol>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Key Outcomes:</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center">
                                            <Truck className="w-4 h-4 text-[#1F818C] mr-3" />
                                            <span className="text-gray-700">Efficient vehicle utilization</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Route className="w-4 h-4 text-[#1F818C] mr-3" />
                                            <span className="text-gray-700">Maximized parcel delivery</span>
                                        </li>
                                        
                                        <li className="flex items-center">
                                            <Info className="w-4 h-4 text-[#1F818C] mr-3" />
                                            <span className="text-gray-700">Complete process transparency</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-8">
                            <button
                                onClick={() => setActiveTab('workflow')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'workflow'
                                        ? 'border-[#1F818C] text-[#1F818C]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Vehicle Assignment Workflow
                            </button>
                            <button
                                onClick={() => setActiveTab('optimization')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'optimization'
                                        ? 'border-[#1F818C] text-[#1F818C]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Parcel Optimization
                            </button>
                           
                        </nav>
                    </div>
                </div>

                {/* Workflow Tab */}
                {activeTab === 'workflow' && (
                    <div className="space-y-8">
                       

                        {/* Three-Step Process */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Settings className="w-7 h-7 mr-3 text-[#1F818C]" />
                                Three-Step Vehicle Assignment Process
                            </h2>

                            <div className="space-y-4">
                                {workflowSteps.map((step, index) => (
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
                                                <div className="grid lg:grid-cols-3 gap-6">
                                                    <div className="lg:col-span-2">
                                                        <h4 className="font-semibold text-gray-900 mb-3">Process Details:</h4>
                                                        <ul className="space-y-2">
                                                            {step.details.map((detail, detailIndex) => (
                                                                <li key={detailIndex} className="flex items-start">
                                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-gray-700">{detail}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <h4 className="font-semibold text-gray-900 mb-3">Example Scenario:</h4>
                                                        <div className="space-y-2 text-sm">
                                                            {Object.entries(step.example).map(([key, value]) => (
                                                                <div key={key} className="flex flex-col">
                                                                    <span className="text-gray-500 capitalize font-medium">
                                                                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                                    </span>
                                                                    <span className="text-gray-800 font-mono text-xs bg-gray-50 px-2 py-1 rounded mt-1">
                                                                        {value}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
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

                {/* Optimization Tab */}
                {activeTab === 'optimization' && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                <Target className="w-7 h-7 mr-3 text-green-500" />
                                Maximum Vehicle Utilization using Parcel Optimization
                            </h2>
                            <p className="text-gray-700 mb-6">
                                After vehicle assignment, the system ask to maximize efficiency by loading
                                additional parcels during the vehicle's journey to the pickup location.
                            </p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Optimization Criteria</h3>
                                    <div className="space-y-4">
                                        {optimizationFeatures.map((feature, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${feature.color}`}>
                                                    {feature.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Capacity Example</h3>
                                    <div className="space-y-3">
                                        <div className="bg-white rounded p-3 border">
                                            <div className="text-sm text-gray-600">Vehicle Maximum</div>
                                            <div className="font-mono text-gray-900">1,000 kg / 5.0 m³</div>
                                        </div>
                                        <div className="bg-white rounded p-3 border">
                                            <div className="text-sm text-gray-600">Current Shipment</div>
                                            <div className="font-mono text-gray-900">2 kg / 0.2 m³</div>
                                        </div>
                                        <div className="bg-green-50 rounded p-3 border border-green-200">
                                            <div className="text-sm text-green-600">Remaining Capacity</div>
                                            <div className="font-mono text-green-900">998 kg / 4.8 m³</div>
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

export default PaxelLogisticsSystem;