import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import SectionTitle from "../SectionTitle";
import axios from 'axios';
import ParcelDetails from './ParcelDetails';


export const EntryDetails = ({ collectionName, entryId, onClose }) => {

  const [entryData, setEntryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const formattedItem = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${backendURL}/admin/${collectionName}/${entryId}`, { withCredentials: true });
        const Data = response.data.data;
        if (Data) {
          setEntryData(Data);
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





//Loading and error states handling
  if (loading) return <div>Loading details...</div>;
  if (error) return <div>Error loading details: {error}</div>;


//Default Path
  return (
    
    <div className="className={`bg-white rounded-xl px-6   w-full flex flex-col max-h-[95vh] overflow-auto 
    ${collectionName === 'parcels' ? ' bg-Background min-w-[60vw]  sm:min-w-[70vw] lg:min-w-[90vw] xl:min-w-[100vw]' : ''">

      <div className="flex justify-between items-center m-6 ">

        <SectionTitle title={`${formattedItem} Details | ${entryId}`} />

        <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-red-500" >
          ✕
        </Button>

      </div>

      {loading && <div>Loading details...</div>}
      {error && <div>Error loading details: {error}</div>}

      <div className="w-full">
        {entryData && (
          <div className="w-full justify-center items-center">
            {collectionName === 'parcel' && <ParcelDetails parcel={entryData} />}

          </div>
        )}

      </div>
    </div>
  );
};