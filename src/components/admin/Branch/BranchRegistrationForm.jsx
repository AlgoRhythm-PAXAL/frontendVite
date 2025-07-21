import FormField from "../FormField";
import { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import PropTypes from "prop-types";

const BranchRegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    location: "",
    contact: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Memoize backend URL to prevent unnecessary re-renders
  const backendUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL, []);

  // Validation rules
  const validationRules = useMemo(() => ({
    location: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\-,.'()]+$/,
      message: "Location must be 2-100 characters and contain only letters, spaces, and common punctuation"
    },
    contact: {
      required: true,
      pattern: /^(\+94|0)([1-9][0-9]{8})$/,
      message: "Contact must be a valid Sri Lankan phone number (e.g., +94771234567 or 0771234567)"
    }
  }), []);

  // Enhanced input validation
  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;

    if (rule.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must not exceed ${rule.maxLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    return null;
  }, [validationRules]);

  // Optimized form validation
  const validateForm = useCallback(() => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
    return errors;
  }, [formData, validateField]);

  // Enhanced change handler with real-time validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field if it becomes valid
    if (validationErrors[name]) {
      const error = validateField(name, value);
      if (!error) {
        setValidationErrors(prev => {
          // eslint-disable-next-line no-unused-vars
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [validateField, validationErrors]);

  // Enhanced submit handler with comprehensive error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    const toastId = toast.loading("Registering branch...");
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Create axios instance with timeout and retry logic
      const axiosInstance = axios.create({
        timeout: 15000,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Prepare sanitized data
      const sanitizedData = {
        location: formData.location.trim(),
        contact: formData.contact.trim().replace(/\s+/g, ''), // Remove all spaces from contact
      };

      const response = await axiosInstance.post(
        `${backendUrl}/api/admin/branches`,
        sanitizedData
      );

      // Handle successful response
      const { data: responseData } = response;
      const successMessage = responseData?.message || "Branch registered successfully!";
      const branchData = responseData?.data;
      
      toast.success(successMessage, {
        id: toastId,
        description: branchData 
          ? `Branch ID: ${branchData.branchId} | Location: ${branchData.location}` 
          : "Branch has been added to the system",
        action: {
          label: "View Branches",
          onClick: () => {
            // Call onSuccess callback if provided
            if (typeof onSuccess === 'function') {
              onSuccess(branchData);
            } else {
              window.location.reload();
            }
          },
        },
      });
      
      // Reset form on success
      setFormData({ location: "", contact: "" });
      
      // Auto-trigger success action after delay
      setTimeout(() => {
        if (typeof onSuccess === 'function') {
          onSuccess(branchData);
        } else {
          window.location.reload();
        }
      }, 2000);

    } catch (error) {
      console.error("Branch registration error:", error);
      
      let errorMessage = "Failed to register branch";
      let description = "An unexpected error occurred. Please try again.";
      
      if (error.response) {
        // Server responded with error status
        const { status, data: errorData } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = "Invalid branch information";
            if (errorData?.errors && Array.isArray(errorData.errors)) {
              description = errorData.errors.map(err => err.message).join(', ');
              // Set field-specific validation errors
              const fieldErrors = {};
              errorData.errors.forEach(err => {
                if (err.field && Object.prototype.hasOwnProperty.call(formData, err.field)) {
                  fieldErrors[err.field] = err.message;
                }
              });
              setValidationErrors(fieldErrors);
            } else if (errorData?.message) {
              description = errorData.message;
            }
            break;
            
          case 401:
            errorMessage = "Authentication required";
            description = "Please log in again to continue";
            break;
            
          case 403:
            errorMessage = "Access denied";
            description = "You don't have permission to register branches";
            break;
            
          case 409:
            errorMessage = "Branch already exists";
            if (errorData?.code === 'DUPLICATE_BRANCH_LOCATION') {
              description = "A branch at this location already exists";
              setValidationErrors({ location: "This location already has a branch" });
            } else if (errorData?.code === 'DUPLICATE_BRANCH_CONTACT') {
              description = "This contact number is already registered";
              setValidationErrors({ contact: "This contact number is already in use" });
            } else {
              description = errorData?.message || "Duplicate branch information detected";
            }
            break;
            
          case 422:
            errorMessage = "Invalid data format";
            description = errorData?.message || "Please check your input and try again";
            break;
            
          case 500:
            errorMessage = "Server error";
            description = "Our servers are experiencing issues. Please try again later.";
            break;
            
          default:
            errorMessage = errorData?.message || `Request failed with status ${status}`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error";
        description = "Please check your internet connection and try again";
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        errorMessage = "Request timeout";
        description = "The request took too long. Please try again.";
      }

      toast.error(errorMessage, {
        id: toastId,
        description,
        duration: 5000,
        ...(error.response?.status === 401 && {
          action: {
            label: "Login",
            onClick: () => (window.location.href = "/admin/login"),
          },
        }),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 w-full bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Branch Registration
        </h1>
        <p className="text-sm text-gray-600">
          Add a new branch location to the Paxal PMS system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormField
              label="Branch Location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="e.g., Colombo Central, Kandy Town"
            />
            {validationErrors.location && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.location}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <FormField
              label="Contact Number"
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="e.g., +94771234567 or 0771234567"
            />
            {validationErrors.contact && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.contact}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Sri Lankan format: +94XXXXXXXXX or 07XXXXXXXX
            </p>
          </div>
        </div>

        {/* Form submission button */}
        <div className="pt-4">
          <button
            type="submit"
            className={`w-full py-3 px-6 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md'
              } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Registering Branch...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Register Branch
              </>
            )}
          </button>
        </div>

        {/* Form hints */}
        <div className="pt-2 text-xs text-gray-500 space-y-1">
          <p>• Branch location should be descriptive and unique</p>
          <p>• Contact number will be used for customer inquiries</p>
          <p>• All fields are required for registration</p>
        </div>
      </form>
    </div>
  );
};

// Add prop types for better development experience
BranchRegistrationForm.propTypes = {
  onSuccess: PropTypes.func,
};

BranchRegistrationForm.defaultProps = {
  onSuccess: null,
};

export default BranchRegistrationForm;
