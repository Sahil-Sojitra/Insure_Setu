

import React, { useState, useEffect } from 'react';


import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Snackbar,
    Tooltip,
    Fab,
    useTheme,
    useMediaQuery
} from '@mui/material';


import {
    DirectionsCar as CarIcon,
    Description as DocumentIcon,
    Payment as PaymentIcon,
    Download as DownloadIcon,
    Refresh as RefreshIcon,
    CheckCircle as CheckIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon
} from '@mui/icons-material';


import {
    KPICard,
    DashboardHeader,
    NotificationAlert
} from '../../Components/Shared/DashboardComponents';

const UserDashboard = () => {



    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));





    const [userInfo, setUserInfo] = useState(null);
    const [loadingUserData, setLoadingUserData] = useState(true);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get customer data from localStorage
                const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');

                if (!customerData.mobile) {
                    window.location.href = '/';
                    return;
                }

                // Fetch all customer policies from backend for this mobile number
                const response = await fetch(`http://localhost:5000/api/customers`);
                const result = await response.json();

                if (response.ok && result.data) {
                    const customerPolicies = result.data.filter(customer =>
                        customer.mobile === customerData.mobile
                    );

                    if (customerPolicies.length > 0) {
                        // Create aggregated dashboard data from all policies
                        const totalPremium = customerPolicies.reduce((sum, policy) => sum + (policy.final_premium || 0), 0);
                        const firstPolicy = customerPolicies[0];

                        // Get the policy that expires soonest for renewal notification
                        const soonestExpiryPolicy = customerPolicies.reduce((earliest, policy) => {
                            const policyEndDate = new Date(policy.insurance_end_date || 0);
                            const earliestEndDate = new Date(earliest.insurance_end_date || 0);
                            return policyEndDate < earliestEndDate ? policy : earliest;
                        });

                        // Create dashboard summary
                        const dashboardData = {
                            customer_name: firstPolicy.customer_name,
                            mobile: firstPolicy.mobile,
                            landmark: firstPolicy.landmark,
                            totalPolicies: customerPolicies.length,
                            totalPremium: totalPremium,
                            policies: customerPolicies,
                            // Use soonest expiry for renewal alerts
                            insurance_end_date: soonestExpiryPolicy.insurance_end_date,
                            // Show multiple vehicle info
                            vehicleInfo: customerPolicies.map(p => ({
                                vehical_number: p.vehical_number,
                                vehicle_type: p.vehicle_type,
                                insurance_company: p.insurance_company,
                                policy_plan: p.policy_plan
                            })),
                            // Summary stats
                            activeCompanies: [...new Set(customerPolicies.map(p => p.insurance_company))],
                            vehicleTypes: [...new Set(customerPolicies.map(p => p.vehicle_type))],
                            paymentTypes: [...new Set(customerPolicies.map(p => p.payment_type))]
                        };

                        setUserInfo(dashboardData);
                    } else {
                        throw new Error('No policies found');
                    }
                } else {
                    throw new Error('Failed to fetch customer data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setSnackbar({
                    open: true,
                    message: 'Error loading user data. Please try again.',
                    severity: 'error'
                });
            } finally {
                setLoadingUserData(false);
            }
        };

        fetchUserData();
    }, []);

    const [loading, setLoading] = useState(false);
    const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [notifications, setNotifications] = useState([]);

    // Update notifications based on user data
    useEffect(() => {
        if (userInfo && userInfo.policies) {
            const newNotifications = [];

            // Check for policies expiring soon
            const now = new Date();
            let expiringPolicies = 0;

            userInfo.policies.forEach(policy => {
                if (policy.insurance_end_date) {
                    const endDate = new Date(policy.insurance_end_date);
                    const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

                    if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
                        expiringPolicies++;
                    }
                }
            });

            if (expiringPolicies > 0) {
                newNotifications.push({
                    id: 1,
                    message: `${expiringPolicies} ${expiringPolicies === 1 ? 'policy' : 'policies'} expiring within 30 days`,
                    type: 'warning',
                    date: new Date().toISOString().split('T')[0]
                });
            }

            // Add portfolio summary notification
            newNotifications.push({
                id: 2,
                message: `Managing ${userInfo.totalPolicies} active ${userInfo.totalPolicies === 1 ? 'policy' : 'policies'} across ${userInfo.activeCompanies.length} ${userInfo.activeCompanies.length === 1 ? 'insurer' : 'insurers'}`,
                type: 'info',
                date: new Date().toISOString().split('T')[0]
            });

            // Add welcome notification
            newNotifications.push({
                id: 3,
                message: `Welcome back, ${userInfo.customer_name}!`,
                type: 'success',
                date: new Date().toISOString().split('T')[0]
            });

            setNotifications(newNotifications);
        }
    }, [userInfo]);





    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getStatusColor = (endDate) => {
        const today = new Date();
        const expiry = new Date(endDate);
        const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysToExpiry < 0) return 'error';
        if (daysToExpiry < 30) return 'warning';
        if (daysToExpiry < 90) return 'info';
        return 'success';
    };

    const getStatusText = (endDate) => {
        const today = new Date();
        const expiry = new Date(endDate);
        const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysToExpiry < 0) return 'Expired';
        if (daysToExpiry < 30) return 'Expiring Soon';
        if (daysToExpiry < 90) return 'Renewal Due';
        return 'Active';
    };

    const getDaysUntilExpiry = (endDate) => {
        const today = new Date();
        const expiry = new Date(endDate);
        return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    };





    const handleDownloadDocument = async () => {
        setLoading(true);
        try {

            setTimeout(() => {
                setSnackbar({
                    open: true,
                    message: 'Document downloaded successfully!',
                    severity: 'success'
                });
                setOpenDocumentDialog(false);
                setLoading(false);
            }, 2000);
        } catch {
            setSnackbar({
                open: true,
                message: 'Failed to download document',
                severity: 'error'
            });
            setLoading(false);
        }
    };

    // Show loading state while fetching user data
    if (loadingUserData) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    // Show error if no user data
    if (!userInfo) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                p: 3
            }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load user data. Please try logging in again.
                </Alert>
                <Button variant="contained" onClick={() => window.location.href = '/'}>
                    Go to Login
                </Button>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{
                width: '100vw',
                minHeight: '100vh',
                backgroundColor: '#f8fafc',
                overflow: 'hidden',
                px: 0,
                py: 0
            }}>
                <Box sx={{
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '100%' },
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                    py: { xs: 2, sm: 3, md: 4, lg: 5 }
                }}>
                    { }
                    <DashboardHeader
                        title="Welcome back,"
                        subtitle="Manage your insurance policies and documents all in one place"
                        userInfo={userInfo}
                    />

                    <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                        { }
                        <Grid item xs={12} sm={12} md={8} lg={7} xl={8}>
                            <Card sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                minHeight: { xs: 220, sm: 280, md: 320, lg: 350 },
                                borderRadius: { xs: 3, sm: 4 },
                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
                                }
                            }}>
                                <CardContent sx={{
                                    p: { xs: 2.5, sm: 3.5, md: 4, lg: 5 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        mb: { xs: 2, sm: 3 },
                                        textAlign: { xs: 'center', sm: 'left' }
                                    }}>
                                        <CarIcon sx={{
                                            mr: { xs: 0, sm: 2 },
                                            mb: { xs: 1, sm: 0 },
                                            fontSize: { xs: 32, sm: 40 }
                                        }} />
                                        <Box>
                                            <Typography variant="h5" sx={{
                                                fontWeight: 'bold',
                                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                            }}>
                                                Insurance Portfolio
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                opacity: 0.9,
                                                fontSize: { xs: '0.875rem', sm: '1rem' }
                                            }}>
                                                {userInfo.totalPolicies} Active {userInfo.totalPolicies === 1 ? 'Policy' : 'Policies'} • {userInfo.vehicleTypes.join(', ')}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ mt: { xs: 1, sm: 2, md: 3 } }}>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="caption" sx={{
                                                opacity: 0.8,
                                                fontSize: { xs: '0.6875rem', sm: '0.75rem' }
                                            }}>
                                                Total Policies
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 'bold',
                                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                                            }}>
                                                {userInfo.totalPolicies}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="caption" sx={{
                                                opacity: 0.8,
                                                fontSize: { xs: '0.6875rem', sm: '0.75rem' }
                                            }}>
                                                Insurance Companies
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 'bold',
                                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                                            }}>
                                                {userInfo.activeCompanies.length}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="caption" sx={{
                                                opacity: 0.8,
                                                fontSize: { xs: '0.6875rem', sm: '0.75rem' }
                                            }}>
                                                Total Premium
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 'bold',
                                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                                            }}>
                                                {formatCurrency(userInfo.totalPremium)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="caption" sx={{
                                                opacity: 0.8,
                                                fontSize: { xs: '0.6875rem', sm: '0.75rem' }
                                            }}>
                                                Next Renewal
                                            </Typography>
                                            <Box sx={{ mt: 0.5 }}>
                                                <Chip
                                                    label={getStatusText(userInfo.insurance_end_date)}
                                                    color={getStatusColor(userInfo.insurance_end_date)}
                                                    size={isSmallScreen ? "small" : "medium"}
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: { xs: '0.6875rem', sm: '0.75rem' }
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        { }
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                            <Grid container spacing={{ xs: 2, sm: 2, md: 3, lg: 3 }} sx={{ height: '100%' }}>
                                <Grid item xs={12}>
                                    <Card sx={{
                                        textAlign: 'center',
                                        p: { xs: 2, sm: 2.5, md: 3 },
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        minHeight: { xs: 120, sm: 140, md: 160, lg: 180 },
                                        borderRadius: { xs: 3, sm: 4 },
                                        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)'
                                        }
                                    }}>
                                        <CalendarIcon sx={{
                                            fontSize: { xs: 28, sm: 32 },
                                            mb: { xs: 0.5, sm: 1 }
                                        }} />
                                        <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            fontSize: { xs: '1rem', sm: '1.25rem' }
                                        }}>
                                            {getDaysUntilExpiry(userInfo.insurance_end_date)} Days
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            fontSize: { xs: '0.6875rem', sm: '0.75rem' }
                                        }}>
                                            Until Policy Expiry
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card sx={{
                                        textAlign: 'center',
                                        p: { xs: 2, sm: 2.5, md: 3 },
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                        color: 'white',
                                        minHeight: { xs: 120, sm: 140, md: 160, lg: 180 },
                                        borderRadius: { xs: 3, sm: 4 },
                                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 12px 35px rgba(59, 130, 246, 0.4)'
                                        }
                                    }}>
                                        <CarIcon sx={{
                                            fontSize: { xs: 28, sm: 32 },
                                            mb: { xs: 0.5, sm: 1 }
                                        }} />
                                        <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            fontSize: { xs: '1rem', sm: '1.25rem' }
                                        }}>
                                            {userInfo.vehicleTypes.length}
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            fontSize: { xs: '0.6875rem', sm: '0.75rem' }
                                        }}>
                                            Vehicle {userInfo.vehicleTypes.length === 1 ? 'Type' : 'Types'}
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>

                        { }
                        <Grid item xs={12} sm={6} md={6} lg={5} xl={5}>
                            <Card sx={{
                                height: '100%',
                                minHeight: { xs: 280, sm: 320, md: 360, lg: 380 },
                                borderRadius: { xs: 3, sm: 4 },
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'white',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                                }
                            }}>
                                <CardContent sx={{
                                    p: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            fontSize: { xs: '1rem', sm: '1.25rem' }
                                        }}>
                                            Recent Notifications
                                        </Typography>
                                    </Box>

                                    {notifications.map((notification) => (
                                        <NotificationAlert
                                            key={notification.id}
                                            notification={notification}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        { }
                        <Grid item xs={12} sm={12} md={6} lg={7} xl={5}>
                            <Card sx={{
                                height: '100%',
                                minHeight: { xs: 280, sm: 320, md: 360, lg: 380 },
                                borderRadius: { xs: 3, sm: 4 },
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'white',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                                }
                            }}>
                                <CardContent sx={{
                                    p: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            fontSize: { xs: '1rem', sm: '1.25rem' }
                                        }}>
                                            Contact Information
                                        </Typography>
                                    </Box>

                                    <List sx={{
                                        p: 0,
                                        '& .MuiListItem-root': {
                                            py: { xs: 1.5, sm: 2, md: 2.5 },
                                            px: 0
                                        }
                                    }}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <PhoneIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Mobile Number"
                                                secondary={userInfo.mobile}
                                                primaryTypographyProps={{
                                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                                }}
                                                secondaryTypographyProps={{
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                }}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon>
                                                <LocationIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Address"
                                                secondary={userInfo.landmark}
                                                primaryTypographyProps={{
                                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                                }}
                                                secondaryTypographyProps={{
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                }}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon>
                                                <EmailIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Email Support"
                                                secondary="support@insurancecrm.com"
                                                primaryTypographyProps={{
                                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                                }}
                                                secondaryTypographyProps={{
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                }}
                                            />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    { }
                    {!isMobile && (
                        <Tooltip title="Quick Actions">
                            <Fab
                                color="primary"
                                sx={{
                                    position: 'fixed',
                                    bottom: { xs: 20, sm: 24, md: 32, lg: 40 },
                                    right: { xs: 20, sm: 24, md: 32, lg: 40 },
                                    zIndex: 1000,
                                    width: { xs: 56, sm: 64, md: 70 },
                                    height: { xs: 56, sm: 64, md: 70 }
                                }}
                                onClick={() => setOpenDocumentDialog(true)}
                            >
                                <RefreshIcon />
                            </Fab>
                        </Tooltip>
                    )}
                </Box>
            </Box>

            { }
            <Dialog
                open={openDocumentDialog}
                onClose={() => setOpenDocumentDialog(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                sx={{
                    '& .MuiDialog-paper': {
                        m: { xs: 0, sm: 2 },
                        maxHeight: { xs: '100vh', sm: 'calc(100% - 64px)' }
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: { xs: '1.125rem', sm: '1.25rem' },
                    p: { xs: 2, sm: 3 }
                }}>
                    <DocumentIcon sx={{ mr: 1 }} />
                    Download Document
                </DialogTitle>
                <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="body1" gutterBottom sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}>
                        Your document will be generated and downloaded. This may take a few moments.
                    </Typography>
                    <Box sx={{
                        mt: 2,
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: 'grey.100',
                        borderRadius: 1
                    }}>
                        <Typography variant="body2" color="text.secondary" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                            <strong>Policy Details:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                            Vehicle: {userInfo.vehical_number} ({userInfo.vehicle_type})
                        </Typography>
                        <Typography variant="body2" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                            Policy: {userInfo.policy_plan} - {userInfo.insurance_company}
                        </Typography>
                        <Typography variant="body2" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                            Valid Until: {new Date(userInfo.insurance_end_date).toLocaleDateString()}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    p: { xs: 2, sm: 3 },
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    gap: { xs: 1, sm: 0 }
                }}>
                    <Button
                        onClick={() => setOpenDocumentDialog(false)}
                        fullWidth={isMobile}
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleDownloadDocument}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
                        fullWidth={isMobile}
                        sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            ml: { xs: 0, sm: 1 }
                        }}
                    >
                        {loading ? 'Generating...' : 'Download'}
                    </Button>
                </DialogActions>
            </Dialog>

            { }
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: isMobile ? 'center' : 'left'
                }}
                sx={{
                    bottom: { xs: 16, sm: 24 },
                    left: { xs: 16, sm: 24 },
                    right: { xs: 16, sm: 'auto' }
                }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default UserDashboard;
