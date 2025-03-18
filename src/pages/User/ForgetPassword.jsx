import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
  
        const response = await axios.post("http://localhost:8000/api/auth/forget-password", { email }, {
            withCredentials: true,
          
          
      });
  
      console.log("Response received:", response.data);
      alert("Reset otp Send your email.");
      localStorage.setItem("userEmail",email); // Ensure response is not undefined
      navigate('/reset-password');
     
    //   if (response.data && response.data.status === "success") {
    //     localStorage.setItem("userEmail",email); // Ensure response is not undefined
    //     // alert("SignUp Successful!!") // <-- This should be from AppContext
    //     // console.log("Navigating to /verify"); 
    //     navigate('/reset-password');
    //   } else {
    //     console.log("Signup failed response:", response.data);
    //     alert(response.data?.message || "Signup failed");
    //   }
      
    } catch (error) {
      console.error("Error received:", error.response || error);
     
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to receive a password reset link.
        </p>

        {/* Form */}
        <form onSubmit={submitHandler }>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

         <button
            type="submit"
            className="w-full bg-teal-700 text-white py-2 rounded-md mt-4 hover:bg-teal-800 transition duration-200"
          disabled={loading}>
          {loading ? "Sending.." :  "Send Reset Link"}
          </button>
          
        </form>

        {/* Back to Login */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          <a href="/login" className="text-teal-600 hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
