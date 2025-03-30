import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faUser,    // Customers
    faTruck,   // Drivers
    faUsers,   // Staff
    faUserShield, // Admins
    faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

const NumberShowingCard = ({ title, type }) => {
    const [count, setCount] = useState(0); // Store fetched count
    const [since,setSince]=useState(0);

    // Define icons based on the type
    const getIcon = (type) => {
        switch (type) {
            case "Customer": return faUser;
            case "Driver": return faTruck;
            case "Staff": return faUsers;
            case "Admin": return faUserShield;
            default: return faQuestionCircle; // Fallback icon
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/user/count', {
                    params: { user: type } // Dynamically set user type
                });
                console.log(`Fetched Count for ${type}:`, response.data.count,response.data.since);
                setCount(response.data.count); // Update state with fetched count

                const date = new Date(response.data.since);
                const onlyDate=date.toISOString().split("T")[0];
                setSince(onlyDate);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchData();
    }, [type]); // Re-run effect when `type` changes

    return (
        <div className="flex items-center gap-6 p-5 w-64 bg-white rounded-2xl border border-gray-300 shadow-lg">
            {/* Icon Section */}
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                <FontAwesomeIcon icon={getIcon(type)} className="text-gray-700 text-2xl" />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                <h1 className="text-4xl font-bold text-gray-900">{count}</h1> {/* Updated dynamically */}
                <h4 className="text-sm text-gray-500">Since {since}</h4>
            </div>
        </div>
    );
};

export default NumberShowingCard;
