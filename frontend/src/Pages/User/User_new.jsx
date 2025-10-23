

import React, { useState, useEffect } from 'react';


import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Button,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemAvatar,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Snackbar,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Badge,
    Tooltip,
    Container,
    useTheme,
    useMediaQuery,
    Stack
} from '@mui/material';


import {
    Dashboard as DashboardIcon,
    DirectionsCar as CarIcon,
    Description as DocumentIcon,
    Payment as PaymentIcon,
    Notifications as NotificationIcon,
    Person as PersonIcon,
    Download as DownloadIcon,
    Refresh as RefreshIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    AccountCircle,
    MoreVert,
    ExitToApp,
    PictureAsPdf as PictureAsPdfIcon
} from '@mui/icons-material';

const UserDashboard = () => {
    
    useEffect(() => {
        
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.getElementsByTagName('head')[0].appendChild(viewport);
        }
        
        
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowX = 'hidden';
        
        return () => {
            document.body.style.overflowX = '';
            document.documentElement.style.overflowX = '';
        };
    }, []);

    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================

    const [userInfo] = useState({
        id: 1,
        customer_name: 'Rahul Sharma',
        mobile: '9876543210',
        vehical_number: 'MH01AB1234',
        vehicle_type: 'Car',
        landmark: 'Andheri West, Mumbai',
        insurance_company: 'HDFC Ergo',
        policy_plan: 'Comprehensive',
        insurance_start_date: '2024-01-15',
        insurance_end_date: '2025-01-14',
        final_premium: 15000,
        payment_type: 'Online',
        od_or_net: 'Net',
        variant: 'Swift VXI',
        policy_document: 'sample_policy_rahul_sharma.pdf'
    });

    const [loading, setLoading] = useState(false);
    const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
    const [documentType, setDocumentType] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications] = useState([
        { id: 1, message: 'Policy renewal due in 30 days', type: 'warning', date: '2025-01-01' },
        { id: 2, message: 'Premium payment successful', type: 'success', date: '2024-12-15' }
    ]);

    
    
    
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    
    
    

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getDaysUntilExpiry = (endDate) => {
        const today = new Date();
        const expiry = new Date(endDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    
    
    

    const handleDocumentRequest = (type) => {
        setDocumentType(type);
        setOpenDocumentDialog(true);
    };

    const handleDownloadDocument = async () => {
        setLoading(true);
        try {
            
            setTimeout(() => {
                setSnackbar({
                    open: true,
                    message: `${documentType} downloaded successfully!`,
                    severity: 'success'
                });
                setOpenDocumentDialog(false);
                setLoading(false);
            }, 2000);
        } catch {
            setSnackbar({
                open: true,
                message: 'Download failed. Please try again.',
                severity: 'error'
            });
            setLoading(false);
        }
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    
    
    

    return (
        <Box sx={{ 
            flexGrow: 1,
            bgcolor: 'background.default',
            minHeight: '100vh',
            pb: { xs: 10, sm: 8, md: 6 }
        }}>
            {}
            <AppBar 
                position="sticky" 
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <Toolbar sx={{ 
                    minHeight: { xs: 56, sm: 64 },
                    px: { xs: 1, sm: 2, md: 3 }
                }}>
                    <DashboardIcon sx={{ 
                        mr: { xs: 1, sm: 2 },
                        fontSize: { xs: 20, sm: 24 }
                    }} />
                    
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            flexGrow: 1,
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            fontWeight: 700,
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        Insurance Dashboard
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" sx={{ mr: 1 }}>
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationIcon />
                            </Badge>
                        </IconButton>
                        
                        <IconButton
                            color="inherit"
                            onClick={handleMenuClick}
                            sx={{ p: { xs: 0.5, sm: 1 } }}
                        >
                            <AccountCircle />
                        </IconButton>
                        
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                            <MenuItem onClick={handleMenuClose}>
                                <ExitToApp sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {}
            <Container maxWidth={false} sx={{ 
                mt: { xs: 2, sm: 3, md: 4 },
                px: { xs: 1, sm: 2, md: 3 }
            }}>
                {}
                <Box sx={{ mb: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
                    <Typography 
                        variant={isMobile ? "h4" : "h3"} 
                        sx={{ 
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Welcome back, {userInfo.customer_name}!
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                        Manage your insurance policies and documents
                    </Typography>
                </Box>

                {}
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 4 }}>
                    
                    {}
                    <Grid item xs={12} lg={8}>
                        <Card sx={{ 
                            width: '100%',
                            minHeight: { xs: 280, sm: 320, md: 360 },
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
                            color: 'white',
                            borderRadius: { xs: 2, sm: 3, md: 4 },
                            boxShadow: { 
                                xs: '0 4px 15px rgba(102, 126, 234, 0.25)',
                                sm: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                md: '0 12px 35px rgba(102, 126, 234, 0.35)'
                            },
                            overflow: 'hidden',
                            position: 'relative',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 16px 45px rgba(102, 126, 234, 0.4)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(1px)'
                            }
                        }}>
                            <CardContent sx={{ 
                                p: { xs: 2, sm: 3, md: 4 },
                                '&:last-child': { pb: { xs: 2, sm: 3, md: 4 } },
                                width: '100%',
                                boxSizing: 'border-box',
                                position: 'relative',
                                zIndex: 2
                            }}>
                                {}
                                <Box sx={{
                                    position: 'absolute',
                                    top: -30,
                                    right: -30,
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.08)',
                                    zIndex: -1
                                }} />
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -40,
                                    left: -40,
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.05)',
                                    zIndex: -1
                                }} />

                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: { xs: 3, sm: 4 },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    textAlign: { xs: 'center', sm: 'left' }
                                }}>
                                    <Avatar sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        width: { xs: 60, sm: 70, md: 80 },
                                        height: { xs: 60, sm: 70, md: 80 },
                                        mr: { xs: 0, sm: 3 },
                                        mb: { xs: 2, sm: 0 },
                                        border: '3px solid rgba(255,255,255,0.3)',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <CarIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 } }} />
                                    </Avatar>
                                    <Box>
                                        <Typography 
                                            variant={isMobile ? "h5" : "h4"} 
                                            sx={{ 
                                                fontWeight: 800,
                                                fontSize: {
                                                    xs: '1.25rem',
                                                    sm: '1.5rem',
                                                    md: '1.75rem'
                                                },
                                                mb: 0.5,
                                                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                letterSpacing: '-0.5px'
                                            }}
                                        >
                                            {userInfo.vehicle_type} Insurance
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                opacity: 0.9,
                                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                                fontWeight: 500
                                            }}
                                        >
                                            {userInfo.vehical_number} • {userInfo.variant}
                                        </Typography>
                                        <Chip 
                                            label="ACTIVE" 
                                            size="small" 
                                            sx={{
                                                mt: 1,
                                                bgcolor: 'rgba(76, 175, 80, 0.2)',
                                                color: '#4caf50',
                                                fontWeight: 700,
                                                fontSize: '0.7rem',
                                                border: '1px solid rgba(76, 175, 80, 0.3)'
                                            }} 
                                        />
                                    </Box>
                                </Box>

                                {}
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                                            Policy Progress
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                                            {getDaysUntilExpiry(userInfo.insurance_end_date)} days remaining
                                        </Typography>
                                    </Box>
                                    <Box sx={{ 
                                        height: 8, 
                                        borderRadius: 4, 
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        overflow: 'hidden'
                                    }}>
                                        <Box sx={{
                                            height: '100%',
                                            width: `${Math.max(20, Math.min(100, (getDaysUntilExpiry(userInfo.insurance_end_date) / 365) * 100))}%`,
                                            bgcolor: getDaysUntilExpiry(userInfo.insurance_end_date) > 60 ? '#4caf50' : getDaysUntilExpiry(userInfo.insurance_end_date) > 30 ? '#ff9800' : '#f44336',
                                            borderRadius: 4,
                                            transition: 'all 0.3s ease'
                                        }} />
                                    </Box>
                                    <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 1 }}>
                                        Expires: {new Date(userInfo.insurance_end_date).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                {}
                                <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mt: 1 }}>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                Company
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {userInfo.insurance_company}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                Plan Type
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {userInfo.policy_plan}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                Premium
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {formatCurrency(userInfo.final_premium)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                Status
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                Active
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {}
                    <Grid item xs={12} lg={4}>
                        <Stack spacing={{ xs: 2, sm: 3 }}>
                            {}
                            <Card sx={{ 
                                textAlign: 'center', 
                                p: { xs: 3, sm: 4 }, 
                                background: getDaysUntilExpiry(userInfo.insurance_end_date) > 60 
                                    ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                                    : getDaysUntilExpiry(userInfo.insurance_end_date) > 30 
                                    ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                                    : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: {
                                    xs: '0 4px 15px rgba(72, 187, 120, 0.25)',
                                    sm: '0 6px 20px rgba(72, 187, 120, 0.3)',
                                    md: '0 8px 25px rgba(72, 187, 120, 0.35)'
                                },
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px) scale(1.02)',
                                    boxShadow: '0 12px 35px rgba(72, 187, 120, 0.4)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -20,
                                    right: -20,
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)'
                                }
                            }}>
                                <Avatar sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: { xs: 50, sm: 60 },
                                    height: { xs: 50, sm: 60 },
                                    mx: 'auto',
                                    mb: 2,
                                    border: '2px solid rgba(255,255,255,0.3)'
                                }}>
                                    <CalendarIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />
                                </Avatar>
                                <Typography variant={isMobile ? "h4" : "h3"} sx={{ 
                                    fontWeight: 800,
                                    mb: 1,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    {getDaysUntilExpiry(userInfo.insurance_end_date)}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    opacity: 0.9, 
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Days Until Expiry
                                </Typography>
                            </Card>
                            
                            {}
                            <Card sx={{ 
                                textAlign: 'center', 
                                p: { xs: 3, sm: 4 }, 
                                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: {
                                    xs: '0 4px 15px rgba(66, 153, 225, 0.25)',
                                    sm: '0 6px 20px rgba(66, 153, 225, 0.3)',
                                    md: '0 8px 25px rgba(66, 153, 225, 0.35)'
                                },
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px) scale(1.02)',
                                    boxShadow: '0 12px 35px rgba(66, 153, 225, 0.4)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -20,
                                    right: -20,
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)'
                                }
                            }}>
                                <Avatar sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: { xs: 50, sm: 60 },
                                    height: { xs: 50, sm: 60 },
                                    mx: 'auto',
                                    mb: 2,
                                    border: '2px solid rgba(255,255,255,0.3)'
                                }}>
                                    <PaymentIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />
                                </Avatar>
                                <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
                                    fontWeight: 800,
                                    mb: 1,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    {userInfo.payment_type}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    opacity: 0.9, 
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Payment Method
                                </Typography>
                            </Card>

                            {}
                            <Card sx={{ 
                                textAlign: 'center', 
                                p: { xs: 3, sm: 4 }, 
                                background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: {
                                    xs: '0 4px 15px rgba(159, 122, 234, 0.25)',
                                    sm: '0 6px 20px rgba(159, 122, 234, 0.3)',
                                    md: '0 8px 25px rgba(159, 122, 234, 0.35)'
                                },
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px) scale(1.02)',
                                    boxShadow: '0 12px 35px rgba(159, 122, 234, 0.4)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                }
                            }}>
                                <Avatar sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    width: { xs: 50, sm: 60 },
                                    height: { xs: 50, sm: 60 },
                                    mx: 'auto',
                                    mb: 2,
                                    border: '2px solid rgba(255,255,255,0.3)'
                                }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        ₹
                                    </Typography>
                                </Avatar>
                                <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
                                    fontWeight: 800,
                                    mb: 1,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    {formatCurrency(userInfo.final_premium)}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    opacity: 0.9, 
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Annual Premium
                                </Typography>
                            </Card>
                        </Stack>
                    </Grid>

                    {}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: { xs: 2, sm: 3 },
                            boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            border: '1px solid',
                            borderColor: 'rgba(102, 126, 234, 0.1)',
                            '&:hover': {
                                boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                                transform: 'translateY(-2px)',
                                borderColor: 'rgba(102, 126, 234, 0.2)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }
                        }}>
                            <CardHeader 
                                avatar={
                                    <Avatar sx={{ 
                                        bgcolor: 'primary.main',
                                        width: { xs: 40, sm: 48 },
                                        height: { xs: 40, sm: 48 }
                                    }}>
                                        📋
                                    </Avatar>
                                }
                                title="Policy Documents" 
                                subheader="Manage your insurance documents"
                                sx={{
                                    pb: { xs: 1, sm: 2 },
                                    '& .MuiCardHeader-title': {
                                        fontSize: {
                                            xs: '1.2rem',
                                            sm: '1.4rem',
                                            md: '1.6rem'
                                        },
                                        fontWeight: 700,
                                        color: 'primary.main'
                                    },
                                    '& .MuiCardHeader-subheader': {
                                        fontSize: {
                                            xs: '0.8rem',
                                            sm: '0.9rem'
                                        },
                                        color: 'text.secondary'
                                    }
                                }}
                            />
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Stack spacing={2}>
                                    {}
                                    <Card sx={{ 
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: userInfo.policy_document ? 'success.main' : 'grey.300',
                                        background: userInfo.policy_document 
                                            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.05) 100%)'
                                            : 'linear-gradient(135deg, rgba(158, 158, 158, 0.05) 0%, rgba(189, 189, 189, 0.05) 100%)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ 
                                                    bgcolor: userInfo.policy_document ? 'success.main' : 'grey.400',
                                                    width: 40,
                                                    height: 40,
                                                    mr: 2
                                                }}>
                                                    {userInfo.policy_document ? '✓' : '📄'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        Insurance Certificate
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {userInfo.policy_document ? 'Ready for download' : 'Processing...'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip 
                                                label={userInfo.policy_document ? 'READY' : 'PENDING'}
                                                size="small"
                                                color={userInfo.policy_document ? 'success' : 'default'}
                                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                        <Button
                                            fullWidth
                                            variant={userInfo.policy_document ? "contained" : "outlined"}
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => handleDocumentRequest('Insurance Certificate')}
                                            disabled={!userInfo.policy_document}
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                borderRadius: 2
                                            }}
                                        >
                                            {userInfo.policy_document ? 'Download Certificate' : 'Processing'}
                                        </Button>
                                    </Card>

                                    {}
                                    <Card sx={{ 
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'info.main',
                                        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(100, 181, 246, 0.05) 100%)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ 
                                                    bgcolor: 'info.main',
                                                    width: 40,
                                                    height: 40,
                                                    mr: 2
                                                }}>
                                                    🧾
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        Premium Receipt
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Payment confirmation document
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip 
                                                label="READY"
                                                size="small"
                                                color="info"
                                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => handleDocumentRequest('Premium Receipt')}
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                bgcolor: 'info.main'
                                            }}
                                        >
                                            Download Receipt
                                        </Button>
                                    </Card>

                                    {}
                                    <Card sx={{ 
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'warning.main',
                                        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 183, 77, 0.05) 100%)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ 
                                                    bgcolor: 'warning.main',
                                                    width: 40,
                                                    height: 40,
                                                    mr: 2
                                                }}>
                                                    📋
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        Policy Terms
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Terms and conditions document
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip 
                                                label="READY"
                                                size="small"
                                                color="warning"
                                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => handleDocumentRequest('Policy Terms')}
                                            sx={{
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                bgcolor: 'warning.main'
                                            }}
                                        >
                                            Download Terms
                                        </Button>
                                    </Card>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: { xs: 2, sm: 3 },
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            boxShadow: '0 6px 25px rgba(102, 126, 234, 0.25)',
                            '&:hover': {
                                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.35)',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }
                        }}>            
                            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 3,
                                    justifyContent: 'center'
                                }}>
                                    <Avatar sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        width: { xs: 50, sm: 60 },
                                        height: { xs: 50, sm: 60 },
                                        mr: 2,
                                        border: '2px solid rgba(255,255,255,0.3)'
                                    }}>
                                        <PersonIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
                                            fontWeight: 700,
                                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}>
                                            Contact Info
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Get in touch with us
                                        </Typography>
                                    </Box>
                                </Box>

                                <Stack spacing={2}>
                                    {}
                                    <Card sx={{
                                        p: 2,
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ 
                                                    bgcolor: 'rgba(76, 175, 80, 0.8)',
                                                    width: 35,
                                                    height: 35,
                                                    mr: 1.5
                                                }}>
                                                    <PhoneIcon sx={{ fontSize: 18 }} />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ 
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        Mobile Number
                                                    </Typography>
                                                    <Typography variant="subtitle1" sx={{ 
                                                        fontWeight: 600,
                                                        color: 'white'
                                                    }}>
                                                        {userInfo.mobile}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{
                                                    bgcolor: 'rgba(76, 175, 80, 0.8)',
                                                    color: 'white',
                                                    minWidth: 'auto',
                                                    px: 2,
                                                    fontSize: '0.7rem'
                                                }}
                                                onClick={() => window.open(`tel:${userInfo.mobile}`)}
                                            >
                                                Call
                                            </Button>
                                        </Box>
                                    </Card>

                                    {}
                                    <Card sx={{
                                        p: 2,
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ 
                                                    bgcolor: 'rgba(244, 67, 54, 0.8)',
                                                    width: 35,
                                                    height: 35,
                                                    mr: 1.5
                                                }}>
                                                    <LocationIcon sx={{ fontSize: 18 }} />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ 
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        Location
                                                    </Typography>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        fontWeight: 600,
                                                        color: 'white'
                                                    }}>
                                                        {userInfo.landmark}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{
                                                    bgcolor: 'rgba(244, 67, 54, 0.8)',
                                                    color: 'white',
                                                    minWidth: 'auto',
                                                    px: 2,
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                Map
                                            </Button>
                                        </Box>
                                    </Card>

                                    {}
                                    <Card sx={{
                                        p: 2,
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ 
                                                    bgcolor: 'rgba(33, 150, 243, 0.8)',
                                                    width: 35,
                                                    height: 35,
                                                    mr: 1.5
                                                }}>
                                                    🏢
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ 
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        Insurance Provider
                                                    </Typography>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        fontWeight: 600,
                                                        color: 'white'
                                                    }}>
                                                        {userInfo.insurance_company}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{
                                                    bgcolor: 'rgba(33, 150, 243, 0.8)',
                                                    color: 'white',
                                                    minWidth: 'auto',
                                                    px: 2,
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                Info
                                            </Button>
                                        </Box>
                                    </Card>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {}
                <Tooltip title="Quick Actions">
                    <Fab
                        color="primary"
                        size={isMobile ? "medium" : "large"}
                        sx={{ 
                            position: 'fixed', 
                            bottom: { xs: 16, sm: 20, md: 24 }, 
                            right: { xs: 16, sm: 20, md: 24 },
                            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                transition: 'all 0.3s ease'
                            }
                        }}
                        onClick={() => setOpenDocumentDialog(true)}
                    >
                        <RefreshIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Fab>
                </Tooltip>
            </Container>

            {}
            <Dialog 
                open={openDocumentDialog} 
                onClose={() => setOpenDocumentDialog(false)} 
                maxWidth="sm" 
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        m: { xs: 0, sm: 2 },
                        width: { xs: '100%', sm: 'auto' },
                        maxHeight: { xs: '100%', sm: '90vh' }
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                    <DocumentIcon sx={{ mr: 1 }} />
                    Download {documentType}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Your {documentType} will be generated and downloaded. This may take a few moments.
                    </Typography>
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Policy Details:</strong>
                        </Typography>
                        <Typography variant="body2">
                            Vehicle: {userInfo.vehical_number} ({userInfo.vehicle_type})
                        </Typography>
                        <Typography variant="body2">
                            Policy: {userInfo.policy_plan} - {userInfo.insurance_company}
                        </Typography>
                        <Typography variant="body2">
                            Valid Until: {new Date(userInfo.insurance_end_date).toLocaleDateString()}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDocumentDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleDownloadDocument}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
                    >
                        {loading ? 'Generating...' : 'Download'}
                    </Button>
                </DialogActions>
            </Dialog>

            {}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserDashboard;