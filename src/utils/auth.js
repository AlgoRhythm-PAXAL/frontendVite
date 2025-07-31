/**
 * Utility functions for authentication and localStorage management
 */

/**
 * Gets the userCenter from localStorage and validates it
 * Returns null if userCenter is invalid or missing
 */
export const getUserCenter = () => {
    const userCenter = localStorage.getItem('userCenter');
    
    // Check if userCenter is valid
    if (!userCenter || userCenter === '[object Object]' || userCenter === 'null' || userCenter === 'undefined') {
        return null;
    }
    
    return userCenter;
};

/**
 * Clears all staff-related authentication data from localStorage
 */
export const clearAuthData = () => {
    localStorage.removeItem('userCenter');
    localStorage.removeItem('staffId');
    localStorage.removeItem('staffName');
    localStorage.removeItem('token');
    console.log('Authentication data cleared from localStorage');
};

/**
 * Checks if the current authentication data is valid
 * Returns true if valid, false otherwise
 */
export const isAuthDataValid = () => {
    const userCenter = getUserCenter();
    const staffId = localStorage.getItem('staffId');
    const staffName = localStorage.getItem('staffName');
    
    return !!(userCenter && staffId && staffName);
};

/**
 * Gets staff information from localStorage
 * Returns null if any required field is missing or invalid
 */
export const getStaffInfo = () => {
    const userCenter = getUserCenter();
    const staffId = localStorage.getItem('staffId');
    const staffName = localStorage.getItem('staffName');
    
    if (!userCenter || !staffId || !staffName) {
        return null;
    }
    
    return {
        userCenter,
        staffId,
        staffName
    };
};
