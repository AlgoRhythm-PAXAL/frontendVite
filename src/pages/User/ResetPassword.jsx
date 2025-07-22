import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem('userEmail');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    otp: '',
    email: storedEmail || '',
    password: '',
    passwordconfirm: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storedEmail) {
      toast.error('Email not found. Please request password reset again.');
      return;
    }

    if (formData.password !== formData.passwordconfirm) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/reset-password',
        formData,
        { withCredentials: true }
      );

      toast.success(response.data.message);
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex flex-col items-center p-4 relative overflow-hidden">
      {/* Title at the top center */}
      <div className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Reset Password</h1>
        <p className="text-[#16646f] mt-2">Enter your new password details</p>
      </div>

      {/* Background Waves - Positioned absolutely behind content */}
      <div className="absolute bottom-0 left-0 w-full">
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
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden h-96   relative z-10">
        <div className="md:flex">
          {/* Left Section - Branding */}
          <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-white">
            <img src="/paxallogo.png" alt="LOGO" className="w-25 h-28 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">PAXAL</h1>
            <p className="text-gray-600 italic mb-6">On Time, Every Time.</p>
          </div>

          {/* Right Section - Reset Form */}
          <div className="md:w-1/2 p-8 bg-white">
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <input
                    type="number"
                    name="otp"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16646f] focus:border-[#16646f] outline-none"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* New Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16646f] focus:border-[#16646f] outline-none pr-10"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
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

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="passwordconfirm"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16646f] focus:border-[#16646f] outline-none pr-10"
                      placeholder="Confirm new password"
                      value={formData.passwordconfirm}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500 hover:text-[#16646f]"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-[#16646f] hover:bg-[#0e4a5a] text-white py-2 px-4 rounded-md font-medium transition duration-200"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
