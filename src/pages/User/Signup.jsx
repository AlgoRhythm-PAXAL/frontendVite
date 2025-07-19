import axios from 'axios';
import React, { useContext } from 'react';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";


const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    passwordconfirm: "",
    address: "",
    contact: "",
    district: "",
    nic: "",
    province: "",
    city: ""
  });

  const provinces = [
    "Western Province", 
    "Central Province", 
    "Southern Province",
    "Northern Province",
    "Eastern Province",
    "North Western Province",
    "North Central Province",
    "Uva Province",
    "Sabaragamuwa Province"
  ];

  const districts = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle"]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData({
      ...formData,
      province,
      district: "" // Reset district when province changes
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (formData.password !== formData.passwordconfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending data to server:", formData);
      const response = await axios.post("http://localhost:8000/api/auth/signup", formData, {
        withCredentials: true,
      });

      console.log("Response received:", response.data);
      
      if (response.data && response.data.status === "success") {
        localStorage.setItem("userEmail", formData.email);
        login();
        toast.success("SignUp Successful!", { duration: 2000 });
        console.log("Navigating to /verify"); 
        navigate('/verify');
      } else {
        console.log("Signup failed response:", response.data);
        toast.error(response.data?.message || "Signup failed");
      }
      
    } catch (error) {
      console.error("Error received:", error.response || error);
      toast.error("Error received:", error.response || error);
      setError(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center p-4">
      
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left Section */}
          <div className="relative w-50% h-relative bg-white flex items-center justify-center">
      {/* Background Waves */}
      <div className="absolute bottom-0 top-0 left-0 w-full h-full overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-1/6"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#16646f" 
            d="M0,128L60,122.7C120,117,240,107,360,122.7C480,139,600,181,720,192C840,203,960,181,1080,170.7C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full h-1/9"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="black"
            d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,224C840,224,960,192,1080,165.3C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>


      
    


      {/* Content */}
      <div className="relative text-center z-10 p-6 flex flex-col justify-start" style={{ marginTop: '-50px' }}>

  

        
        <img
          src="/paxallogo.png" 
          alt="LOGO "
          className="mx-auto  w-30 h-40"
        />
       
        <p className="mt-9 font-semibold text-gray-700 max-w-2xl mx-auto">
            <p> "Experience seamless parcel tracking and</p>
            <p> management with real-time updates, intuitive design and advanced </p>
            <p>features.Simplify operations and delight customers</p>
            <p> with unmatched efficiency and transparency."</p>
        </p>
      </div>
    </div>





    

          {/* Right Section */}
          <div className="md:w-1/2 p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
              <p className="text-teal-600 mt-2">Improve your internal parcel tracking today!</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.fName}
                    onChange={handleChange}
                    name="fName"
                    placeholder="first name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lName}
                    onChange={handleChange}
                    name="lName"
                    placeholder="last name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  required
                />
              </div>

              

              

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={handleChange}
                  name="contact"
                  placeholder="07XXXXXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                <input
                  type="text"
                  value={formData.nic}
                  onChange={handleChange}
                  name="nic"
                  placeholder="123456789V or 200012345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={handleChange}
                  name="address"
                  placeholder="123 Main Street, City"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <select
                    value={formData.province}
                    onChange={handleProvinceChange}
                    name="province"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select
                    value={formData.district}
                    onChange={handleChange}
                    name="district"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                    disabled={!formData.province}
                  >
                    <option value="">Select District</option>
                    {formData.province && districts[formData.province].map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    name="city"
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    
                  />
                </div>
              </div>

                        {/* Password Field */}
<div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
  <input
    type={showPassword ? "text" : "password"}
    value={formData.password}
    onChange={handleChange}
    name="password"
    placeholder="••••••••"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition pr-10"
    required
    minLength="5"
  />
  <span
    className="absolute top-9 right-3 text-gray-600 cursor-pointer"
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

{/* Confirm Password Field */}
<div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
  <input
    type={showConfirmPassword ? "text" : "password"}
    value={formData.passwordconfirm}
    onChange={handleChange}
    name="passwordconfirm"
    placeholder="••••••••"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition pr-10"
    required
    minLength="5"
  />
  <span
    className="absolute top-9 right-3 text-gray-600 cursor-pointer"
    onClick={() => setShowConfirmPassword((prev) => !prev)}
  >
    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>  

 

              

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-teal-600 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-6  bg-[#16646f]  hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-sm text-center text-gray-600 mt-4">
                Already have an account? <a href="/login" className="text-teal-600 font-medium hover:underline">Login here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
