import express from 'express';
import {
    sendCustomerOTP,
    verifyCustomerOTP,
    checkCustomerCredentials,
    syncCustomerAuthRecords
} from '../controllers/customerAuthController.js';
import {
    validateAdminAccess,
    sessionLogger,
    rateLimitLogin
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply session logging to all routes
router.use(sessionLogger);

// Route to check customer credentials (mobile + vehicle number) with rate limiting
router.post('/check-credentials', rateLimitLogin(), checkCustomerCredentials);

// Route to send OTP for customer login with rate limiting
router.post('/send-otp', rateLimitLogin(), sendCustomerOTP);

// Route to verify OTP and complete login with rate limiting
router.post('/verify-otp', rateLimitLogin(), verifyCustomerOTP);

// Route to sync customer auth records (admin access required)
router.post('/sync-auth-records', validateAdminAccess, syncCustomerAuthRecords);

// Route to get all customers for testing (development only)
// router.get('/test-customers', async (req, res) => {
//     try {
//         const { query } = await import('../utils/connectToDB.js');
//         const { getAllCustomersQuery } = await import('../utils/sqlQuery.js');

//         const result = await query(getAllCustomersQuery);

//         res.json({
//             success: true,
//             message: `Found ${result.rows.length} customers`,
//             customers: result.rows.map(customer => ({
//                 id: customer.id,
//                 customer_id: customer.customer_id,
//                 mobile: customer.mobile,
//                 customer_name: customer.customer_name,
//                 vehicle_number: customer.vehical_number
//             }))
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch customers',
//             error: error.message
//         });
//     }
// });

export default router;