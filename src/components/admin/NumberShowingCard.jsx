import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,        // Customers
  faTruck,       // Drivers
  faUserShield, // Admins
  faUsers,      // Staff
} from "@fortawesome/free-solid-svg-icons";
import {toast} from 'sonner'
import LoadingAnimation from '../../utils/LoadingAnimation';

const NumberShowingCard = ({ title, type }) => {
  const [data, setData] = useState({ count: 0, since: '' });
  const [loading, setLoading] = useState(true);

  const getIconConfig = () => {
    const baseClasses = "w-14 h-14 flex items-center justify-center rounded-xl";
    
    switch(type) {
      case 'Customer':
        return {
          icon: faUser,
          bgClass: `${baseClasses} bg-blue-100 text-blue-600`
        };
      case 'Driver':
        return {
          icon: faTruck,
          bgClass: `${baseClasses} bg-green-100 text-green-600`
        };
      case 'Admin':
        return {
          icon: faUserShield,
          bgClass: `${baseClasses} bg-purple-100 text-purple-600`
        };
      case 'Staff':
        return {
          icon: faUsers,
          bgClass: `${baseClasses} bg-orange-100 text-orange-600`
        };
      default:
        return {
          icon: faUser,
          bgClass: `${baseClasses} bg-gray-100 text-gray-600`
        };
    }
  };

  useEffect(() => {
    const fetchUserCount = async () => {
      const backendUrl=import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await axios.get(`${backendUrl}/admin/user/count`,{withCredentials:true,params: { user: type }});
      
        
        setData({
          count: response.data.count,
          since: new Date(response.data.since).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        });
      } catch (error) {
        const errorMessage=error.message;
        console.error(`Error fetching ${type} count:`, error);
        toast.error(`Fetching data went fishing 🎣. No luck yet. ${type}`,{
          description:errorMessage,
        })
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, [type]);

  const { icon, bgClass } = getIconConfig();

  return (
    <div className="flex items-center gap-5 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex-[1_1_280px] min-w-[280px] max-w-full">
      {/* Icon Container */}
      <div className={bgClass}>
        <FontAwesomeIcon icon={icon} className="text-2xl" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="flex items-baseline gap-3">
          {loading ? (
            // <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
            <LoadingAnimation/>
          ) : (
            <span className="text-3xl font-bold text-gray-900">
              {data.count.toLocaleString()}
            </span>
          )}
        </div>
        <span className="text-xs font-medium text-gray-400">
          Since {loading ? '...' : data.since}
        </span>
      </div>
    </div>
  );
};

export default NumberShowingCard;