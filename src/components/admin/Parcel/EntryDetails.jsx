// EntryDetails.jsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import SectionTitle from "../SectionTitle";
import axios from 'axios';

export const EntryDetails = ({ collectionName, entryId, onClose }) => {
  const [entryData, setEntryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const formattedItem = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/admin/${collectionName}/${entryId}`,
          { withCredentials: true }
        );
        
        if (response.data) {
          setEntryData(response.data);
        } else {
          throw new Error('No data received');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (entryId) fetchDetails();
  }, [entryId, collectionName, backendURL]);

  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return value.toString();
  };

  // if (loading) return <div>Loading details...</div>;
  // if (error) return <div>Error loading details: {error}</div>;

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()} >
    //   <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
    //     <div className="flex justify-between items-center mb-6">
    //       <SectionTitle title={`${formattedItem} Details | ${ entryId}`} />
    //       <Button 
    //         variant="ghost" 
    //         onClick={onClose}
    //         className="text-gray-500 hover:text-gray-700"
    //       >
    //         ✕
    //       </Button>
    //     </div>

    //     {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //       {Object.entries(entryData).map(([key, value]) => (
    //         <div key={key} className="space-y-1">
    //           <label className="block text-sm font-medium text-gray-700 capitalize">
    //             {key.replace(/([A-Z])/g, ' $1')}:
    //           </label>
    //           <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-900 break-words">
    //             {formatValue(value)}
    //           </div>
    //         </div>
    //       ))}
    //     </div> */}
    //   </div>
    // </div>

    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <SectionTitle title={`${formattedItem} Details | ${entryId}`} />
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </Button>
      </div>

      {loading && <div>Loading details...</div>}
      {error && <div>Error loading details: {error}</div>}
      
      {entryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(entryData).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}:
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-900 break-words">
                {formatValue(value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};