import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await axios.post("http://localhost:8000/api/auth/login", formData, {
        withCredentials: true,
      });
     
      if (response.data && response.data.status === "success") {
        login();
        toast.success("Login Successful!", { duration: 2000 });
        navigate('/');
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Waves - Positioned absolutely at bottom */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#16646f"
            d="M0,128L60,122.7C120,117,240,107,360,122.7C480,139,600,181,720,192C840,203,960,181,1080,170.7C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
          <path
            fill="black"
            d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,224C840,224,960,192,1080,165.3C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Content Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden relative z-10">
        <div className="md:flex">
          {/* Left Section - Branding */}
          <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-white">
            <img
              src="/paxallogo.png" 
              alt="PAXAL Logo"
              className="w-30 h-40 mb-6"
            />
            <h1 className="text-3xl font-bold text-gray-800">PAXAL</h1>
            <p className="text-gray-600 italic mb-6">On Time, Every Time.</p>
            <div className="text-gray-700 space-y-1 text-center">
              <p>"Experience seamless parcel tracking and</p>
              <p>management with real-time updates, intuitive</p>
              <p>design and advanced features. Simplify operations</p>
              <p>and delight customers with unmatched</p>
              <p>efficiency and transparency."</p>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="md:w-1/2 p-8 bg-white">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800">Log in</h2>
                <p className="text-[#16646f] mt-2">Improve your internal parcel tracking today!</p>
              </div>

              <form onSubmit={submitHandler} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16646f] focus:border-[#16646f] outline-none transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16646f] focus:border-[#16646f] outline-none transition pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500 hover:text-[#16646f]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#16646f] focus:ring-[#16646f] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="/forget-password" className="font-medium text-[#16646f] hover:text-[#0e4a5a]">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-[#16646f] hover:bg-[#0e4a5a] text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                <p className="text-sm text-center text-gray-600 mt-4">
                  Don't have an account?{' '}
                  <a href="/signup" className="font-medium text-[#16646f] hover:text-[#0e4a5a]">
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
