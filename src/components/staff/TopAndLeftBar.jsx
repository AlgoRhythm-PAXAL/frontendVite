import { useState } from 'react';
import { ChevronDown, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const TopAndLeftBar = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar />
            <div className="flex flex-col flex-1">
                <TopBar />
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

// Top Bar Component for Parcel Management
const TopBar = () => {
    return (
        <div className="bg-gray-100 w-full py-4 px-6 flex items-center justify-between border-b border-gray-200">
            {/* Title in center */}
            <div className="text-2xl font-semibold">
                Available Parcels
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-5">
                {/* Bell notification */}
                <div className="text-xl">🔔</div>

                {/* User location */}
                <div className="text-right text-xs">
                    <div className="text-gray-500">E0001</div>
                    <div>Colombo</div>
                </div>

                {/* User profile image */}
                <div className="h-8 w-8 rounded-full bg-red-200 overflow-hidden">
                    <img src="/api/placeholder/32/32" alt="User Profile" className="h-full w-full object-cover" />
                </div>
            </div>
        </div>
    );
};

// Side Bar Component
const SideBar = () => {
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);

    const menuOptions = [
        {
            title: "Lodging Management",
            items: ["Create Lodging", "View Lodgings"]
        },
        {
            title: "Collection Management",
            items: ["Create Collection", "View Collections"]
        },
        {
            title: "Shipment Management",
            items: [
                { title: "Parcel Table", path: "/staff/shipment-management/parcel-table-page" },
                { title: "Create Shipment", path: "/staff/shipment-management/create-shipment" },
                { title: "View Shipments", path: "/staff/shipment-management/view-shipments" }
            ]
        },
        {
            title: "Inquiry Management",
            items: ["Create Inquiry", "View Inquiries"]
        }
    ];

    const toggleDropdown = (index) => {
        if (openDropdown === index) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(index);
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="bg-teal-600 h-full w-64 flex flex-col">
            {/* Company Logo */}
            <div className="p-4 flex justify-center">
                <div className="text-white text-xl font-bold">PARCEL SYSTEM</div>
            </div>

            {/* Management Options */}
            <div className="p-4 flex flex-col space-y-3">
                {menuOptions.map((option, index) => (
                    <div key={index} className="relative">
                        <button
                            onClick={() => toggleDropdown(index)}
                            className="w-full flex items-center justify-between bg-white text-gray-800 px-3 py-2 rounded-md focus:outline-none"
                        >
                            <span>{option.title}</span>
                            <ChevronDown size={16} />
                        </button>

                        {openDropdown === index && (
                            <div className="mt-1 bg-white rounded-md shadow-lg py-1">
                                {option.items.map((item, itemIndex) => (
                                    typeof item === 'string' ? (
                                        <div key={itemIndex} className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                                            {item}
                                        </div>
                                    ) : (
                                        <Link
                                            key={itemIndex}
                                            to={item.path}
                                            className={`block px-3 py-2 text-sm hover:bg-gray-100 ${isActive(item.path) ? 'bg-gray-100 font-medium' : ''}`}
                                        >
                                            {item.title}
                                        </Link>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Menu Options */}
            <div className="mt-auto p-4 text-white">
                <div className="flex items-center mb-3 space-x-2 cursor-pointer hover:text-gray-200">
                    <Settings size={16} />
                    <span>Settings</span>
                </div>
                <div className="flex items-center mb-3 space-x-2 cursor-pointer hover:text-gray-200">
                    <HelpCircle size={16} />
                    <span>Help</span>
                </div>
                <div className="flex items-center space-x-2 cursor-pointer text-red-300 hover:text-red-200">
                    <LogOut size={16} />
                    <span>Logout Account</span>
                </div>
            </div>
        </div>
    );
};

export default TopAndLeftBar;