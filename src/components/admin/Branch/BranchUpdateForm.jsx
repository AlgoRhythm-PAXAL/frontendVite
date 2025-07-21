import { useState } from "react";
import { Input } from "@/components/ui/input";
import PropTypes from "prop-types";

const BranchUpdateForm = ({ formData, setFormData, rowData }) => {
  const [fieldErrors, setFieldErrors] = useState({});

  // Validation rules for update form
  const validateUpdateField = (name, value) => {
    switch (name) {
      case 'location':
        if (!value.trim()) return 'Location is required';
        if (value.length < 2) return 'Location must be at least 2 characters';
        if (value.length > 100) return 'Location must not exceed 100 characters';
        if (!/^[a-zA-Z\s\-,.'()]+$/.test(value)) return 'Location contains invalid characters';
        return null;
      case 'contact':
        if (!value.trim()) return 'Contact number is required';
        if (!/^(\+94|0)([1-9][0-9]{8})$/.test(value.replace(/\s+/g, ''))) {
          return 'Please enter a valid Sri Lankan phone number';
        }
        return null;
      default:
        return null;
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field becomes valid
    const error = validateUpdateField(name, value);
    if (!error && fieldErrors[name]) {
      setFieldErrors(prev => {
        // eslint-disable-next-line no-unused-vars
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    } else if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Branch Location <span className="text-red-500">*</span>
        </label>
        <Input
          value={
            formData.location !== undefined
              ? formData.location
              : rowData?.location || ""
          }
          onChange={handleFieldChange}
          name="location"
          placeholder="Enter branch location (e.g., Colombo Central)"
          className={`transition-colors ${
            fieldErrors.location 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {fieldErrors.location && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {fieldErrors.location}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Contact Number <span className="text-red-500">*</span>
        </label>
        <Input
          value={
            formData.contact !== undefined
              ? formData.contact
              : rowData?.contact || ""
          }
          onChange={handleFieldChange}
          name="contact"
          placeholder="Enter contact number (e.g., +94771234567)"
          type="tel"
          className={`transition-colors ${
            fieldErrors.contact 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {fieldErrors.contact && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {fieldErrors.contact}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Sri Lankan format: +94XXXXXXXXX or 07XXXXXXXX
        </p>
      </div>

      {/* Form hints */}
      <div className="pt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">Update Guidelines:</p>
        <ul className="space-y-1">
          <li>• Location should be descriptive and unique</li>
          <li>• Contact number will be used for customer inquiries</li>
          <li>• Changes will be reflected immediately across the system</li>
        </ul>
      </div>
    </div>
  );
};

BranchUpdateForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  rowData: PropTypes.object,
};

BranchUpdateForm.defaultProps = {
  rowData: {},
};

export default BranchUpdateForm;
