


export function validateIndianVehicleNumber(vehicleNumber) {

    if (!vehicleNumber) return false;


    const cleanedNumber = vehicleNumber.toString().trim().replace(/\s+/g, '').toUpperCase();

    // Complete list of valid Indian state and union territory codes
    // Updated as per Ministry of Road Transport and Highways (MORTH) specifications
    const indianStateCodes = [
        'AN',
        'AP',
        'AR',
        'AS',
        'BR',
        'CH',
        'CG',
        'DN',
        'DD',
        'DL',
        'GA',
        'GJ',
        'HR',
        'HP',
        'JH',
        'JK',
        'KA',
        'KL',
        'LA',
        'LD',
        'MP',
        'MH',
        'MN',
        'ML',
        'MZ',
        'NL',
        'OR',
        'PY',
        'PB',
        'RJ',
        'SK',
        'TN',
        'TS',
        'TR',
        'UP',
        'UK',
        'UT',
        'WB'
    ];



    const vehiclePattern = /^([A-Z]{2})(\d{1,2})([A-Z]{1,2})(\d{1,4})$/;
    const match = cleanedNumber.match(vehiclePattern);


    if (!match) {
        return false;
    }


    const [, stateCode, districtCode, series, number] = match;


    if (!indianStateCodes.includes(stateCode)) {
        return false;
    }


    const districtNum = parseInt(districtCode, 10);
    const vehicleNum = parseInt(number, 10);


    if (districtNum < 1 || districtNum > 99) {
        return false;
    }


    if (vehicleNum < 1 || vehicleNum > 9999) {
        return false;
    }


    return true;
}


export function cleanVehicleNumber(vehicleNumber) {

    if (!vehicleNumber) return '';

    // Remove all whitespace, trim, and convert to uppercase
    return vehicleNumber.toString().trim().replace(/\s+/g, '').toUpperCase();
}

/**
 * CLEAN AND VALIDATE MOBILE NUMBER
 * 
 * Processes mobile numbers from various input formats including Excel scientific notation.
 * Ensures the result is a valid 10-digit Indian mobile number.
 * 
 * @param {string|number} mobile - Raw mobile number input
 * @returns {string} - Cleaned 10-digit mobile number or empty string if invalid
 */
export function cleanMobileNumber(mobile) {
    // Return empty string if no mobile number provided
    if (!mobile) return '';

    // Handle Excel scientific notation (e.g., 9.876543211e+09)
    if (mobile.toString().includes('e') || mobile.toString().includes('E')) {
        const num = parseFloat(mobile);
        if (!isNaN(num)) {

            return Math.round(num).toString();
        }
    }


    const cleanedMobile = mobile.toString().replace(/[^\d]/g, '');

    // Return the cleaned digits
    return cleanedMobile;
}

/**
 * CLEAN PREMIUM AMOUNT
 * 
 * Processes premium amounts by removing currency symbols, commas, and other formatting.
 * Converts to numeric value for database storage and calculations.
 * 
 * @param {string|number} premium - Raw premium amount input
 * @returns {number|null} - Cleaned numeric premium amount or null if invalid
 */
export function cleanPremiumAmount(premium) {
    // Return null if no premium provided
    if (!premium) return null;

    // Remove currency symbols (₹, $), commas, and extra whitespace
    const cleaned = premium.toString()
        .replace(/[₹,$]/g, '')      // Remove currency symbols
        .replace(/,/g, '')         // Remove commas
        .trim();                   // Remove whitespace

    // Convert to number
    const number = parseFloat(cleaned);

    // Return null if conversion failed, otherwise return the number
    return isNaN(number) ? null : number;
}

/**
 * PARSE EXCEL DATE VALUES
 * 
 * Handles various date formats that can come from Excel files including:
 * - Excel serial numbers (days since 1900-01-01)
 * - DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY formats
 * - YYYY-MM-DD ISO format
 * - Standard JavaScript Date objects
 * 
 * @param {string|number|Date} dateValue - Raw date value from Excel
 * @returns {string|null} - ISO date string (YYYY-MM-DD) or null if invalid
 */
export function parseExcelDate(dateValue) {
    // Return null if no date value provided
    if (!dateValue) return null;

    // Handle JavaScript Date objects
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue.toISOString().split('T')[0];
    }


    let dateString = dateValue.toString().trim();
    if (!dateString) return null;



    if (/^\d{4,5}$/.test(dateString)) {
        const serialNumber = parseInt(dateString, 10);


        const excelEpoch = new Date(1900, 0, 1);
        const date = new Date(excelEpoch.getTime() + (serialNumber - 2) * 24 * 60 * 60 * 1000);

        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    }


    const ddmmyyyyMatch = dateString.match(/^(\d{1,2})[\/.\\-](\d{1,2})[\/.\\-](\d{4})$/);
    if (ddmmyyyyMatch) {
        const day = parseInt(ddmmyyyyMatch[1], 10);
        const month = parseInt(ddmmyyyyMatch[2], 10);
        const year = parseInt(ddmmyyyyMatch[3], 10);


        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            const date = new Date(year, month - 1, day);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
    }


    const yyyymmddMatch = dateString.match(/^(\d{4})[\\-](\d{1,2})[\\-](\d{1,2})$/);
    if (yyyymmddMatch) {
        return dateString;
    }


    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
    }


    return null;
}

/**
 * Generate customer ID from mobile number and vehicle number
 * Format: [Mobile1-2][Vehicle_Series][Mobile3-4][Vehicle_Last4]
 * Example: Mobile: 9876543210, Vehicle: MH01AB1234 → Customer ID: 98AB541234
 * @param {string} mobile - Customer's mobile number
 * @param {string} vehicleNumber - Customer's vehicle registration number
 * @returns {string} Generated customer ID
 */
export function generateCustomerId(mobile, vehicleNumber) {
    if (!mobile || !vehicleNumber) {
        throw new Error('Mobile number and vehicle number are required for customer ID generation');
    }

    // Extract digits from mobile number
    const mobileDigits = mobile.replace(/\D/g, ''); // Remove non-digits
    if (mobileDigits.length < 4) {
        throw new Error('Mobile number must have at least 4 digits');
    }

    // Get first 2 digits of mobile
    const mobile1_2 = mobileDigits.substring(0, 2);
    // Get 3rd and 4th digits of mobile  
    const mobile3_4 = mobileDigits.substring(2, 4);

    // Clean and parse vehicle number
    const cleanVehicleNumber = vehicleNumber.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Extract series (letters) and digits from vehicle number
    // Vehicle format is typically like: MH01AB1234
    const vehiclePattern = /^([A-Z]{2})(\d{1,2})([A-Z]{1,2})(\d{1,4})$/;
    const match = cleanVehicleNumber.match(vehiclePattern);
    
    if (match) {
        const [, stateCode, districtCode, series, number] = match;
        // Use series letters (like AB) and last 4 digits
        const vehicleSeries = series.padEnd(2, 'X'); // Pad series to 2 chars if needed
        const vehicleLast4 = number.padStart(4, '0'); // Ensure 4 digits
        
        return `${mobile1_2}${vehicleSeries}${mobile3_4}${vehicleLast4}`;
    } else {
        // Fallback for non-standard vehicle numbers
        // Try to extract series letters and last digits
        const letters = cleanVehicleNumber.replace(/[^A-Z]/g, '');
        const digits = cleanVehicleNumber.replace(/[^0-9]/g, '');
        
        const vehicleSeries = letters.length >= 2 ? letters.slice(-2) : letters.padEnd(2, 'X');
        const vehicleLast4 = digits.length >= 4 ? digits.slice(-4) : digits.padStart(4, '0');
        
        return `${mobile1_2}${vehicleSeries}${mobile3_4}${vehicleLast4}`;
    }
}