# Customer Authentication System Implementation

## Overview

This implementation creates an automatic authentication system that syncs customer data between the main `customer_details` table and a new `customer_details_auth` table for login purposes.

## Database Schema

### customer_details_auth Table

```sql
CREATE TABLE customer_details_auth (
    id SERIAL PRIMARY KEY,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    vehicle_number VARCHAR(255),
    otp_hash VARCHAR(255),
    otp_expiry TIMESTAMP,
    FOREIGN KEY (mobile) REFERENCES customer_details(mobile) ON DELETE CASCADE
);
```

## Key Features

### 1. Automatic Data Synchronization

- When an agent creates a customer in the Users page, data is automatically copied to `customer_details_auth`
- Fields copied: `mobile`, `vehicle_number`
- OTP fields start as NULL and are populated during login process

### 2. Customer Login Flow

1. **Credential Check**: Customer enters mobile + vehicle number
2. **OTP Generation**: System generates and sends OTP to mobile
3. **OTP Verification**: Customer enters OTP to complete login
4. **Login Success**: Customer gets access to their dashboard

### 3. Data Integrity

- Foreign key constraint ensures auth records are deleted when customer is deleted
- Automatic updates to auth table when customer details change
- Proper error handling for auth operations

## API Endpoints

### Customer Authentication Routes

- `POST /api/auth/customer/check-credentials` - Verify mobile + vehicle number
- `POST /api/auth/customer/send-otp` - Generate and send OTP
- `POST /api/auth/customer/verify-otp` - Verify OTP and login

### Alternative Routes (same functionality)

- `POST /api/customer-auth/check-credentials`
- `POST /api/customer-auth/send-otp`
- `POST /api/customer-auth/verify-otp`

## Implementation Details

### Files Modified/Created

#### 1. `/backend/utils/sqlQuery.js`

- Added queries for auth table operations
- `AddCustomerAuthQuery` - Insert new auth record
- `verifyCustomerLoginQuery` - Verify login credentials
- `updateCustomerOTPQuery` - Update OTP hash and expiry
- Additional queries for auth management

#### 2. `/backend/controllers/customerCRUDController.js`

- Modified to automatically create auth records when customers are added
- Updated to handle auth record updates/deletions
- Added auth table creation check

#### 3. `/backend/controllers/customerAuthController.js` (NEW)

- `sendCustomerOTP()` - Generate and send OTP
- `verifyCustomerOTP()` - Verify OTP and complete login
- `checkCustomerCredentials()` - Validate mobile + vehicle number

#### 4. `/backend/routes/customerAuthRoutes.js` (NEW)

- Routes for customer authentication endpoints

#### 5. `/backend/index.js`

- Added customer auth routes to Express app

## Security Features

### OTP Security

- OTPs are hashed using SHA-256 before storage
- 10-minute expiry time for OTPs
- OTPs are cleared after successful verification
- Random 6-digit OTP generation

### Data Protection

- Vehicle numbers are cleaned and normalized
- Input validation on all endpoints
- Proper error handling without exposing sensitive data

## Usage Example

### When Agent Creates Customer

```javascript
// Agent fills customer form in Users page
const customerData = {
  mobile: "9876543210",
  vehical_number: "MH01AB1234",
  customer_name: "John Doe",
  // ... other fields
};

// Automatic process:
// 1. Insert into customer_details table
// 2. Auto-insert into customer_details_auth table with mobile + vehicle_number
// 3. OTP fields remain NULL until login attempt
```

### Customer Login Process

```javascript
// Step 1: Check credentials
POST /api/auth/customer/check-credentials
{
    "mobile": "9876543210",
    "vehicleNumber": "MH01AB1234"
}

// Step 2: Send OTP
POST /api/auth/customer/send-otp
{
    "mobile": "9876543210",
    "vehicleNumber": "MH01AB1234"
}

// Step 3: Verify OTP
POST /api/auth/customer/verify-otp
{
    "mobile": "9876543210",
    "vehicleNumber": "MH01AB1234",
    "otp": "123456"
}
```

## Error Handling

### Common Errors

- **404**: Customer not found with provided credentials
- **400**: Invalid OTP or expired OTP
- **400**: Missing required fields
- **500**: Database or system errors

### Logging

- All auth operations are logged for debugging
- OTP generation/verification events are tracked
- Error details are logged without exposing sensitive data

## Integration with Frontend

### LoginPage Integration

The existing LoginPage.jsx can be updated to use these endpoints:

```javascript
// In handleUserGetOTP function
const response = await fetch("/api/auth/customer/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mobile: userFormData.mobile,
    vehicleNumber: userFormData.vehicleNumber,
  }),
});

// In handleUserLogin function
const response = await fetch("/api/auth/customer/verify-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mobile: userFormData.mobile,
    vehicleNumber: userFormData.vehicleNumber,
    otp: userFormData.otp,
  }),
});
```

## Next Steps

1. **SMS Integration**: Replace mock SMS with actual SMS service (Twilio, AWS SNS, etc.)
2. **Rate Limiting**: Add rate limiting for OTP requests
3. **Session Management**: Implement JWT tokens for authenticated sessions
4. **Frontend Integration**: Update LoginPage to use new API endpoints
5. **Testing**: Add unit tests for auth functions

This implementation provides a complete customer authentication system that automatically syncs data and provides secure login functionality for customers created by agents.
