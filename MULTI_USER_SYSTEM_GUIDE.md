# Multi-User CRM System Implementation Guide

## Overview

This CRM system has been enhanced to support simultaneous login of multiple customers and agents, with complete data isolation to ensure each user only sees their own relevant information.

## Key Features Implemented

### 1. **Enhanced Authentication System**

- **Session Management**: Robust session handling with `sessionManager.js` utility
- **Data Normalization**: Consistent user data structure across all user types
- **Session Validation**: Automatic session expiration and validation
- **Multi-User Support**: Customers, Agents, and Admins can be logged in simultaneously

### 2. **Complete Data Isolation**

#### **For Agents:**

- Each agent can only access their assigned customers
- Dashboard shows agent-specific statistics
- Customer management is filtered by agent ID
- API endpoints: `/api/agents/{agent_id}/customers` and `/api/agents/{agent_id}/dashboard`

#### **For Customers:**

- Customers can only access their own policy information
- Customer dashboard shows personal data only
- Document uploads are customer-specific

#### **For Admins:**

- Full access to all system data
- Can manage all agents and customers
- System-wide statistics and controls

### 3. **Backend Security Middleware**

- **Authentication Validation**: `validateAgentAccess`, `validateCustomerAccess`, `validateAdminAccess`
- **Data Isolation**: `ensureDataIsolation` middleware
- **Rate Limiting**: Protection against brute force login attempts
- **Session Logging**: Comprehensive logging for debugging and security

### 4. **Frontend Session Management**

- **Persistent Sessions**: Sessions survive page reloads
- **Automatic Session Cleanup**: Invalid sessions are automatically cleared
- **Real-time Session Validation**: Continuous session health checks
- **Multi-Tab Support**: Consistent authentication across browser tabs

## User Authentication Flow

### **Customer Login:**

1. Customer enters mobile number
2. System sends OTP to mobile
3. Customer verifies OTP
4. Session created with customer-specific data access

### **Agent Login:**

1. Agent enters registered mobile number
2. System sends OTP to mobile
3. Agent verifies OTP
4. Session created with agent-specific customer access

### **Admin Login:**

1. Admin enters email and password
2. Direct authentication (no OTP required)
3. Session created with full system access

## Data Access Patterns

### **Agent Data Access:**

```javascript
// Agent can only access their own customers
GET /api/agents/101/customers  // Only customers assigned to agent 101
GET /api/agents/101/dashboard  // Dashboard stats for agent 101 only

// Agent-specific filtering in backend:
WHERE agent_id = $1  // Always filters by the logged-in agent's ID
```

### **Customer Data Access:**

```javascript
// Customer can only access their own data
GET / api / customers / CUST_001 / policy - document; // Only CUST_001's documents
PUT / api / customers / CUST_001; // Only CUST_001 can update their info
```

### **Admin Data Access:**

```javascript
// Admin has full system access
GET / api / customers; // All customers
GET / api / agents; // All agents
POST / api / agents; // Can create new agents
```

## Testing Multi-User Functionality

### **Test Scenario 1: Multiple Agent Logins**

1. Open browser tab 1: Login as Agent A (mobile: 9876543210)
2. Open browser tab 2: Login as Agent B (mobile: 9876543211)
3. Verify each agent sees only their assigned customers
4. Add customer to Agent A - verify Agent B doesn't see it

### **Test Scenario 2: Agent + Customer Simultaneous Login**

1. Browser tab 1: Agent login and view dashboard
2. Browser tab 2: Customer login and view policies
3. Verify no cross-contamination of data
4. Both users should maintain independent sessions

### **Test Scenario 3: Admin Oversight**

1. Admin login
2. View all agents and their customer counts
3. Verify admin can see system-wide statistics
4. Test agent management (add/edit/delete agents)

## Session Management API

### **Frontend Session Utils:**

```javascript
import {
  createSession,
  getCurrentSession,
  isSessionValid,
  clearAllSessions,
} from "./utils/sessionManager";

// Create new session
const result = createSession(userData, "agent");

// Check current session
const session = getCurrentSession();
if (session.isValid) {
  // User is authenticated
  console.log(`Logged in as: ${session.userData.name}`);
}

// Validate session (with expiration check)
if (isSessionValid()) {
  // Session is still valid
  proceedWithRequest();
} else {
  // Session expired, redirect to login
  redirectToLogin();
}
```

### **Backend Middleware Usage:**

```javascript
// Protect agent routes with data isolation
router.get(
  "/:id/customers",
  validateAgentAccess, // Verify agent exists
  ensureDataIsolation("agent"), // Apply agent-specific filtering
  getAgentCustomers // Execute controller
);

// Rate limit authentication endpoints
router.post(
  "/auth/verify-otp",
  rateLimitLogin(), // Prevent brute force attacks
  verifyAgentOTP // Process login
);
```

## Database Schema for Multi-User Support

### **Agents Table:**

```sql
CREATE TABLE agents (
    agent_id SERIAL PRIMARY KEY,
    agent_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Customers Table (with Agent Assignment):**

```sql
CREATE TABLE customer_details (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) UNIQUE,
    customer_name VARCHAR(255),
    mobile VARCHAR(15),
    agent_id INTEGER REFERENCES agents(agent_id),
    -- other customer fields...
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Authentication Tables:**

```sql
-- Agent authentication with OTP
CREATE TABLE agent_auth (
    auth_id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES agents(agent_id),
    mobile VARCHAR(15) UNIQUE NOT NULL,
    otp_hash VARCHAR(255),
    otp_expiry TIMESTAMP
);

-- Customer authentication with OTP
CREATE TABLE customer_details_auth (
    auth_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customer_details(customer_id),
    mobile VARCHAR(15) NOT NULL,
    otp_hash VARCHAR(255),
    otp_expiry TIMESTAMP
);
```

## Security Features

### **1. Data Isolation Enforcement:**

- Database queries always include user-specific WHERE clauses
- Middleware validates user permissions before data access
- Frontend routes protected with user type verification

### **2. Session Security:**

- Session expiration (24 hours default)
- Automatic session cleanup on logout
- Cross-tab session synchronization

### **3. Rate Limiting:**

- Login attempt limits (5 attempts per 15 minutes)
- OTP request throttling
- API endpoint protection

### **4. Input Validation:**

- Mobile number format validation
- OTP format verification
- User data structure validation

## Troubleshooting Guide

### **Issue: Agent sees other agent's customers**

- Check agent_id assignment in customer_details table
- Verify middleware is correctly filtering by agent ID
- Ensure frontend is passing correct agent ID in API calls

### **Issue: Session not persisting across page reloads**

- Check localStorage for session data
- Verify AuthContext is properly reading session on initialization
- Ensure session validation is not failing due to data format issues

### **Issue: Multiple tabs showing different login states**

- Check for localStorage event listeners
- Verify AuthContext is updating state across components
- Ensure session cleanup is not being triggered incorrectly

## Development Testing

### **Using the Test Dashboard:**

1. Navigate to `/test-session` route in your application
2. Use the test buttons to simulate different user logins
3. Monitor the session info panel for real-time session data
4. Check browser console for detailed logging

### **API Testing with Curl:**

```bash
# Test agent-specific customer access
curl -X GET "http://localhost:5000/api/agents/101/customers"

# Test agent dashboard
curl -X GET "http://localhost:5000/api/agents/101/dashboard"

# Test customer authentication
curl -X POST "http://localhost:5000/api/customer-auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"mobile": "9876543210"}'
```

## Performance Considerations

### **Database Indexing:**

```sql
-- Index for faster agent-customer lookups
CREATE INDEX idx_customer_agent_id ON customer_details(agent_id);

-- Index for authentication lookups
CREATE INDEX idx_agent_auth_mobile ON agent_auth(mobile);
CREATE INDEX idx_customer_auth_mobile ON customer_details_auth(mobile);
```

### **Frontend Optimization:**

- Session data cached in memory
- Lazy loading of user-specific components
- Efficient re-rendering with React hooks

## Production Deployment Notes

### **Environment Variables:**

```env
# Session configuration
SESSION_EXPIRY_HOURS=24
MAX_LOGIN_ATTEMPTS=5
LOGIN_WINDOW_MINUTES=15

# Database configuration
DB_HOST=your_db_host
DB_NAME=crm_database
DB_USER=crm_user
DB_PASSWORD=secure_password
```

### **Security Checklist:**

- [ ] HTTPS enabled for all communications
- [ ] JWT tokens used for production authentication
- [ ] Database connections encrypted
- [ ] OTP delivery via secure SMS provider
- [ ] Rate limiting configured at reverse proxy level
- [ ] Session data encrypted in storage
- [ ] CORS properly configured for frontend domains

This implementation ensures robust multi-user support with complete data isolation, making it safe for multiple customers and agents to use the system simultaneously while maintaining data privacy and security.
