// Validation utilities that match backend Zod schemas

// Email validation (matches backend strict validation)
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, message: "Email is required" };
  }
  
  const trimmedEmail = email.toLowerCase().trim();
  
  if (trimmedEmail.length < 5) {
    return { isValid: false, message: 'Email must be at least 5 characters long' };
  }
  
  if (trimmedEmail.length > 100) {
    return { isValid: false, message: 'Email must not exceed 100 characters' };
  }
  
  // Basic email format validation
  const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!strictEmailRegex.test(trimmedEmail)) {
    return { isValid: false, message: 'Invalid email format' };
  }
  
  // Strict domain validation (removed .co to match backend)
  const validDomainExtensions = /\.(com|org|net|edu|gov|co\.uk|ac\.uk|in|lk|io|dev|tech|info|biz)$/i;
  if (!validDomainExtensions.test(trimmedEmail)) {
    return { isValid: false, message: 'Please enter a valid email address with a proper domain (e.g., .com, .org, .net)' };
  }
  
  return { isValid: true, message: "" };
};

// NIC validation (matches backend validation with advanced logic)
export const validateNIC = (nic) => {
  if (!nic || nic.trim().length === 0) {
    return { isValid: false, message: "NIC is required" };
  }
  
  const cleanNIC = nic.trim().toUpperCase();
  
  // Basic format validation
  const oldFormat = /^[0-9]{9}[VX]$/; // 9 digits + V/X
  const newFormat = /^[0-9]{12}$/;    // 12 digits exactly
  
  if (!oldFormat.test(cleanNIC) && !newFormat.test(cleanNIC)) {
    return { isValid: false, message: "Invalid NIC format. Use old format (123456789V) or new format (200203601188)" };
  }
  
  // Length validation
  if (cleanNIC.length !== 10 && cleanNIC.length !== 12) {
    return { isValid: false, message: "NIC must be exactly 10 characters (old format) or 12 characters (new format)" };
  }
  
  // Advanced validation logic
  if (cleanNIC.length === 12) {
    // New format NIC validation
    const year = parseInt(cleanNIC.substring(0, 4));
    const dayOfYear = parseInt(cleanNIC.substring(4, 7));
    
    // Basic year validation
    if (year < 1900 || year > new Date().getFullYear()) {
      return { isValid: false, message: "Invalid NIC number - please check the format and validity" };
    }
    
    // Day of year validation (1-366 for males, 501-866 for females)
    if (!((dayOfYear >= 1 && dayOfYear <= 366) || (dayOfYear >= 501 && dayOfYear <= 866))) {
      return { isValid: false, message: "Invalid NIC number - please check the format and validity" };
    }
  } else if (cleanNIC.length === 10) {
    // Old format NIC validation
    const dayOfYear = parseInt(cleanNIC.substring(2, 5));
    
    // Day of year validation for old format
    if (!((dayOfYear >= 1 && dayOfYear <= 366) || (dayOfYear >= 501 && dayOfYear <= 866))) {
      return { isValid: false, message: "Invalid NIC number - please check the format and validity" };
    }
  }
  
  return { isValid: true, message: "" };
};

// Contact number validation (matches backend validation)
export const validateContactNo = (contactNo) => {
  if (!contactNo || contactNo.trim().length === 0) {
    return { isValid: false, message: "Contact number is required" };
  }
  
  // Remove spaces, dashes, parentheses for validation
  const cleanContact = contactNo.replace(/[\s\-()+=]/g, '');
  
  // Sri Lankan mobile numbers: 07XXXXXXXX or 947XXXXXXXX (without +)
  const sriLankanMobile = /^(07[0-9]{8}|947[0-9]{8})$/;
  const generalMobile = /^[0-9]{10,15}$/;
  
  const isValid = sriLankanMobile.test(cleanContact) || generalMobile.test(cleanContact);
  
  return {
    isValid,
    message: isValid ? "" : "Invalid contact number format. Use Sri Lankan format (07XXXXXXXX) or international format"
  };
};

// Name validation (matches backend validation)
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: "Name is required" };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters long" };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, message: "Name must not exceed 50 characters" };
  }
  
  // Allow letters, spaces, and some common name characters
  const namePattern = /^[a-zA-Z\s.'-]+$/;
  const isValid = namePattern.test(trimmedName);
  
  return {
    isValid,
    message: isValid ? "" : "Name can only contain letters, spaces, periods, apostrophes, and hyphens"
  };
};

// License ID validation for drivers
export const validateLicenseId = (licenseId) => {
  if (!licenseId || licenseId.trim().length === 0) {
    return { isValid: false, message: "License ID is required for drivers" };
  }
  
  const cleanLicenseId = licenseId.trim().toUpperCase();
  
  if (cleanLicenseId.length > 50) {
    return { isValid: false, message: "License ID must not exceed 50 characters" };
  }
  
  // Sri Lankan driving license format validation
  const licensePattern = /^[A-Z0-9\-/]+$/;
  if (!licensePattern.test(cleanLicenseId)) {
    return { isValid: false, message: "Invalid license ID format. Please enter a valid driving license number" };
  }
  
  return { isValid: true, message: "" };
};

// User type validation
export const validateUserType = (userType) => {
  const validTypes = ['admin', 'driver', 'staff'];
  const isValid = validTypes.includes(userType);
  
  return {
    isValid,
    message: isValid ? "" : "Please select a valid user type"
  };
};

// Branch ID validation for staff and drivers
export const validateBranchId = (branchId, userType) => {
  if (['driver', 'staff'].includes(userType)) {
    if (!branchId || branchId.trim().length === 0) {
      return { isValid: false, message: "Branch assignment is required" };
    }
    
    // Check if it's a valid MongoDB ObjectId format
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(branchId)) {
      return { isValid: false, message: "Invalid branch ID format" };
    }
  }
  
  return { isValid: true, message: "" };
};

// Vehicle ID validation for drivers
export const validateVehicleId = (vehicleId, userType) => {
  if (userType === 'driver') {
    if (!vehicleId || vehicleId.trim().length === 0) {
      return { isValid: false, message: "Vehicle assignment is required for drivers" };
    }
    
    // Check if it's a valid MongoDB ObjectId format
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(vehicleId)) {
      return { isValid: false, message: "Invalid vehicle ID format" };
    }
  }
  
  return { isValid: true, message: "" };
};

// Complete form validation
export const validateAdminRegistrationForm = (formData) => {
  const errors = {};
  const validFields = {};
  
  // Validate each field
  const validations = [
    { field: 'name', validator: validateName },
    { field: 'email', validator: validateEmail },
    { field: 'nic', validator: validateNIC },
    { field: 'contactNo', validator: validateContactNo },
    { field: 'userType', validator: validateUserType },
  ];
  
  // Add conditional validations
  if (formData.userType === 'driver') {
    validations.push({ field: 'licenseId', validator: validateLicenseId });
  }
  
  validations.forEach(({ field, validator }) => {
    const result = validator(formData[field]);
    if (!result.isValid) {
      errors[field] = result.message;
    } else {
      validFields[field] = true;
    }
  });
  
  // Validate branch for drivers and staff
  const branchValidation = validateBranchId(formData.branchId, formData.userType);
  if (!branchValidation.isValid) {
    errors.branchId = branchValidation.message;
  } else if (['driver', 'staff'].includes(formData.userType)) {
    validFields.branchId = true;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    validFields
  };
};

// Real-time field validation
export const validateField = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case 'name':
      return validateName(value);
    case 'email':
      return validateEmail(value);
    case 'nic':
      return validateNIC(value);
    case 'contactNo':
      return validateContactNo(value);
    case 'userType':
      return validateUserType(value);
    case 'licenseId':
      return validateLicenseId(value);
    case 'branchId':
      return validateBranchId(value, formData.userType);
    case 'vehicleId':
      return validateVehicleId(value, formData.userType);
    case 'staffId':
      return validateStaffId(value);
    case 'status':
      return validateStaffStatus(value);
    case 'adminId':
      return validateAdminId(value, formData.userType);
    default:
      return { isValid: true, message: "" };
  }
};

// Format functions for display
export const formatNIC = (nic) => {
  if (!nic) return '';
  return nic.toUpperCase();
};

export const formatContactNo = (contact) => {
  if (!contact) return '';
  // Remove all non-digit characters except +
  return contact.replace(/[^\d+]/g, '');
};

export const formatName = (name) => {
  if (!name) return '';
  // Normalize spaces and trim
  return name.trim().replace(/\s+/g, ' ');
};

// Driver registration form validation
export const validateDriverRegistrationForm = (formData) => {
  const errors = {};
  
  // Validate all required fields for driver registration
  const requiredFields = ['name', 'email', 'contactNo', 'nic', 'licenseId', 'branchId', 'vehicleId'];
  
  requiredFields.forEach(field => {
    const result = validateField(field, formData[field], formData);
    if (!result.isValid) {
      errors[field] = result.message;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Staff ID validation
export const validateStaffId = (staffId) => {
  if (!staffId || staffId.trim().length === 0) {
    return { isValid: false, message: "Staff ID is required" };
  }
  
  const cleanStaffId = staffId.trim().toUpperCase();
  
  if (cleanStaffId.length > 20) {
    return { isValid: false, message: "Staff ID must not exceed 20 characters" };
  }
  
  // Staff ID format validation (e.g., STF001, STAFF001, etc.)
  const staffIdPattern = /^(STF|STAFF)\d{3,6}$/;
  if (!staffIdPattern.test(cleanStaffId)) {
    return { isValid: false, message: "Invalid Staff ID format. Use format like STF001 or STAFF001" };
  }
  
  return { isValid: true, message: "" };
};

// Staff status validation
export const validateStaffStatus = (status) => {
  const validStatuses = ['active', 'inactive'];
  const isValid = validStatuses.includes(status);
  
  return {
    isValid,
    message: isValid ? "" : "Status must be either 'active' or 'inactive'"
  };
};

// Admin ID validation
export const validateAdminId = (adminId, userType) => {
  if (['staff'].includes(userType)) {
    if (!adminId || adminId.trim().length === 0) {
      return { isValid: false, message: "Admin assignment is required" };
    }
    
    // Check if it's a valid MongoDB ObjectId format
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(adminId)) {
      return { isValid: false, message: "Invalid admin ID format" };
    }
  }
  
  return { isValid: true, message: "" };
};

// Staff registration form validation
export const validateStaffRegistrationForm = (formData) => {
  const errors = {};
  
  // Validate all required fields for staff registration
  const requiredFields = ['name', 'email', 'contactNo', 'nic', 'staffId', 'status', 'branchId', 'adminId'];
  
  requiredFields.forEach(field => {
    let result;
    switch (field) {
      case 'staffId':
        result = validateStaffId(formData[field]);
        break;
      case 'status':
        result = validateStaffStatus(formData[field]);
        break;
      case 'adminId':
        result = validateAdminId(formData[field], 'staff');
        break;
      default:
        result = validateField(field, formData[field], formData);
    }
    
    if (!result.isValid) {
      errors[field] = result.message;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Enhanced validateField function to include staff-specific fields
export const validateFieldEnhanced = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case 'name':
      return validateName(value);
    case 'email':
      return validateEmail(value);
    case 'nic':
      return validateNIC(value);
    case 'contactNo':
      return validateContactNo(value);
    case 'userType':
      return validateUserType(value);
    case 'licenseId':
      return validateLicenseId(value);
    case 'branchId':
      return validateBranchId(value, formData.userType);
    case 'vehicleId':
      return validateVehicleId(value, formData.userType);
    case 'staffId':
      return validateStaffId(value);
    case 'status':
      return validateStaffStatus(value);
    case 'adminId':
      return validateAdminId(value, formData.userType);
    default:
      return { isValid: true, message: "" };
  }
};
