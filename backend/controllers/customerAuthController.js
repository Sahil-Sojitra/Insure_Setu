import { query } from '../utils/connectToDB.js';
import {
    verifyCustomerLoginQuery,
    updateCustomerOTPQuery,
    getCustomerAuthByMobileQuery,
    createCustomerAuthTableQuery,
    getAllCustomersQuery,
    AddCustomerAuthQuery
} from '../utils/sqlQuery.js';
import { createError } from '../utils/error.js';
import crypto from 'crypto';
import { generateCustomerId } from './customerValidationUtils.js';

// In-memory session store (would be replaced with Redis in production)
const sessions = new Map();

// Helper function to ensure auth table exists
async function ensureAuthTableExists() {
    const authResponse = await query(`SELECT to_regclass('customer_details_auth');`);
    if (!authResponse.rows[0].to_regclass) {
        await query(createCustomerAuthTableQuery);
        console.log('Customer auth table created');
    }
}

// Function to generate random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to hash OTP
function hashOTP(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

// Function to send OTP (Mock - replace with actual SMS service)
async function sendOTP(mobile, otp) {
    // Create a prominent console log for the OTP
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║                  CUSTOMER OTP CODE                   ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log(`║  Mobile: ${mobile.padEnd(42, ' ')} ║`);
    console.log(`║  OTP Code: ${otp.padEnd(39, ' ')} ║`);
    console.log(`║  Time: ${new Date().toLocaleTimeString().padEnd(41, ' ')} ║`);
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('\n');

    // In a production environment, you would send an actual SMS here
    return true;
}

// Generate a session ID
function generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
}

// Sync customer auth records
export async function syncCustomerAuthRecords(req, res, next) {
    try {
        // Ensure auth table exists
        await ensureAuthTableExists();

        // Get all customers
        const customersResult = await query(getAllCustomersQuery);
        const customers = customersResult.rows;

        let syncedCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const customer of customers) {
            try {
                const customerId = customer.customer_id || generateCustomerId(customer.mobile, customer.vehical_number);

                // Try to insert auth record (will fail if already exists)
                await query(AddCustomerAuthQuery, [
                    customerId,
                    customer.mobile,
                    customer.vehical_number.replace(/\s+/g, '').toUpperCase()
                ]);
                syncedCount++;
            } catch (error) {
                if (error.code === '23505') {
                    // Record already exists, that's OK
                    continue;
                }
                errorCount++;
                errors.push({ customer: customer.mobile, error: error.message });
            }
        }

        res.json({
            success: true,
            message: `Sync completed. ${syncedCount} auth records created.`,
            syncedCount,
            errorCount,
            errors: errors.length > 0 ? errors : null
        });
    } catch (error) {
        console.error('Error in syncCustomerAuthRecords:', error);
        next(error);
    }
}

// Generate and send OTP for customer login
export async function sendCustomerOTP(req, res, next) {
    try {
        const { mobile } = req.body;

        // Validate required fields
        if (!mobile) {
            return res.status(400).json({
                message: 'Mobile number is required'
            });
        }

        // Ensure auth table exists
        await ensureAuthTableExists();

        // Check if customer exists with this mobile number
        const customerCheck = await query('SELECT * FROM customer_details WHERE mobile = $1 LIMIT 1', [mobile]);

        if (!customerCheck.rows.length) {
            return res.status(404).json({
                message: 'Customer not found with provided mobile number'
            });
        }

        const customerId = customerCheck.rows[0].customer_id;
        console.log(`Found customer with ID: ${customerId}`);

        // Generate OTP
        const otp = generateOTP();
        const hashedOTP = hashOTP(otp);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Update OTP in database using customer_id
        await query(updateCustomerOTPQuery, [hashedOTP, otpExpiry, customerId]);

        // Send OTP (replace with actual SMS service)
        await sendOTP(mobile, otp);

        // Create a session
        const sessionId = generateSessionId();
        sessions.set(sessionId, {
            customerId,
            mobile,
            expiresAt: otpExpiry
        });

        res.status(200).json({
            message: 'OTP sent successfully to your mobile number',
            success: true,
            sessionId
        });

    } catch (error) {
        console.error('Error in sendCustomerOTP:', error);
        next(error);
    }
}

// Verify OTP and login customer
export async function verifyCustomerOTP(req, res, next) {
    try {
        const { sessionId, otp } = req.body;

        // Validate required fields
        if (!sessionId || !otp) {
            return res.status(400).json({
                message: 'Session ID and OTP are required'
            });
        }

        // Get session
        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({
                message: 'Session not found or expired. Please generate a new OTP'
            });
        }

        // Check if session has expired
        if (new Date() > new Date(session.expiresAt)) {
            sessions.delete(sessionId);
            return res.status(400).json({
                message: 'Session has expired. Please generate a new OTP'
            });
        }

        const { mobile, customerId } = session;

        // Ensure auth table exists
        await ensureAuthTableExists();

        // Get customer auth record
        const authRecord = await query(getCustomerAuthByMobileQuery, [mobile]);

        if (!authRecord.rows.length) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        const customerAuth = authRecord.rows[0];

        // Check if OTP exists
        if (!customerAuth.otp_hash || !customerAuth.otp_expiry) {
            return res.status(400).json({
                message: 'No OTP found. Please generate OTP first'
            });
        }

        // Verify OTP
        const hashedInputOTP = hashOTP(otp);
        if (hashedInputOTP !== customerAuth.otp_hash) {
            return res.status(400).json({
                message: 'Invalid OTP. Please try again'
            });
        }

        // Clear OTP after successful verification using customer_id
        await query(updateCustomerOTPQuery, [null, null, customerId]);

        // Clear session
        sessions.delete(sessionId);

        // Get customer details for response
        const customerDetails = await query('SELECT * FROM customer_details WHERE mobile = $1 LIMIT 1', [mobile]);

        res.status(200).json({
            message: 'Login successful',
            success: true,
            customer: {
                mobile: customerDetails.rows[0].mobile,
                customer_name: customerDetails.rows[0].customer_name,
                customer_id: customerDetails.rows[0].customer_id
            }
        });

    } catch (error) {
        console.error('Error in verifyCustomerOTP:', error);
        next(error);
    }
}

// Check customer login credentials (without OTP)
export async function checkCustomerCredentials(req, res, next) {
    try {
        const { mobile } = req.body;

        // Validate required fields
        if (!mobile) {
            return res.status(400).json({
                message: 'Mobile number is required'
            });
        }

        // Check if customer exists with this mobile number
        const customerCheck = await query('SELECT * FROM customer_details WHERE mobile = $1 LIMIT 1', [mobile]);

        if (!customerCheck.rows.length) {
            return res.status(404).json({
                message: 'Invalid credentials. Customer not found with provided mobile number'
            });
        }

        res.status(200).json({
            message: 'Credentials are valid',
            success: true,
            customer: {
                mobile: customerCheck.rows[0].mobile,
                customer_name: customerCheck.rows[0].customer_name,
                customer_id: customerCheck.rows[0].customer_id
            }
        });

    } catch (error) {
        console.error('Error in checkCustomerCredentials:', error);
        next(error);
    }
}