// Customer form validation utilities
export const validateCustomerForm = {
  fName: (value) => {
    if (!value || typeof value !== 'string') {
      return 'First name is required';
    }
    
    const trimmed = value.trim();
    
    if (trimmed.length === 0) {
      return 'First name is required';
    }
    
    if (trimmed.length > 50) {
      return 'First name must not exceed 50 characters';
    }
    
    const namePattern = /^[a-zA-Z\s.'-]+$/;
    if (!namePattern.test(trimmed)) {
      return 'First name can only contain letters, spaces, periods, apostrophes, and hyphens';
    }
    
    return null;
  },

  lName: (value) => {
    if (!value || typeof value !== 'string') {
      return 'Last name is required';
    }
    
    const trimmed = value.trim();
    
    if (trimmed.length === 0) {
      return 'Last name is required';
    }
    
    if (trimmed.length > 50) {
      return 'Last name must not exceed 50 characters';
    }
    
    const namePattern = /^[a-zA-Z\s.'-]+$/;
    if (!namePattern.test(trimmed)) {
      return 'Last name can only contain letters, spaces, periods, apostrophes, and hyphens';
    }
    
    return null;
  },

  email: (value) => {
    if (!value || typeof value !== 'string') {
      return 'Email is required';
    }
    
    const trimmed = value.trim().toLowerCase();
    
    if (trimmed.length < 5) {
      return 'Email must be at least 5 characters long';
    }
    
    if (trimmed.length > 100) {
      return 'Email must not exceed 100 characters';
    }
    
    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return 'Invalid email format';
    }
    
    // Domain validation
    const validDomainExtensions = /\.(com|org|net|edu|gov|co\.uk|ac\.uk|in|lk|io|dev|tech|info|biz)$/i;
    if (!validDomainExtensions.test(trimmed)) {
      return 'Please enter a valid email address with a proper domain (e.g., .com, .org, .net)';
    }
    
    return null;
  },

  contact: (value) => {
    if (!value || typeof value !== 'string') {
      return 'Contact number is required';
    }
    
    // Clean the contact number
    const cleaned = value.replace(/[\s\-()]/g, '').trim();
    
    if (cleaned.length < 10) {
      return 'Contact number must be at least 10 digits';
    }
    
    if (cleaned.length > 15) {
      return 'Contact number must not exceed 15 digits';
    }
    
    // Sri Lankan mobile numbers validation
    const sriLankanMobile = /^(07[0-9]{8}|947[0-9]{8}|\+947[0-9]{8})$/;
    const generalMobile = /^[0-9]{10,15}$/;
    
    if (!sriLankanMobile.test(cleaned) && !generalMobile.test(cleaned)) {
      return 'Invalid contact number format. Use Sri Lankan format (07XXXXXXXX) or international format';
    }
    
    return null;
  },

  nic: (value) => {
    if (!value || typeof value !== 'string') {
      return 'NIC is required';
    }
    
    const trimmed = value.trim().toUpperCase();
    
    // Sri Lankan NIC validation
    const oldFormat = /^[0-9]{9}[VX]$/; // 9 digits + V or X
    const newFormat = /^[0-9]{12}$/;    // 12 digits
    
    if (!oldFormat.test(trimmed) && !newFormat.test(trimmed)) {
      return 'Invalid NIC format. Use old format (123456789V) or new format (200203601188)';
    }
    
    if (trimmed.length !== 10 && trimmed.length !== 12) {
      return 'NIC must be exactly 10 characters (old format) or 12 characters (new format)';
    }
    
    // Additional NIC logic validation
    if (trimmed.length === 12) {
      // New format NIC validation
      const year = parseInt(trimmed.substring(0, 4));
      const dayOfYear = parseInt(trimmed.substring(4, 7));
      
      if (year < 1900 || year > new Date().getFullYear()) {
        return 'Invalid NIC year';
      }
      
      if (!((dayOfYear >= 1 && dayOfYear <= 366) || (dayOfYear >= 501 && dayOfYear <= 866))) {
        return 'Invalid NIC number - please check the format and validity';
      }
    } else if (trimmed.length === 10) {
      // Old format NIC validation
      const dayOfYear = parseInt(trimmed.substring(2, 5));
      
      if (!((dayOfYear >= 1 && dayOfYear <= 366) || (dayOfYear >= 501 && dayOfYear <= 866))) {
        return 'Invalid NIC number - please check the format and validity';
      }
    }
    
    return null;
  },

  address: (value) => {
    if (value && typeof value === 'string') {
      const trimmed = value.trim();
      
      if (trimmed.length > 255) {
        return 'Address must not exceed 255 characters';
      }
    }
    
    return null;
  },

  city: (value) => {
    if (value && typeof value === 'string') {
      const trimmed = value.trim();
      
      if (trimmed.length > 100) {
        return 'City must not exceed 100 characters';
      }
      
      if (trimmed.length > 0) {
        const cityPattern = /^[a-zA-Z\s.'-]+$/;
        if (!cityPattern.test(trimmed)) {
          return 'City can only contain letters, spaces, periods, apostrophes, and hyphens';
        }
      }
    }
    
    return null;
  },

  district: (value) => {
    if (value && typeof value === 'string') {
      const trimmed = value.trim();
      
      if (trimmed.length > 100) {
        return 'District must not exceed 100 characters';
      }
      
      if (trimmed.length > 0) {
        const districtPattern = /^[a-zA-Z\s.'-]+$/;
        if (!districtPattern.test(trimmed)) {
          return 'District can only contain letters, spaces, periods, apostrophes, and hyphens';
        }
      }
    }
    
    return null;
  },

  province: (value) => {
    if (value && typeof value === 'string') {
      const trimmed = value.trim();
      
      if (trimmed.length > 100) {
        return 'Province must not exceed 100 characters';
      }
      
      if (trimmed.length > 0) {
        const provincePattern = /^[a-zA-Z\s.'-]+$/;
        if (!provincePattern.test(trimmed)) {
          return 'Province can only contain letters, spaces, periods, apostrophes, and hyphens';
        }
      }
    }
    
    return null;
  }
};

// Validate all fields at once
export const validateAllCustomerFields = (formData) => {
  const errors = {};
  
  // Required fields validation
  const requiredFields = ['fName', 'lName', 'email', 'contact', 'nic'];
  
  for (const field of requiredFields) {
    const error = validateCustomerForm[field](formData[field]);
    if (error) {
      errors[field] = error;
    }
  }
  
  // Optional fields validation
  const optionalFields = ['address', 'city', 'district', 'province'];
  
  for (const field of optionalFields) {
    const error = validateCustomerForm[field](formData[field]);
    if (error) {
      errors[field] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Real-time validation for individual fields
export const validateField = (fieldName, value) => {
  if (validateCustomerForm[fieldName]) {
    return validateCustomerForm[fieldName](value);
  }
  return null;
};

// Format contact number for display
export const formatContactNumber = (contact) => {
  if (!contact) return '';
  
  const cleaned = contact.replace(/[\s\-()]/g, '');
  
  // Format Sri Lankan mobile numbers
  if (/^07[0-9]{8}$/.test(cleaned)) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  // Format international numbers
  if (/^\+947[0-9]{8}$/.test(cleaned)) {
    return `+94 ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
  }
  
  return contact;
};

// Format NIC for display
export const formatNIC = (nic) => {
  if (!nic) return '';
  
  const cleaned = nic.trim().toUpperCase();
  
  // Format old NIC (123456789V)
  if (/^[0-9]{9}[VX]$/.test(cleaned)) {
    return `${cleaned.substring(0, 9)}${cleaned.substring(9)}`;
  }
  
  // Format new NIC (200203601188)
  if (/^[0-9]{12}$/.test(cleaned)) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  
  return nic;
};
