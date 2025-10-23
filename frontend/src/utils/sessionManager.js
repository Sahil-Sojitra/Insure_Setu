// Session Management Utilities for Multi-User CRM System

/**
 * Session storage keys for different user types
 */
export const SESSION_KEYS = {
    CUSTOMER: 'customerData',
    AGENT: 'agentData',
    ADMIN: 'adminData',
    USER_TYPE: 'userType',
    SESSION_ID: 'sessionId',
    LOGIN_TIMESTAMP: 'loginTimestamp'
};

/**
 * User types constants
 */
export const USER_TYPES = {
    CUSTOMER: 'user',
    AGENT: 'agent',
    ADMIN: 'admin'
};

/**
 * Generate a unique session identifier
 */
export const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get current timestamp
 */
export const getCurrentTimestamp = () => {
    return new Date().toISOString();
};

/**
 * Validate session data structure
 */
export const validateSessionData = (userData, userType) => {
    if (!userData || typeof userData !== 'object') {
        return { valid: false, error: 'Invalid user data format' };
    }

    switch (userType) {
        case USER_TYPES.CUSTOMER:
            if (!userData.customer_id && !userData.mobile) {
                return { valid: false, error: 'Customer data must have customer_id or mobile' };
            }
            break;

        case USER_TYPES.AGENT:
            if (!userData.agent_id && !userData.id) {
                return { valid: false, error: 'Agent data must have agent_id or id' };
            }
            if (!userData.agent_name && !userData.email) {
                return { valid: false, error: 'Agent data must have name or email' };
            }
            break;

        case USER_TYPES.ADMIN:
            if (!userData.email && !userData.admin_id) {
                return { valid: false, error: 'Admin data must have email or admin_id' };
            }
            break;

        default:
            return { valid: false, error: 'Invalid user type' };
    }

    return { valid: true };
};

/**
 * Normalize user data to ensure consistent structure
 */
export const normalizeUserData = (userData, userType) => {
    const normalized = { ...userData };

    switch (userType) {
        case USER_TYPES.CUSTOMER:
            normalized.id = userData.customer_id || userData.id;
            normalized.type = USER_TYPES.CUSTOMER;
            normalized.name = userData.customer_name || userData.name;
            normalized.identifier = userData.mobile;
            break;

        case USER_TYPES.AGENT:
            normalized.id = userData.agent_id || userData.id;
            normalized.type = USER_TYPES.AGENT;
            normalized.name = userData.agent_name || userData.name;
            normalized.identifier = userData.email;
            break;

        case USER_TYPES.ADMIN:
            normalized.id = userData.admin_id || userData.id || 'admin_1';
            normalized.type = USER_TYPES.ADMIN;
            normalized.name = userData.admin_name || userData.name || 'Admin';
            normalized.identifier = userData.email;
            break;
    }

    // Add session metadata
    normalized.sessionId = generateSessionId();
    normalized.loginTime = getCurrentTimestamp();

    return normalized;
};

/**
 * Create a session for a user
 */
export const createSession = (userData, userType) => {
    try {
        // Validate input
        const validation = validateSessionData(userData, userType);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        // Normalize data
        const normalizedData = normalizeUserData(userData, userType);

        // Clear any existing sessions
        clearAllSessions();

        // Store session data
        const sessionKey = getSessionKey(userType);
        localStorage.setItem(sessionKey, JSON.stringify(normalizedData));

        // Store metadata
        if (userType !== USER_TYPES.CUSTOMER) {
            localStorage.setItem(SESSION_KEYS.USER_TYPE, userType);
        }
        localStorage.setItem(SESSION_KEYS.SESSION_ID, normalizedData.sessionId);
        localStorage.setItem(SESSION_KEYS.LOGIN_TIMESTAMP, normalizedData.loginTime);

        // Log session creation
        console.log(`Session created for ${userType}:`, {
            id: normalizedData.id,
            name: normalizedData.name,
            identifier: normalizedData.identifier,
            sessionId: normalizedData.sessionId
        });

        return {
            success: true,
            sessionData: normalizedData
        };
    } catch (error) {
        console.error('Failed to create session:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Get session key for user type
 */
const getSessionKey = (userType) => {
    switch (userType) {
        case USER_TYPES.CUSTOMER:
            return SESSION_KEYS.CUSTOMER;
        case USER_TYPES.AGENT:
            return SESSION_KEYS.AGENT;
        case USER_TYPES.ADMIN:
            return SESSION_KEYS.ADMIN;
        default:
            throw new Error('Invalid user type');
    }
};

/**
 * Get current session data
 */
export const getCurrentSession = () => {
    try {
        // Check for customer session first (highest priority for user-facing app)
        const customerData = localStorage.getItem(SESSION_KEYS.CUSTOMER);
        if (customerData) {
            const parsed = JSON.parse(customerData);
            const validation = validateSessionData(parsed, USER_TYPES.CUSTOMER);
            if (validation.valid) {
                return {
                    userData: parsed,
                    userType: USER_TYPES.CUSTOMER,
                    isValid: true
                };
            }
        }

        // Check for agent session
        const userType = localStorage.getItem(SESSION_KEYS.USER_TYPE);
        if (userType === USER_TYPES.AGENT) {
            const agentData = localStorage.getItem(SESSION_KEYS.AGENT);
            if (agentData) {
                const parsed = JSON.parse(agentData);
                const validation = validateSessionData(parsed, USER_TYPES.AGENT);
                if (validation.valid) {
                    return {
                        userData: parsed,
                        userType: USER_TYPES.AGENT,
                        isValid: true
                    };
                }
            }
        }

        // Check for admin session
        if (userType === USER_TYPES.ADMIN) {
            const adminData = localStorage.getItem(SESSION_KEYS.ADMIN);
            if (adminData) {
                const parsed = JSON.parse(adminData);
                const validation = validateSessionData(parsed, USER_TYPES.ADMIN);
                if (validation.valid) {
                    return {
                        userData: parsed,
                        userType: USER_TYPES.ADMIN,
                        isValid: true
                    };
                }
            }
        }

        return {
            userData: null,
            userType: null,
            isValid: false
        };
    } catch (error) {
        console.error('Failed to get current session:', error);
        return {
            userData: null,
            userType: null,
            isValid: false,
            error: error.message
        };
    }
};

/**
 * Clear all sessions
 */
export const clearAllSessions = () => {
    try {
        localStorage.removeItem(SESSION_KEYS.CUSTOMER);
        localStorage.removeItem(SESSION_KEYS.AGENT);
        localStorage.removeItem(SESSION_KEYS.ADMIN);
        localStorage.removeItem(SESSION_KEYS.USER_TYPE);
        localStorage.removeItem(SESSION_KEYS.SESSION_ID);
        localStorage.removeItem(SESSION_KEYS.LOGIN_TIMESTAMP);

        console.log('All sessions cleared');
        return true;
    } catch (error) {
        console.error('Failed to clear sessions:', error);
        return false;
    }
};

/**
 * Check if a session is still valid (not expired)
 */
export const isSessionValid = (maxAgeHours = 24) => {
    try {
        const currentSession = getCurrentSession();
        if (!currentSession.isValid) {
            return false;
        }

        const loginTimestamp = localStorage.getItem(SESSION_KEYS.LOGIN_TIMESTAMP);
        if (!loginTimestamp) {
            return false;
        }

        const loginTime = new Date(loginTimestamp);
        const now = new Date();
        const ageInHours = (now - loginTime) / (1000 * 60 * 60);

        return ageInHours < maxAgeHours;
    } catch (error) {
        console.error('Failed to validate session:', error);
        return false;
    }
};

/**
 * Get session information for debugging
 */
export const getSessionInfo = () => {
    const session = getCurrentSession();
    const sessionId = localStorage.getItem(SESSION_KEYS.SESSION_ID);
    const loginTime = localStorage.getItem(SESSION_KEYS.LOGIN_TIMESTAMP);

    return {
        ...session,
        sessionId,
        loginTime,
        isExpired: !isSessionValid(),
        browserInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled
        }
    };
};

/**
 * Switch between user types (for testing/debugging)
 */
export const switchUserType = (newUserType) => {
    const currentSession = getCurrentSession();

    if (currentSession.isValid && currentSession.userType === newUserType) {
        console.log(`Already logged in as ${newUserType}`);
        return currentSession;
    }

    console.log(`Switching from ${currentSession.userType || 'none'} to ${newUserType}`);
    // This would typically require re-authentication
    return getCurrentSession();
};