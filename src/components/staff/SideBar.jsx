import { useState } from 'react';
import { ChevronDown, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import QRScanner from "../../components/staff/QRScanner";
import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL;


const SideBar = () => {
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const navigate = useNavigate();

    const menuOptions = [
        {
            title: "Lodging Management",
            items: [
                { title: "Pickup Requests", path: "/staff/lodging-management/view-pickups" },
                { title: "Drop-off Requests", path: "/staff/lodging-management/view-dropOffs" },
                { title: "Add New Parcel", path: "/staff/lodging-management/add-new-parcel" },
                { title: "View Parcels", path: "/staff/lodging-management/view-parcels" }
            ]
        },
        {
            title: "Collection Management",
            items: [
                { title: "Dashboard", path: "/staff/collection-management/dashboard" },
                { title: "Track Parcels", path: "/staff/collection-management/tracking" },
                { title: "Deliver Parcels", path: "/staff/collection-management/view-collection-center-delivery-parcels" },
                { title: "Assign Driver", path: "/staff/collection-management/assign-driver" }

            ]
        },
        {
            title: "Shipment Management",
            items: [
                { title: "Smart B2B Shipment Creation", path: "/staff/shipment-management/parcel-table-page" },
                { title: "Manual B2B Shipment Creation", path: "/staff/shipment-management/manual-shipment-page" },
                { title: "Created B2B Shipments", path: "/staff/shipment-management/created-shipments-page" },
                { title: "B2B Shipment History", path: "/staff/shipment-management/view-shipments" }
            ]
        },
        {
            title: "Inquiry Management",
            items: [
                { title: "View Inquiries", path: "/staff/inquiry-management/view-new-inquiries" },
                { title: "Inquiry History", path: "/staff/inquiry-management/view-replied-inquiries" },

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

    {/* Logout button */ }
    const handleLogout = async () => {
        try {
            await axios.post(
                `${backendURL}/staff/logout`,
                {},
                { withCredentials: true }
            );
            navigate("/staff/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="bg-Primary fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 flex flex-col">

            {/* Management Options */}
            <div className="p-4 flex flex-col space-y-4 overflow-y-auto mt-5">
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
                <div className='mt-1 bg-white rounded-md shadow-lg py-2 px-3'>
                    <button
                        onClick={() => setShowScanner(true)}
                    >
                        Scan Parcel QR Code
                    </button>

                    {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}


                </div>
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
                <div className="flex items-center space-x-2 cursor-pointer text-red-300 hover:text-red-200"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    <span >Logout Account</span>
                </div>
            </div>
        </div>
    );
};

export default SideBar;