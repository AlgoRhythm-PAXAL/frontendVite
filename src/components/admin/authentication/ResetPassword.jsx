import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LOGO from '../../../assets/Velox-Logo.png';
import FormField from '../FormField';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const location = useLocation();
  const { email, otp } = location.state || {};
  const [formData, setFormData] = useState({
    email: email,
    password: '',
    confirmPassword: '',
    otp: otp,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8000/admin/reset-password',
        formData
      );
      if (response.data.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/admin/login'), 3000);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (error) {
      setError('Failed to reset password. Please try again.', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center w-1/3 bg-white pb-8 px-16 rounded-3xl relative z-10">
      <img src={LOGO} alt="LOGO" width={120} height={120} className="mt-8" />
      <div className="text-center w-full">
        <h1 className="font-semibold text-3xl my-10">Reset Password</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-5 w-full"
      >
        <FormField
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter new password"
          required
        />
        <FormField
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-2/3 mt-4 px-4 py-3 bg-Primary text-white rounded-xl hover:bg-primary"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
