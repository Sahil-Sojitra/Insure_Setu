import React, { useState, useEffect } from 'react';
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    Avatar,
    Menu,
    MenuItem,
    Snackbar,
    Alert,
    Pagination,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Download as DownloadIcon,
    People as PeopleIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    DateRange as DateRangeIcon
} from '@mui/icons-material';

const AgentManagement = () => {
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuAgentId, setMenuAgentId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Pagination and search
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const itemsPerPage = 10;

    // Form data
    const [formData, setFormData] = useState({
        agent_name: '',
        email: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    useEffect(() => {
        fetchAgents();
    }, []);

    useEffect(() => {
        filterAgents();
    }, [agents, searchTerm, statusFilter, filterAgents]);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://insure-setu-backend.onrender.com/api/agents', {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any auth headers if needed
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            setAgents(result.data || []);
        } catch (error) {
            console.error('Error fetching agents:', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch agents',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const filterAgents = React.useCallback(() => {
        let filtered = [...agents];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(agent =>
                agent.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.mobile?.includes(searchTerm)
            );
        }

        // Status filter (you can add status field to agent table if needed)
        if (statusFilter !== 'all') {
            // For now, assume all agents are active
            // filtered = filtered.filter(agent => agent.status === statusFilter);
        }

        setFilteredAgents(filtered);
        setCurrentPage(1);
    }, [agents, searchTerm, statusFilter]);

    const handleOpenDialog = (mode, agent = null) => {
        setDialogMode(mode);
        setSelectedAgent(agent);

        if (mode === 'edit' && agent) {
            setFormData({
                agent_name: agent.agent_name || '',
                email: agent.email || '',
                mobile: agent.mobile || '',
                address: agent.address || '',
                city: agent.city || '',
                state: agent.state || '',
                pincode: agent.pincode || ''
            });
        } else {
            setFormData({
                agent_name: '',
                email: '',
                mobile: '',
                address: '',
                city: '',
                state: '',
                pincode: ''
            });
        }

        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAgent(null);
        setFormData({
            agent_name: '',
            email: '',
            mobile: '',
            address: '',
            city: '',
            state: '',
            pincode: ''
        });
    };

    const handleSubmit = async () => {
        try {
            // Validate required fields
            if (!formData.agent_name || !formData.email || !formData.mobile) {
                setSnackbar({
                    open: true,
                    message: 'Please fill in all required fields (Name, Email, Mobile)',
                    severity: 'error'
                });
                return;
            }

            console.log('Form data:', formData);
            const baseUrl = 'https://insure-setu-backend.onrender.com/api/agents';
            const url = dialogMode === 'add' ? baseUrl : `${baseUrl}/${selectedAgent.agent_id}`;
            const method = dialogMode === 'add' ? 'POST' : 'PUT';

            console.log('Making request to:', url, 'with method:', method);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    // Add any auth headers if needed
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            let result;
            try {
                result = await response.json();
                console.log('Response result:', result);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                throw new Error('Invalid response format from server');
            }

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: `Agent ${dialogMode === 'add' ? 'added' : 'updated'} successfully`,
                    severity: 'success'
                });
                fetchAgents();
                handleCloseDialog();
            } else {
                throw new Error(result.error || result.message || `Failed to ${dialogMode} agent`);
            }
        } catch (error) {
            console.error(`Error ${dialogMode}ing agent:`, error);
            setSnackbar({
                open: true,
                message: error.message || `Failed to ${dialogMode} agent`,
                severity: 'error'
            });
        }
    };

    const handleDeleteAgent = async (agentId) => {
        if (!window.confirm('Are you sure you want to delete this agent?')) {
            return;
        }

        try {
            const response = await fetch(`https://insure-setu-backend.onrender.com/api/agents/${agentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any auth headers if needed
                },
            });

            const result = await response.json();

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Agent deleted successfully',
                    severity: 'success'
                });
                fetchAgents();
            } else {
                throw new Error(result.message || 'Failed to delete agent');
            }
        } catch (error) {
            console.error('Error deleting agent:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to delete agent',
                severity: 'error'
            });
        }
        handleMenuClose();
    };

    const handleMenuOpen = (event, agentId) => {
        setAnchorEl(event.currentTarget);
        setMenuAgentId(agentId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuAgentId(null);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'NA';
    };

    const exportToCSV = () => {
        const csvContent = [
            ['Name', 'Email', 'Mobile', 'Address', 'City', 'State', 'Pincode', 'Customers', 'Created Date'],
            ...filteredAgents.map(agent => [
                agent.agent_name,
                agent.email,
                agent.mobile,
                agent.address,
                agent.city,
                agent.state,
                agent.pincode,
                agent.customer_count || 0,
                new Date(agent.created_at).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agents_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Pagination
    const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAgents = filteredAgents.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Agent Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage and monitor all agents in the system
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={exportToCSV}
                    >
                        Export
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('add')}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            }
                        }}
                    >
                        Add Agent
                    </Button>
                </Box>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom variant="body2">
                                        Total Agents
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#667eea' }}>
                                        {agents.length}
                                    </Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 40, color: '#667eea', opacity: 0.7 }} />
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
                                        Active Agents
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#22c55e' }}>
                                        {agents.length} {/* Assuming all are active */}
                                    </Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 40, color: '#22c55e', opacity: 0.7 }} />
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
                                        Total Customers
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                                        {agents.reduce((sum, agent) => sum + (agent.customer_count || 0), 0)}
                                    </Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 40, color: '#3b82f6', opacity: 0.7 }} />
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
                                        Avg Customers/Agent
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#f59e0b' }}>
                                        {agents.length > 0 ? Math.round(agents.reduce((sum, agent) => sum + (agent.customer_count || 0), 0) / agents.length) : 0}
                                    </Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 40, color: '#f59e0b', opacity: 0.7 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters and Search */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search agents by name, email, or mobile..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Status Filter</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Status Filter"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">
                                Showing {paginatedAgents.length} of {filteredAgents.length} agents
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Agents Table */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Agent</TableCell>
                                    <TableCell>Contact Info</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Customers</TableCell>
                                    <TableCell>Join Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            Loading agents...
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedAgents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No agents found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedAgents.map((agent) => (
                                        <TableRow key={agent.agent_id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            width: 40,
                                                            height: 40
                                                        }}
                                                    >
                                                        {getInitials(agent.agent_name)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {agent.agent_name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ID: {agent.agent_id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                        <EmailIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                                        <Typography variant="body2">{agent.email}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                                        <Typography variant="body2">{agent.mobile}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationOnIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                                    <Typography variant="body2">
                                                        {agent.city}, {agent.state}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={agent.customer_count || 0}
                                                    size="small"
                                                    color={agent.customer_count > 10 ? 'success' : agent.customer_count > 5 ? 'warning' : 'default'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <DateRangeIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                                    <Typography variant="body2">
                                                        {new Date(agent.created_at).toLocaleDateString()}
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
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={(e) => handleMenuOpen(e, agent.agent_id)}
                                                    size="small"
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(e, page) => setCurrentPage(page)}
                                color="primary"
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        minWidth: 180,
                    }
                }}
            >
                <MenuItem
                    onClick={() => {
                        const agent = agents.find(a => a.agent_id === menuAgentId);
                        handleOpenDialog('edit', agent);
                        handleMenuClose();
                    }}
                    sx={{
                        borderRadius: 2,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateX(4px)',
                        }
                    }}
                >
                    <EditIcon sx={{ mr: 2, fontSize: 20, color: '#667eea' }} />
                    <Typography sx={{ fontWeight: 500 }}>Edit Agent</Typography>
                </MenuItem>
                <MenuItem
                    onClick={() => handleDeleteAgent(menuAgentId)}
                    sx={{
                        color: 'error.main',
                        borderRadius: 2,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: 'rgba(239, 68, 68, 0.1)',
                            transform: 'translateX(4px)',
                        }
                    }}
                >
                    <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 500 }}>Delete Agent</Typography>
                </MenuItem>
            </Menu>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'add' ? 'Add New Agent' : 'Edit Agent'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Agent Name"
                                name="agent_name"
                                value={formData.agent_name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                multiline
                                rows={2}
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            }
                        }}
                    >
                        {dialogMode === 'add' ? 'Add Agent' : 'Update Agent'}
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

export default AgentManagement;