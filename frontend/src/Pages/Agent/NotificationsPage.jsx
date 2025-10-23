

import React, { useState } from 'react';


import {
    Box,                    
    Typography,             
    Card,                   
    CardContent,            
    List,                   
    ListItem,               
    ListItemIcon,           
    ListItemText,           
    ListItemSecondaryAction, 
    IconButton,             
    Badge,                  
    Chip,                   
    Tabs,                   
    Tab,                    
    Button,                 
    Divider,               
    Dialog,                 
    DialogTitle,            
    DialogContent,          
    DialogActions          
} from '@mui/material';


import {
    TextField,              
    FormControl,            
    InputLabel,             
    Select,                 
    MenuItem               
} from '@mui/material';


import {
    Notifications as NotificationsIcon, 
    Warning as WarningIcon,             
    Info as InfoIcon,                   
    CheckCircle as CheckCircleIcon,     
    Error as ErrorIcon,                 
    Delete as DeleteIcon,               
    MarkEmailRead as MarkReadIcon,      
    Add as AddIcon,                     
    Send as SendIcon                    
} from '@mui/icons-material';


const NotificationsPage = () => {
    
    
    

    
    const [activeTab, setActiveTab] = useState(0);

    
    const [openDialog, setOpenDialog] = useState(false);
    
    
    

    
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'warning',     
            title: 'Policy Expiry Alert',
            message: '5 policies are expiring within the next 30 days. Please contact customers for renewal.',
            timestamp: '2024-09-28T10:30:00', 
            read: false,         
            priority: 'high'     
        },
        {
            id: 2,
            type: 'info',        
            title: 'New User Registration',
            message: '3 new users registered today. Welcome Rahul Sharma, Priya Patel, and Amit Kumar.',
            timestamp: '2024-09-28T09:15:00',
            read: false,         
            priority: 'medium'   
        },
        {
            id: 3,
            type: 'success',     
            title: 'System Update Complete',
            message: 'CRM system has been successfully updated to version 2.1.0 with new features.',
            timestamp: '2024-09-28T08:00:00',
            read: true,          
            priority: 'low'      
        },
        {
            id: 4,
            type: 'error',       
            title: 'Payment Failed',
            message: 'Premium payment failed for policy MH01AB1234. Please follow up with customer.',
            timestamp: '2024-09-27T16:45:00',
            read: false,         
            priority: 'high'     
        },
        {
            id: 5,
            type: 'info',        
            title: 'Backup Completed',
            message: 'Daily database backup completed successfully at 2:00 AM.',
            timestamp: '2024-09-27T02:00:00',
            read: true,          
            priority: 'low'      
        }
    ]);

    const [newNotification, setNewNotification] = useState({
        type: 'info',
        title: '',
        message: '',
        priority: 'medium'
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning':
                return <WarningIcon color="warning" />;
            case 'error':
                return <ErrorIcon color="error" />;
            case 'success':
                return <CheckCircleIcon color="success" />;
            case 'info':
            default:
                return <InfoIcon color="info" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
            default:
                return 'default';
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return date.toLocaleDateString();
    };

    const filterNotifications = () => {
        switch (activeTab) {
            case 0:
                return notifications; 
            case 1:
                return notifications.filter(n => !n.read); 
            case 2:
                return notifications.filter(n => n.read); 
            case 3:
                return notifications.filter(n => n.priority === 'high'); 
            default:
                return notifications;
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const handleCreateNotification = () => {
        const notification = {
            ...newNotification,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false
        };
        setNotifications([notification, ...notifications]);
        setNewNotification({ type: 'info', title: '', message: '', priority: 'medium' });
        setOpenDialog(false);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Box sx={{
            p: { xs: 1, sm: 2, md: 3, lg: 4 },
            minHeight: 'calc(100vh - 120px)',
            backgroundColor: '#f8fafc',
            position: 'relative'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                mb: { xs: 3, md: 4 },
                gap: { xs: 2, md: 0 }
            }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                        fontWeight: 700,
                        color: '#1e293b',
                        textAlign: { xs: 'center', md: 'left' },
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: { xs: '50%', md: 0 },
                            transform: { xs: 'translateX(-50%)', md: 'none' },
                            width: 60,
                            height: 4,
                            backgroundColor: '#667eea',
                            borderRadius: 2
                        }
                    }}
                >
                    <Badge
                        badgeContent={unreadCount}
                        color="error"
                        sx={{
                            '& .MuiBadge-badge': {
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                                minWidth: { xs: 18, md: 22 },
                                height: { xs: 18, md: 22 }
                            }
                        }}
                    >
                        Notifications
                    </Badge>
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{
                        borderRadius: { xs: 2, md: 3 },
                        px: { xs: 2, md: 3 },
                        py: { xs: 1, md: 1.5 },
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    Create Notification
                </Button>
            </Box>

            {}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(4, 1fr)'
                },
                gap: { xs: 2, sm: 2.5, md: 3 },
                mb: { xs: 3, md: 4 }
            }}>
                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <NotificationsIcon sx={{ color: '#667eea', mr: 2, fontSize: '2rem' }} />
                            <Box>
                                <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 700 }}>{notifications.length}</Typography>
                                <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>Total Notifications</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MarkReadIcon sx={{ color: '#10b981', mr: 2, fontSize: '2rem' }} />
                            <Box>
                                <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 700 }}>{unreadCount}</Typography>
                                <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>Unread Messages</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WarningIcon sx={{ color: '#f59e0b', mr: 2, fontSize: '2rem' }} />
                            <Box>
                                <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 700 }}>
                                    {notifications.filter(n => n.priority === 'high').length}
                                </Typography>
                                <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>High Priority</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CheckCircleIcon sx={{ color: '#6366f1', mr: 2, fontSize: '2rem' }} />
                            <Box>
                                <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 700 }}>
                                    {notifications.filter(n => n.read).length}
                                </Typography>
                                <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>Read Messages</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {}
            <Box sx={{
                mb: 3,
                '& .MuiTabs-root': {
                    backgroundColor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                },
                '& .MuiTab-root': {
                    color: '#64748b',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    py: 2,
                    '&.Mui-selected': {
                        color: '#667eea',
                        backgroundColor: '#f1f5f9'
                    },
                    '&:hover': {
                        color: '#667eea',
                        backgroundColor: '#f8fafc'
                    }
                },
                '& .MuiTabs-indicator': {
                    backgroundColor: '#667eea',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                }
            }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    <Tab label="All" />
                    <Tab label={`Unread (${unreadCount})`} />
                    <Tab label="Read" />
                    <Tab label="Important" />
                </Tabs>
            </Box>

            {}
            <Card sx={{
                backgroundColor: 'white',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden'
            }}>
                <List>
                    {filterNotifications().map((notification, index) => (
                        <React.Fragment key={notification.id}>
                            <ListItem
                                sx={{
                                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                                    borderLeft: notification.read ? 'none' : '4px solid',
                                    borderLeftColor: notification.read ? 'transparent' : 'primary.main'
                                }}
                            >
                                <ListItemIcon>
                                    {getIcon(notification.type)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle1" component="span">
                                                {notification.title}
                                            </Typography>
                                            <Chip
                                                label={notification.priority}
                                                size="small"
                                                color={getPriorityColor(notification.priority)}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled">
                                                {formatTimestamp(notification.timestamp)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    {!notification.read && (
                                        <IconButton
                                            edge="end"
                                            onClick={() => markAsRead(notification.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            <MarkReadIcon />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        edge="end"
                                        onClick={() => deleteNotification(notification.id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            {index < filterNotifications().length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Card>

            {}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={newNotification.type}
                                onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                            >
                                <MenuItem value="info">Info</MenuItem>
                                <MenuItem value="warning">Warning</MenuItem>
                                <MenuItem value="error">Error</MenuItem>
                                <MenuItem value="success">Success</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Title"
                            value={newNotification.title}
                            onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Message"
                            value={newNotification.message}
                            onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={newNotification.priority}
                                onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value })}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={handleCreateNotification}
                        disabled={!newNotification.title || !newNotification.message}
                    >
                        Send Notification
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NotificationsPage;