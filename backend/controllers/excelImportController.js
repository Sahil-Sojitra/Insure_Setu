

import { query } from '../utils/connectToDB.js';
import { createCustomerTableQuery, AddCustomerQuery } from '../utils/sqlQuery.js';
import { uploadExcel, cleanupFile } from '../utils/multerConfig.js';
import {
    validateIndianVehicleNumber,
    cleanVehicleNumber,
    cleanMobileNumber,
    cleanPremiumAmount,
    parseExcelDate
} from './customerValidationUtils.js';
import XLSX from 'xlsx';


export async function importCustomersFromExcel(req, res, next) {
    
    uploadExcel(req, res, async (uploadError) => {
        let filePath = null;

        try {
            
            
            

            
            if (uploadError) {
                console.error('File upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: uploadError.message || 'File upload failed',
                    error: 'UPLOAD_ERROR'
                });
            }

            
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No Excel file uploaded. Please select a valid Excel file.',
                    error: 'NO_FILE'
                });
            }

            filePath = req.file.path;
            console.log(`Processing Excel file: ${filePath}`);

            
            
            

            
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[sheetName];

            
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,     
                defval: ''     // Default value for empty cells
            });

            // Validate minimum data requirements
            if (jsonData.length < 2) {
                throw new Error('Excel file must contain at least a header row and one data row');
            }

            
            
            

            
            const headers = jsonData[0].map(header =>
                typeof header === 'string' ? header.toLowerCase().trim() : ''
            );
            const dataRows = jsonData.slice(1); // Remove header row

            // Define flexible field mapping for various header naming conventions
            // This allows users to use different column names in their Excel files
            const fieldMapping = {
                'vehical_number': [
                    'vehical_number', 'vehicle_number', 'vehicle no', 'registration',
                    'vehicle number', 'reg no', 'registration number', 'vehiclenumber'
                ],
                'customer_name': [
                    'customer_name', 'name', 'customer', 'full_name', 'customer name',
                    'client name', 'customername'
                ],
                'mobile': [
                    'mobile', 'phone', 'contact', 'mobile_number', 'mobile number',
                    'phone number', 'contact number', 'mobilenumber'
                ],
                'landmark': [
                    'landmark', 'address', 'location', 'area'
                ],
                'vehicle_type': [
                    'vehicle_type', 'type', 'vehicle_category', 'vehicle type',
                    'category', 'vehicletype'
                ],
                'business_type': [
                    'business_type', 'business', 'category', 'business type',
                    'policy type', 'businesstype'
                ],
                'insurance_company': [
                    'insurance_company', 'insurer', 'company', 'insurance company',
                    'insurance provider', 'insurancecompany'
                ],
                'policy_plan': [
                    'policy_plan', 'plan', 'coverage', 'policy plan',
                    'insurance plan', 'policyplan'
                ],
                'insurance_start_date': [
                    'insurance_start_date', 'start_date', 'policy_start', 'insurance start date',
                    'start date', 'policy start date', 'from date', 'startdate'
                ],
                'insurance_end_date': [
                    'insurance_end_date', 'end_date', 'policy_end', 'expiry_date',
                    'insurance end date', 'end date', 'policy end date', 'to date',
                    'expiry date', 'enddate'
                ],
                'final_premium': [
                    'final_premium', 'premium', 'amount', 'final premium',
                    'premium amount', 'total premium', 'finalpremium'
                ],
                'payment_type': [
                    'payment_type', 'payment_method', 'payment', 'payment type',
                    'payment mode', 'paymenttype'
                ],
                'od_or_net': [
                    'od_or_net', 'coverage_type', 'policy_type', 'od or net',
                    'coverage', 'odornet'
                ],
                'variant': [
                    'variant', 'model', 'vehicle_variant', 'vehicle variant',
                    'car model', 'vehiclevariant'
                ]
            };

            
            const columnMapping = {};
            for (const [dbField, possibleHeaders] of Object.entries(fieldMapping)) {
                for (const possibleHeader of possibleHeaders) {
                    const index = headers.findIndex(h => h === possibleHeader.toLowerCase());
                    if (index !== -1) {
                        columnMapping[dbField] = index;
                        break; 
                    }
                }
            }

            
            const insurancePeriodVariations = [
                'insurance period', 'policy period', 'coverage period', 'insurance_period',
                'insuranceperiod', 'policyperiod', 'period', 'insurance dates',
                'policy dates', 'coverage dates', 'validity period', 'validity'
            ];
            let insurancePeriodIndex = -1;
            let periodColumnName = '';

            for (const variation of insurancePeriodVariations) {
                insurancePeriodIndex = headers.findIndex(h => h === variation.toLowerCase());
                if (insurancePeriodIndex !== -1) {
                    periodColumnName = variation;
                    break;
                }
            }

            // Debug logging for troubleshooting
            console.log('=== EXCEL IMPORT DEBUG INFO ===');
            console.log('Raw headers from Excel:', jsonData[0]);
            console.log('Processed headers:', headers);
            console.log('Column mapping result:', columnMapping);
            console.log('Insurance period column:', periodColumnName, 'at index', insurancePeriodIndex);
            console.log('Total data rows to process:', dataRows.length);

            
            const requiredFields = [
                'vehical_number', 'customer_name', 'mobile', 'landmark',
                'vehicle_type', 'business_type', 'insurance_company', 'policy_plan',
                'insurance_start_date', 'insurance_end_date', 'final_premium',
                'payment_type', 'od_or_net'
            ];

            const missingFields = requiredFields.filter(field => !(field in columnMapping));

            
            if (insurancePeriodIndex !== -1) {
                const dateFields = ['insurance_start_date', 'insurance_end_date'];
                const missingDateFields = dateFields.filter(field => !(field in columnMapping));

                if (missingDateFields.length === 2) {
                    
                    const nonDateRequiredFields = requiredFields.filter(field => !dateFields.includes(field));
                    const actualMissingFields = nonDateRequiredFields.filter(field => !(field in columnMapping));

                    if (actualMissingFields.length > 0) {
                        throw new Error(`Missing required columns: ${actualMissingFields.join(', ')}. Available columns: [${headers.join(', ')}]`);
                    }
                } else if (missingFields.length > 0) {
                    throw new Error(`Missing required columns: ${missingFields.join(', ')}. Available columns: [${headers.join(', ')}]`);
                }
            } else if (missingFields.length > 0) {
                throw new Error(`Missing required columns: ${missingFields.join(', ')}. Available columns: [${headers.join(', ')}]`);
            }

            
            
            

            const processedUsers = [];
            const validationErrors = [];

            
            for (let i = 0; i < dataRows.length; i++) {
                const row = dataRows[i];
                const rowNum = i + 2; 

                try {
                    
                    if (!row || row.every(cell => !cell || cell === null || cell === undefined || cell.toString().trim() === '')) {
                        continue;
                    }

                    console.log(`Processing row ${rowNum}:`, row.slice(0, 5)); // Log first 5 columns

                    // Extract data using column mapping
                    const userData = {};
                    for (const [dbField, colIndex] of Object.entries(columnMapping)) {
                        const cellValue = row[colIndex];
                        userData[dbField] = (cellValue !== null && cellValue !== undefined)
                            ? cellValue.toString().trim()
                            : '';
                    }

                    // Handle combined insurance period if individual dates are missing
                    if (insurancePeriodIndex !== -1 &&
                        (!userData.insurance_start_date || !userData.insurance_end_date ||
                            userData.insurance_start_date === '' || userData.insurance_end_date === '')) {

                        const periodValue = row[insurancePeriodIndex];
                        if (periodValue && periodValue.toString().trim()) {
                            const periodStr = periodValue.toString().trim();
                            console.log(`Processing period value for row ${rowNum}: "${periodStr}"`);

                            // Try multiple patterns for period splitting
                            let periodMatch = null;

                            // Pattern 1: Dash/hyphen separated (most common)
                            periodMatch = periodStr.match(/^(.+?)\s*[-–—]\s*(.+?)$/);

                            if (!periodMatch) {
                                // Pattern 2: "to" keyword
                                periodMatch = periodStr.match(/^(.+?)\s+to\s+(.+?)$/i);
                            }

                            if (!periodMatch) {
                                // Pattern 3: Comma separated
                                periodMatch = periodStr.match(/^(.+?)\s*,\s*(.+?)$/);
                            }

                            if (!periodMatch) {
                                // Pattern 4: Space separated (assuming format like "01/01/2023 31/12/2023")
                                const parts = periodStr.split(/\s+/);
                                if (parts.length >= 2) {
                                    periodMatch = [null, parts[0], parts[parts.length - 1]];
                                }
                            }

                            // Extract dates if pattern matched
                            if (periodMatch && periodMatch.length >= 3) {
                                userData.insurance_start_date = periodMatch[1].trim();
                                userData.insurance_end_date = periodMatch[2].trim();
                                console.log(`Extracted dates: start="${userData.insurance_start_date}", end="${userData.insurance_end_date}"`);
                            } else {
                                console.log(`Could not parse period format: "${periodStr}"`);
                            }
                        }
                    }

                    console.log(`Row ${rowNum} final dates: start="${userData.insurance_start_date}", end="${userData.insurance_end_date}"`);

                    // Validation array for current row
                    const rowErrors = [];

                    // Clean and validate vehicle registration number
                    if (userData.vehical_number) {
                        const originalVehicleNumber = userData.vehical_number;
                        userData.vehical_number = cleanVehicleNumber(userData.vehical_number);

                        if (!validateIndianVehicleNumber(originalVehicleNumber)) {
                            rowErrors.push(`Vehicle number '${originalVehicleNumber}' is not in valid Indian format (e.g., MH01AB1234, GJ 05 CD 5678)`);
                        }
                    }

                    // Clean and validate mobile number
                    if (userData.mobile) {
                        userData.mobile = cleanMobileNumber(userData.mobile);
                        if (!/^\d{10}$/.test(userData.mobile)) {
                            rowErrors.push(`Mobile number '${userData.mobile}' must be exactly 10 digits`);
                        }
                    } else {
                        rowErrors.push('Mobile number is required');
                    }

                    
                    if (userData.final_premium) {
                        const cleanedPremium = cleanPremiumAmount(userData.final_premium);
                        if (cleanedPremium === null || cleanedPremium <= 0) {
                            rowErrors.push(`Premium '${userData.final_premium}' must be a valid positive number`);
                        } else {
                            userData.final_premium = cleanedPremium;
                        }
                    } else {
                        rowErrors.push('Premium amount is required');
                    }

                    
                    const parsedStartDate = parseExcelDate(userData.insurance_start_date);
                    const parsedEndDate = parseExcelDate(userData.insurance_end_date);

                    if (!parsedStartDate) {
                        rowErrors.push(`Invalid start date format: '${userData.insurance_start_date}'`);
                    } else {
                        userData.insurance_start_date = parsedStartDate;
                    }

                    if (!parsedEndDate) {
                        rowErrors.push(`Invalid end date format: '${userData.insurance_end_date}'`);
                    } else {
                        userData.insurance_end_date = parsedEndDate;
                    }

                    
                    if (parsedStartDate && parsedEndDate && parsedEndDate <= parsedStartDate) {
                        rowErrors.push('End date must be after start date');
                    }

                    
                    const otherRequiredFields = requiredFields.filter(field =>
                        !['insurance_start_date', 'insurance_end_date', 'mobile', 'final_premium', 'vehical_number'].includes(field)
                    );

                    otherRequiredFields.forEach(field => {
                        if (!userData[field] || userData[field].toString().trim() === '') {
                            rowErrors.push(`${field} is required`);
                        }
                    });

                    // If validation errors exist, add to error list and skip row
                    if (rowErrors.length > 0) {
                        const errorMsg = `Row ${rowNum}: ${rowErrors.join('; ')}`;
                        validationErrors.push(errorMsg);
                        console.log('Validation failed for row:', errorMsg);
                        continue;
                    }

                    // Row is valid, add to processed users
                    processedUsers.push(userData);

                } catch (rowError) {
                    const errorMsg = `Row ${rowNum}: ${rowError.message}`;
                    validationErrors.push(errorMsg);
                    console.error('Row processing error:', errorMsg);
                }
            }

            console.log(`Processed ${processedUsers.length} valid users, ${validationErrors.length} errors`);

            // ============================================================================
            // STEP 5: DATABASE OPERATIONS
            // ============================================================================

            // If all rows have validation errors, return error response
            if (validationErrors.length > 0 && processedUsers.length === 0) {
                throw new Error(`All rows failed validation:\\n${validationErrors.join('\\n')}`);
            }

            // Ensure customer_details table exists
            const tableCheck = await query(`SELECT to_regclass('customer_details');`);
            if (!tableCheck.rows[0].to_regclass) {
                await query(createCustomerTableQuery);
            }

            // Insert valid users into database
            const insertResults = [];
            const insertErrors = [];

            for (let i = 0; i < processedUsers.length; i++) {
                const userData = processedUsers[i];
                try {
                    // Execute database insertion for each valid user
                    const result = await query(AddCustomerQuery, [
                        userData.vehical_number,
                        userData.customer_name,
                        userData.mobile,
                        userData.landmark,
                        userData.vehicle_type,
                        userData.business_type,
                        userData.insurance_company,
                        userData.policy_plan,
                        userData.insurance_start_date,
                        userData.insurance_end_date,
                        userData.final_premium,
                        userData.payment_type,
                        userData.od_or_net,
                        userData.variant || null,
                        null // policy_document - not supported in bulk import
                    ]);

                    // Track successful insertion
                    insertResults.push({
                        vehical_number: userData.vehical_number,
                        customer_name: userData.customer_name,
                        status: 'success'
                    });

                } catch (insertError) {
                    console.error(`Insert error for ${userData.vehical_number}:`, insertError);

                    // Track failed insertion with error details
                    insertErrors.push({
                        vehical_number: userData.vehical_number,
                        customer_name: userData.customer_name,
                        error: insertError.message
                    });
                }
            }

            // ============================================================================
            // STEP 6: RESPONSE GENERATION
            // ============================================================================

            // Compile comprehensive response with statistics and results
            const response = {
                success: insertResults.length > 0,
                message: `Excel import completed: ${insertResults.length} users imported successfully${insertErrors.length > 0 ? `, ${insertErrors.length} records had errors` : ''}${validationErrors.length > 0 ? `, ${validationErrors.length} validation errors` : ''}`,
                summary: {
                    totalRows: dataRows.length,
                    validRows: processedUsers.length,
                    successfulInserts: insertResults.length,
                    failedInserts: insertErrors.length,
                    validationErrors: validationErrors.length
                },
                results: {
                    successful: insertResults,
                    failed: insertErrors,
                    validationErrors: validationErrors.slice(0, 20) // Show first 20 errors for debugging
                },
                debug: {
                    headersFound: headers,
                    columnMapping: columnMapping,
                    sampleProcessedUser: processedUsers[0] || null
                }
            };

            // Determine appropriate HTTP status code
            const statusCode = insertErrors.length === 0 && validationErrors.length === 0 ? 200 : 207; // 207 = Multi-Status

            res.status(statusCode).json(response);

        } catch (error) {
            console.error('Excel import error:', error);

            // Return error response for processing failures
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to process Excel file',
                error: 'PROCESSING_ERROR'
            });

        } finally {
            
            if (filePath) {
                cleanupFile(filePath);
            }
        }
    });
}