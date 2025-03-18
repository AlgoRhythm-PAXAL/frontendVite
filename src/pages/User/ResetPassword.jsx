// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // Eye icons for password toggle

// import axios from "axios";
// const ResetPassword = () => {
//     const storedEmail = localStorage.getItem("userEmail");
//  const [loading,setLoading]=useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [password, setPassword] = useState("");
//   const [passwordconfirm, setPasswordconfirm] = useState("");
//   const [otp, setOtp] = useState("");

//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();
//    const [formData, setFormData] = useState({
//           otp:"",
//           email:{storedEmail},
//           password: "",
//           passwordconfirm:""
          
//         });
  
  
//         const handleChange = (e) => {
//           setFormData({ ...formData, [e.target.name]: e.target.value });
//         };

//         const handleSubmit = async () => {
//             const storedEmail = localStorage.getItem("userEmail"); // ✅ Get email from localStorage
//             if (!storedEmail) return alert("Email not found. Please sign up again.");
        
//             setLoading(true);
//             try {
//                 // const data={ storedEmail,otp,password,passwordconfirm}
//               const response = await axios.post(
//                 "http://localhost:8000/api/auth/reset-password",
//                 { email: storedEmail }, formData,// ✅ Send email in the request body
//                 { withCredentials: true }
//               );
//               alert(response.data.message);
//             } catch (error) {
//               alert(error.response?.data?.message || "Failed to resend OTP");
//             }
//             setLoading(false);
//           };

//   return (
//     <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
//       {/* Background SVG Waves */}
//       <div className="absolute inset-0 w-full h-full">
//         <svg viewBox="0 0 1440 320" className="absolute top-0 left-0 w-full text-teal-700">
//           <path
//             fill="currentColor"
//             fillOpacity="1"
//             d="M0,256L60,245.3C120,235,240,213,360,192C480,171,600,149,720,170.7C840,192,960,256,1080,261.3C1200,267,1320,213,1380,186.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
//           ></path>
//         </svg>
//         <svg viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full text-black">
//           <path
//             fill="currentColor"
//             fillOpacity="1"
//             d="M0,256L60,245.3C120,235,240,213,360,192C480,171,600,149,720,170.7C840,192,960,256,1080,261.3C1200,267,1320,213,1380,186.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
//           ></path>
//         </svg>
//       </div>

//       {/* Reset Password Form Container */}
//       <div className="relative z-10 w-full max-w-2xl bg-white p-10 shadow-lg rounded-2xl border-l-4 border-teal-700">
//         <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>

//         <div className="flex items-center justify-center">
//           {/* Logo Placeholder */}
//           <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg">
//             <svg width="80" height="80" viewBox="0 0 24 24" fill="black">
//               <path d="M2 12h4v-2H2v2zm0 4h4v-2H2v2zm0 4h4v-2H2v2zm6-8h14v-2H8v2zm0 4h14v-2H8v2zm0 4h14v-2H8v2zm0-12h14V6H8v2z" />
//             </svg>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="mt-6">
//           {/* OTP Input */}
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-1">OTP</label>
//             <input
//               type="number"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none "
//               placeholder="Enter OTP"
              
//               value={formData.otp}
//               onChange={handleChange}
        
//               required
//             />
//           </div>

//           {/* New Password Input */}
//           <div className="mb-4 relative">
//             <label className="block text-gray-700 mb-1">New Password</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"
//                 placeholder="Enter new password"
//                 value={formData.password} onChange={handleChange}
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-3 text-gray-500"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>

//           {/* Confirm Password Input */}
//           <div className="mb-4 relative">
//             <label className="block text-gray-700 mb-1">Confirm Password</label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"
//                 placeholder="Confirm new password"
//                 value={formData.passwordconfirm} onChange={handleChange}
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-3 text-gray-500"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-teal-700 text-white py-2 rounded-md mt-4 hover:bg-teal-800 transition duration-200"
//           >
//             Send Details
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import axios from "axios";

const ResetPassword = () => {
  const storedEmail = localStorage.getItem("userEmail");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Correct way to initialize state
  const [formData, setFormData] = useState({
    otp: "",
    email: storedEmail || "", // Ensure email is stored properly
    password: "",
    passwordconfirm: "",
  });

  // Correct handleChange function
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storedEmail) {
      return alert("Email not found. Please request password reset again.");
    }

    if (formData.password !== formData.passwordconfirm) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/reset-password",
        formData, // Send complete formData
        { withCredentials: true }
      );

      alert(response.data.message);
      localStorage.removeItem("userEmail"); // Clear stored email after reset
      navigate("/login"); // Redirect to login
    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative z-10 w-full max-w-2xl bg-white p-10 shadow-lg rounded-2xl border-l-4 border-teal-700">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
        
        <form onSubmit={handleSubmit} className="mt-6">
          {/* OTP Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">OTP</label>
            <input
              type="number"
              name="otp"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </div>

          {/* New Password Input */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="passwordconfirm"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"
                placeholder="Confirm new password"
                value={formData.passwordconfirm}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-2 rounded-md mt-4 hover:bg-teal-800 transition duration-200"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

