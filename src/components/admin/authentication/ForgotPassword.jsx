import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import FormField from '../FormField';
import LOGO from '../../../assets/Velox-Logo.png';
import formValidator from '../../../utils/formValidator.js';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    // Validate form data
    const validateForm = useCallback(() => {
        const errors = {};
        
        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!formValidator.validateEmail(formData.email)) {
            errors.email = "Please enter a valid email address";
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData.email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous validation errors
        setValidationErrors({});
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            await axios.post(
                `${backendURL}/api/admin/auth/forgot-password`, 
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000 // 10 second timeout
                }
            );
            
            toast.success("Verification Code Sent", {
                description: "Please check your email for the verification code",
                duration: 3000,
            });
            
            // Navigate to OTP verification page
            navigate("/admin/verify-OTP", { 
                state: { email: formData.email },
                replace: true // Replace current history entry
            });
            
        } catch (error) {
            let errorMessage = "Failed to send verification code. Please try again.";
            
            if (error.response) {
                // Server responded with error status
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                // Network error
                errorMessage = "Network error. Please check your connection and try again.";
            } else if (error.code === 'ECONNABORTED') {
                // Timeout error
                errorMessage = "Request timeout. Please try again.";
            }
            
            toast.error("Error", {
                description: errorMessage,
                action: {
                    label: "Retry",
                    onClick: () => handleSubmit(e)
                }
            });
            
            console.error("Forgot password error:", error);
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
    }, [validationErrors]);





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
                <h1 className="text-3xl font-bold text-gray-800 font-mulish">
                    Forgot Password
                </h1>
                <p className="text-gray-600 mt-2">
                    Enter your email to receive a verification code
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <FormField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                    />
                    {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {validationErrors.email}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !formData.email}
                    className="w-full bg-Primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-Primary
                             focus:outline-none focus:ring-2 focus:ring-Primary focus:ring-offset-2"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending Code...</span>
                        </div>
                    ) : (
                        "Get Verification Code"
                    )}
                </button>

                {/* Back to Login Link */}
                <div className="text-center">
                    <Link
                        to="/admin/login"
                        className="text-Primary hover:text-primary-dark transition-colors duration-200 text-sm font-medium"
                    >
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ForgotPassword