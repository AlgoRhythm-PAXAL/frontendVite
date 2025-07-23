import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';

/* eslint-disable react-refresh/only-export-components */

export const StaffAuthContext = createContext();

export const StaffAuthProvider = ({ children }) => {
    const [staff, setStaff] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Function to get current staff information from backend
    const getCurrentStaff = async () => {
        try {
            const response = await fetch('http://localhost:8000/staff/status', {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStaff(data.user);
                setIsAuthenticated(true);
                return data.user;
            } else if (response.status === 401) {
                // Not authenticated
                setStaff(null);
                setIsAuthenticated(false);
            } else {
                throw new Error('Failed to get staff status');
            }
        } catch (error) {
            console.error('Error getting current staff:', error);
            setStaff(null);
            setIsAuthenticated(false);
        }
    };

    // Login function
    const login = async (credentials) => {
        try {
            const response = await fetch('http://localhost:8000/staff/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                setStaff(data.staff);
                setIsAuthenticated(true);
                return { success: true, staff: data.staff };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await fetch('http://localhost:8000/staff/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setStaff(null);
            setIsAuthenticated(false);
        }
    };

    // Get auth headers for API requests
    const getAuthHeaders = () => {
        return {
            'Content-Type': 'application/json'
        };
    };

    // Make authenticated API calls
    const authenticatedFetch = async (url, options = {}) => {
        const defaultOptions = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (response.status === 401) {
            // Token expired or invalid, redirect to login
            setIsAuthenticated(false);
            setStaff(null);
            // You might want to redirect to login page here
        }

        return response;
    };

    // Check authentication status on component mount
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            await getCurrentStaff();
            setLoading(false);
        };

        checkAuth();
    }, []);

    const value = {
        staff,
        isAuthenticated,
        loading,
        login,
        logout,
        getCurrentStaff,
        getAuthHeaders,
        authenticatedFetch
    };

    return (
        <StaffAuthContext.Provider value={value}>
            {children}
        </StaffAuthContext.Provider>
    );
};

// Add prop types validation
StaffAuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

// Custom hook to use staff auth context
export const useStaffAuth = () => {
    const context = useContext(StaffAuthContext);
    if (!context) {
        throw new Error('useStaffAuth must be used within a StaffAuthProvider');
    }
    return context;
};
