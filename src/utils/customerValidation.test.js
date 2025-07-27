import { validateCustomerForm, validateAllCustomerFields, validateField } from './customerValidation.js';

// Test cases for validation
const testCases = {
  validData: {
    fName: 'John',
    lName: 'Doe',
    email: 'john.doe@example.com',
    contact: '0771234567',
    nic: '200123456789',
    address: '123 Main Street',
    city: 'Colombo',
    district: 'Colombo',
    province: 'Western'
  },
  invalidData: {
    fName: '',
    lName: '123',
    email: 'invalid-email',
    contact: '123',
    nic: 'invalid-nic',
    address: 'a'.repeat(256),
    city: '123',
    district: '123',
    province: '123'
  }
};

// Test individual field validations
console.log('=== Individual Field Validation Tests ===');

Object.keys(testCases.validData).forEach(field => {
  const validResult = validateField(field, testCases.validData[field]);
  console.log(`${field} (valid):`, validResult);
});

console.log('\n=== Invalid Field Tests ===');
Object.keys(testCases.invalidData).forEach(field => {
  const invalidResult = validateField(field, testCases.invalidData[field]);
  console.log(`${field} (invalid):`, invalidResult);
});

// Test complete form validation
console.log('\n=== Complete Form Validation Tests ===');

const validFormResult = validateAllCustomerFields(testCases.validData);
console.log('Valid form:', validFormResult);

const invalidFormResult = validateAllCustomerFields(testCases.invalidData);
console.log('Invalid form:', invalidFormResult);

// Test edge cases
console.log('\n=== Edge Case Tests ===');

// Test Sri Lankan NIC formats
const nicTests = [
  '123456789V', // Old format
  '123456789X', // Old format with X
  '200123456789', // New format
  'invalid', // Invalid
  '12345678', // Too short
  '1234567890123' // Too long
];

nicTests.forEach(nic => {
  const result = validateField('nic', nic);
  console.log(`NIC "${nic}":`, result);
});

// Test contact number formats
const contactTests = [
  '0771234567', // Sri Lankan mobile
  '+94771234567', // International format
  '011-1234567', // Invalid format (should be landline format)
  '123', // Too short
  '12345678901234567890' // Too long
];

contactTests.forEach(contact => {
  const result = validateField('contact', contact);
  console.log(`Contact "${contact}":`, result);
});

export { testCases };
