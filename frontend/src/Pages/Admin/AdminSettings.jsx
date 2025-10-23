import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Tab,
    Tabs,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Avatar
} from '@mui/material';
import {
    Save as SaveIcon,
    Security as SecurityIcon,
    Notifications as NotificationsIcon,
    Storage as StorageIcon,
    Settings as SettingsIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
    Backup as BackupIcon,
    RestoreFromTrash as RestoreIcon
} from '@mui/icons-material';

const AdminSettings = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openBackupDialog, setOpenBackupDialog] = useState(false);

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        systemName: 'CRM Insurance System',
        systemEmail: 'admin@crm-insurance.com',
        supportPhone: '+1-800-123-4567',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        currency: 'INR'
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        passwordMinLength: 8,
        passwordRequireSpecialChar: true,
        passwordRequireNumbers: true,
        passwordRequireUppercase: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        twoFactorAuth: false,
        ipWhitelisting: false
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        policyExpiryAlert: true,
        newAgentAlert: true,
        paymentFailureAlert: true,
        systemMaintenanceAlert: true,
        weeklyReports: true,
        monthlyReports: true
    });

    // System Users (Admin/Super Admin)
    const [systemUsers, setSystemUsers] = useState([
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@crm.com',
            role: 'Super Admin',
            lastLogin: '2024-01-15 10:30 AM',
            status: 'Active'
        },
        {
            id: 2,
            name: 'System Manager',
            email: 'manager@crm.com',
            role: 'Admin',
            lastLogin: '2024-01-14 02:15 PM',
            status: 'Active'
        }
    ]);

    useEffect(() => {
        // Load settings from API or localStorage
        loadSettings();
    }, []);

    const loadSettings = () => {
        // Mock loading settings - replace with actual API call
        console.log('Loading settings...');
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const saveGeneralSettings = async () => {
        try {
            // Mock API call - replace with actual endpoint
            console.log('Saving general settings:', generalSettings);

            setSnackbar({
                open: true,
                message: 'General settings saved successfully',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to save general settings',
                severity: 'error'
            });
        }
    };

    const saveSecuritySettings = async () => {
        try {
            // Mock API call - replace with actual endpoint
            console.log('Saving security settings:', securitySettings);

            setSnackbar({
                open: true,
                message: 'Security settings saved successfully',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to save security settings',
                severity: 'error'
            });
        }
    };

    const saveNotificationSettings = async () => {
        try {
            // Mock API call - replace with actual endpoint
            console.log('Saving notification settings:', notificationSettings);

            setSnackbar({
                open: true,
                message: 'Notification settings saved successfully',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to save notification settings',
                severity: 'error'
            });
        }
    };

    const handleBackup = async () => {
        try {
            // Mock backup process
            console.log('Starting backup...');
            setSnackbar({
                open: true,
                message: 'System backup initiated successfully',
                severity: 'success'
            });
            setOpenBackupDialog(false);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Backup failed',
                severity: 'error'
            });
        }
    };

    const exportSystemData = () => {
        // Mock export functionality
        const data = {
            agents: 'agent_data',
            customers: 'customer_data',
            policies: 'policy_data',
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crm_export_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        System Settings
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Configure system preferences and manage admin users
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportSystemData}
                >
                    Export Data
                </Button>
            </Box>

            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab icon={<SettingsIcon />} label="General" />
                        <Tab icon={<SecurityIcon />} label="Security" />
                        <Tab icon={<NotificationsIcon />} label="Notifications" />
                        <Tab icon={<StorageIcon />} label="Backup & Data" />
                        <Tab icon={<SecurityIcon />} label="Admin Users" />
                    </Tabs>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    {/* General Settings Tab */}
                    {currentTab === 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                General System Settings
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="System Name"
                                        value={generalSettings.systemName}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            systemName: e.target.value
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="System Email"
                                        type="email"
                                        value={generalSettings.systemEmail}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            systemEmail: e.target.value
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Support Phone"
                                        value={generalSettings.supportPhone}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            supportPhone: e.target.value
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Timezone"
                                        value={generalSettings.timezone}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            timezone: e.target.value
                                        })}
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                                        <option value="UTC">UTC (UTC+0)</option>
                                        <option value="America/New_York">America/New_York (UTC-5)</option>
                                        <option value="Europe/London">Europe/London (UTC+0)</option>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Date Format"
                                        value={generalSettings.dateFormat}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            dateFormat: e.target.value
                                        })}
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Currency"
                                        value={generalSettings.currency}
                                        onChange={(e) => setGeneralSettings({
                                            ...generalSettings,
                                            currency: e.target.value
                                        })}
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={saveGeneralSettings}
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                            }
                                        }}
                                    >
                                        Save General Settings
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Security Settings Tab */}
                    {currentTab === 1 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Security & Authentication Settings
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Minimum Password Length"
                                        type="number"
                                        value={securitySettings.passwordMinLength}
                                        onChange={(e) => setSecuritySettings({
                                            ...securitySettings,
                                            passwordMinLength: parseInt(e.target.value)
                                        })}
                                        inputProps={{ min: 6, max: 50 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Session Timeout (minutes)"
                                        type="number"
                                        value={securitySettings.sessionTimeout}
                                        onChange={(e) => setSecuritySettings({
                                            ...securitySettings,
                                            sessionTimeout: parseInt(e.target.value)
                                        })}
                                        inputProps={{ min: 5, max: 480 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Max Login Attempts"
                                        type="number"
                                        value={securitySettings.maxLoginAttempts}
                                        onChange={(e) => setSecuritySettings({
                                            ...securitySettings,
                                            maxLoginAttempts: parseInt(e.target.value)
                                        })}
                                        inputProps={{ min: 3, max: 10 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Password Requirements
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText primary="Require Special Characters" />
                                            <ListItemSecondaryAction>
                                                <Switch
                                                    checked={securitySettings.passwordRequireSpecialChar}
                                                    onChange={(e) => setSecuritySettings({
                                                        ...securitySettings,
                                                        passwordRequireSpecialChar: e.target.checked
                                                    })}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Require Numbers" />
                                            <ListItemSecondaryAction>
                                                <Switch
                                                    checked={securitySettings.passwordRequireNumbers}
                                                    onChange={(e) => setSecuritySettings({
                                                        ...securitySettings,
                                                        passwordRequireNumbers: e.target.checked
                                                    })}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Require Uppercase Letters" />
                                            <ListItemSecondaryAction>
                                                <Switch
                                                    checked={securitySettings.passwordRequireUppercase}
                                                    onChange={(e) => setSecuritySettings({
                                                        ...securitySettings,
                                                        passwordRequireUppercase: e.target.checked
                                                    })}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Two-Factor Authentication" />
                                            <ListItemSecondaryAction>
                                                <Switch
                                                    checked={securitySettings.twoFactorAuth}
                                                    onChange={(e) => setSecuritySettings({
                                                        ...securitySettings,
                                                        twoFactorAuth: e.target.checked
                                                    })}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="IP Whitelisting" />
                                            <ListItemSecondaryAction>
                                                <Switch
                                                    checked={securitySettings.ipWhitelisting}
                                                    onChange={(e) => setSecuritySettings({
                                                        ...securitySettings,
                                                        ipWhitelisting: e.target.checked
                                                    })}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={saveSecuritySettings}
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                            }
                                        }}
                                    >
                                        Save Security Settings
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Notification Settings Tab */}
                    {currentTab === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Notification Preferences
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Email Notifications"
                                        secondary="Receive notifications via email"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={notificationSettings.emailNotifications}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                emailNotifications: e.target.checked
                                            })}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="SMS Notifications"
                                        secondary="Receive notifications via SMS"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={notificationSettings.smsNotifications}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                smsNotifications: e.target.checked
                                            })}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Policy Expiry Alerts"
                                        secondary="Alert when policies are about to expire"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={notificationSettings.policyExpiryAlert}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                policyExpiryAlert: e.target.checked
                                            })}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="New Agent Alerts"
                                        secondary="Alert when new agents register"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={notificationSettings.newAgentAlert}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                newAgentAlert: e.target.checked
                                            })}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Payment Failure Alerts"
                                        secondary="Alert when premium payments fail"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={notificationSettings.paymentFailureAlert}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                paymentFailureAlert: e.target.checked
                                            })}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Weekly Reports"
                                        secondary="Receive weekly system reports"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={notificationSettings.weeklyReports}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                weeklyReports: e.target.checked
                                            })}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText
                                        primary="Monthly Reports"
                                        secondary="Receive monthly system reports"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={notificationSettings.monthlyReports}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                monthlyReports: e.target.checked
                                            })}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={saveNotificationSettings}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                        }
                                    }}
                                >
                                    Save Notification Settings
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* Backup & Data Tab */}
                    {currentTab === 3 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Backup & Data Management
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <BackupIcon sx={{ mr: 2, color: '#3b82f6' }} />
                                                <Typography variant="h6">System Backup</Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                Create a complete backup of all system data including agents, customers, and policies.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<BackupIcon />}
                                                onClick={() => setOpenBackupDialog(true)}
                                                fullWidth
                                            >
                                                Create Backup
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <RestoreIcon sx={{ mr: 2, color: '#f59e0b' }} />
                                                <Typography variant="h6">Data Restore</Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                Restore system data from a previous backup file.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={<UploadIcon />}
                                                fullWidth
                                            >
                                                Upload Backup
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                Recent Backups
                                            </Typography>
                                            <List>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="backup_2024-01-15_10-30.zip"
                                                        secondary="Created on January 15, 2024 at 10:30 AM"
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Button size="small" startIcon={<DownloadIcon />}>
                                                            Download
                                                        </Button>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                                <Divider />
                                                <ListItem>
                                                    <ListItemText
                                                        primary="backup_2024-01-14_10-30.zip"
                                                        secondary="Created on January 14, 2024 at 10:30 AM"
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Button size="small" startIcon={<DownloadIcon />}>
                                                            Download
                                                        </Button>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Admin Users Tab */}
                    {currentTab === 4 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Admin Users Management
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                        }
                                    }}
                                >
                                    Add Admin User
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Last Login</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {systemUsers.map((user) => (
                                            <TableRow key={user.id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                width: 40,
                                                                height: 40
                                                            }}
                                                        >
                                                            {getInitials(user.name)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                                {user.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {user.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.role}
                                                        color={user.role === 'Super Admin' ? 'error' : 'primary'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{user.lastLogin}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.status}
                                                        color="success"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" sx={{ mr: 1 }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Backup Confirmation Dialog */}
            <Dialog open={openBackupDialog} onClose={() => setOpenBackupDialog(false)}>
                <DialogTitle>Create System Backup</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        This will create a complete backup of all system data including:
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText primary="• All agent information and credentials" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="• Customer data and policies" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="• System settings and configurations" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="• Uploaded documents and files" />
                        </ListItem>
                    </List>
                    <Alert severity="info" sx={{ mt: 2 }}>
                        The backup process may take several minutes depending on the amount of data.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBackupDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleBackup}
                        variant="contained"
                        startIcon={<BackupIcon />}
                    >
                        Start Backup
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

export default AdminSettings;