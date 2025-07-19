import { useState, useEffect } from "react";


const UserDetails = ({ entryId }) => {
  if (!entryId) {
    console.error("Entry ID is missing.");  
    return null;
  }
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [entryData, setEntryData] = useState(null);
  const [parcelTimeData, setParcelTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendURL}/api/admin/parcel/${entryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setEntryData(data);
        setParcelTimeData(data.parcelTime);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (entryId) {
      fetchData();
    }
  }, [entryId, backendURL]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading user details: {error}</div>;
  }
  return (
    <div>
      <h1>User Details</h1>
      {/* Render user details here */}
      {entryData && (
        <div>
          <h2>{entryData.name}</h2>
          <p>Email: {entryData.email}</p>
          <p>Phone: {entryData.phone}</p>
          {/* Add more fields as needed */}
        </div>
      )}
      {parcelTimeData && (
        <div>
          <h3>Parcel Time Data</h3>
          <p>Created At: {parcelTimeData.createdAt}</p>
          <p>Updated At: {parcelTimeData.updatedAt}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default UserDetails;
