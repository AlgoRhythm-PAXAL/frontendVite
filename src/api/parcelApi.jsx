import axios from 'axios';

const API_URL = 'http://localhost:8000/api';
const backendURL = import.meta.env.VITE_BACKEND_URL;

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
    const response = await axios.post(
      `${backendURL}/api/parcels/addparcel`,
      parcelData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error submitting parcel:',
      error.response?.data || error.message
    );
    throw error;
  }

}

  export const calculatePayment=async({itemSize,fromBranchId,toBranchId,shippingMethod})=>{

    console.log("Passing parameters",fromBranchId,toBranchId)
    try{

      const params = new URLSearchParams({
      itemSize,
      shippingMethod
    });

    if (fromBranchId) params.append('from', fromBranchId);
    if (toBranchId) params.append('to', toBranchId);
      const response = await axios.get(`${backendURL}/api/payment/get-price?${params.toString()}`)
       return response.data;
    }
    catch(error){
      console.error(
      'Error calculating payment:',
      error.response?.data || error.message
    );
    throw error;
    }
  
  
};

