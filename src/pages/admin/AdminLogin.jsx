import { useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import FormField from "../../components/admin/FormField";
import LOGO from "../../assets/Velox-Logo.png";
import formValidator from "../../utils/formValidator.js";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  
  // Use admin auth context
  const { login, loading: isLoading } = useAdminAuth();

  // Validate form data
  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!formValidator.validateEmail(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Navigate to dashboard after successful login
        setTimeout(() => navigate("/admin"), 1000);
      }
      // Error handling is done in the context
    } catch (error) {
      console.error("Login submit error:", error);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [validationErrors]);

  // Check if form is valid for button state
  const isFormValid = useMemo(() => {
    return formData.email && formData.password && Object.keys(validationErrors).length === 0;
  }, [formData, validationErrors]);

  return (
    <div className="min-h-screen bg-Background flex items-center justify-center relative overflow-hidden">
      {/* Login Form Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative z-10 mx-4">
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
          <h1 className="text-3xl font-bold text-gray-800 font-mulish">
            Admin Login
          </h1>
          <p className="text-gray-600 mt-2">
            Please sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <FormField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <FormField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full bg-Primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-Primary
                     focus:outline-none focus:ring-2 focus:ring-Primary focus:ring-offset-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link
              to="/admin/forgotPassword"
              className="text-Primary hover:text-primary-dark transition-colors duration-200 text-sm font-medium"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Overlapping SVGs */}
        <div className="absolute bottom-0 w-full">
          <div className="relative w-full h-[200px]">
            {/* First SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 390"
              className="absolute bottom-0 w-full"
              aria-hidden="true"
            >
              <path
                fill="#1f818c"
                fillOpacity="1"
                d="M0,192L60,197.3C120,203,240,213,360,229.3C480,245,600,267,720,250.7C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              />
            </svg>
            {/* Second SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1400 280"
              className="absolute bottom-0 w-full"
              aria-hidden="true"
            >
              <path
                fill="#000000"
                fillOpacity="1"
                d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,122.7C840,107,960,117,1080,133.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
