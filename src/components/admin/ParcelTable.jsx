import { useEffect, useState } from 'react';
import axios from 'axios';
import StickyHeadTable from './MUITable';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminTheme } from '../../contexts/AdminThemeContext';
import PropTypes from 'prop-types';

const ParcelTable = ({ title, apiEndpoint }) => {
  const { isAuthenticated } = useAdminAuth();
  const { theme } = useAdminTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          apiEndpoint || 'http://localhost:8000/admin/parcel/all',
          { withCredentials: true }
        );
        console.log(`API Response for ${title}:`, response.data.parcels);
        const parcelData = response.data.parcels;

        setData(parcelData || []);
        setError(null);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
        setError('Failed to load parcel data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, title, isAuthenticated]);

  // Get table headers dynamically
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  if (loading) {
    return (
      <div 
        className={`w-full flex flex-col justify-center p-2 rounded-2xl border shadow-lg ${
          theme === 'dark' 
            ? 'admin-dark bg-gray-800 border-gray-700' 
            : 'admin-light bg-white border-gray-300'
        }`}
        data-admin-theme={theme}
      >
        <h1 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {title || 'Parcel Table'}
        </h1>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`w-full flex flex-col justify-center p-2 rounded-2xl border shadow-lg ${
          theme === 'dark' 
            ? 'admin-dark bg-gray-800 border-red-500/50' 
            : 'admin-light bg-white border-red-300'
        }`}
        data-admin-theme={theme}
      >
        <h1 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {title || 'Parcel Table'}
        </h1>
        <div className="flex justify-center items-center p-8">
          <span className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full flex flex-col justify-center p-2 rounded-2xl border shadow-lg ${
        theme === 'dark' 
          ? 'admin-dark bg-gray-800 border-gray-700' 
          : 'admin-light bg-white border-gray-300'
      }`}
      data-admin-theme={theme}
    >
      <h1 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {title || 'Parcel Table'}
      </h1>
      <StickyHeadTable data={data} headers={headers} theme={theme} />
    </div>
  );
};

ParcelTable.propTypes = {
  title: PropTypes.string,
  apiEndpoint: PropTypes.string,
};

export default ParcelTable;
