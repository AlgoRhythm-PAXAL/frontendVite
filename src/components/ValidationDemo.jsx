import { useState } from 'react';
import { validateField } from '../utils/customerValidation';

const ValidationDemo = () => {
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    email: '',
    contact: '',
    nic: '',
    address: '',
    city: '',
    district: '',
    province: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate field
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Customer Validation Demo</h2>
      
      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={formData.fName}
            onChange={(e) => handleChange('fName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.fName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter first name"
          />
          {errors.fName && (
            <p className="text-red-500 text-sm mt-1">{errors.fName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lName}
            onChange={(e) => handleChange('lName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.lName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter last name"
          />
          {errors.lName && (
            <p className="text-red-500 text-sm mt-1">{errors.lName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            value={formData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.contact ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter contact number (e.g., 0771234567)"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        {/* NIC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NIC Number
          </label>
          <input
            type="text"
            value={formData.nic}
            onChange={(e) => handleChange('nic', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.nic ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter NIC (e.g., 123456789V or 200123456789)"
          />
          {errors.nic && (
            <p className="text-red-500 text-sm mt-1">{errors.nic}</p>
          )}
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).some(key => errors[key]) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="text-red-800 font-medium mb-2">Validation Errors:</h4>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.entries(errors).map(([field, error]) => 
                error && (
                  <li key={field} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span><strong>{field}:</strong> {error}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Success Message */}
        {Object.keys(formData).every(key => formData[key]) && 
         !Object.keys(errors).some(key => errors[key]) && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 font-medium">All validations passed! ✅</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationDemo;
