// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../../components/User/Navbar";



// const AddParcel = () => {
 
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     receiverFullname: "",
//     receiverEmail: "",
//     receiverContact: "",
    
//         receiverNumber: "",
//         receiverStreet: "",
//         receiverCity: "",
//         receiverDistrict: "",
//         receiverPostalcode: "",
//         receiverProvince: "",
    
//     parcelSize: "",
//     itemType: "",
//     specialInstructions: "",
    
//       shipmentMethod: "",
    
      
//       paymentMethod: "",
    
//   });

//   // Handle input changes
//   const handleChange = (e) => {
    
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };



//   // Handle form submission
//   const SubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//      console.log("sending to server");
//       const response = await axios.post("http://localhost:8000/api/parcels/addparcel", formData,{
//        withCredentials:true,
//       });

     
//       if (response.data && response.data.status==="success") {
//         alert("Parcel added successfully!");
//         navigate("/"); // Redirect to parcels list
//       } else {
//         alert(response.data.message || "Failed to add parcel.");
//       }
//     } catch (error) {
//       console.error("Error adding parcel:", error);
//       alert("Something went wrong.");
//     }
//   };

//   return (

//     <div>
//       <Navbar/>
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Parcel</h2>
//         <form onSubmit={SubmitHandler}>
//           {/* Receiver Information */}
//           <div className="mb-6">
//             <h3 className="font-semibold">Receiver Information</h3>
//             <input type="text" name="receiverFullname" value={formData.receiverFullname} onChange={handleChange} placeholder="Receiver Name" className="w-full p-2 border rounded mt-2" />
//             <input type="email" name="receiverEmail" value={formData.receiverEmail} onChange={handleChange} placeholder="Receiver Email" className="w-full p-2 border rounded mt-2" />
//             <input type="text" name="receiverContact" value={formData.receiverContact} onChange={handleChange} placeholder="Receiver Contact" className="w-full p-2 border rounded mt-2" />
//           </div>

//           {/* Receiver Address */}
//           <div className="mb-6">
//             <h3 className="font-semibold">Receiver Address</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <input type="text" name="receiverNumber" value={formData.receiverNumber} onChange={handleChange} placeholder="Number" className="p-2 border rounded" />
//               <input type="text" name="receiverStreet" value={formData.receiverStreet}  onChange={handleChange} placeholder="Street" className="p-2 border rounded" />
//               <input type="text" name="receiverCity" value={formData.receiverCity} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
//               <input type="text" name="receiverDistrict" value={formData.receiverDistrict} onChange={handleChange} placeholder="District" className="p-2 border rounded" />
//               <input type="text" name="receiverPostalcode" value={formData.receiverPostalcode}  onChange={handleChange}placeholder="Postal Code" className="p-2 border rounded" />
//               <input type="text" name="receiverProvince" value={formData.receiverProvince}  onChange={handleChange} placeholder="Province" className="p-2 border rounded" />
//             </div>
//           </div>

//           {/* Parcel Information */}
//           <div className="mb-6">
//             <h3 className="font-semibold">Parcel Information</h3>
//             <input type="text" name="parcelSize" value={formData.parcelSize} onChange={handleChange} placeholder="Parcel Size" className="w-full p-2 border rounded mt-2" />
//             <input type="text" name="itemType" value={formData.itemType} onChange={handleChange} placeholder="Item Type" className="w-full p-2 border rounded mt-2" />
//             <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Special Instructions" className="w-full p-2 border rounded mt-2"></textarea>
//           </div>

//           {/* Shipping Information */}
//           <div className="mb-6">
//             <h3 className="font-semibold">Shipping Information</h3>
//             <div className="flex space-x-4">
//               <label>
//                 <input type="radio" name="shipmentMethod" value="Standard" checked={formData.shipmentMethod === "Standard"} onChange={handleChange} /> Standard
//               </label>
//               <label>
//                 <input type="radio" name="shipmentMethod" value="Express" checked={formData.shipmentMethod === "Express"} onChange={handleChange} /> Express
//               </label>
//             </div>
//             <div className="flex space-x-4 mt-2">
//               <label>
//                 <input type="radio" name="paymentMethod" value="Online" checked={formData.paymentMethod === "Online"} onChange={handleChange} /> Online
//               </label>
//               <label>
//                 <input type="radio" name="paymentMethod" value="Cash" checked={formData.paymentMethod === "Cash"} onChange={handleChange} /> Cash
//               </label>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-between">
//             <button type="button" className="px-6 py-2 border border-gray-400 rounded">Cancel</button>
//             <button type="submit" className="px-6 py-2 bg-teal-700 text-white rounded">+ Add Parcel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default AddParcel;


import  { useState } from 'react';
import axios from 'axios';

const AddParcelForm = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    nic: '',
    contact: '',
    address: '',
    district: '',
    province: '',
    zone: '',

    receiverFullname: '',
    receiverContact: '',
    receiverEmail: '',
    receiverPostalcode: '',
    receiverNumber: '',
    receiverDistrict: '',
    receiverProvince: '',
    receiverAddress: '',
    receiverLandmark: '',
    receiverZone: '',

    parcelSize: '',
    itemType: '',
    shipmentMethod: '',
    submittingMethod: '',
    paymentMethod: '',
    specialInstructions: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


 


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(
       "http://localhost:8000/api/parcels/addparcel", formData,
        { withCredentials: true }
      );

      console.log(res.data);
      alert('Parcel Added Successfully!');
    } catch (err) {
      console.error('Error Details:', err.response ? err.response.data : err);
      
      console.error(err);
      alert('Failed to add parcel.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Add New Parcel</h2>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Sender Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Sender Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="fullname" onChange={handleChange} placeholder="Full Name" className="input-style" />
            <input name="nic" onChange={handleChange} placeholder="NIC Number" className="input-style" />
            <input name="contact" onChange={handleChange} placeholder="Contact Number" className="input-style" />
            <input name="address" onChange={handleChange} placeholder="Address" className="input-style" />
            <input name="district" onChange={handleChange} placeholder="District" className="input-style" />
            <input name="province" onChange={handleChange} placeholder="Province" className="input-style" />
            <input name="zone" onChange={handleChange} placeholder="Zone" className="input-style" />
          </div>
        </div>

        {/* Receiver Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Receiver Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="receiverFullname" onChange={handleChange} placeholder="Full Name" className="input-style" />
            <input name="receiverContact" onChange={handleChange} placeholder="Contact Number" className="input-style" />
            <input name="receiverEmail" onChange={handleChange} placeholder="Email" className="input-style" />
            <input name="receiverPostalcode" onChange={handleChange} placeholder="Postal Code" className="input-style" />
            <input name="receiverNumber" onChange={handleChange} placeholder="House Number" className="input-style" />
            <input name="receiverDistrict" onChange={handleChange} placeholder="District" className="input-style" />
            <input name="receiverProvince" onChange={handleChange} placeholder="Province" className="input-style" />
            <input name="receiverAddress" onChange={handleChange} placeholder="Address" className="input-style" />
            <input name="receiverLandmark" onChange={handleChange} placeholder="Landmark" className="input-style" />
            <input name="receiverZone" onChange={handleChange} placeholder="Zone" className="input-style" />
          </div>
        </div>

        {/* Parcel Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Parcel Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select name="parcelSize" onChange={handleChange} className="input-style">
              <option value="">Select Parcel Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            <input name="itemType" onChange={handleChange} placeholder="Item Type" className="input-style" />
            <select name="shipmentMethod" onChange={handleChange} className="input-style">
              <option value="">Shipment Method</option>
              <option value="Express">Express</option>
              <option value="Standard">Standard</option>
             
            </select>
            <select name="submittingMethod" onChange={handleChange} className="input-style">
              <option value="">Submitting Method</option>
              <option value="Drop-Off">Drop-off</option>
              <option value="Pickup">Pick-up</option>
            </select>
            <select name="paymentMethod" onChange={handleChange} className="input-style">
              <option value="">Payment Method</option>
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online</option>
            </select>
            <textarea name="specialInstructions" onChange={handleChange} placeholder="Special Instructions" className="input-style"></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="bg-blue-600 text-white py-3 px-10 rounded-xl hover:bg-blue-700 transition">Add Parcel</button>
        </div>
      </form>
    </div>




  );
};

export default AddParcelForm;

