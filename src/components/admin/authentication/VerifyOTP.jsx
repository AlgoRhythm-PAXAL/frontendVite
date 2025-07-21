import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import LOGO from "../../../assets/Velox-Logo.png";
import FormField from "../FormField";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  
  const [formData, setFormData] = useState({ email: email || "", otp: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect to forgot password if no email is provided
  useEffect(() => {
    if (!email) {
      toast.error("Session expired", {
        description: "Please start the password reset process again.",
      });
      navigate("/admin/forgotPassword", { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Validate OTP
  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.otp) {
      errors.otp = "Verification code is required";
    } else if (formData.otp.length !== 6) {
      errors.otp = "Verification code must be 6 digits";
    } else if (!/^\d+$/.test(formData.otp)) {
      errors.otp = "Verification code must contain only numbers";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${backendURL}/api/admin/auth/verify-otp`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.data.success) {
        toast.success("Code Verified", {
          description: "Redirecting to reset password...",
          duration: 2000,
        });
        
        navigate("/admin/reset-password", {
          state: { email: email, otp: formData.otp },
          replace: true
        });
      } else {
        toast.error("Verification Failed", {
          description: "Invalid or expired verification code.",
        });
      }
    } catch (error) {
      let errorMessage = "Failed to verify code. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please try again.";
      }
      
      toast.error("Verification Error", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleSubmit(e)
        }
      });
      
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Only allow numeric input for OTP and limit to 6 digits
    if (name === 'otp') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [validationErrors]);

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    
    try {
      await axios.post(
        `${backendURL}/api/admin/auth/forgot-password`,
        { email },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      
      toast.success("Code Resent", {
        description: "A new verification code has been sent to your email.",
        duration: 3000,
      });
      
      setResendCooldown(60); // 60 second cooldown
      
    } catch (err) {
      toast.error("Failed to Resend", {
        description: "Failed to resend verification code. Please try again.",
      });
      console.error("Resend code error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative z-10">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img 
          src={LOGO} 
          alt="Company Logo" 
          className="w-30 h-30 object-contain"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-mulish mb-2">
          Enter Verification Code
        </h1>
        <p className="text-gray-600 text-sm">
          We&apos;ve sent a 6-digit code to
        </p>
        <p className="text-Primary font-medium text-sm">
          {email}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <FormField
            label="Verification Code"
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter 6-digit code"
            required
            maxLength={6}
            className="text-center text-2xl font-mono tracking-widest"
          />
          {validationErrors.otp && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.otp}
            </p>
          )}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.otp || formData.otp.length !== 6}
          className="w-full bg-Primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-Primary
                   focus:outline-none focus:ring-2 focus:ring-Primary focus:ring-offset-2"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify Code"
          )}
        </button>

        {/* Resend Code */}
        <div className="text-center space-y-2">
          <p className="text-gray-600 text-sm">
            Didn&apos;t receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || isLoading}
            className="text-Primary hover:text-primary-dark transition-colors duration-200 text-sm font-medium 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 
              ? `Resend in ${resendCooldown}s`
              : "Resend Code"
            }
          </button>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to="/admin/login"
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default VerifyOTP;
