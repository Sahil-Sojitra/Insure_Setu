import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Tabs,
    Tab,
    InputAdornment,
    Divider,
    Alert,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    Person as PersonIcon,
    Business as BusinessIcon,
    AdminPanelSettings as AdminIcon,
    Phone as PhoneIcon,
    DirectionsCar as CarIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Send as SendIcon,
    Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../Hooks/useAuth';
import { API_ENDPOINTS } from '../config/api';

const LoginPage = () => {
    const { isAuthenticated, userType, login } = useAuth();

    // Tab state
    const [activeTab, setActiveTab] = useState(0);

    // Session storage
    const [sessionId, setSessionId] = useState(null);

    // User login states
    const [userFormData, setUserFormData] = useState({
        mobile: '',
        otp: ''
    });
    const [userOtpSent, setUserOtpSent] = useState(false);
    const [userLoading, setUserLoading] = useState(false);

    // Agent login states
    const [agentFormData, setAgentFormData] = useState({
        email: '',
        mobile: '',
        otp: ''
    });
    const [agentOtpSent, setAgentOtpSent] = useState(false);
    const [agentLoading, setAgentLoading] = useState(false);

    // Admin login states
    const [adminFormData, setAdminFormData] = useState({
        email: '',
        password: ''
    });
    const [adminLoading, setAdminLoading] = useState(false);

    // Error and success states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form validation
    const [userFormErrors, setUserFormErrors] = useState({});
    const [agentFormErrors, setAgentFormErrors] = useState({});
    const [adminFormErrors, setAdminFormErrors] = useState({});

    // Redirect if already authenticated
    if (isAuthenticated) {
        if (userType === 'user') {
            return <Navigate to="/user" replace />;
        } else if (userType === 'agent') {
            return <Navigate to="/agent" replace />;
        } else if (userType === 'admin') {
            return <Navigate to="/admin" replace />;
        }
    }

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
        setSuccess('');
        // Reset forms when switching tabs
        setUserFormData({ mobile: '', otp: '' });
        setAgentFormData({ email: '', mobile: '', otp: '' });
        setAdminFormData({ email: '', password: '' });
        setUserOtpSent(false);
        setAgentOtpSent(false);
        setUserFormErrors({});
        setAgentFormErrors({});
        setAdminFormErrors({});
        setSessionId(null);
    };

    // User form handlers
    const handleUserInputChange = (field, value) => {
        setUserFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (userFormErrors[field]) {
            setUserFormErrors(prev => ({ ...prev, [field]: '' }));
        }
        setError('');
    };

    // Agent form handlers
    const handleAgentInputChange = (field, value) => {
        setAgentFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (agentFormErrors[field]) {
            setAgentFormErrors(prev => ({ ...prev, [field]: '' }));
        }
        setError('');
    };

    // Admin form handlers
    const handleAdminInputChange = (field, value) => {
        setAdminFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (adminFormErrors[field]) {
            setAdminFormErrors(prev => ({ ...prev, [field]: '' }));
        }
        setError('');
    };

    // Validate user form
    const validateUserForm = () => {
        const errors = {};

        if (!userFormData.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(userFormData.mobile)) {
            errors.mobile = 'Mobile number must be 10 digits';
        }

        if (userOtpSent && !userFormData.otp.trim()) {
            errors.otp = 'OTP is required';
        } else if (userOtpSent && !/^\d{6}$/.test(userFormData.otp)) {
            errors.otp = 'OTP must be 6 digits';
        }

        setUserFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Validate agent form
    const validateAgentForm = () => {
        const errors = {};

        // Only validate mobile for OTP sending, not email
        if (!agentFormData.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(agentFormData.mobile)) {
            errors.mobile = 'Mobile number must be 10 digits';
        }

        if (agentOtpSent && !agentFormData.otp.trim()) {
            errors.otp = 'OTP is required';
        } else if (agentOtpSent && !/^\d{6}$/.test(agentFormData.otp)) {
            errors.otp = 'OTP must be 6 digits';
        }

        setAgentFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Validate agent OTP form (only mobile number required for sending OTP)
    const validateAgentOtpForm = () => {
        const errors = {};

        if (!agentFormData.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(agentFormData.mobile)) {
            errors.mobile = 'Mobile number must be 10 digits';
        }

        setAgentFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Validate admin form
    const validateAdminForm = () => {
        const errors = {};

        if (!adminFormData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminFormData.email)) {
            errors.email = 'Enter a valid email address';
        }

        if (!adminFormData.password.trim()) {
            errors.password = 'Password is required';
        } else if (adminFormData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setAdminFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle user get OTP
    const handleUserGetOTP = async () => {
        if (!validateUserForm()) return;

        setUserLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_ENDPOINTS.customerAuth}/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mobile: userFormData.mobile
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSessionId(data.sessionId);
                setUserOtpSent(true);
                setSuccess('OTP sent successfully! Check the backend console for the OTP code.');
            } else {
                setError(data.message || 'Failed to send OTP. Please check your mobile and vehicle number.');
            }

        } catch (err) {
            console.error('User OTP error:', err);
            setError('Failed to connect to server. Please ensure the backend is running.');
        } finally {
            setUserLoading(false);
        }
    };

    // Handle agent get OTP
    const handleAgentGetOTP = async () => {
        if (!validateAgentOtpForm()) return;

        setAgentLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_ENDPOINTS.agents}/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: agentFormData.mobile
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setAgentOtpSent(true);
                setSuccess(`OTP sent to ${agentFormData.mobile}. Use OTP: ${result.otp}`);
                console.log('✅ Agent OTP sent successfully:', result.otp);
            } else {
                setError(result.error || 'Failed to send OTP');
            }
        } catch (err) {
            console.error('Agent OTP error:', err);
            setError('Failed to send OTP. Please try again.');
        } finally {
            setAgentLoading(false);
        }
    };

    // Handle user login
    const handleUserLogin = async () => {
        if (!validateUserForm()) return;

        if (!sessionId) {
            setError('Session expired. Please request OTP again.');
            return;
        }

        setUserLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_ENDPOINTS.customerAuth}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: sessionId,
                    otp: userFormData.otp
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(`Login successful! Welcome ${data.customer?.customer_name || 'Customer'}. Redirecting...`);

                // Use auth context to handle login
                login(data.customer, 'user');

                // Redirect to user dashboard
                setTimeout(() => {
                    window.location.href = '/user';
                }, 1500);
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
            }

        } catch (err) {
            console.error('User login error:', err);
            setError('Failed to verify OTP. Please try again.');
        } finally {
            setUserLoading(false);
        }
    };

    // Handle agent login
    const handleAgentLogin = async () => {
        if (!validateAgentForm()) return;

        setAgentLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_ENDPOINTS.agents}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: agentFormData.mobile,
                    otp: agentFormData.otp
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Create agent profile from API response
                const agentProfile = {
                    customer_name: result.agent.agent_name,
                    email: result.agent.email,
                    mobile: result.agent.mobile,
                    role: 'Insurance Agent',
                    id: result.agent.agent_id,
                    agent_code: `CRM-AGT-${String(result.agent.agent_id).padStart(3, '0')}`,
                    department: 'Customer Relations',
                    joining_date: new Date().toISOString().split('T')[0],
                    token: result.token
                };

                setSuccess(`Login successful! Welcome ${agentProfile.customer_name}. Redirecting to dashboard...`);

                // Use auth context to handle login
                login(agentProfile, 'agent');

                console.log('✅ Agent login successful:', agentProfile.customer_name);

                // Redirect to agent dashboard
                setTimeout(() => {
                    window.location.href = '/agent';
                }, 1500);
            } else {
                setError(result.error || 'Invalid OTP. Please try again.');
            }

        } catch (err) {
            console.error('Agent login error:', err);
            setError('Invalid OTP. Please try again.');
        } finally {
            setAgentLoading(false);
        }
    };

    // Handle admin login
    const handleAdminLogin = async () => {
        if (!validateAdminForm()) return;

        setAdminLoading(true);
        setError('');

        try {
            // Dummy admin credentials for testing
            const dummyAdmin = {
                email: 'admin@crm.com',
                password: 'admin123'
            };

            // Verify credentials
            if (adminFormData.email.toLowerCase() === dummyAdmin.email &&
                adminFormData.password === dummyAdmin.password) {

                // Create dummy admin profile
                const adminProfile = {
                    customer_name: 'System Administrator',
                    email: adminFormData.email,
                    role: 'System Administrator',
                    id: 'ADMIN001',
                    agent_code: 'CRM-ADM-001',
                    department: 'System Management',
                    joining_date: '2024-01-01'
                };

                setSuccess(`Admin login successful! Welcome ${adminProfile.customer_name}. Redirecting to admin dashboard...`);

                // Use auth context to handle login
                login(adminProfile, 'admin');

                console.log('✅ Admin login successful:', adminProfile.customer_name);

                // Redirect to admin dashboard
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 1500);
            } else {
                setError('Invalid email or password. Use admin@crm.com / admin123');
            }

        } catch (err) {
            console.error('Admin login error:', err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setAdminLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            height: '100vh',
            backgroundColor: '#f5f7fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1, sm: 2, md: 3 },
            overflow: 'auto'
        }}>
            <Container
                maxWidth={false}
                sx={{
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '500px', md: '550px', lg: '600px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    p: { xs: 1, sm: 2 }
                }}
            >
                <Paper
                    elevation={12}
                    sx={{
                        borderRadius: { xs: 2, sm: 3, md: 4 },
                        overflow: 'hidden',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
                        width: '100%',
                        maxHeight: { xs: '98vh', sm: '95vh', md: '90vh' },
                        display: 'flex',
                        flexDirection: 'column',
                        my: { xs: 1, sm: 2 }
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        p: { xs: 2.5, sm: 3.5, md: 4.5 },
                        textAlign: 'center'
                    }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                mb: 0.5,
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '2.75rem' }
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                opacity: 0.9,
                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }
                            }}
                        >
                            Sign in to your account
                        </Typography>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            centered
                            variant="fullWidth"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                    fontWeight: 600,
                                    py: { xs: 1.25, sm: 1.5, md: 2 },
                                    minWidth: { xs: 80, sm: 100, md: 120 }
                                }
                            }}
                        >
                            <Tab
                                icon={<PersonIcon />}
                                label="User Login"
                                iconPosition="start"
                            />
                            <Tab
                                icon={<BusinessIcon />}
                                label="Agent Login"
                                iconPosition="start"
                            />
                            <Tab
                                icon={<AdminIcon />}
                                label="Admin Login"
                                iconPosition="start"
                            />
                        </Tabs>
                    </Box>

                    {/* Form Content */}
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: { xs: 2, sm: 3, md: 4 },
                        overflow: 'auto'
                    }}>
                        {/* Error/Success Messages */}
                        {error && (
                            <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                                {success}
                            </Alert>
                        )}

                        {/* User Login Form */}
                        {activeTab === 0 && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%'
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: { xs: 2.5, sm: 3, md: 3.5 },
                                        color: '#334155',
                                        fontWeight: 600,
                                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                        textAlign: 'center'
                                    }}
                                >
                                    User Login
                                </Typography>

                                <Stack
                                    spacing={{ xs: 2, sm: 2.5, md: 3 }}
                                    sx={{
                                        width: '100%',
                                        maxWidth: { xs: '100%', sm: '380px', md: '400px' },
                                        alignItems: 'center'
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        label="Mobile Number"
                                        value={userFormData.mobile}
                                        onChange={(e) => handleUserInputChange('mobile', e.target.value)}
                                        error={!!userFormErrors.mobile}
                                        helperText={userFormErrors.mobile}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Enter 10-digit mobile number"
                                        inputProps={{ maxLength: 10 }}
                                        disabled={userOtpSent || userLoading}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                fontSize: { xs: '0.875rem', sm: '1rem' }
                                            }
                                        }}
                                    />

                                    {/* OTP Input - Shows only after OTP is sent */}
                                    {userOtpSent && (
                                        <TextField
                                            fullWidth
                                            label="Enter OTP"
                                            value={userFormData.otp}
                                            onChange={(e) => handleUserInputChange('otp', e.target.value)}
                                            error={!!userFormErrors.otp}
                                            helperText={userFormErrors.otp}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            placeholder="Enter 6-digit OTP"
                                            inputProps={{ maxLength: 6 }}
                                            disabled={userLoading}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                                    borderRadius: 2,
                                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                                }
                                            }}
                                        />
                                    )}

                                    {!userOtpSent ? (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleUserGetOTP}
                                            disabled={userLoading}
                                            startIcon={userLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                            sx={{
                                                py: { xs: 1, sm: 1.25, md: 1.5 },
                                                px: { xs: 3, sm: 4, md: 6 },
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 3,
                                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                                minWidth: { xs: '120px', sm: '140px', md: '160px' },
                                                '&:hover': {
                                                    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            {userLoading ? 'Sending...' : 'Get OTP'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleUserLogin}
                                            disabled={userLoading}
                                            startIcon={userLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                            sx={{
                                                py: { xs: 1, sm: 1.25, md: 1.5 },
                                                px: { xs: 3, sm: 4, md: 6 },
                                                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 3,
                                                boxShadow: '0 8px 20px rgba(5, 150, 105, 0.3)',
                                                minWidth: { xs: '120px', sm: '140px', md: '160px' },
                                                '&:hover': {
                                                    boxShadow: '0 12px 30px rgba(5, 150, 105, 0.4)',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            {userLoading ? 'Logging in...' : 'Login'}
                                        </Button>
                                    )}

                                    {/* Resend OTP Option */}
                                    {userOtpSent && (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                                Didn't receive the OTP?
                                            </Typography>
                                            <Button
                                                variant="text"
                                                color="primary"
                                                onClick={() => {
                                                    setUserFormData(prev => ({ ...prev, otp: '' }));
                                                    setUserOtpSent(false);
                                                    setSessionId(null);
                                                    handleUserGetOTP();
                                                }}
                                                disabled={userLoading}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                }}
                                            >
                                                Resend OTP
                                            </Button>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        )}

                        {/* Agent Login Form */}
                        {activeTab === 1 && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%'
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: { xs: 2.5, sm: 3, md: 3.5 },
                                        color: '#334155',
                                        fontWeight: 600,
                                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                        textAlign: 'center'
                                    }}
                                >
                                    Agent Login
                                </Typography>

                                <Stack
                                    spacing={{ xs: 2, sm: 2.5, md: 3 }}
                                    sx={{
                                        width: '100%',
                                        maxWidth: { xs: '100%', sm: '380px', md: '400px' },
                                        alignItems: 'center'
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        label="Mobile Number"
                                        value={agentFormData.mobile}
                                        onChange={(e) => handleAgentInputChange('mobile', e.target.value)}
                                        error={!!agentFormErrors.mobile}
                                        helperText={agentFormErrors.mobile}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Enter 10-digit mobile number"
                                        inputProps={{ maxLength: 10 }}
                                        disabled={agentOtpSent || agentLoading}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                fontSize: { xs: '0.875rem', sm: '1rem' }
                                            }
                                        }}
                                    />

                                    {/* OTP Input - Shows only after OTP is sent */}
                                    {agentOtpSent && (
                                        <TextField
                                            fullWidth
                                            label="Enter OTP"
                                            value={agentFormData.otp}
                                            onChange={(e) => handleAgentInputChange('otp', e.target.value)}
                                            error={!!agentFormErrors.otp}
                                            helperText={agentFormErrors.otp}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            placeholder="Enter 6-digit OTP"
                                            inputProps={{ maxLength: 6 }}
                                            disabled={agentLoading}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                                    borderRadius: 2,
                                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                                }
                                            }}
                                        />
                                    )}

                                    {!agentOtpSent ? (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleAgentGetOTP}
                                            disabled={agentLoading}
                                            startIcon={agentLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                            sx={{
                                                py: { xs: 1, sm: 1.25, md: 1.5 },
                                                px: { xs: 3, sm: 4, md: 6 },
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 3,
                                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                                minWidth: { xs: '120px', sm: '140px', md: '160px' },
                                                '&:hover': {
                                                    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            {agentLoading ? 'Sending...' : 'Get OTP'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleAgentLogin}
                                            disabled={agentLoading}
                                            startIcon={agentLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                            sx={{
                                                py: { xs: 1, sm: 1.25, md: 1.5 },
                                                px: { xs: 3, sm: 4, md: 6 },
                                                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 3,
                                                boxShadow: '0 8px 20px rgba(5, 150, 105, 0.3)',
                                                minWidth: { xs: '120px', sm: '140px', md: '160px' },
                                                '&:hover': {
                                                    boxShadow: '0 12px 30px rgba(5, 150, 105, 0.4)',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            {agentLoading ? 'Logging in...' : 'Login'}
                                        </Button>
                                    )}

                                    {/* Resend OTP Option */}
                                    {agentOtpSent && (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                                Didn't receive the OTP?
                                            </Typography>
                                            <Button
                                                variant="text"
                                                color="primary"
                                                onClick={handleAgentGetOTP}
                                                disabled={agentLoading}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                }}
                                            >
                                                Resend OTP
                                            </Button>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        )}

                        {/* Admin Login Form */}
                        {activeTab === 2 && (
                            <Box sx={{
                                p: { xs: 2, sm: 3, md: 4 },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: { xs: '300px', sm: '350px', md: '400px' }
                            }}>
                                <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ width: '100%', maxWidth: { xs: '300px', sm: '400px', md: '450px' } }}>
                                    {/* Error Display */}
                                    {error && (
                                        <Alert severity="error" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                            {error}
                                        </Alert>
                                    )}

                                    {/* Success Display */}
                                    {success && (
                                        <Alert severity="success" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                            {success}
                                        </Alert>
                                    )}

                                    {/* Email Field */}
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={adminFormData.email}
                                        onChange={(e) => handleAdminInputChange('email', e.target.value)}
                                        error={!!adminFormErrors.email}
                                        helperText={adminFormErrors.email}
                                        disabled={adminLoading}
                                        variant="outlined"
                                        size="medium"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon sx={{ color: 'text.secondary', fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                                '& fieldset': {
                                                    borderColor: '#e2e8f0',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#667eea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#667eea',
                                                }
                                            }
                                        }}
                                    />

                                    {/* Password Field */}
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={adminFormData.password}
                                        onChange={(e) => handleAdminInputChange('password', e.target.value)}
                                        error={!!adminFormErrors.password}
                                        helperText={adminFormErrors.password || 'Use: admin@crm.com / admin123'}
                                        disabled={adminLoading}
                                        variant="outlined"
                                        size="medium"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon sx={{ color: 'text.secondary', fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                                '& fieldset': {
                                                    borderColor: '#e2e8f0',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#667eea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#667eea',
                                                }
                                            }
                                        }}
                                    />

                                    {/* Login Button */}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={handleAdminLogin}
                                        disabled={adminLoading}
                                        startIcon={adminLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                        sx={{
                                            py: { xs: 1, sm: 1.25, md: 1.5 },
                                            px: { xs: 3, sm: 4, md: 6 },
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            borderRadius: 3,
                                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                            minWidth: { xs: '120px', sm: '140px', md: '160px' },
                                            '&:hover': {
                                                boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        {adminLoading ? 'Logging in...' : 'Login as Admin'}
                                    </Button>

                                    {/* Test Credentials Info */}
                                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                            <strong>Test Credentials:</strong><br />
                                            Email: admin@crm.com<br />
                                            Password: admin123
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                    </Box>

                    {/* Footer */}
                    <Divider />
                    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, textAlign: 'center', bgcolor: '#f8fafc' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            © 2025 CRM System. All rights reserved.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;