import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import LOGO from "../../../assets/Velox-Logo.png";
import FormField from "../FormField";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};
  
  const [formData, setFormData] = useState({
    email: email || "",
    password: "",
    confirmPassword: "",
    otp: otp || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  // Redirect if no email or OTP is provided
  useEffect(() => {
    if (!email || !otp) {
      toast.error("Session expired", {
        description: "Please start the password reset process again.",
      });
      navigate("/admin/forgotPassword", { replace: true });
    }
  }, [email, otp, navigate]);

  // Check password strength
  const checkPasswordStrength = useCallback((password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("One uppercase letter");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("One lowercase letter");

    if (/\d/.test(password)) score += 1;
    else feedback.push("One number");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push("One special character");

    setPasswordStrength({ score, feedback });
    return score >= 4; // Require at least 4 criteria
  }, []);

  // Validate form data
  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!checkPasswordStrength(formData.password)) {
      errors.password = "Password does not meet security requirements";
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.password, formData.confirmPassword, checkPasswordStrength]);

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
        `${backendURL}/api/admin/auth/reset-password`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 second timeout
        }
      );
      
      if (response.data.success) {
        toast.success("Password Reset Successful", {
          description: "Your password has been updated successfully. Redirecting to login...",
          duration: 3000,
        });
        
        setTimeout(() => {
          navigate("/admin/login", { replace: true });
        }, 3000);
      } else {
        toast.error("Reset Failed", {
          description: response.data.message || "Failed to reset password. Please try again.",
        });
      }
    } catch (error) {
      let errorMessage = "Failed to reset password. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please try again.";
      }
      
      toast.error("Reset Error", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleSubmit(e)
        }
      });
      
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Check password strength in real-time
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  }, [validationErrors, checkPasswordStrength]);

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'text-red-500';
    if (passwordStrength.score <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Get password strength text
  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Medium';
    return 'Strong';
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
          Reset Password
        </h1>
        <p className="text-gray-600 text-sm">
          Create a new secure password for your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password Field */}
        <div>
          <FormField
            label="New Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.password}
            </p>
          )}
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Password Strength:</span>
                <span className={`text-sm font-medium ${getPasswordStrengthColor()}`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.score <= 2 ? 'bg-red-500' :
                    passwordStrength.score <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-gray-500">Missing:</p>
                  <ul className="text-xs text-gray-500 list-disc list-inside">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <FormField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Reset Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.password || !formData.confirmPassword || passwordStrength.score < 4}
          className="w-full bg-Primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-Primary
                   focus:outline-none focus:ring-2 focus:ring-Primary focus:ring-offset-2"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Resetting Password...</span>
            </div>
          ) : (
            "Reset Password"
          )}
        </button>

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

export default ResetPassword;
