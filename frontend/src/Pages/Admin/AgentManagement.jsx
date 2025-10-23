import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
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
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add');
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuAgentId, setMenuAgentId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        agent_name: '',
        email: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const fetchAgents = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching agents...');
            
            const response = await fetch('https://insure-setu-backend.onrender.com/api/agents', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            if (result.data) {
                setAgents(result.data);
                setFilteredAgents(result.data);
            } else {
                setAgents([]);
                setFilteredAgents([]);
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
            setError(error.message);
            setSnackbar({
                open: true,
                message: `Failed to fetch agents: ${error.message}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const filterAgents = useCallback(() => {
        let filtered = [...agents];
        if (searchTerm) {
            filtered = filtered.filter(agent =>
                agent.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.mobile?.includes(searchTerm)
            );
        }
        if (statusFilter !== 'all') {
            // Add status filtering logic if needed
        }
        setFilteredAgents(filtered);
        setCurrentPage(1);
    }, [agents, searchTerm, statusFilter]);

    useEffect(() => {
        filterAgents();
    }, [agents, searchTerm, statusFilter, filterAgents]);

    // Rest of your component logic...

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                    Error loading agents
                </Typography>
                <Typography color="text.secondary" paragraph>
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => {
                        setError(null);
                        fetchAgents();
                    }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

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
                {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2" color="text.secondary">
                            Loading...
                        </Typography>
                    </Box>
                )}
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

            {loading ? (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '200px',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <CircularProgress />
                    <Typography variant="body1" color="text.secondary">
                        Loading agents...
                    </Typography>
                </Box>
            ) : (
                <>
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

                        {/* Similar structure for other statistics cards */}
                    </Grid>

                    {/* Rest of your component JSX */}
                </>
            )}

            {/* Dialogs, Snackbars, etc. */}
        </Box>
    );
};

export default AgentManagement;