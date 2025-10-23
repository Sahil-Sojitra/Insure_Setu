# Agent Login Guide

## Dummy Agent Credentials for Testing

This system includes a predefined dummy agent for testing purposes.

### Agent Login Credentials:

- **Email**: `agent@crm.com`
- **Mobile**: `9876543210`
- **OTP**: `123456` (Fixed OTP for demo)

### How to Login as Agent:

1. Go to the login page
2. Click on the **"Agent Login"** tab
3. Enter the email: `agent@crm.com`
4. Enter the mobile: `9876543210`
5. Click **"Get OTP"**
6. The system will show a success message with the OTP
7. Enter the OTP: `123456`
8. Click **"Login"**
9. You will be redirected to the Agent Dashboard

### Agent Profile Details:

- **Name**: Agent John Doe
- **Role**: Insurance Agent
- **Agent Code**: CRM-AGT-001
- **Department**: Customer Relations
- **ID**: AGT001

### Features Available:

- **Dashboard**: Overview of agent activities
- **Customers**: Manage customer accounts
- **Notifications**: View system notifications
- **Settings**: Agent preferences
- **Logout**: Secure logout functionality

### Security Features:

- Session-based authentication
- Automatic logout on invalid sessions
- Secure localStorage management
- Redirect to login for unauthorized access

### Console Logging:

The system provides detailed console logs for debugging:

- OTP generation messages
- Login success/failure details
- Agent profile information
- Session management details

---

**Note**: This is a dummy implementation for development and testing purposes. In production, replace this with proper authentication APIs and database integration.
