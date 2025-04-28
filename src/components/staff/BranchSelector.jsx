import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const BranchSelector = ({ register, name, required = false, errors}) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:8000/staff/ui/branches'); 
        setBranches(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches');
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Sort branches alphabetically by location
  const sortedBranches = useMemo(() => {
    return [...branches].sort((a, b) => 
      a.location.localeCompare(b.location)
    );
  }, [branches]);

  if (loading) {
    return <div>Loading branches...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
     
      <select
        {...register(name, { required })}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:Primary focus:border-Primary"
      >
        <option value="">Select Branch</option>
        {sortedBranches.map((branch) => (
          <option key={branch._id} value={branch._id}>
            {branch.location}
          </option>
        ))}
      </select>
      {errors?.[name] && <p className="mt-1 text-sm text-red-600">This field is required</p>}

    </div>
  );
};

export default BranchSelector;