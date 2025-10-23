

import { query } from '../utils/connectToDB.js';
import { getAllCustomersQuery } from '../utils/sqlQuery.js';
import XLSX from 'xlsx';


export async function exportCustomersToExcel(req, res, next) {
    try {
        console.log('Starting Excel export process...');

        
        
        

        
        const selectQuery = `
            SELECT 
                id,
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
                variant
            FROM customer_details 
            ORDER BY id ASC
        `;

        const result = await query(selectQuery);
        const users = result.rows;

        console.log(`Retrieved ${users.length} users from database`);

        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found in the database to export',
                error: 'NO_DATA'
            });
        }

        
        
        

        
        const excelData = users.map((user, index) => {
            return {
                'S.No.': index + 1,                                    
                'Vehicle Number': user.vehical_number || '',           // Standardized vehicle registration
                'Customer Name': user.customer_name || '',             // Full customer name
                'Mobile Number': user.mobile || '',                    // Contact number
                'Address/Landmark': user.landmark || '',               // Address information
                'Vehicle Type': user.vehicle_type || '',               // Car, Bike, Truck, etc.
                'Business Type': user.business_type || '',             // Private, Commercial, Renewal
                'Insurance Company': user.insurance_company || '',     // Insurance provider name
                'Policy Plan': user.policy_plan || '',                 // Coverage type
                'Insurance Start Date': user.insurance_start_date
                    ? new Date(user.insurance_start_date).toLocaleDateString('en-IN')
                    : '',                                              // Formatted start date
                'Insurance End Date': user.insurance_end_date
                    ? new Date(user.insurance_end_date).toLocaleDateString('en-IN')
                    : '',                                              // Formatted end date
                'Premium Amount (₹)': user.final_premium
                    ? `₹${parseFloat(user.final_premium).toLocaleString('en-IN')}`
                    : '',                                              // Formatted currency
                'Payment Type': user.payment_type || '',               // Payment method
                'Coverage Type': user.od_or_net || '',                 // OD or Net
                'Vehicle Variant': user.variant || ''                  // Vehicle model/variant
            };
        });

        console.log('Data formatting completed');

        // ============================================================================
        // STEP 3: EXCEL WORKBOOK CREATION
        // ============================================================================

        // Create new Excel workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // ============================================================================
        // STEP 4: EXCEL STYLING AND FORMATTING
        // ============================================================================

        // Define column widths for better readability
        const columnWidths = [
            { wch: 8 },   // S.No.
            { wch: 15 },  // Vehicle Number
            { wch: 20 },  // Customer Name
            { wch: 12 },  // Mobile Number
            { wch: 25 },  // Address/Landmark
            { wch: 12 },  // Vehicle Type
            { wch: 12 },  // Business Type
            { wch: 18 },  // Insurance Company
            { wch: 15 },  // Policy Plan
            { wch: 12 },  // Start Date
            { wch: 12 },  // End Date
            { wch: 15 },  // Premium Amount
            { wch: 12 },  // Payment Type
            { wch: 12 },  // Coverage Type
            { wch: 15 }   // Vehicle Variant
        ];

        // Apply column width settings
        worksheet['!cols'] = columnWidths;

        // Set up auto-filter for easy data sorting and filtering
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        worksheet['!autofilter'] = { ref: worksheet['!ref'] };

        // Add worksheet to workbook with descriptive name
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Data');

        console.log('Excel formatting applied');

        // ============================================================================
        // STEP 5: FILE GENERATION AND RESPONSE
        // ============================================================================

        // Generate Excel file buffer
        const excelBuffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
            compression: true  // Compress for smaller file size
        });

        console.log(`Excel file generated successfully. Size: ${excelBuffer.length} bytes`);

        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const filename = `CRM_Users_Export_${timestamp}.xlsx`;

        // Set appropriate HTTP headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', excelBuffer.length);

        
        console.log(`Export completed: ${users.length} users exported to ${filename}`);

        
        res.end(excelBuffer);

    } catch (error) {
        console.error('Excel export error:', error);

        
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                message: 'Database connection failed. Please try again later.',
                error: 'DB_CONNECTION_ERROR'
            });
        }

        if (error.code === '42P01') { 
            return res.status(404).json({
                success: false,
                message: 'User data table not found. Please contact administrator.',
                error: 'TABLE_NOT_FOUND'
            });
        }

        
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate Excel export',
            error: 'EXPORT_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}