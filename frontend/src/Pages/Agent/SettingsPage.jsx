

import React, { useState } from 'react';


import {
    Box,                    
    Typography,             
    Card,                   
    CardContent,            
    CardHeader,             
    Grid,                   
    Divider,               
    Tab,                    
    Tabs,                   
    Alert,                  
    Snackbar,              
    List,                   
    ListItem,               
    ListItemText,           
    ListItemSecondaryAction, 
    Dialog,                 
    DialogTitle,            
    DialogContent,          
    DialogActions,          
    Fade,                   
    Zoom                   
} from '@mui/material';


import {
    TextField,              
    Button,                 
    Switch,                 
    FormControlLabel,       
    FormControl,            
    InputLabel,             
    Select,                 
    MenuItem,               
    IconButton             
} from '@mui/material';


import {
    Save as SaveIcon,           
    Security as SecurityIcon,   
    Notifications as NotificationsIcon, 
    Palette as PaletteIcon,     
    Storage as StorageIcon,     
    Edit as EditIcon,           
    Delete as DeleteIcon,       
    Add as AddIcon,             
    Backup as BackupIcon,       
    CloudDownload as RestoreIcon 
} from '@mui/icons-material';


const SettingsPage = () => {
    
    
    

    
    const [activeTab, setActiveTab] = useState(0);

    
    const [showSnackbar, setShowSnackbar] = useState(false);    
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Success/error message
    const [openUserDialog, setOpenUserDialog] = useState(false); // User management dialog

    // ============================================================================
    // SETTINGS STATE MANAGEMENT
    // ============================================================================

    /**
     * GENERAL SETTINGS STATE
     * 
     * Core application configuration including company information,
     * contact details, and regional preferences.
     * These settings affect system-wide display and behavior.
     */
    const [generalSettings, setGeneralSettings] = useState({
        companyName: 'Vehicle Insurance CRM',    
        contactEmail: 'admin@crm.com',          
        phoneNumber: '+91 9876543210',          
        address: 'Mumbai, Maharashtra, India',  
        timezone: 'Asia/Kolkata',               
        dateFormat: 'DD/MM/YYYY',               
        currency: 'INR'                         
    });

    
    const [securitySettings, setSecuritySettings] = useState({
        enableTwoFactor: false,      
        sessionTimeout: 30,          
        passwordMinLength: 8,        
        enableLoginAlerts: true,     
        maxLoginAttempts: 5          
    });

    
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,        
        pushNotifications: false,        
        policyExpiryAlerts: true,       
        newUserAlerts: true,            
        systemUpdateAlerts: false,      
        notificationFrequency: 'immediate' 
    });

    
    const [themeSettings, setThemeSettings] = useState({
        darkMode: false,               
        primaryColor: '#1976d2',       
        sidebarCollapsed: false,       
        compactMode: false             
    });

    
    const [systemUsers] = useState([
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@crm.com',
            role: 'Administrator',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Sales Manager',
            email: 'sales@crm.com',
            role: 'Manager',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Support Agent',
            email: 'support@crm.com',
            role: 'Agent',
            status: 'Inactive'
        }
    ]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSave = (settingType) => {
        setSnackbarMessage(`${settingType} settings saved successfully!`);
        setShowSnackbar(true);
    };

    const handleGeneralSettingChange = (field, value) => {
        setGeneralSettings({ ...generalSettings, [field]: value });
    };

    const handleSecuritySettingChange = (field, value) => {
        setSecuritySettings({ ...securitySettings, [field]: value });
    };

    const handleNotificationSettingChange = (field, value) => {
        setNotificationSettings({ ...notificationSettings, [field]: value });
    };

    const handleThemeSettingChange = (field, value) => {
        setThemeSettings({ ...themeSettings, [field]: value });
    };

    const TabPanel = ({ children, value, index }) => (
        <div hidden={value !== index}>
            {value === index && (
                <Zoom in timeout={600} style={{ transitionDelay: value === index ? '100ms' : '0ms' }}>
                    <Box sx={{ pt: 0 }}>{children}</Box>
                </Zoom>
            )}
        </div>
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            p: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 4, sm: 6 }
        }}>
            <Fade in timeout={800}>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        color: '#1e293b',
                        fontWeight: 700,
                        textAlign: { xs: 'center', md: 'left' },
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                        mb: { xs: 3, md: 4 },
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
                    System Settings
                </Typography>
            </Fade>

            <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Box sx={{
                    mb: { xs: 3, md: 4 },
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
                        <Tab label="General" />
                        <Tab label="Security" />
                        <Tab label="Notifications" />
                        <Tab label="Appearance" />
                        <Tab label="Users" />
                        <Tab label="Data" />
                    </Tabs>
                </Box>
            </Fade>

            {}
            <TabPanel value={activeTab} index={0}>
                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardHeader
                        title="General Settings"
                        sx={{
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                            color: '#1e293b',
                            '& .MuiCardHeader-title': {
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                fontWeight: 600
                            }
                        }}
                    />
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    value={generalSettings.companyName}
                                    onChange={(e) => handleGeneralSettingChange('companyName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Email"
                                    value={generalSettings.contactEmail}
                                    onChange={(e) => handleGeneralSettingChange('contactEmail', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={generalSettings.phoneNumber}
                                    onChange={(e) => handleGeneralSettingChange('phoneNumber', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Timezone</InputLabel>
                                    <Select
                                        value={generalSettings.timezone}
                                        onChange={(e) => handleGeneralSettingChange('timezone', e.target.value)}
                                    >
                                        <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                                        <MenuItem value="UTC">UTC</MenuItem>
                                        <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Address"
                                    value={generalSettings.address}
                                    onChange={(e) => handleGeneralSettingChange('address', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSave('General')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    Save General Settings
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </TabPanel>

            {}
            <TabPanel value={activeTab} index={1}>
                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardHeader
                        title="Security Settings"
                        avatar={<SecurityIcon sx={{ color: '#667eea' }} />}
                        sx={{
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                            color: '#1e293b',
                            '& .MuiCardHeader-title': {
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                fontWeight: 600
                            }
                        }}
                    />
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={securitySettings.enableTwoFactor}
                                            onChange={(e) => handleSecuritySettingChange('enableTwoFactor', e.target.checked)}
                                        />
                                    }
                                    label="Enable Two-Factor Authentication"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={securitySettings.enableLoginAlerts}
                                            onChange={(e) => handleSecuritySettingChange('enableLoginAlerts', e.target.checked)}
                                        />
                                    }
                                    label="Enable Login Alerts"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Session Timeout (minutes)"
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Password Minimum Length"
                                    value={securitySettings.passwordMinLength}
                                    onChange={(e) => handleSecuritySettingChange('passwordMinLength', parseInt(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSave('Security')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    Save Security Settings
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </TabPanel>

            {}
            <TabPanel value={activeTab} index={2}>
                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardHeader
                        title="Notification Preferences"
                        avatar={<NotificationsIcon sx={{ color: '#667eea' }} />}
                        sx={{
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                            color: '#1e293b',
                            '& .MuiCardHeader-title': {
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                fontWeight: 600
                            }
                        }}
                    />
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={notificationSettings.emailNotifications}
                                            onChange={(e) => handleNotificationSettingChange('emailNotifications', e.target.checked)}
                                        />
                                    }
                                    label="Email Notifications"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={notificationSettings.policyExpiryAlerts}
                                            onChange={(e) => handleNotificationSettingChange('policyExpiryAlerts', e.target.checked)}
                                        />
                                    }
                                    label="Policy Expiry Alerts"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={notificationSettings.newUserAlerts}
                                            onChange={(e) => handleNotificationSettingChange('newUserAlerts', e.target.checked)}
                                        />
                                    }
                                    label="New User Registration Alerts"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Notification Frequency</InputLabel>
                                    <Select
                                        value={notificationSettings.notificationFrequency}
                                        onChange={(e) => handleNotificationSettingChange('notificationFrequency', e.target.value)}
                                    >
                                        <MenuItem value="immediate">Immediate</MenuItem>
                                        <MenuItem value="hourly">Hourly</MenuItem>
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSave('Notification')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    Save Notification Settings
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </TabPanel>

            {}
            <TabPanel value={activeTab} index={3}>
                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardHeader
                        title="Appearance Settings"
                        avatar={<PaletteIcon sx={{ color: '#667eea' }} />}
                        sx={{
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                            color: '#1e293b',
                            '& .MuiCardHeader-title': {
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                fontWeight: 600
                            }
                        }}
                    />
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={themeSettings.darkMode}
                                            onChange={(e) => handleThemeSettingChange('darkMode', e.target.checked)}
                                        />
                                    }
                                    label="Dark Mode"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={themeSettings.compactMode}
                                            onChange={(e) => handleThemeSettingChange('compactMode', e.target.checked)}
                                        />
                                    }
                                    label="Compact Mode"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Primary Color"
                                    type="color"
                                    value={themeSettings.primaryColor}
                                    onChange={(e) => handleThemeSettingChange('primaryColor', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSave('Appearance')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    Save Appearance Settings
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </TabPanel>

            {}
            <TabPanel value={activeTab} index={4}>
                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardHeader
                        title="System Users"
                        action={
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenUserDialog(true)}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                            >
                                Add User
                            </Button>
                        }
                        sx={{
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                            color: '#1e293b',
                            '& .MuiCardHeader-title': {
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                fontWeight: 600
                            }
                        }}
                    />
                    <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                        <List>
                            {systemUsers.map((user, index) => (
                                <React.Fragment key={user.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={`${user.email} • ${user.role} • ${user.status}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" sx={{ mr: 1 }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < systemUsers.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </TabPanel>

            {}
            <TabPanel value={activeTab} index={5}>
                <Card sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                    }
                }}>
                    <CardHeader
                        title="Data Management"
                        avatar={<StorageIcon sx={{ color: '#667eea' }} />}
                        sx={{
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                            color: '#1e293b',
                            '& .MuiCardHeader-title': {
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                fontWeight: 600
                            }
                        }}
                    />
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Alert severity="info">
                                    Manage your database backups and system data here. Always ensure you have recent backups before making changes.
                                </Alert>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    startIcon={<BackupIcon />}
                                    onClick={() => handleSave('Backup')}
                                    sx={{
                                        border: '2px solid #667eea',
                                        color: '#667eea',
                                        fontWeight: 600,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            border: '2px solid #5a67d8',
                                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
                                        }
                                    }}
                                >
                                    Create Backup
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    startIcon={<RestoreIcon />}
                                    onClick={() => handleSave('Restore')}
                                    sx={{
                                        border: '2px solid #667eea',
                                        color: '#667eea',
                                        fontWeight: 600,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            border: '2px solid #5a67d8',
                                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
                                        }
                                    }}
                                >
                                    Restore from Backup
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Database Statistics
                                </Typography>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: { xs: 2, sm: 3 }
                                }}>
                                    <Card sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        borderRadius: 3,
                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
                                        }
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>1,234</Typography>
                                            <Typography sx={{ opacity: 0.9, fontSize: '1.1rem' }}>Total Users</Typography>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{
                                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                        color: 'white',
                                        borderRadius: 3,
                                        boxShadow: '0 8px 25px rgba(118, 75, 162, 0.3)',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 15px 35px rgba(118, 75, 162, 0.4)'
                                        }
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>856</Typography>
                                            <Typography sx={{ opacity: 0.9, fontSize: '1.1rem' }}>Active Policies</Typography>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        borderRadius: 3,
                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
                                        }
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>2.3 GB</Typography>
                                            <Typography sx={{ opacity: 0.9, fontSize: '1.1rem' }}>Database Size</Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </TabPanel>

            {}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowSnackbar(false)}
                message={snackbarMessage}
            />

            {}
            <Dialog
                open={openUserDialog}
                onClose={() => setOpenUserDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#1e293b',
                    fontSize: '1.25rem',
                    fontWeight: 600
                }}>Add New User</DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <TextField fullWidth label="Full Name" />
                        <TextField fullWidth label="Email Address" type="email" />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select defaultValue="">
                                <MenuItem value="Administrator">Administrator</MenuItem>
                                <MenuItem value="Manager">Manager</MenuItem>
                                <MenuItem value="Agent">Agent</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField fullWidth label="Password" type="password" />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={() => setOpenUserDialog(false)}
                        sx={{
                            color: '#667eea',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenUserDialog(false)}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
                            py: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                            }
                        }}
                    >
                        Add User
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SettingsPage;