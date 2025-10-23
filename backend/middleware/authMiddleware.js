import { createError } from '../utils/error.js';
import { query } from '../utils/connectToDB.js';

// Middleware to validate agent authentication and ensure data isolation
export const validateAgentAccess = async (req, res, next) => {
    try {
        const { id } = req.params; // Agent ID from URL params
        const authHeader = req.headers.authorization;

        // Basic validation
        if (!id || isNaN(id)) {
            return next(createError(400, 'Valid agent ID is required'));
        }

        // In a production environment, you would validate the JWT token here
        // For now, we'll just verify the agent exists
        const agentQuery = `SELECT agent_id, agent_name, email, mobile FROM agents WHERE agent_id = $1`;
        const agentResult = await query(agentQuery, [id]);

        if (agentResult.rows.length === 0) {
            return next(createError(404, 'Agent not found'));
        }

        // Add agent info to request for use in controllers
        req.agent = agentResult.rows[0];
        req.agentId = id;

        console.log(`Agent access validated: ${req.agent.agent_name} (ID: ${id})`);
        next();
    } catch (error) {
        console.error('Agent validation error:', error);
        next(createError(500, 'Authentication validation failed'));
    }
};

// Middleware to validate customer access and ensure data isolation
export const validateCustomerAccess = async (req, res, next) => {
    try {
        const customerId = req.params.id || req.body.customer_id || req.query.customer_id;

        if (!customerId) {
            return next(createError(400, 'Customer ID is required'));
        }

        // Verify customer exists - check both id (primary key) and customer_id fields
        let customerQuery;
        let queryParam = customerId;

        // If the customerId is numeric, it's likely the primary key 'id'
        if (!isNaN(customerId)) {
            customerQuery = `SELECT id, customer_id, customer_name, mobile FROM customer_details WHERE id = $1`;
        } else {
            // If it's not numeric, it's the custom customer_id field
            customerQuery = `SELECT id, customer_id, customer_name, mobile FROM customer_details WHERE customer_id = $1`;
        }

        const customerResult = await query(customerQuery, [queryParam]);

        if (customerResult.rows.length === 0) {
            return next(createError(404, 'Customer not found'));
        }

        // Add customer info to request
        req.customer = customerResult.rows[0];
        req.customerId = customerId;
        req.customerDbId = customerResult.rows[0].id; // Store the database ID for use in other queries

        console.log(`Customer access validated: ${req.customer.customer_name} (ID: ${customerId}, DB ID: ${req.customerDbId})`);
        next();
    } catch (error) {
        console.error('Customer validation error:', error);
        next(createError(500, 'Customer validation failed'));
    }
};

// Middleware to ensure admin access
export const validateAdminAccess = (req, res, next) => {
    try {
        // In production, validate admin JWT token here
        // For now, we'll assume admin access is granted
        req.isAdmin = true;
        console.log('Admin access validated');
        next();
    } catch (error) {
        console.error('Admin validation error:', error);
        next(createError(500, 'Admin validation failed'));
    }
};

// Middleware to log user sessions for debugging
export const sessionLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';

    console.log(`[${timestamp}] Session: ${req.method} ${req.path} | IP: ${ip} | UserAgent: ${userAgent.substring(0, 50)}...`);

    next();
};

// Middleware to ensure data isolation for multi-user scenarios
export const ensureDataIsolation = (userType) => {
    return (req, res, next) => {
        try {
            switch (userType) {
                case 'agent':
                    // Ensure agent can only access their own data
                    if (req.agentId) {
                        req.dataFilter = { agent_id: req.agentId };
                        console.log(`Data isolation applied for agent: ${req.agentId}`);
                    }
                    break;

                case 'customer':
                    // Ensure customer can only access their own data
                    if (req.customerDbId) {
                        req.dataFilter = { id: req.customerDbId };
                        console.log(`Data isolation applied for customer: ${req.customerId} (DB ID: ${req.customerDbId})`);
                    } else if (req.customerId) {
                        req.dataFilter = { customer_id: req.customerId };
                        console.log(`Data isolation applied for customer: ${req.customerId}`);
                    }
                    break;

                case 'admin':
                    // Admin can access all data
                    req.dataFilter = {};
                    console.log('Admin access - no data isolation applied');
                    break;

                default:
                    return next(createError(400, 'Invalid user type for data isolation'));
            }

            next();
        } catch (error) {
            console.error('Data isolation error:', error);
            next(createError(500, 'Data isolation failed'));
        }
    };
};

// Rate limiting middleware for login attempts
const loginAttempts = new Map();

export const rateLimitLogin = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const identifier = req.ip + ':' + (req.body.mobile || req.body.email || 'unknown');
        const now = Date.now();

        if (!loginAttempts.has(identifier)) {
            loginAttempts.set(identifier, { attempts: 1, resetTime: now + windowMs });
        } else {
            const record = loginAttempts.get(identifier);

            if (now > record.resetTime) {
                // Reset the window
                record.attempts = 1;
                record.resetTime = now + windowMs;
            } else if (record.attempts >= maxAttempts) {
                return res.status(429).json({
                    message: 'Too many login attempts. Please try again later.',
                    retryAfter: Math.ceil((record.resetTime - now) / 1000)
                });
            } else {
                record.attempts++;
            }
        }

        next();
    };
};