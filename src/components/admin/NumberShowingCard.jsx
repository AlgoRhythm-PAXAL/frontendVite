import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faUser,    // Customers
    faTruck,   // Drivers
    faUsers,   // Staff
    faUserShield, // Admins
    faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

const NumberShowingCard = ({ title, number, since, type }) => {
    // Define icons based on the type
    const getIcon = (type) => {
        switch (type) {
            case "customers": return faUser;
            case "drivers": return faTruck;
            case "staff": return faUsers;
            case "admins": return faUserShield;
            default: return faQuestionCircle; // Fallback icon
        }
    };

    return (
        <div className="flex items-center gap-6 p-5 w-80 bg-white rounded-2xl border border-gray-300 shadow-lg">
            {/* Icon Section */}
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                <FontAwesomeIcon icon={getIcon(type)} className="text-gray-700 text-2xl" />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                <h1 className="text-4xl font-bold text-gray-900">{number}</h1>
                <h4 className="text-sm text-gray-500">Since {since}</h4>
            </div>
        </div>
    );
};

export default NumberShowingCard;
