import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/User/Navbar";



const AddParcel = () => {
 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    receiverFullname: "",
    receiverEmail: "",
    receiverContact: "",
    
        receiverNumber: "",
        receiverStreet: "",
        receiverCity: "",
        receiverDistrict: "",
        receiverPostalcode: "",
        receiverProvince: "",
    
    parcelSize: "",
    itemType: "",
    specialInstructions: "",
    
      shipmentMethod: "",
    
      
      paymentMethod: "",
    
  });

  // Handle input changes
  const handleChange = (e) => {
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  // Handle form submission
  const SubmitHandler = async (e) => {
    e.preventDefault();
    try {
     console.log("sending to server");
      const response = await axios.post("http://localhost:8000/api/parcels/addparcel", formData,{
       withCredentials:true,
      });

     
      if (response.data && response.data.status==="success") {
        alert("Parcel added successfully!");
        navigate("/"); // Redirect to parcels list
      } else {
        alert(response.data.message || "Failed to add parcel.");
      }
    } catch (error) {
      console.error("Error adding parcel:", error);
      alert("Something went wrong.");
    }
  };

  return (

    <div>
      <Navbar/>
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Parcel</h2>
        <form onSubmit={SubmitHandler}>
          {/* Receiver Information */}
          <div className="mb-6">
            <h3 className="font-semibold">Receiver Information</h3>
            <input type="text" name="receiverFullname" value={formData.receiverFullname} onChange={handleChange} placeholder="Receiver Name" className="w-full p-2 border rounded mt-2" />
            <input type="email" name="receiverEmail" value={formData.receiverEmail} onChange={handleChange} placeholder="Receiver Email" className="w-full p-2 border rounded mt-2" />
            <input type="text" name="receiverContact" value={formData.receiverContact} onChange={handleChange} placeholder="Receiver Contact" className="w-full p-2 border rounded mt-2" />
          </div>

          {/* Receiver Address */}
          <div className="mb-6">
            <h3 className="font-semibold">Receiver Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="receiverNumber" value={formData.receiverNumber} onChange={handleChange} placeholder="Number" className="p-2 border rounded" />
              <input type="text" name="receiverStreet" value={formData.receiverStreet}  onChange={handleChange} placeholder="Street" className="p-2 border rounded" />
              <input type="text" name="receiverCity" value={formData.receiverCity} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
              <input type="text" name="receiverDistrict" value={formData.receiverDistrict} onChange={handleChange} placeholder="District" className="p-2 border rounded" />
              <input type="text" name="receiverPostalcode" value={formData.receiverPostalcode}  onChange={handleChange}placeholder="Postal Code" className="p-2 border rounded" />
              <input type="text" name="receiverProvince" value={formData.receiverProvince}  onChange={handleChange} placeholder="Province" className="p-2 border rounded" />
            </div>
          </div>

          {/* Parcel Information */}
          <div className="mb-6">
            <h3 className="font-semibold">Parcel Information</h3>
            <input type="text" name="parcelSize" value={formData.parcelSize} onChange={handleChange} placeholder="Parcel Size" className="w-full p-2 border rounded mt-2" />
            <input type="text" name="itemType" value={formData.itemType} onChange={handleChange} placeholder="Item Type" className="w-full p-2 border rounded mt-2" />
            <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Special Instructions" className="w-full p-2 border rounded mt-2"></textarea>
          </div>

          {/* Shipping Information */}
          <div className="mb-6">
            <h3 className="font-semibold">Shipping Information</h3>
            <div className="flex space-x-4">
              <label>
                <input type="radio" name="shipmentMethod" value="Standard" checked={formData.shipmentMethod === "Standard"} onChange={handleChange} /> Standard
              </label>
              <label>
                <input type="radio" name="shipmentMethod" value="Express" checked={formData.shipmentMethod === "Express"} onChange={handleChange} /> Express
              </label>
            </div>
            <div className="flex space-x-4 mt-2">
              <label>
                <input type="radio" name="paymentMethod" value="Online" checked={formData.paymentMethod === "Online"} onChange={handleChange} /> Online
              </label>
              <label>
                <input type="radio" name="paymentMethod" value="Cash" checked={formData.paymentMethod === "Cash"} onChange={handleChange} /> Cash
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button type="button" className="px-6 py-2 border border-gray-400 rounded">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-teal-700 text-white rounded">+ Add Parcel</button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AddParcel;
