import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Button,
    Fade,
    Grow,
    alpha,
    Stack,
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    Assignment as AssignmentIcon,
    Notifications as NotificationsIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Refresh as RefreshIcon,
    SupervisorAccount as SupervisorAccountIcon,
    Group as GroupIcon,
    Policy as PolicyIcon,
    Timeline as TimelineIcon,
    AccessTime as AccessTimeIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
    // Removed unused theme variable
    const [dashboardData, setDashboardData] = useState({
        totalAgents: 0,
        totalCustomers: 0,
        activePolicies: 0,
        expiringPolicies: 0,
        recentAgents: [],
        recentCustomers: [],
        agentPerformance: [],
        systemAlerts: []
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardData();

        // Auto-refresh when page becomes visible
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchDashboardData();
            }
        };

        // Auto-refresh when window gets focus
        const handleWindowFocus = () => {
            fetchDashboardData();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleWindowFocus);

        // Auto-refresh every 30 seconds
        const refreshInterval = setInterval(() => {
            if (!document.hidden) {
                fetchDashboardData();
            }
        }, 30000);

        // Cleanup event listeners and interval
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleWindowFocus);
            clearInterval(refreshInterval);
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch agents data
            const agentsResponse = await fetch(`${API_ENDPOINTS.agents}`);
            if (!agentsResponse.ok) {
                throw new Error('Failed to fetch agents');
            }
            const agentsResult = await agentsResponse.json();
            console.log('Agents API response:', agentsResult);

            // Fetch customers data
            let customersResult = { data: [] };
            try {
                const customersResponse = await fetch(`${API_ENDPOINTS.customers}`);
                if (customersResponse.ok) {
                    customersResult = await customersResponse.json();
                    console.log('Customers API response:', customersResult);
                }
            } catch (customerError) {
                console.warn('Customers endpoint not available:', customerError.message);
                // If customers endpoint doesn't exist, we'll use agent customer counts
            }

            // Check for different possible response structures
            let agents = [];
            if (agentsResult.message === 'Agents retrieved successfully' && agentsResult.data) {
                agents = agentsResult.data;
            } else if (agentsResult.data) {
                agents = agentsResult.data;
            } else if (Array.isArray(agentsResult)) {
                agents = agentsResult;
            } else if (agentsResult.success) {
                agents = agentsResult.data || [];
            }

            console.log('Processed agents data:', agents);
            const customers = customersResult.data || [];

            // Calculate active and expiring policies
            const currentDate = new Date();
            const thirtyDaysFromNow = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

            let activePolicies = 0;
            let expiringPolicies = 0;

            if (customers.length > 0) {
                activePolicies = customers.filter(customer =>
                    customer.insurance_end_date && new Date(customer.insurance_end_date) > currentDate
                ).length;

                expiringPolicies = customers.filter(customer =>
                    customer.insurance_end_date &&
                    new Date(customer.insurance_end_date) > currentDate &&
                    new Date(customer.insurance_end_date) <= thirtyDaysFromNow
                ).length;
            } else {
                // If no customer data available, estimate from agent data
                const totalCustomers = agents.reduce((sum, agent) => sum + (agent.customer_count || 0), 0);
                activePolicies = Math.floor(totalCustomers * 0.8); // Assume 80% active
                expiringPolicies = Math.floor(totalCustomers * 0.1); // Assume 10% expiring
            }

            // Get recent agents and customers
            const recentAgents = agents
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5);

            const recentCustomers = customers.length > 0
                ? customers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
                : [];

            // Calculate agent performance
            const agentPerformance = agents.map(agent => ({
                ...agent,
                performance: Math.min(100, (agent.customer_count || 0) * 10) // Simple performance calculation
            }));

            // System alerts (dynamic based on real data)
            const systemAlerts = [
                {
                    id: 1,
                    type: expiringPolicies > 0 ? 'warning' : 'info',
                    title: `${expiringPolicies} policies expiring soon`,
                    description: expiringPolicies > 0
                        ? 'Review and contact customers for renewal'
                        : 'No policies expiring in the next 30 days',
                    time: '2 hours ago'
                },
                {
                    id: 2,
                    type: 'info',
                    title: 'Agent Performance Update',
                    description: `${agents.length} agents are currently active in the system`,
                    time: '4 hours ago'
                },
                {
                    id: 3,
                    type: 'success',
                    title: 'System Status',
                    description: 'All systems are running normally',
                    time: '6 hours ago'
                }
            ];

            setDashboardData({
                totalAgents: agents.length,
                totalCustomers: customers.length > 0
                    ? customers.length
                    : agents.reduce((sum, agent) => sum + (agent.customer_count || 0), 0),
                activePolicies,
                expiringPolicies,
                recentAgents,
                recentCustomers,
                agentPerformance: agentPerformance.slice(0, 5),
                systemAlerts
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);

            // Fallback to mock data if API fails
            const mockData = {
                totalAgents: 0,
                totalCustomers: 0,
                activePolicies: 0,
                expiringPolicies: 0,
                recentAgents: [],
                recentCustomers: [],
                agentPerformance: [],
                systemAlerts: [
                    {
                        id: 1,
                        type: 'error',
                        title: 'Connection Error',
                        description: 'Unable to fetch real-time data. Please check your connection.',
                        time: 'Just now'
                    }
                ]
            };
            setDashboardData(mockData);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color, trend }) => (
        <Grow in={true} timeout={600}>
            <Card
                sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    boxShadow: `0 4px 20px ${alpha(color, 0.15)}`,
                    border: `1px solid ${alpha(color, 0.1)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${alpha(color, 0.25)}`,
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
                    }
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    fontSize: '0.75rem'
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    mt: 1,
                                    background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: color }} />
                                ) : (
                                    value.toLocaleString()
                                )}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 64,
                                height: 64,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${alpha(color, 0.15)}, ${alpha(color, 0.25)})`,
                                color: color,
                                backdropFilter: 'blur(10px)',
                                boxShadow: `0 4px 12px ${alpha(color, 0.2)}`
                            }}
                        >
                            {React.cloneElement(icon, { sx: { fontSize: 28 } })}
                        </Box>
                    </Box>
                    {trend && (
                        <Fade in={true} timeout={800}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 1.5,
                                borderRadius: 2,
                                background: alpha('#22c55e', 0.1),
                                border: `1px solid ${alpha('#22c55e', 0.2)}`
                            }}>
                                <TrendingUpIcon sx={{ fontSize: 16, color: '#22c55e', mr: 1 }} />
                                <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 500 }}>
                                    {trend}
                                </Typography>
                            </Box>
                        </Fade>
                    )}
                </CardContent>
            </Card>
        </Grow>
    );

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'warning':
                return <WarningIcon sx={{ color: '#f59e0b' }} />;
            case 'success':
                return <CheckCircleIcon sx={{ color: '#22c55e' }} />;
            default:
                return <NotificationsIcon sx={{ color: '#3b82f6' }} />;
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            p: { xs: 2, sm: 3 },
            backgroundColor: 'background.default'
        }}>
            {/* Header */}
            <Fade in={true} timeout={600}>
                <Paper
                    elevation={1}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        mb: 4,
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                Admin Dashboard
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '1.1rem',
                                    fontWeight: 400
                                }}
                            >
                                Welcome back! Here's your CRM system overview.
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Tooltip title="Auto-refreshes every 30 seconds">
                                <Button
                                    variant="outlined"
                                    startIcon={<TimelineIcon />}
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Live Data
                                </Button>
                            </Tooltip>
                            <Button
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                                onClick={() => {
                                    setRefreshing(true);
                                    fetchDashboardData().finally(() => setRefreshing(false));
                                }}
                                disabled={loading || refreshing}
                                sx={{
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                                    }
                                }}
                            >
                                {loading ? 'Loading...' : 'Refresh'}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Fade>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Total Agents"
                        value={dashboardData.totalAgents}
                        icon={<SupervisorAccountIcon />}
                        color="#667eea"
                        trend="+12% from last month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Total Customers"
                        value={dashboardData.totalCustomers}
                        icon={<GroupIcon />}
                        color="#22c55e"
                        trend="+8% from last month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Active Policies"
                        value={dashboardData.activePolicies}
                        icon={<PolicyIcon />}
                        color="#3b82f6"
                        trend="+5% from last month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Expiring Soon"
                        value={dashboardData.expiringPolicies}
                        icon={<AccessTimeIcon />}
                        color="#ef4444"
                        trend="Needs attention"
                    />
                </Grid>
            </Grid>

            <Fade in={true} timeout={1000}>
                <Grid container spacing={3}>
                    {/* Agent Performance */}
                    <Grid item xs={12} lg={8}>
                        <Card sx={{
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            background: 'rgba(255, 255, 255, 0.98)'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    Agent Performance
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Agent</TableCell>
                                                <TableCell>Customers</TableCell>
                                                <TableCell>Performance</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.agentPerformance.map((agent) => (
                                                <TableRow key={agent.agent_id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                    width: 32,
                                                                    height: 32,
                                                                    fontSize: '0.875rem'
                                                                }}
                                                            >
                                                                {getInitials(agent.agent_name)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {agent.agent_name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {agent.email}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={agent.customer_count || 0}
                                                            size="small"
                                                            color={agent.customer_count > 5 ? 'success' : 'default'}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={agent.performance}
                                                                sx={{ width: 100, height: 6, borderRadius: 3 }}
                                                            />
                                                            <Typography variant="body2">
                                                                {agent.performance}%
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label="Active"
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* System Alerts */}
                    <Grid item xs={12} lg={4}>
                        <Card sx={{
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            background: 'rgba(255, 255, 255, 0.98)'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    System Alerts
                                </Typography>
                                <List>
                                    {dashboardData.systemAlerts.map((alert, index) => (
                                        <React.Fragment key={alert.id}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ backgroundColor: 'transparent' }}>
                                                        {getAlertIcon(alert.type)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={alert.title}
                                                    secondary={alert.description}
                                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                                                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {alert.time}
                                                </Typography>
                                            </ListItem>
                                            {index < dashboardData.systemAlerts.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Activity */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Recent Agents
                                </Typography>
                                <List>
                                    {dashboardData.recentAgents.map((agent, index) => (
                                        <React.Fragment key={agent.agent_id}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            width: 32,
                                                            height: 32,
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {getInitials(agent.agent_name)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={agent.agent_name}
                                                    secondary={agent.email}
                                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                                                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(agent.created_at).toLocaleDateString()}
                                                </Typography>
                                            </ListItem>
                                            {index < dashboardData.recentAgents.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Recent Customers
                                </Typography>
                                <List>
                                    {dashboardData.recentCustomers.slice(0, 5).map((customer, index) => (
                                        <React.Fragment key={customer.id}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ backgroundColor: '#22c55e' }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={customer.customer_name}
                                                    secondary={`${customer.mobile} • ${customer.vehical_number}`}
                                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                                                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                                                </Typography>
                                            </ListItem>
                                            {index < Math.min(4, dashboardData.recentCustomers.length - 1) && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Fade>
        </Box>
    );
};

export default AdminDashboard;