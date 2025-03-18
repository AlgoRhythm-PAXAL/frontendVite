import axios from 'axios';
import React, { useContext } from 'react'
import  { useState } from "react";
import { useNavigate } from 'react-router-dom';





import { AuthContext } from "../../contexts/AuthContext";





const Signup = () => {

  const navigate=useNavigate();
  // Inside Signup Component
const { login } = useContext(AuthContext);

 
  
     const [loading,setLoading]=useState(false);
     
     const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        fName:"",
        lName:"",
        email: "",
        password: "",
        passwordconfirm:""
        
      });


      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };


      const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
      
        try {
          console.log("Sending data to server:", formData);
      
          const response = await axios.post("http://localhost:8000/api/auth/signup", formData, {
            withCredentials: true,
          });
      
          console.log("Response received:", response.data);
         
          if (response.data && response.data.status === "success") {
            localStorage.setItem("userEmail", formData.email); // Ensure response is not undefined
            login();  // ✅ Update global state
            alert("SignUp Successful!!") // <-- This should be from AppContext
            console.log("Navigating to /verify"); 
            navigate('/verify');
          } else {
            console.log("Signup failed response:", response.data);
            alert(response.data?.message || "Signup failed");
          }
          
        } catch (error) {
          console.error("Error received:", error.response || error);
          setError(error.response?.data?.message || "Signup failed. Try again.");
        } finally {
          setLoading(false);
        }
      };
      






  return (
   <div className="flex min-h-screen">
            {/* Left Section */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-gray-100 p-10 relative">
              {/* Logo */}
              <img src="/logo.jpg" alt="Logo" className="h-20 mb-4" />
              {/* Text */}
              <p className="text-center text-gray-700 max-w-md">
                "Experience seamless parcel tracking and management with real-time <br />
                updates, intuitive design, and advanced features. <br />
                Simplify operations and delight customers with unmatched <br />
                efficiency and transparency."
              </p>
      
              {/* Decorative Waves */}
              <div className="w-full absolute bottom-0">
                <svg viewBox="0 0 1440 320" className="w-full">
                  <path fill="#176d71" d="M0,224L1440,96L1440,320L0,320Z"></path>
                  <path fill="black" d="M0,300L1440,200L1440,320L0,320Z"></path>
                </svg>
              </div>
            </div>
      
            {/* Right Section */}
            <div className="w-1/2 flex flex-col justify-center px-16">
              <h2 className="text-3xl font-bold text-gray-800">Sign up</h2>
              <p className="text-sm text-teal-700 mt-2">Improve your internal parcel tracking today!</p>
      
              {/* Form */}
              <form  onSubmit={submitHandler}className="mt-6 space-y-4">
                <input type="text" value={formData.fName} onChange={handleChange} name="fName" placeholder="First Name" className="input-field w-full" /><br />
                <input type="text" value={formData.lName} onChange={handleChange}  name="lName" placeholder="Last Name" className="input-field w-full" /><br />
                <input type="email" value={formData.email} onChange={handleChange}  name="email"placeholder="Email" className="input-field w-full" /><br />
                <input type="password" value={formData.password} onChange={handleChange}  name="password" placeholder="Password" className="input-field w-full" /><br />
                <input type="password"   value={formData.passwordconfirm} onChange={handleChange} name="passwordconfirm" placeholder="Confirm Password" className="input-field w-full" /><br />
      
                <p className="text-xs text-gray-600">
                  By clicking sign up, you agree to the <br />
                  <a href="#" className="text-teal-700 underline">Privacy Policy</a> and <br />
                  <a href="#" className="text-teal-700 underline">Terms and Conditions</a>.
                </p>
      
                <button type="submit" className="w-full bg-teal-700 text-white py-2 rounded-full" disabled={loading}>
                {loading ? "Signing up..." : "Next"}
                </button>
                
                <p className="text-sm text-center text-gray-600">
                  Already have an account? <a href='/login'  className="text-teal-700">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}
      
      

export default Signup;
