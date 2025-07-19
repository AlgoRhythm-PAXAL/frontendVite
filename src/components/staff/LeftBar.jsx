import { useState } from 'react';
import { ChevronDown, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const TopAndLeftBar = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar />

        <div className="flex-1 overflow-auto">
                <Outlet />
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
            items: [
                { title: "View Pickups", path: "/staff/lodging-management/view-pickups" },
                { title: "View Drop-offs", path: "/staff/lodging-management/view-dropOffs" },
                { title: "View Parcels", path: "/staff/lodging-management/view-parcels" },
                { title: "Add Parcels", path: "/staff/lodging-management/add-new-parcel" },

            ]
        },
        {
            title: "Collection Management",
             items: [
                  { title: "Dashboard", path: "/staff/collection-management/dashboard" },
                { title: "Track Parcels", path: "/staff/collection-management/tracking" },
                { title: "View doorstep parcels", path: "/staff/collection-management/assign-driver" },
                { title: "View collection-center parcels", path: "/staff/collection-management/view-collection-center-delivery-parcels" },
               ]
        },
        {
            title: "Shipment Management",
            items: [
                { title: "Create Shipment", path: "/staff/shipment-management/parcel-table-page" },
                { title: "Create Shipment Manually", path: "/staff/shipment-management/manual-shipment-page" },
                { title: "Created Shipments", path: "/staff/shipment-management/created-shipments-page" },
                { title: "View Shipments", path: "/staff/shipment-management/view-shipments" }
            ]
        },
        {
            title: "Inquiry Management",
            items: [
                { title: "View new inquiries", path: "/staff/inquiry-management/view-new-inquiries" },
                { title: "View inquiry history", path: "/staff/inquiry-management/view-replied-inquiries" },
              
            ]
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
                <div className="text-white text-xl font-bold">Staff Portal</div>
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