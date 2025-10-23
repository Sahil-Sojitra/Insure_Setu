

import { query } from '../utils/connectToDB.js';
import {
    createCustomerTableQuery,
    getAllCustomersQuery,
    AddCustomerQuery,
    getCustomerByIdQuery,
    deleteCustomerByIdQuery,
    updateCustomerByIdQuery,
    createCustomerAuthTableQuery,
    AddCustomerAuthQuery,
    getCustomerAuthByMobileQuery,
    updateCustomerOTPQuery,
    verifyCustomerLoginQuery,
    deleteCustomerAuthByMobileQuery,
    updateCustomerAuthQuery
} from '../utils/sqlQuery.js';
import { addPolicyDocumentColumnQuery, implementCustomerIdRelationshipQuery, allowMultiplePoliciesPerMobileQuery } from '../utils/migration.js';
import { createError } from '../utils/error.js';
import { validateIndianVehicleNumber, cleanVehicleNumber, generateCustomerId } from './customerValidationUtils.js';
import fs from 'fs';
import path from 'path';
import { deleteFromCloudinary } from '../utils/cloudinaryConfig.js';

// Helper function to ensure auth table exists
async function ensureAuthTableExists() {
    const authResponse = await query(`SELECT to_regclass('customer_details_auth');`);
    if (!authResponse.rows[0].to_regclass) {
        await query(createCustomerAuthTableQuery);
        console.log('Customer auth table created');
    }
}

export async function getAllCustomers(req, res, next) {
    try {

        const response = await query(`SELECT to_regclass('customer_details');`);


        if (!response.rows[0].to_regclass) {
            await query(createCustomerTableQuery);
        } else {
            // Run customer_id relationship migration for existing table
            await query(implementCustomerIdRelationshipQuery);
            await query(addPolicyDocumentColumnQuery);
            // Run migration to allow multiple policies per mobile number
            await query(allowMultiplePoliciesPerMobileQuery);
        }

        // Ensure auth table exists
        await ensureAuthTableExists();


        const { rows } = await query(getAllCustomersQuery);


        res.status(200).json({
            message: 'Customers retrieved successfully',
            data: rows
        });
    } catch (error) {

        next(error);
    }
}


export async function getCustomerById(req, res, next) {
    try {

        const { id } = req.params;


        const { rows } = await query(getCustomerByIdQuery, [id]);


        if (!rows.length) {
            return next(createError(400, 'Customer not found'));
        }


        res.status(200).json({
            message: 'Customer retrieved successfully',
            data: rows[0]
        });
    } catch (error) {

        next(error);
    }
}


export async function createCustomer(req, res, next) {
    try {

        const {
            vehical_number,
            customer_name,
            mobile,
            landmark,
            vehicle_type,
            business_type,
            insurance_company,
            policy_plan,
            insurance_start_date,
            insurance_end_date,
            final_premium,
            payment_type,
            od_or_net,
            variant,
            agent_id
        } = req.body;


        if (!vehical_number || !customer_name || !mobile || !landmark || !vehicle_type ||
            !business_type || !insurance_company || !policy_plan || !insurance_start_date ||
            !insurance_end_date || !final_premium || !payment_type || !od_or_net || !variant) {
            return res.status(400).json({ message: 'All details are required' });
        }


        if (!validateIndianVehicleNumber(vehical_number)) {
            return res.status(400).json({
                message: 'Invalid vehicle registration number format. Please enter a valid Indian vehicle number (e.g., MH01AB1234, GJ 05 CD 5678)'
            });
        }


        const cleanedVehicleNumber = cleanVehicleNumber(vehical_number);

        // Ensure table structure is updated with customer_id support
        const response = await query(`SELECT to_regclass('customer_details');`);
        if (!response.rows[0].to_regclass) {
            await query(createCustomerTableQuery);
        } else {
            // Run customer_id relationship migration for existing table
            await query(implementCustomerIdRelationshipQuery);
            // Run migration to allow multiple policies per mobile number
            await query(allowMultiplePoliciesPerMobileQuery);
        }

        // Generate customer_id based on mobile and vehicle number
        const customerId = generateCustomerId(mobile, cleanedVehicleNumber);
        console.log(`Generated customer ID: ${customerId} for mobile: ${mobile} and vehicle: ${cleanedVehicleNumber}`);

        let policyDocPath = null;
        if (req.file) {
            // Cloudinary stores the URL in req.file.path
            policyDocPath = req.file.path;
        }

        // Check if the vehicle number already exists
        const vehicleCheck = await query('SELECT * FROM customer_details WHERE vehical_number = $1', [cleanedVehicleNumber]);
        if (vehicleCheck.rows.length > 0) {
            return res.status(400).json({
                message: 'Vehicle number already exists. Each vehicle can only have one active policy.'
            });
        }


        const data = await query(AddCustomerQuery, [
            customerId,
            cleanedVehicleNumber,
            customer_name,
            mobile,
            landmark,
            vehicle_type,
            business_type,
            insurance_company,
            policy_plan,
            insurance_start_date,
            insurance_end_date,
            final_premium,
            payment_type,
            od_or_net,
            variant,
            policyDocPath,
            agent_id || null
        ]);

        // Ensure auth table exists
        await ensureAuthTableExists();

        // Also insert into customer_details_auth table for login purposes
        try {
            await query(AddCustomerAuthQuery, [
                customerId,
                mobile,
                cleanedVehicleNumber
            ]);
            console.log(`Customer auth record created for customer ID: ${customerId}`);
        } catch (authError) {
            console.error('Error creating customer auth record:', authError);
            // Continue even if auth record creation fails
        }


        res.status(201).json({
            message: 'Customer added successfully',
            data: data.rows[0]
        });
    } catch (error) {

        if (req.file && req.file.public_id) {
            try {
                await deleteFromCloudinary(req.file.public_id);
                console.log(`Cloudinary file deleted due to error: ${req.file.public_id}`);
            } catch (fileError) {
                console.error('Error deleting file from Cloudinary:', fileError);
            }
        }


        if (error.code === '23505') {
            // Check which constraint was violated
            if (error.detail && error.detail.includes('vehical_number')) {
                return res.status(400).json({
                    message: 'Vehicle number already exists. Each vehicle can only have one active policy.'
                });
            } else if (error.detail && error.detail.includes('customer_id')) {
                return res.status(400).json({
                    message: 'System error: Customer ID collision. Please try again.'
                });
            } else {
                return res.status(400).json({
                    message: 'A record with this information already exists. Please check the details.'
                });
            }
        }

        if (error.code === '23514') {
            return res.status(400).json({
                message: 'Invalid data: Please check your input values.'
            });
        }


        return res.status(400).json({
            message: error.message || 'Could not add customer details',
            error: error.code || 'Unknown error'
        });
    }
}


export async function updateCustomerById(req, res, next) {
    try {

        const { id } = req.params;


        console.log('Update request - ID:', id);
        console.log('Update request - Body:', req.body);


        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: 'Invalid customer ID provided'
            });
        }


        const {
            vehical_number,
            customer_name,
            mobile,
            landmark,
            vehicle_type,
            business_type,
            insurance_company,
            policy_plan,
            insurance_start_date,
            insurance_end_date,
            final_premium,
            payment_type,
            od_or_net,
            variant,
            agent_id
        } = req.body;


        if (!vehical_number || !customer_name || !mobile || !vehicle_type || !business_type ||
            !insurance_company || !policy_plan || !insurance_start_date || !insurance_end_date ||
            !final_premium || !payment_type || !od_or_net) {
            return res.status(400).json({
                message: 'Missing required fields for update'
            });
        }


        if (!validateIndianVehicleNumber(vehical_number)) {
            return res.status(400).json({
                message: 'Invalid vehicle registration number format. Please enter a valid Indian vehicle number (e.g., MH01AB1234, GJ 05 CD 5678)'
            });
        }


        const cleanedVehicleNumber = cleanVehicleNumber(vehical_number);


        const customerExists = await query(getCustomerByIdQuery, [id]);
        if (!customerExists.rows.length) {
            return res.status(404).json({
                message: 'Customer not found with the provided ID'
            });
        }


        let policyDocPath = customerExists.rows[0].policy_document;
        if (req.file) {
            // Delete old file from Cloudinary if it exists
            if (policyDocPath && policyDocPath.includes('cloudinary.com')) {
                try {
                    // Extract public_id from Cloudinary URL
                    const urlParts = policyDocPath.split('/');
                    const fileNameWithExtension = urlParts[urlParts.length - 1];
                    const publicId = `crm_policy_documents/${fileNameWithExtension}`;
                    await deleteFromCloudinary(publicId);
                    console.log(`Deleted old policy document from Cloudinary: ${publicId}`);
                } catch (fileError) {
                    console.error('Error deleting old policy document from Cloudinary:', fileError);
                }
            }

            // Set new Cloudinary URL
            policyDocPath = req.file.path;
        }


        const result = await query(updateCustomerByIdQuery, [
            cleanedVehicleNumber,
            customer_name,
            mobile,
            landmark,
            vehicle_type,
            business_type,
            insurance_company,
            policy_plan,
            insurance_start_date,
            insurance_end_date,
            parseFloat(final_premium),
            payment_type,
            od_or_net,
            variant,
            policyDocPath,
            agent_id || null,
            parseInt(id)
        ]);

        console.log('Update result:', result.rowCount, 'rows affected');


        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Customer not found or no changes made'
            });
        }


        res.status(200).json({
            message: 'Customer updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error in updateCustomerById:', error);


        if (error.code === '23505') {
            return res.status(400).json({
                message: 'Vehicle number already exists. Please use a different vehicle number.'
            });
        }

        if (error.code === '22P02') {
            return res.status(400).json({
                message: 'Invalid data format provided'
            });
        }


        return res.status(500).json({
            message: error.message || 'Could not update customer',
            error: error.code || 'Unknown error'
        });
    }
}


export async function deleteCustomerById(req, res, next) {
    try {

        const { id } = req.params;


        const customerExists = await query(getCustomerByIdQuery, [id]);
        if (!customerExists.rows.length) {
            return next(createError(400, 'Customer not found'));
        }


        const policyDocPath = customerExists.rows[0].policy_document;


        const { rows } = await query(deleteCustomerByIdQuery, [id]);


        if (rows.length && policyDocPath) {
            try {
                // Check if it's a Cloudinary URL
                if (policyDocPath.includes('cloudinary.com')) {
                    // Extract public_id from Cloudinary URL
                    const urlParts = policyDocPath.split('/');
                    const fileNameWithExtension = urlParts[urlParts.length - 1];
                    const publicId = `crm_policy_documents/${fileNameWithExtension}`;
                    await deleteFromCloudinary(publicId);
                    console.log(`Deleted policy document from Cloudinary: ${publicId}`);
                } else {
                    // Handle local files (backward compatibility)
                    const fullPath = path.join('.', policyDocPath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                        console.log(`Deleted local policy document: ${fullPath}`);
                    }
                }
            } catch (fileError) {
                console.error('Error deleting policy document:', fileError);
            }
        }

        // Log confirmation of cascade deletion from auth table
        if (rows.length) {
            const mobile = rows[0].mobile;
            console.log(`Customer deleted successfully. Mobile: ${mobile}`);
            console.log(`Auth record for mobile ${mobile} will be automatically deleted due to CASCADE constraint`);

            // Optional: Verify the auth record was deleted (for logging purposes)
            try {
                const authCheck = await query(getCustomerAuthByMobileQuery, [mobile]);
                if (authCheck.rows.length === 0) {
                    console.log(`✓ Confirmed: Auth record for mobile ${mobile} has been cascade deleted`);
                } else {
                    console.log(`⚠ Warning: Auth record for mobile ${mobile} still exists (unexpected)`);
                }
            } catch (authError) {
                console.log(`Auth record verification failed: ${authError.message}`);
            }
        }


        res.status(200).json({
            message: 'Customer and associated auth record deleted successfully',
            data: rows[0]
        });
    } catch (error) {
        console.log("Error in deleting the customer", error);

        next(error);
    }
}