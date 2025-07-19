import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Fetch all branches from backend
export const fetchBranches = async () => {
  try {
    const response = await axios.get(`${API_URL}/branches`);
    return response.data.data.branches;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

// Submit parcel data to backend
export const submitParcel = async (parcelData) => {
  try {
   
    
    const response = await axios.post('http://localhost:8000/api/parcels/addparcel', parcelData, {
        withCredentials: true,
      
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting parcel:', error.response?.data || error.message);
    throw error;
  }
};