

import React, { useState, useEffect } from 'react';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Paper,
    Chip,
    Avatar,
    LinearProgress,
    Fade,
    Zoom,
    useTheme,
    CircularProgress,
    Alert,
    Skeleton
} from '@mui/material';

import {
    TrendingUp,
    People,
    Assignment,
    AccountBalance,
    Notifications
} from '@mui/icons-material';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../Hooks/useAuth';

const DashboardPage = () => {
    const theme = useTheme();
    const { userData } = useAuth(); // Get logged-in agent data
    const [dashboardData, setDashboardData] = useState({
        totalCustomers: 0,
        activePolicies: 0,
        pendingClaims: 0,
        totalPremium: 0,
        recentActivities: [],
        policyData: [],
        monthlyData: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch dashboard data from backend
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError('');

                // Check if agent data is available
                if (!userData || !userData.id) {
                    setError('Agent information not available. Please log in again.');
                    setLoading(false);
                    return;
                }

                const agentId = userData.id;
                console.log(`Fetching dashboard data for agent ID: ${agentId}`);

                // Fetch agent-specific dashboard data
                const dashboardResponse = await fetch(`/api/agents/${agentId}/dashboard`);

                if (dashboardResponse.ok) {
                    const dashboardResult = await dashboardResponse.json();
                    console.log('Dashboard API response:', dashboardResult);

                    // Update dashboard data with real agent-specific data from improved backend
                    const data = dashboardResult.data;
                    setDashboardData({
                        totalCustomers: data.totalCustomers || 0,
                        activePolicies: data.activePolicies || 0,
                        pendingClaims: data.expiringPolicies || 0,
                        totalPremium: data.totalPremium || 0,
                        recentActivities: data.recentActivities || [],
                        policyData: [
                            { name: 'Active', value: data.activePolicies || 0, color: '#4CAF50' },
                            { name: 'Expiring Soon', value: data.expiringPolicies || 0, color: '#FF9800' },
                            { name: 'Expired', value: data.expiredPolicies || 0, color: '#f44336' }
                        ],
                        monthlyData: data.monthlyData || []
                    });

                    console.log(`Dashboard updated for ${data.agent?.agent_name}: ${data.totalCustomers} customers, ${data.activePolicies} active policies`);
                } else {
                    // Fallback: Fetch agent-specific customers if dashboard endpoint fails
                    const customersResponse = await fetch(`/api/agents/${agentId}/customers`);

                    if (customersResponse.ok) {
                        const customersResult = await customersResponse.json();
                        const customers = customersResult.data || [];

                        // Calculate dashboard statistics from customers data
                        const totalCustomers = customers.length;

                        // Count active policies (assuming policies with future end dates are active)
                        const now = new Date();
                        const activePolicies = customers.filter(customer => {
                            if (customer.insurance_end_date) {
                                const endDate = new Date(customer.insurance_end_date);
                                return endDate > now;
                            }
                            return false;
                        }).length;

                        // Count expired policies 
                        const expiredPolicies = customers.filter(customer => {
                            if (customer.insurance_end_date) {
                                const endDate = new Date(customer.insurance_end_date);
                                return endDate <= now;
                            }
                            return false;
                        }).length;

                        // Count policies expiring soon (within 30 days) as pending
                        const thirtyDaysFromNow = new Date();
                        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                        const pendingClaims = customers.filter(customer => {
                            if (customer.insurance_end_date) {
                                const endDate = new Date(customer.insurance_end_date);
                                return endDate <= thirtyDaysFromNow && endDate > now;
                            }
                            return false;
                        }).length;

                        // Calculate total premium
                        const totalPremium = customers.reduce((sum, customer) => {
                            return sum + (parseFloat(customer.final_premium) || 0);
                        }, 0);

                        // Prepare policy distribution data for pie chart
                        const policyData = [
                            { name: 'Active', value: activePolicies, color: '#8884d8' },
                            { name: 'Expiring Soon', value: pendingClaims, color: '#82ca9d' },
                            { name: 'Expired', value: expiredPolicies, color: '#ffc658' }
                        ];

                        // Generate monthly data
                        const monthlyData = [];
                        for (let i = 5; i >= 0; i--) {
                            const date = new Date();
                            date.setMonth(date.getMonth() - i);
                            const monthName = date.toLocaleDateString('en-US', { month: 'short' });

                            // Count policies created in this month
                            const monthPolicies = customers.filter(customer => {
                                if (customer.created_at || customer.insurance_start_date) {
                                    const customerDate = new Date(customer.created_at || customer.insurance_start_date);
                                    return customerDate.getMonth() === date.getMonth() &&
                                        customerDate.getFullYear() === date.getFullYear();
                                }
                                return false;
                            }).length;

                            // For claims, we'll simulate some data since we don't have claims table
                            const claims = Math.floor(Math.random() * 15) + 5;

                            monthlyData.push({
                                month: monthName,
                                policies: monthPolicies,
                                claims: claims
                            });
                        }

                        // Generate recent activities from customer data
                        const recentActivities = customers
                            .sort((a, b) => new Date(b.created_at || b.insurance_start_date) - new Date(a.created_at || a.insurance_start_date))
                            .slice(0, 5)
                            .map((customer, index) => ({
                                id: index,
                                title: `New policy created for ${customer.customer_name}`,
                                subtitle: `Vehicle: ${customer.vehical_number} • Premium: ₹${customer.final_premium}`,
                                time: customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Recent'
                            }));

                        setDashboardData({
                            totalCustomers,
                            activePolicies,
                            pendingClaims,
                            totalPremium,
                            recentActivities,
                            policyData,
                            monthlyData
                        });
                    } else {
                        setError('Failed to fetch agent-specific data');
                    }
                }
            } catch (err) {
                console.error('Dashboard data fetch error:', err);
                setError('Failed to connect to server. Please ensure the backend is running.');
            } finally {
                setLoading(false);
            }
        };

        if (userData) {
            fetchDashboardData();
        }

        // Set up auto-refresh every 5 minutes
        const refreshInterval = setInterval(() => {
            if (userData && document.visibilityState === 'visible') {
                console.log('Auto-refreshing dashboard data...');
                fetchDashboardData();
            }
        }, 5 * 60 * 1000); // 5 minutes

        // Cleanup interval on unmount
        return () => {
            clearInterval(refreshInterval);
        };
    }, [userData]);

    // Format currency with more accuracy
    const formatCurrency = (amount) => {
        if (amount >= 10000000) { // 1 crore and above
            return `₹${(amount / 10000000).toFixed(2)}Cr`;
        } else if (amount >= 100000) { // 1 lakh and above
            return `₹${(amount / 100000).toFixed(2)}L`;
        } else if (amount >= 1000) { // 1 thousand and above
            return `₹${(amount / 1000).toFixed(2)}K`;
        }
        return `₹${amount.toFixed(2)}`;
    };

    // Show loading state
    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 120px)',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Loading Dashboard Data...
                </Typography>
            </Box>
        );
    }

    // Show error state
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (

        <Box sx={{
            p: { xs: 1, sm: 2, md: 3, lg: 4 },
            minHeight: 'calc(100vh - 120px)',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
            position: 'relative'
        }}>
            { }
            <Fade in={true} timeout={800}>
                <Box sx={{ mb: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3rem' },
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Dashboard Overview
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                        Welcome back, {userData?.agent_name || userData?.name || 'Agent'}! Here's what's happening with your insurance business today.
                    </Typography>
                    {!loading && (
                        <Chip
                            label={`Last updated: ${new Date().toLocaleTimeString()}`}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1, fontSize: '0.75rem' }}
                        />
                    )}
                </Box>
            </Fade>

            { }
            <Fade in={true} timeout={1000}>
                <Grid container spacing={{ xs: 2, sm: 2.5, md: 3, lg: 4 }} sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
                    { }
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                            <Card sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                height: { xs: 160, sm: 180, md: 200 },
                                borderRadius: { xs: 3, md: 4 },
                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
                                }
                            }}>
                                <CardContent sx={{
                                    p: { xs: 2, md: 3 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{
                                                fontSize: { xs: '0.875rem', md: '1rem' },
                                                fontWeight: 500,
                                                opacity: 0.9
                                            }}>
                                                Total Customers
                                            </Typography>
                                            <Typography variant="h3" sx={{
                                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                                fontWeight: 700,
                                                mt: { xs: 0.5, md: 1 }
                                            }}>
                                                {loading ? (
                                                    <Skeleton variant="text" width="80%" sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                                                ) : (
                                                    dashboardData.totalCustomers?.toLocaleString() || '0'
                                                )}
                                            </Typography>
                                        </Box>
                                        <Avatar sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            width: { xs: 40, md: 50 },
                                            height: { xs: 40, md: 50 }
                                        }}>
                                            <People sx={{ fontSize: { xs: 20, md: 24 } }} />
                                        </Avatar>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label="+12%"
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                fontSize: { xs: '0.7rem', md: '0.75rem' }
                                            }}
                                        />
                                        <Typography variant="body2" sx={{
                                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                                            opacity: 0.9
                                        }}>
                                            from last month
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>

                    { }
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                            <Card sx={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: 'white',
                                height: { xs: 160, sm: 180, md: 200 },
                                borderRadius: { xs: 3, md: 4 },
                                boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 40px rgba(240, 147, 251, 0.4)'
                                }
                            }}>
                                <CardContent sx={{
                                    p: { xs: 2, md: 3 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{
                                                fontSize: { xs: '0.875rem', md: '1rem' },
                                                fontWeight: 500,
                                                opacity: 0.9
                                            }}>
                                                Active Policies
                                            </Typography>
                                            <Typography variant="h3" sx={{
                                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                                fontWeight: 700,
                                                mt: { xs: 0.5, md: 1 }
                                            }}>
                                                {loading ? (
                                                    <Skeleton variant="text" width="80%" sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                                                ) : (
                                                    dashboardData.activePolicies?.toLocaleString() || '0'
                                                )}
                                            </Typography>
                                        </Box>
                                        <Avatar sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            width: { xs: 40, md: 50 },
                                            height: { xs: 40, md: 50 }
                                        }}>
                                            <Assignment sx={{ fontSize: { xs: 20, md: 24 } }} />
                                        </Avatar>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label="+5%"
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                fontSize: { xs: '0.7rem', md: '0.75rem' }
                                            }}
                                        />
                                        <Typography variant="body2" sx={{
                                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                                            opacity: 0.9
                                        }}>
                                            from last month
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>

                    { }
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                            <Card sx={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                color: 'white',
                                height: { xs: 160, sm: 180, md: 200 },
                                borderRadius: { xs: 3, md: 4 },
                                boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 40px rgba(79, 172, 254, 0.4)'
                                }
                            }}>
                                <CardContent sx={{
                                    p: { xs: 2, md: 3 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{
                                                fontSize: { xs: '0.875rem', md: '1rem' },
                                                fontWeight: 500,
                                                opacity: 0.9
                                            }}>
                                                Pending Claims
                                            </Typography>
                                            <Typography variant="h3" sx={{
                                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                                fontWeight: 700,
                                                mt: { xs: 0.5, md: 1 }
                                            }}>
                                                {dashboardData.pendingClaims}
                                            </Typography>
                                        </Box>
                                        <Avatar sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            width: { xs: 40, md: 50 },
                                            height: { xs: 40, md: 50 }
                                        }}>
                                            <Notifications sx={{ fontSize: { xs: 20, md: 24 } }} />
                                        </Avatar>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label="-8%"
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                fontSize: { xs: '0.7rem', md: '0.75rem' }
                                            }}
                                        />
                                        <Typography variant="body2" sx={{
                                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                                            opacity: 0.9
                                        }}>
                                            from last month
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>

                    { }
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Zoom in={true} style={{ transitionDelay: '400ms' }}>
                            <Card sx={{
                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                color: 'white',
                                height: { xs: 160, sm: 180, md: 200 },
                                borderRadius: { xs: 3, md: 4 },
                                boxShadow: '0 8px 32px rgba(250, 112, 154, 0.3)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 40px rgba(250, 112, 154, 0.4)'
                                }
                            }}>
                                <CardContent sx={{
                                    p: { xs: 2, md: 3 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{
                                                fontSize: { xs: '0.875rem', md: '1rem' },
                                                fontWeight: 500,
                                                opacity: 0.9
                                            }}>
                                                Total Premium
                                            </Typography>
                                            <Typography variant="h3" sx={{
                                                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                                                fontWeight: 700,
                                                mt: { xs: 0.5, md: 1 }
                                            }}>
                                                {formatCurrency(dashboardData.totalPremium)}
                                            </Typography>
                                        </Box>
                                        <Avatar sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            width: { xs: 40, md: 50 },
                                            height: { xs: 40, md: 50 }
                                        }}>
                                            <AccountBalance sx={{ fontSize: { xs: 20, md: 24 } }} />
                                        </Avatar>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label="+18%"
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                fontSize: { xs: '0.7rem', md: '0.75rem' }
                                            }}
                                        />
                                        <Typography variant="body2" sx={{
                                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                                            opacity: 0.9
                                        }}>
                                            from last month
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>
                </Grid>
            </Fade>

            { }
            <Fade in={true} timeout={1200}>
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
                    { }
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{
                            p: { xs: 2, sm: 3, md: 4 },
                            borderRadius: { xs: 3, md: 4 },
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            height: '100%',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                            }
                        }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.25rem' },
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    mb: { xs: 2, md: 3 }
                                }}
                            >
                                Policy Distribution
                            </Typography>
                            { }
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dashboardData.policyData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {dashboardData.policyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>


                    { }
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{
                            p: { xs: 2, sm: 3, md: 4 },
                            borderRadius: { xs: 3, md: 4 },
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            height: '100%',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                            }
                        }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.25rem' },
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    mb: { xs: 2, md: 3 }
                                }}
                            >
                                Monthly Trends
                            </Typography>
                            { }
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dashboardData.monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="policies" fill="#8884d8" name="New Policies" />
                                    <Bar dataKey="claims" fill="#82ca9d" name="Claims Filed" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Fade>

            { }
            <Fade in={true} timeout={1600}>
                <Box sx={{ mt: 4 }}>  { }
                    <Typography variant="h6" gutterBottom>
                        Recent Activities
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                {dashboardData.recentActivities.length > 0 ? (
                                    dashboardData.recentActivities.map((activity) => (
                                        <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle2">{activity.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">{activity.subtitle} • {activity.time}</Typography>
                                            </Box>
                                        </Box>
                                    ))
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No recent activities found
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Fade>
        </Box>
    );
};

export default DashboardPage;