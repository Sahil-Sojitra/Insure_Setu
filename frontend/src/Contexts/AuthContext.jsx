import React, { createContext, useState, useEffect } from 'react';
import {
    getCurrentSession,
    createSession,
    clearAllSessions,
    isSessionValid,
    getSessionInfo as getSessionDetails,
    USER_TYPES
} from '../utils/sessionManager.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(null); // 'user', 'agent', or 'admin'
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status on component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            setLoading(true);

            // Use session manager to get current session
            const session = getCurrentSession();

            if (session.isValid && isSessionValid()) {
                setUserData(session.userData);
                setUserType(session.userType);
                setIsAuthenticated(true);

                console.log('Valid session found:', {
                    userType: session.userType,
                    userId: session.userData.id,
                    userName: session.userData.name
                });
            } else {
                // No valid session or session expired
                if (session.error) {
                    console.error('Session validation error:', session.error);
                }

                // Clear invalid sessions
                clearAllSessions();
                setIsAuthenticated(false);
                setUserType(null);
                setUserData(null);

                console.log('No valid session found, user needs to log in');
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            // Clear potentially corrupted data
            clearAllSessions();
            setIsAuthenticated(false);
            setUserType(null);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, type) => {
        try {
            // Use session manager to create session
            const sessionResult = createSession(userData, type);

            if (sessionResult.success) {
                setUserData(sessionResult.sessionData);
                setUserType(type);
                setIsAuthenticated(true);

                console.log(`${type.toUpperCase()} login successful:`, {
                    id: sessionResult.sessionData.id,
                    name: sessionResult.sessionData.name,
                    identifier: sessionResult.sessionData.identifier,
                    sessionId: sessionResult.sessionData.sessionId
                });

                return sessionResult.sessionData;
            } else {
                throw new Error(sessionResult.error || 'Failed to create session');
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = () => {
        try {
            const currentUser = userData;
            const currentType = userType;

            // Use session manager to clear all sessions
            clearAllSessions();

            // Reset state
            setIsAuthenticated(false);
            setUserType(null);
            setUserData(null);

            // Log logout for debugging
            console.log(`${currentType?.toUpperCase()} Logout:`, {
                id: currentUser?.id,
                name: currentUser?.name || currentUser?.customer_name || currentUser?.agent_name || currentUser?.email,
                type: currentType,
                sessionId: currentUser?.sessionId
            });

            // Redirect to login page
            window.location.href = '/login';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // Add session validation function
    const validateSession = () => {
        if (!isAuthenticated || !userData || !userData.id || !isSessionValid()) {
            console.warn('Invalid or expired session detected, redirecting to login');
            logout();
            return false;
        }
        return true;
    };

    // Add function to get current user session info
    const getSessionInfo = () => {
        const sessionDetails = getSessionDetails();
        return {
            ...sessionDetails,
            contextState: {
                isAuthenticated,
                userType,
                userId: userData?.id,
                userName: userData?.name || userData?.customer_name || userData?.agent_name || userData?.email,
                userEmail: userData?.email || userData?.mobile,
                sessionValid: isAuthenticated && userData && userData.id && isSessionValid()
            }
        };
    };

    const value = {
        isAuthenticated,
        userType,
        userData,
        loading,
        login,
        logout,
        checkAuthStatus,
        validateSession,
        getSessionInfo
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;