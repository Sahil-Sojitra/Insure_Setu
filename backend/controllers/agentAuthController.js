import { query } from '../utils/connectToDB.js';
import {
    getAgentAuthByMobileQuery,
    updateAgentOTPQuery,
    verifyAgentLoginQuery
} from '../utils/sqlQuery.js';
import { createError } from '../utils/error.js';
import crypto from 'crypto';

// Generate and send OTP for agent login
export async function sendAgentOTP(req, res, next) {
    try {
        const { mobile } = req.body;

        if (!mobile) {
            return next(createError(400, 'Mobile number is required'));
        }

        // Mobile validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            return next(createError(400, 'Invalid mobile number. Must be 10 digits starting with 6-9'));
        }

        // Check if agent exists with this mobile
        const agentAuth = await query(getAgentAuthByMobileQuery, [mobile]);
        if (agentAuth.rows.length === 0) {
            return next(createError(404, 'No agent found with this mobile number'));
        }

        // Generate OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP for security
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

        // Set OTP expiry (5 minutes from now)
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        // Update OTP in database
        await query(updateAgentOTPQuery, [otpHash, otpExpiry, agentAuth.rows[0].agent_id]);

        // In production, send OTP via SMS service
        // For demo, we'll return the OTP (remove this in production)
        console.log(`Agent OTP for ${mobile}: ${otp}`);

        res.status(200).json({
            message: 'OTP sent successfully',
            mobile: mobile,
            // Remove this in production
            otp: otp // For demo purposes only
        });
    } catch (error) {
        console.error('Error in sendAgentOTP:', error);
        next(createError(500, 'Failed to send OTP'));
    }
}

// Verify OTP and login agent
export async function verifyAgentOTP(req, res, next) {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !otp) {
            return next(createError(400, 'Mobile number and OTP are required'));
        }

        // Mobile validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            return next(createError(400, 'Invalid mobile number'));
        }

        // OTP validation
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            return next(createError(400, 'OTP must be 6 digits'));
        }

        // Get agent with auth details
        const agentData = await query(verifyAgentLoginQuery, [mobile]);
        if (agentData.rows.length === 0) {
            return next(createError(404, 'Agent not found'));
        }

        const agent = agentData.rows[0];

        // Check if OTP exists and is not expired
        if (!agent.otp_hash || !agent.otp_expiry) {
            return next(createError(400, 'No OTP found. Please request a new OTP'));
        }

        if (new Date() > new Date(agent.otp_expiry)) {
            return next(createError(400, 'OTP has expired. Please request a new OTP'));
        }

        // Verify OTP
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (otpHash !== agent.otp_hash) {
            return next(createError(400, 'Invalid OTP'));
        }

        // Clear OTP after successful verification
        await query(updateAgentOTPQuery, [null, null, agent.agent_id]);

        // Return agent profile
        const agentProfile = {
            agent_id: agent.agent_id,
            agent_name: agent.agent_name,
            email: agent.email,
            mobile: agent.mobile
        };

        res.status(200).json({
            message: 'Login successful',
            agent: agentProfile,
            token: `agent_${agent.agent_id}_${Date.now()}` // Simple token for demo
        });
    } catch (error) {
        console.error('Error in verifyAgentOTP:', error);
        next(createError(500, 'Failed to verify OTP'));
    }
}

// Get agent profile (for authenticated routes)
export async function getAgentProfile(req, res, next) {
    try {
        const { agent_id } = req.params;

        if (!agent_id || isNaN(agent_id)) {
            return next(createError(400, 'Valid agent ID is required'));
        }

        const agentData = await query(verifyAgentLoginQuery, []);
        // Alternative: get agent by ID directly
        const agentQuery = `
            SELECT agent_id, agent_name, email, mobile, created_at 
            FROM agents WHERE agent_id = $1
        `;
        const result = await query(agentQuery, [agent_id]);

        if (result.rows.length === 0) {
            return next(createError(404, 'Agent not found'));
        }

        res.status(200).json({
            message: 'Agent profile retrieved successfully',
            agent: result.rows[0]
        });
    } catch (error) {
        console.error('Error in getAgentProfile:', error);
        next(createError(500, 'Failed to retrieve agent profile'));
    }
}