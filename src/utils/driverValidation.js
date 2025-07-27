// Driver validation utilities for frontend
export const validateField = (field, value) => {
  if (!value || value.trim() === '') {
    return null; // Don't show error for empty fields, let them be optional for updates
  }

  const trimmedValue = value.trim();

  switch (field) {
    case 'name': {
      if (trimmedValue.length < 2) {
        return 'Name must be at least 2 characters long';
      }
      if (trimmedValue.length > 100) {
        return 'Name must not exceed 100 characters';
      }
      if (!/^[a-zA-Z\s.'-]+$/.test(trimmedValue)) {
        return 'Name can only contain letters, spaces, periods, apostrophes, and hyphens';
      }
      return null;
    }

    case 'email': {
      if (trimmedValue.length < 5) {
        return 'Email must be at least 5 characters long';
      }
      if (trimmedValue.length > 100) {
        return 'Email must not exceed 100 characters';
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(trimmedValue)) {
        return 'Invalid email format';
      }
      const validDomains = /\.(com|org|net|edu|gov|co\.uk|ac\.uk|in|lk|io|dev|tech|info|biz)$/i;
      if (!validDomains.test(trimmedValue)) {
        return 'Please enter a valid email address with a proper domain (e.g., .com, .org, .net)';
      }
      return null;
    }

    case 'contactNo': {
      // Clean the contact number
      const cleanContact = trimmedValue.replace(/[\s\-()]/g, '');
      if (cleanContact.length < 10) {
        return 'Contact number must be at least 10 digits';
      }
      if (cleanContact.length > 15) {
        return 'Contact number must not exceed 15 digits';
      }
      const sriLankanMobile = /^(07[0-9]{8}|947[0-9]{8}|\+947[0-9]{8})$/;
      const generalMobile = /^[0-9]{10,15}$/;
      if (!sriLankanMobile.test(cleanContact) && !generalMobile.test(cleanContact)) {
        return 'Invalid contact number format. Use Sri Lankan format (07XXXXXXXX) or international format';
      }
      return null;
    }

    case 'nic': {
      const upperNic = trimmedValue.toUpperCase();
      const oldFormat = /^[0-9]{9}[VX]$/;
      const newFormat = /^[0-9]{12}$/;
      
      if (!oldFormat.test(upperNic) && !newFormat.test(upperNic)) {
        return 'Invalid NIC format. Use old format (123456789V) or new format (200203601188)';
      }
      
      if (upperNic.length !== 10 && upperNic.length !== 12) {
        return 'NIC must be exactly 10 characters (old format) or 12 characters (new format)';
      }

      // Additional NIC validation logic
      if (upperNic.length === 12) {
        const year = parseInt(upperNic.substring(0, 4));
        const dayOfYear = parseInt(upperNic.substring(4, 7));
        
        if (year < 1900 || year > new Date().getFullYear()) {
          return 'Invalid birth year in NIC';
        }
        
        if (!((dayOfYear >= 1 && dayOfYear <= 366) || (dayOfYear >= 501 && dayOfYear <= 866))) {
          return 'Invalid day of year in NIC';
        }
      } else if (upperNic.length === 10) {
        const dayOfYear = parseInt(upperNic.substring(2, 5));
        if (!((dayOfYear >= 1 && dayOfYear <= 366) || (dayOfYear >= 501 && dayOfYear <= 866))) {
          return 'Invalid day of year in NIC';
        }
      }
      return null;
    }

    case 'licenseId': {
      if (trimmedValue.length < 5) {
        return 'License ID must be at least 5 characters long';
      }
      if (trimmedValue.length > 20) {
        return 'License ID must not exceed 20 characters';
      }
      // Sri Lankan license format: typically alphanumeric
      const licensePattern = /^[A-Z0-9\-/]+$/i;
      if (!licensePattern.test(trimmedValue)) {
        return 'License ID can only contain letters, numbers, hyphens, and forward slashes';
      }
      return null;
    }

    default:
      return null;
  }
};

export const validateAllDriverFields = (driverData) => {
  const errors = {};
  
  // Only validate fields that have values (for update operations)
  Object.keys(driverData).forEach(field => {
    if (driverData[field] && driverData[field].trim() !== '') {
      const error = validateField(field, driverData[field]);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};

export const formatDriverContact = (contact) => {
  if (!contact) return '';
  // Remove all non-digit characters except +
  const cleaned = contact.replace(/[^\d+]/g, '');
  
  // Format Sri Lankan numbers
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  if (cleaned.startsWith('+947') && cleaned.length === 13) {
    return cleaned.replace(/(\+94)(\d{1})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  }
  
  return cleaned;
};

export const formatDriverName = (name) => {
  if (!name) return '';
  return name.trim().replace(/\s+/g, ' ');
};

export const formatDriverEmail = (email) => {
  if (!email) return '';
  return email.toLowerCase().trim();
};

export const formatDriverNIC = (nic) => {
  if (!nic) return '';
  return nic.trim().toUpperCase();
};

export const formatDriverLicenseId = (licenseId) => {
  if (!licenseId) return '';
  return licenseId.trim().toUpperCase();
};
