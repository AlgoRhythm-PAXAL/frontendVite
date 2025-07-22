import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import StickyHeadTable from './MUITable';

const ParcelTable = ({ title, apiEndpoint }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/admin/parcel/all',
          { withCredentials: true }
        );
        console.log(`API Response for ${title}:`, response.data.parcels);
        const driverData = response.data.parcels;

        setData(driverData);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      }
    };

    fetchData();
  }, [apiEndpoint, title]);

  // Get table headers dynamically
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="w-full flex flex-col justify-center  p-2  bg-white rounded-2xl border border-gray-300 shadow-lg">
      <h1>Parcel table</h1>
      <StickyHeadTable data={data} headers={headers} />
    </div>
  );
};

export default ParcelTable;
