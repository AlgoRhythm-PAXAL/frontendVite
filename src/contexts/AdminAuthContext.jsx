import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'sonner';

// Create the admin auth context
const AdminAuthContext = createContext();

// Admin auth provider component
export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Refs for timers
    const inactivityTimer = useRef(null);
    const tokenRefreshTimer = useRef(null);
    
    // Configuration
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
    const TOKEN_REFRESH_BUFFER = 2 * 60 * 1000; // 2 minutes before expiry

    // Clear all timers
    const clearTimers = useCallback(() => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
            inactivityTimer.current = null;
        }
        if (tokenRefreshTimer.current) {
            clearTimeout(tokenRefreshTimer.current);
            tokenRefreshTimer.current = null;
        }
    }, []);

    // Logout function (defined early to avoid circular dependencies)
    const logout = useCallback(async (message = "Logged out successfully") => {
        try {
            setLoading(true);
            clearTimers();
            
            // Call logout endpoint
            await axios.post(`${backendURL}/api/admin/auth/logout`, {}, {
                withCredentials: true,
                timeout: 5000
            });
        } catch (error) {
            console.error('Logout API error:', error);
            // Continue with logout even if API call fails
        } finally {
            // Clear authentication state
            setAdmin(null);
            setIsAuthenticated(false);
            setLoading(false);
            
            if (message) {
                toast.info(message);
            }
        }
    }, [backendURL, clearTimers]);

    // Reset inactivity timer
    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
        }
        
        if (isAuthenticated) {
            inactivityTimer.current = setTimeout(() => {
                console.log("Admin inactivity timeout reached");
                logout("You have been logged out due to inactivity");
            }, INACTIVITY_TIMEOUT);
        }
    }, [isAuthenticated, INACTIVITY_TIMEOUT, logout]);

    // Refresh access token
    const refreshToken = useCallback(async () => {
        try {
            const response = await axios.post(
                `${backendURL}/api/admin/auth/refresh`,
                {},
                { withCredentials: true, timeout: 8000 }
            );
            
            console.log("Token refreshed successfully");
            return response.data.expiresAt;
        } catch (error) {
            console.error("Token refresh failed:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout("Your session has expired. Please log in again.");
            }
            return null;
        }
    }, [backendURL, logout]);

    // Schedule token refresh
    const scheduleTokenRefresh = useCallback((expiresAt) => {
        if (tokenRefreshTimer.current) {
            clearTimeout(tokenRefreshTimer.current);
        }

        if (!expiresAt) return;

        const timeUntilRefresh = expiresAt - Date.now() - TOKEN_REFRESH_BUFFER;
        
        if (timeUntilRefresh > 0) {
            tokenRefreshTimer.current = setTimeout(async () => {
                console.log("Attempting token refresh");
                const newExpiresAt = await refreshToken();
                if (newExpiresAt) {
                    scheduleTokenRefresh(newExpiresAt);
                }
            }, timeUntilRefresh);
        }
    }, [TOKEN_REFRESH_BUFFER, refreshToken]);

    // Get current admin from backend
    const getCurrentAdmin = useCallback(async () => {
        try {
            const response = await axios.get(`${backendURL}/api/admin/auth/status`, {
                withCredentials: true,
                timeout: 8000
            });

            if (response.data.isAuthenticated) {
                setAdmin(response.data.user);
                setIsAuthenticated(true);
                
                // Schedule token refresh and reset inactivity timer
                scheduleTokenRefresh(response.data.expiresAt);
                resetInactivityTimer();
                
                return response.data.user;
            } else {
                setAdmin(null);
                setIsAuthenticated(false);
                return null;
            }
        } catch (error) {
            console.error('Error getting current admin:', error);
            setAdmin(null);
            setIsAuthenticated(false);
            return null;
        }
    }, [backendURL, scheduleTokenRefresh, resetInactivityTimer]);

    // Login function
    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);
            
            const response = await axios.post(
                `${backendURL}/api/admin/auth/login`,
                credentials,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000
                }
            );

            if (response.data && response.data.admin) {
                const adminData = response.data.admin;
                
                setAdmin(adminData);
                setIsAuthenticated(true);
                
                // Schedule token refresh and reset inactivity timer
                scheduleTokenRefresh(response.data.expiresAt);
                resetInactivityTimer();
                
                toast.success("Login Successful", {
                    description: `Welcome back, ${adminData.name}`,
                    duration: 2000
                });

                return { 
                    success: true, 
                    admin: adminData,
                    message: response.data.message 
                };
            } else {
                return { 
                    success: false, 
                    message: 'Invalid response from server' 
                };
            }
        } catch (error) {
            console.error('Admin login error:', error);
            
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Login failed. Please check your credentials.';
            
            toast.error("Authentication Error", {
                description: errorMessage,
                duration: 4000
            });
            
            return { 
                success: false, 
                message: errorMessage 
            };
        } finally {
            setLoading(false);
        }
    }, [backendURL, scheduleTokenRefresh, resetInactivityTimer]);

    // Activity handler for user interactions
    const handleActivity = useCallback(() => {
        if (isAuthenticated) {
            resetInactivityTimer();
        }
    }, [isAuthenticated, resetInactivityTimer]);

    // Authenticated fetch helper
    const authenticatedFetch = useCallback(async (url, options = {}) => {
        const defaultOptions = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (response.status === 401) {
                // Token expired, try to refresh
                const newExpiresAt = await refreshToken();
                if (newExpiresAt) {
                    // Retry original request
                    return await fetch(url, { ...defaultOptions, ...options });
                } else {
                    logout("Your session has expired. Please log in again.");
                    throw new Error('Authentication failed');
                }
            }
            
            return response;
        } catch (error) {
            console.error('Authenticated fetch error:', error);
            throw error;
        }
    }, [refreshToken, logout]);

    // Initialize authentication state on mount
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            try {
                await getCurrentAdmin();
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };

        if (!isInitialized) {
            initializeAuth();
        }
    }, [getCurrentAdmin, isInitialized]);

    // Add activity listeners
    useEffect(() => {
        if (isAuthenticated) {
            const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
            
            events.forEach(event => {
                document.addEventListener(event, handleActivity, true);
            });

            return () => {
                events.forEach(event => {
                    document.removeEventListener(event, handleActivity, true);
                });
            };
        }
    }, [isAuthenticated, handleActivity]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            clearTimers();
        };
    }, [clearTimers]);

    // Context value
    const value = {
        admin,
        isAuthenticated,
        loading,
        login,
        logout,
        getCurrentAdmin,
        handleActivity,
        authenticatedFetch,
        refreshToken
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

// Prop types validation
AdminAuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AdminAuthContext;
