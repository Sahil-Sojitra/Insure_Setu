import express from 'express';
import {
    getAllAgents,
    addAgent,
    getAgentById,
    updateAgent,
    deleteAgent,
    getAgentCustomers,
    getAgentDashboard
} from '../controllers/agentController.js';
import {
    sendAgentOTP,
    verifyAgentOTP,
    getAgentProfile
} from '../controllers/agentAuthController.js';
import {
    validateAgentAccess,
    validateAdminAccess,
    sessionLogger,
    ensureDataIsolation,
    rateLimitLogin
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply session logging to all routes
router.use(sessionLogger);

// Agent CRUD routes (admin access required)
router.get('/', validateAdminAccess, getAllAgents);
router.post('/', validateAdminAccess, addAgent);
router.get('/:id', validateAgentAccess, getAgentById);
router.put('/:id', validateAdminAccess, updateAgent);
router.delete('/:id', validateAdminAccess, deleteAgent);

// Agent-specific customer routes (with data isolation)
router.get('/:id/customers',
    validateAgentAccess,
    ensureDataIsolation('agent'),
    getAgentCustomers
);
router.get('/:id/dashboard',
    validateAgentAccess,
    ensureDataIsolation('agent'),
    getAgentDashboard
);

// Agent authentication routes (with rate limiting)
router.post('/auth/send-otp', rateLimitLogin(), sendAgentOTP);
router.post('/auth/verify-otp', rateLimitLogin(), verifyAgentOTP);
router.get('/auth/profile/:agent_id', validateAgentAccess, getAgentProfile);

export default router;