# CRM Application - Dynamic Backend Integration

## 🚀 Quick Start

### Prerequisites

- Node.js installed
- PostgreSQL database running
- Both backend and frontend dependencies installed

### Starting the Application

#### Option 1: Use the batch script

```bash
# Double-click on start-both-servers.bat
# OR run from command line:
start-both-servers.bat
```

#### Option 2: Manual start

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm start
```

## 🔧 Backend Endpoints

### Health Check

- **GET** `/api/health` - Check if backend is running

### Customer Authentication

- **POST** `/api/auth/customer/send-otp` - Send OTP for login
- **POST** `/api/auth/customer/verify-otp` - Verify OTP and login
- **POST** `/api/auth/customer/sync-auth-records` - Sync customer auth records
- **GET** `/api/auth/customer/test-customers` - Get list of customers for testing

### Customer Management

- **GET** `/api/customers` - Get all customers
- **GET** `/api/customers/:id` - Get customer by ID
- **POST** `/api/customers` - Create new customer
- **PUT** `/api/customers/:id` - Update customer
- **DELETE** `/api/customers/:id` - Delete customer

## 🎯 Testing the Integration

### 1. Test Login Flow

1. Go to `http://localhost:3000`
2. Use the User Login tab
3. Enter mobile and vehicle number of an existing customer
4. Check backend terminal for OTP code (displayed in a box)
5. Enter OTP to complete login

### 2. Test Customer Data

1. After login, navigate to different pages:
   - **My Policy** - Shows dynamic policy data from backend
   - **Documents** - Shows uploaded documents
   - **Payments** - Shows payment history
   - **Dashboard** - Shows overview with real data

### 3. Backend Health Check

Visit: `http://localhost:5000/api/health`

### 4. Customer List API

Visit: `http://localhost:5000/api/customers`

## 🔄 Data Flow

### Login Process

```
Frontend Login → Backend OTP → Console Display → Frontend Verify → Dashboard
```

### User Pages

```
Frontend → localStorage (customer data) → Backend API → Dynamic Content
```

## 🛠️ Key Changes Made

### ✅ Removed All Dummy Data

- MyPolicy.jsx - Now fetches real customer data
- Documents.jsx - Shows actual uploaded documents
- Payments.jsx - Displays real payment information
- UserDashboard.jsx - Dynamic user info and notifications

### ✅ Enhanced Authentication

- Session-based OTP verification
- Prominent OTP display in backend console
- Secure session management
- Auto-redirect on authentication failure

### ✅ Real Backend Integration

- All frontend components now connect to backend APIs
- Error handling for network issues
- Loading states for better UX
- Automatic customer data synchronization

## 📋 Next Steps

1. **Start Both Servers**: Use the batch script or manual commands
2. **Create Test Customer**: Use the admin panel or API
3. **Test Login**: Try logging in with customer credentials
4. **Verify Data**: Check all user pages show real data
5. **Test OTP**: Check backend console for OTP codes

## ⚠️ Important Notes

- OTP codes are displayed in the backend terminal console
- Customer data is fetched from the database in real-time
- All pages now require authentication
- Documents are stored in the backend uploads folder
- Session data is stored in localStorage

## 🐛 Troubleshooting

### Backend Won't Start

- Check if PostgreSQL is running
- Verify database connection settings
- Check for port conflicts (5000)

### Frontend Won't Connect

- Ensure backend is running on port 5000
- Check for CORS issues
- Verify API endpoint URLs

### Login Issues

- Check if customer exists in database
- Verify mobile and vehicle number match
- Look for OTP in backend console

### No Data Showing

- Check browser console for errors
- Verify customer is authenticated
- Check localStorage for customerData
