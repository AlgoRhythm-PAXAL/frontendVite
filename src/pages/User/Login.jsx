import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import  { useContext } from 'react'
import { useNavigate } from 'react-router-dom';





import { AuthContext } from "../../contexts/AuthContext"; // Icons for password toggle

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate();
    // Inside Signup Component
  const { login } = useContext(AuthContext);
  const [loading,setLoading]=useState(false);

     const [error, setError] = useState(null);
      const [formData, setFormData] = useState({
          
          email: "",
          password: ""
          
          
        });
  
  
        const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const submitHandler = async (e) => {
          e.preventDefault();
          setLoading(true);
        
          try {
            console.log("Sending data to server:", formData);
        
            const response = await axios.post("http://localhost:8000/api/auth/login", formData, {
              withCredentials: true,
            });
        
            console.log("Response received:", response.data);
           
            if (response.data && response.data.status === "success") {
             
              login();  // ✅ Update global state
              alert("Login Successful!!") // <-- This should be from AppContext
              
              navigate('/');
            } else {
              console.log("Login failed response:", response.data);
              alert(response.data?.message || "Login failed");
            }
            
          } catch (error) {
            console.error("Error received:", error.response || error);
            setError(error.response?.data?.message || "Login failed. Try again.");
          } finally {
            setLoading(false);
          }
        };
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Section - Login Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10 shadow-lg border-r-4 border-teal-700">
        <h2 className="text-3xl font-semibold mb-2">Log in</h2>
        <p className="text-teal-600 mb-6 text-sm">
          Improve your internal parcel tracking today!
        </p>

        <form  onSubmit={submitHandler}className="mt-6 space-y-4">
       {/* Email Input */}
       <div className="w-full max-w-md">
          <label className="block text-gray-700 mb-1">Email</label>
          <input type="email" value={formData.email} onChange={handleChange}  name="email"placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"/><br />
        </div>
         {/* Password Input */}
         <div className="w-full max-w-md mt-4 relative">
          <label className="block text-gray-700 mb-1">Password</label>
          <div className="relative">
          <input type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange}  name="password" placeholder="Enter your password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"/><br />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        

        <button type="submit" className="w-full max-w-md bg-teal-700 text-white py-2 rounded-md mt-6 hover:bg-teal-800" disabled={loading}>
                {loading ? "Login.." : "Next"}
                </button>
        </form>

        

        {/* Links */}
        <div className="flex justify-between w-full max-w-md text-sm mt-4 text-gray-600">
          <Link to="/forgot-password" className="hover:text-teal-600">
            Forgot password?
          </Link>
          <Link to="/signup" className="hover:text-teal-600">
            Create a new account
          </Link>
        </div>
      </div>

      {/* Right Section - Logo and Branding */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-10 relative overflow-hidden">
        {/* SVG Logo */}
        <div className="mb-6">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 12h4v-2H2v2zm0 4h4v-2H2v2zm0 4h4v-2H2v2zm6-8h14v-2H8v2zm0 4h14v-2H8v2zm0 4h14v-2H8v2zm0-12h14V6H8v2z" />
          </svg>
        </div>

        {/* Branding Text */}
        <h2 className="text-xl font-semibold text-gray-800">PAXAL</h2>
        <p className="text-gray-500 italic">On Time, Every Time.</p>

        <p className="text-gray-600 text-center mt-4 text-sm px-6">
          "Experience seamless parcel tracking and management with real-time
          updates, intuitive design, and advanced features. Simplify operations
          and delight customers with unmatched efficiency and transparency."
        </p>

        {/* Wave Effect - Black and Green */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Black Curve */}
            <path
              fill="black"
              fillOpacity="1"
              d="M0,224L60,218.7C120,213,240,203,360,192C480,181,600,171,720,176C840,181,960,203,1080,197.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>

            {/* Green Curve */}
            <path
              fill="#0f766e"
              fillOpacity="1"
              d="M0,256L60,245.3C120,235,240,213,360,192C480,171,600,149,720,170.7C840,192,960,256,1080,261.3C1200,267,1320,213,1380,186.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Login;
