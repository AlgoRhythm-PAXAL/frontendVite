
import React, { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const EmailVerify = () => {
  const { login } = useContext(AuthContext);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      toast.error('Please enter the complete OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/verify',
        { otp: enteredOtp },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      await login();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail) {
      toast.error('Email not found. Please sign up again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/resend-otp',
        { email: storedEmail },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Waves - Matching other auth pages */}
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative z-10">
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
            <p className="text-[#16646f] mt-2">
              Enter the 4-digit code sent to your email
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-4 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-16 h-16 text-center text-2xl border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16646f] focus:border-[#16646f]"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="w-full py-3 bg-[#16646f] hover:bg-[#0e4a5a] text-white font-medium rounded-lg transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>

          {/* Resend OTP Button */}
          <button
            onClick={handleResendOtp}
            className="w-full py-3 mt-4 bg-white border border-[#16646f] text-[#16646f] hover:bg-gray-50 font-medium rounded-lg transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#16646f]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Resending...
              </>
            ) : (
              'Resend OTP'
            )}
          </button>

          {/* Back to Login Link */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Wrong email?{' '}
            <a
              href="/login"
              className="font-medium text-[#16646f] hover:text-[#0e4a5a]"
            >
              Go back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;