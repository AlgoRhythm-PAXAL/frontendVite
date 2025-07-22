import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import toast from 'react-hot-toast';

const Emailverify = () => {
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
    if (enteredOtp.length !== 4) return alert('Please enter the complete OTP');

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/verify',
        { otp: enteredOtp },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      //alert(response.data.message);
      login();
      navigate('/'); // Navigate to home on success
    } catch (error) {
      //alert(error.response?.data?.message || "Verification failed");
      toast.error(error.response?.data?.message || 'Verification failed');
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    const storedEmail = localStorage.getItem('userEmail'); //  Get email from localStorage
    if (!storedEmail) return alert('Email not found. Please sign up again.');

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/resend-otp',
        { email: storedEmail }, //  Send email in the request body
        { withCredentials: true }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resend OTP');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the 4-digit code sent to your email address
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full py-2 bg-teal-700 text-white font-semibold rounded-md hover:bg-teal-600"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        {/* Resend OTP Button */}
        <button
          onClick={handleResendOtp}
          className="w-full py-2 mt-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500"
          disabled={loading}
        >
          {loading ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default Emailverify;
