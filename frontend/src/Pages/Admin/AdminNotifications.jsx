import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Avatar,
    Chip,
    Button,
    IconButton,
    Divider,
    Badge,
    Tab,
    Tabs,
    Alert,
    Snackbar,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Error as ErrorIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    Send as SendIcon,
    Person as PersonIcon,
    Assignment as AssignmentIcon,
    TrendingUp as TrendingUpIcon,
    Security as SecurityIcon
} from '@mui/icons-material';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openDialog, setOpenDialog] = useState(false);
    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
        type: 'info',
        targetAgents: 'all'
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        // Mock data - replace with actual API call
        const mockNotifications = [
            {
                id: 1,
                type: 'warning',
                title: 'Policy Expiration Alert',
                message: '15 policies are expiring within the next 30 days. Please contact customers for renewal.',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                read: false,
                priority: 'high',
                category: 'policy'
            },
            {
                id: 2,
                type: 'success',
                title: 'New Agent Registration',
                message: 'John Smith has successfully registered as a new agent.',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                read: true,
                priority: 'medium',
                category: 'agent'
            },
            {
                id: 3,
                type: 'info',
                title: 'System Maintenance Scheduled',
                message: 'System maintenance is scheduled for this weekend from 2 AM to 6 AM.',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                read: false,
                priority: 'medium',
                category: 'system'
            },
            {
                id: 4,
                type: 'error',
                title: 'Payment Processing Issue',
                message: 'There was an issue processing 3 premium payments. Manual intervention required.',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                read: false,
                priority: 'high',
                category: 'payment'
            },
            {
                id: 5,
                type: 'info',
                title: 'Monthly Report Generated',
                message: 'The monthly performance report has been generated and is ready for review.',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                read: true,
                priority: 'low',
                category: 'report'
            }
        ];

        setNotifications(mockNotifications);
    };

    const getNotificationIcon = (type) => {
        const iconProps = { sx: { color: '#fff' } };
        switch (type) {
            case 'warning':
                return <WarningIcon {...iconProps} />;
            case 'error':
                return <ErrorIcon {...iconProps} />;
            case 'success':
                return <CheckCircleIcon {...iconProps} />;
            default:
                return <InfoIcon {...iconProps} />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'warning':
                return '#f59e0b';
            case 'error':
                return '#ef4444';
            case 'success':
                return '#22c55e';
            default:
                return '#3b82f6';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            default:
                return 'info';
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else {
            return `${days} days ago`;
        }
    };

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const deleteNotification = (notificationId) => {
        setNotifications(prev =>
            prev.filter(notification => notification.id !== notificationId)
        );
        setSnackbar({
            open: true,
            message: 'Notification deleted successfully',
            severity: 'success'
        });
        handleMenuClose();
    };

    const handleMenuOpen = (event, notification) => {
        setAnchorEl(event.currentTarget);
        setSelectedNotification(notification);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedNotification(null);
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const filterNotifications = () => {
        switch (currentTab) {
            case 1:
                return notifications.filter(n => !n.read);
            case 2:
                return notifications.filter(n => n.priority === 'high');
            case 3:
                return notifications.filter(n => n.category === 'policy');
            case 4:
                return notifications.filter(n => n.category === 'agent');
            default:
                return notifications;
        }
    };

    const handleSendNotification = async () => {
        // Mock sending notification
        const notification = {
            id: Date.now(),
            type: newNotification.type,
            title: newNotification.title,
            message: newNotification.message,
            timestamp: new Date(),
            read: false,
            priority: 'medium',
            category: 'custom'
        };

        setNotifications(prev => [notification, ...prev]);
        setSnackbar({
            open: true,
            message: 'Notification sent successfully',
            severity: 'success'
        });
        setOpenDialog(false);
        setNewNotification({
            title: '',
            message: '',
            type: 'info',
            targetAgents: 'all'
        });
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Notifications
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage system alerts and send notifications to agents
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        }
                    }}
                >
                    Send Notification
                </Button>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom variant="body2">
                                        Total Notifications
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                                        {notifications.length}
                                    </Typography>
                                </Box>
                                <NotificationsIcon sx={{ fontSize: 40, color: '#3b82f6', opacity: 0.7 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom variant="body2">
                                        Unread
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#f59e0b' }}>
                                        {unreadCount}
                                    </Typography>
                                </Box>
                                <Badge badgeContent={unreadCount} color="warning">
                                    <NotificationsIcon sx={{ fontSize: 40, color: '#f59e0b', opacity: 0.7 }} />
                                </Badge>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom variant="body2">
                                        High Priority
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#ef4444' }}>
                                        {highPriorityCount}
                                    </Typography>
                                </Box>
                                <WarningIcon sx={{ fontSize: 40, color: '#ef4444', opacity: 0.7 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom variant="body2">
                                        This Week
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#22c55e' }}>
                                        {notifications.filter(n =>
                                            (new Date() - n.timestamp) < 7 * 24 * 60 * 60 * 1000
                                        ).length}
                                    </Typography>
                                </Box>
                                <TrendingUpIcon sx={{ fontSize: 40, color: '#22c55e', opacity: 0.7 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Notifications List */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label="All" />
                        <Tab label={`Unread (${unreadCount})`} />
                        <Tab label={`High Priority (${highPriorityCount})`} />
                        <Tab label="Policy Alerts" />
                        <Tab label="Agent Updates" />
                    </Tabs>
                </Box>
                <CardContent sx={{ p: 0 }}>
                    <List>
                        {filterNotifications().length === 0 ? (
                            <ListItem>
                                <ListItemText
                                    primary="No notifications found"
                                    secondary="There are no notifications in this category"
                                />
                            </ListItem>
                        ) : (
                            filterNotifications().map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem
                                        sx={{
                                            backgroundColor: notification.read ? 'transparent' : '#f8fafc',
                                            '&:hover': { backgroundColor: '#f1f5f9' }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: getNotificationColor(notification.type),
                                                    width: 48,
                                                    height: 48
                                                }}
                                            >
                                                {getNotificationIcon(notification.type)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: notification.read ? 400 : 600,
                                                            flexGrow: 1
                                                        }}
                                                    >
                                                        {notification.title}
                                                    </Typography>
                                                    <Chip
                                                        label={notification.priority}
                                                        size="small"
                                                        color={getPriorityColor(notification.priority)}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mb: 0.5 }}
                                                    >
                                                        {notification.message}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        <ScheduleIcon sx={{ fontSize: 12, mr: 0.5 }} />
                                                        {formatTimestamp(notification.timestamp)}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {!notification.read && (
                                                    <Button
                                                        size="small"
                                                        onClick={() => markAsRead(notification.id)}
                                                    >
                                                        Mark as Read
                                                    </Button>
                                                )}
                                                <IconButton
                                                    onClick={(e) => handleMenuOpen(e, notification)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < filterNotifications().length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </CardContent>
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {selectedNotification && !selectedNotification.read && (
                    <MenuItem onClick={() => {
                        markAsRead(selectedNotification.id);
                        handleMenuClose();
                    }}>
                        Mark as Read
                    </MenuItem>
                )}
                <MenuItem
                    onClick={() => deleteNotification(selectedNotification?.id)}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Send Notification Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Send New Notification</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notification Title"
                                value={newNotification.title}
                                onChange={(e) => setNewNotification({
                                    ...newNotification,
                                    title: e.target.value
                                })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Message"
                                multiline
                                rows={4}
                                value={newNotification.message}
                                onChange={(e) => setNewNotification({
                                    ...newNotification,
                                    message: e.target.value
                                })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Notification Type"
                                value={newNotification.type}
                                onChange={(e) => setNewNotification({
                                    ...newNotification,
                                    type: e.target.value
                                })}
                                SelectProps={{ native: true }}
                            >
                                <option value="info">Information</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                                <option value="success">Success</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Target Agents"
                                value={newNotification.targetAgents}
                                onChange={(e) => setNewNotification({
                                    ...newNotification,
                                    targetAgents: e.target.value
                                })}
                                SelectProps={{ native: true }}
                            >
                                <option value="all">All Agents</option>
                                <option value="active">Active Agents Only</option>
                                <option value="specific">Specific Agents</option>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleSendNotification}
                        variant="contained"
                        startIcon={<SendIcon />}
                        disabled={!newNotification.title || !newNotification.message}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            }
                        }}
                    >
                        Send Notification
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default AdminNotifications;