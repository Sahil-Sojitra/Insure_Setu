import { query } from '../utils/connectToDB.js';
import {
    createAgentTableQuery,
    addAgentQuery,
    getAgentByEmailQuery,
    getAgentByIdQuery,
    getAllAgentsQuery,
    deleteAgentByIdQuery,
    updateAgentByIdQuery,
    createAgentAuthTableQuery,
    addAgentAuthQuery,
    getAgentAuthByMobileQuery,
    verifyAgentLoginQuery,
    getCustomersByAgentIdQuery,
    getCustomerCountByAgentIdQuery,
    addAgentIdToExistingCustomersQuery,
    addAgentForeignKeyQuery
} from '../utils/sqlQuery.js';
import { createError } from '../utils/error.js';

// Helper function to ensure agent and agent_auth tables exist
async function ensureAgentTablesExist() {
    // Check if agent table exists
    const agentResponse = await query(`SELECT to_regclass('agents');`);
    if (!agentResponse.rows[0].to_regclass) {
        await query(createAgentTableQuery);
        console.log('Agent table created');
    }

    // Check if agent_auth table exists
    const authResponse = await query(`SELECT to_regclass('agent_auth');`);
    if (!authResponse.rows[0].to_regclass) {
        await query(createAgentAuthTableQuery);
        console.log('Agent auth table created');
    }

    // Add agent_id column to existing customer_details table if not exists
    try {
        await query(addAgentIdToExistingCustomersQuery);
        await query(addAgentForeignKeyQuery);
        console.log('Customer table updated with agent_id column');
    } catch (error) {
        console.log('Customer table already has agent_id column or other issue:', error.message);
    }
}

// Get all agents
export async function getAllAgents(req, res, next) {
    try {
        await ensureAgentTablesExist();

        const data = await query(getAllAgentsQuery);

        // Get customer count for each agent
        const agentsWithStats = await Promise.all(
            data.rows.map(async (agent) => {
                const customerCount = await query(getCustomerCountByAgentIdQuery, [agent.agent_id]);
                return {
                    ...agent,
                    customer_count: parseInt(customerCount.rows[0].customer_count)
                };
            })
        );

        res.status(200).json({
            message: 'Agents retrieved successfully',
            data: agentsWithStats
        });
    } catch (error) {
        console.error('Error in getAllAgents:', error);
        next(createError(500, 'Failed to retrieve agents'));
    }
}

// Add new agent
export async function addAgent(req, res, next) {
    try {
        const { agent_name, email, mobile } = req.body;

        // Validation
        if (!agent_name || !email || !mobile) {
            return next(createError(400, 'Agent name, email, and mobile are required'));
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(createError(400, 'Invalid email format'));
        }

        // Mobile validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            return next(createError(400, 'Invalid mobile number. Must be 10 digits starting with 6-9'));
        }

        await ensureAgentTablesExist();

        // Check if agent already exists
        const existingAgent = await query(getAgentByEmailQuery, [email]);
        if (existingAgent.rows.length > 0) {
            return next(createError(409, 'Agent with this email already exists'));
        }

        // Check if mobile already exists
        const existingMobile = await query(getAgentAuthByMobileQuery, [mobile]);
        if (existingMobile.rows.length > 0) {
            return next(createError(409, 'Agent with this mobile number already exists'));
        }

        // Add agent
        const agentData = await query(addAgentQuery, [agent_name, email, mobile]);
        const newAgent = agentData.rows[0];

        // Automatically create agent auth record
        try {
            await query(addAgentAuthQuery, [
                newAgent.agent_id,
                mobile
            ]);
            console.log(`Agent auth record created for agent ID: ${newAgent.agent_id}`);
        } catch (authError) {
            console.error('Error creating agent auth record:', authError);
            // Continue even if auth record creation fails
        }

        res.status(201).json({
            message: 'Agent added successfully',
            data: newAgent
        });
    } catch (error) {
        console.error('Error in addAgent:', error);
        next(createError(500, 'Failed to add agent'));
    }
}

// Get agent by ID
export async function getAgentById(req, res, next) {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return next(createError(400, 'Valid agent ID is required'));
        }

        await ensureAgentTablesExist();

        const data = await query(getAgentByIdQuery, [id]);

        if (data.rows.length === 0) {
            return next(createError(404, 'Agent not found'));
        }

        // Get customer count for this agent
        const customerCount = await query(getCustomerCountByAgentIdQuery, [id]);
        const agent = {
            ...data.rows[0],
            customer_count: parseInt(customerCount.rows[0].customer_count)
        };

        res.status(200).json({
            message: 'Agent retrieved successfully',
            data: agent
        });
    } catch (error) {
        console.error('Error in getAgentById:', error);
        next(createError(500, 'Failed to retrieve agent'));
    }
}

// Update agent
export async function updateAgent(req, res, next) {
    try {
        const { id } = req.params;
        const { agent_name, email, mobile } = req.body;

        if (!id || isNaN(id)) {
            return next(createError(400, 'Valid agent ID is required'));
        }

        if (!agent_name || !email || !mobile) {
            return next(createError(400, 'Agent name, email, and mobile are required'));
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(createError(400, 'Invalid email format'));
        }

        // Mobile validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            return next(createError(400, 'Invalid mobile number. Must be 10 digits starting with 6-9'));
        }

        await ensureAgentTablesExist();

        // Check if agent exists
        const existingAgent = await query(getAgentByIdQuery, [id]);
        if (existingAgent.rows.length === 0) {
            return next(createError(404, 'Agent not found'));
        }

        // Check if email already exists for another agent
        const emailCheck = await query(getAgentByEmailQuery, [email]);
        if (emailCheck.rows.length > 0 && emailCheck.rows[0].agent_id != id) {
            return next(createError(409, 'Agent with this email already exists'));
        }

        // Update agent
        const data = await query(updateAgentByIdQuery, [agent_name, email, mobile, id]);

        // Update agent auth mobile if changed
        try {
            await query(`UPDATE agent_auth SET mobile = $1 WHERE agent_id = $2`, [mobile, id]);
            console.log(`Agent auth mobile updated for agent ID: ${id}`);
        } catch (authError) {
            console.error('Error updating agent auth mobile:', authError);
        }

        res.status(200).json({
            message: 'Agent updated successfully',
            data: data.rows[0]
        });
    } catch (error) {
        console.error('Error in updateAgent:', error);
        next(createError(500, 'Failed to update agent'));
    }
}

// Delete agent
export async function deleteAgent(req, res, next) {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return next(createError(400, 'Valid agent ID is required'));
        }

        await ensureAgentTablesExist();

        // Check if agent exists
        const existingAgent = await query(getAgentByIdQuery, [id]);
        if (existingAgent.rows.length === 0) {
            return next(createError(404, 'Agent not found'));
        }

        // Check if agent has customers
        const customerCount = await query(getCustomerCountByAgentIdQuery, [id]);
        if (parseInt(customerCount.rows[0].customer_count) > 0) {
            return next(createError(409, 'Cannot delete agent with existing customers. Please reassign customers first.'));
        }

        // Delete agent (auth will be deleted automatically due to CASCADE)
        const data = await query(deleteAgentByIdQuery, [id]);

        res.status(200).json({
            message: 'Agent deleted successfully',
            data: data.rows[0]
        });
    } catch (error) {
        console.error('Error in deleteAgent:', error);
        next(createError(500, 'Failed to delete agent'));
    }
}

// Get customers for a specific agent
export async function getAgentCustomers(req, res, next) {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return next(createError(400, 'Valid agent ID is required'));
        }

        await ensureAgentTablesExist();

        // Check if agent exists
        const existingAgent = await query(getAgentByIdQuery, [id]);
        if (existingAgent.rows.length === 0) {
            return next(createError(404, 'Agent not found'));
        }

        // Get customers for this agent
        const data = await query(getCustomersByAgentIdQuery, [id]);

        res.status(200).json({
            message: 'Agent customers retrieved successfully',
            data: data.rows,
            agent: existingAgent.rows[0]
        });
    } catch (error) {
        console.error('Error in getAgentCustomers:', error);
        next(createError(500, 'Failed to retrieve agent customers'));
    }
}

// Get agent dashboard stats
export async function getAgentDashboard(req, res, next) {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return next(createError(400, 'Valid agent ID is required'));
        }

        await ensureAgentTablesExist();

        // Check if agent exists
        const agentData = await query(getAgentByIdQuery, [id]);
        if (agentData.rows.length === 0) {
            return next(createError(404, 'Agent not found'));
        }

        const agent = agentData.rows[0];

        // Get comprehensive dashboard statistics
        const totalCustomers = await query(getCustomerCountByAgentIdQuery, [id]);

        const activePolicies = await query(
            `SELECT COUNT(*) as active_count FROM customer_details 
             WHERE agent_id = $1 AND insurance_end_date > CURRENT_DATE`,
            [id]
        );

        const expiringPolicies = await query(
            `SELECT COUNT(*) as expiring_count FROM customer_details 
             WHERE agent_id = $1 AND insurance_end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'`,
            [id]
        );

        const expiredPolicies = await query(
            `SELECT COUNT(*) as expired_count FROM customer_details 
             WHERE agent_id = $1 AND insurance_end_date <= CURRENT_DATE`,
            [id]
        );

        const totalPremium = await query(
            `SELECT COALESCE(SUM(CAST(final_premium AS DECIMAL)), 0) as total_premium 
             FROM customer_details 
             WHERE agent_id = $1 AND final_premium IS NOT NULL AND final_premium != ''`,
            [id]
        );

        const recentCustomers = await query(
            `SELECT * FROM customer_details 
             WHERE agent_id = $1 
             ORDER BY created_at DESC LIMIT 5`,
            [id]
        );

        // Get monthly data for the last 6 months
        const monthlyData = await query(
            `SELECT 
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as policies,
                COALESCE(SUM(CAST(final_premium AS DECIMAL)), 0) as premium
             FROM customer_details 
             WHERE agent_id = $1 
                AND created_at >= CURRENT_DATE - INTERVAL '6 months'
             GROUP BY DATE_TRUNC('month', created_at)
             ORDER BY month DESC`,
            [id]
        );

        // Format monthly data
        const formattedMonthlyData = monthlyData.rows.map(row => ({
            month: new Date(row.month).toLocaleDateString('en-US', { month: 'short' }),
            policies: parseInt(row.policies),
            claims: Math.floor(Math.random() * 15) + 5, // Simulated claims data
            premium: parseFloat(row.premium)
        }));

        // Create recent activities from recent customers
        const recentActivities = recentCustomers.rows.map((customer, index) => ({
            id: index,
            title: `New policy created for ${customer.customer_name}`,
            subtitle: `Vehicle: ${customer.vehical_number} • Premium: ₹${customer.final_premium || 0}`,
            time: customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Recent',
            type: 'policy_creation'
        }));

        res.status(200).json({
            message: 'Agent dashboard data retrieved successfully',
            data: {
                agent: agent,
                totalCustomers: parseInt(totalCustomers.rows[0].customer_count),
                activePolicies: parseInt(activePolicies.rows[0].active_count),
                expiringPolicies: parseInt(expiringPolicies.rows[0].expiring_count),
                expiredPolicies: parseInt(expiredPolicies.rows[0].expired_count),
                totalPremium: parseFloat(totalPremium.rows[0].total_premium),
                recentActivities: recentActivities,
                recentCustomers: recentCustomers.rows,
                monthlyData: formattedMonthlyData,
                stats: {
                    total_customers: parseInt(totalCustomers.rows[0].customer_count),
                    active_policies: parseInt(activePolicies.rows[0].active_count),
                    expiring_policies: parseInt(expiringPolicies.rows[0].expiring_count),
                    expired_policies: parseInt(expiredPolicies.rows[0].expired_count),
                    total_premium: parseFloat(totalPremium.rows[0].total_premium)
                }
            }
        });
    } catch (error) {
        console.error('Error in getAgentDashboard:', error);
        next(createError(500, 'Failed to retrieve agent dashboard'));
    }
}