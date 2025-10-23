

import React, { useState, useEffect } from 'react';


import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';


import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Checkbox
} from '@mui/material';


import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment
} from '@mui/material';


import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
    Save as SaveIcon,
    Upload as UploadIcon,
    Download as DownloadIcon
} from '@mui/icons-material';

import { useAuth } from '../../Hooks/useAuth';


const UsersPage = () => {
    const { userData } = useAuth(); // Get logged-in agent data





    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Bulk selection state
    const [selectedUsers, setSelectedUsers] = useState([]);     // Array of selected user IDs
    const [selectAll, setSelectAll] = useState(false);         // Select all checkbox state
    const [bulkDeleting, setBulkDeleting] = useState(false);   // Bulk delete loading state              


    const [searchTerm, setSearchTerm] = useState('');          // Search input value
    const [page, setPage] = useState(0);                       // Current page number (0-based)
    const [rowsPerPage, setRowsPerPage] = useState(10);        // Items per page setting

    /**
     * DIALOG STATE MANAGEMENT
     * Controls the modal dialog for viewing, adding, and editing users
     */
    const [openDialog, setOpenDialog] = useState(false);       // Dialog visibility state
    const [selectedUser, setSelectedUser] = useState(null);    // Currently selected user for operations
    const [dialogMode, setDialogMode] = useState('view');


    const [formData, setFormData] = useState({
        vehical_number: '',        // Vehicle registration number (primary identifier)
        customer_name: '',         // Full customer name
        mobile: '',               // 10-digit mobile number
        landmark: '',             // Address/landmark for location
        vehicle_type: '',         // Car, Bike, Truck, Bus
        business_type: '',        // Private, Commercial, Renewal
        insurance_company: '',    // Insurance provider name
        policy_plan: '',          // Comprehensive or Third Party
        insurance_start_date: '', // Policy start date (YYYY-MM-DD)
        insurance_end_date: '',   // Policy expiry date (YYYY-MM-DD)
        final_premium: '',        // Premium amount in INR
        payment_type: '',         // Online, Cash, Card, Cheque
        od_or_net: '',           // Own Damage or Net coverage
        variant: ''              // Vehicle variant/model details
    });

    /**
     * FORM VALIDATION AND SUBMISSION STATE
     * Handles form validation, submission status, and user feedback
     */
    const [formErrors, setFormErrors] = useState({});          // Form validation error messages
    const [submitting, setSubmitting] = useState(false);       // Form submission loading state
    const [snackbar, setSnackbar] = useState({                // Toast notification state
        open: false,
        message: '',
        severity: 'success'
    });


    const [importing, setImporting] = useState(false);
    const [importDialog, setImportDialog] = useState(false);


    const [exporting, setExporting] = useState(false);


    const [selectedPolicyDocument, setSelectedPolicyDocument] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [importResults, setImportResults] = useState(null);

    // Dynamic API URL based on logged-in agent
    const getApiBaseUrl = () => {
        if (userData && userData.id) {
            return `/api/agents/${userData.id}/customers`;
        }
        return '/api/customers'; // fallback
    };

    const API_BASE_URL = 'http://localhost:5000/api/user';






    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Check if agent data is available
            if (!userData || !userData.id) {
                setSnackbar({
                    open: true,
                    message: 'Agent information not available. Please log in again.',
                    severity: 'error'
                });
                setLoading(false);
                return;
            }

            const agentSpecificUrl = getApiBaseUrl();
            const response = await fetch(agentSpecificUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.status}`);
            }

            const result = await response.json();
            setUsers(result.data || []);
            setFilteredUsers(result.data || []);

        } catch (error) {
            console.error('Error fetching users:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load users. Please refresh the page.',
                severity: 'error'
            });
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchUsers();
        }
    }, [userData]);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.vehical_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.mobile.includes(searchTerm)
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        // Reset select all state when changing pages
        const newPageUsers = filteredUsers.slice(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage);
        const allNewPageSelected = newPageUsers.every(user => selectedUsers.includes(user.id));
        setSelectAll(allNewPageSelected && newPageUsers.length > 0);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDialog = (mode, user = null) => {
        setDialogMode(mode);
        setSelectedUser(user);

        if (mode === 'add') {

            setFormData({
                vehical_number: '',
                customer_name: '',
                mobile: '',
                landmark: '',
                vehicle_type: 'Car',
                business_type: 'Private',
                insurance_company: '',
                policy_plan: 'Comprehensive',
                insurance_start_date: '',
                insurance_end_date: '',
                final_premium: '',
                payment_type: 'Online',
                od_or_net: 'Net',
                variant: ''
            });
        } else if (mode === 'edit' && user) {
            // Format dates for HTML date inputs (YYYY-MM-DD format)
            const formatDateForInput = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return '';
                return date.toISOString().split('T')[0];
            };

            setFormData({
                vehical_number: user.vehical_number || '',
                customer_name: user.customer_name || '',
                mobile: user.mobile || '',
                landmark: user.landmark || '',
                vehicle_type: user.vehicle_type || 'Car',
                business_type: user.business_type || 'Private',
                insurance_company: user.insurance_company || '',
                policy_plan: user.policy_plan || 'Comprehensive',
                insurance_start_date: formatDateForInput(user.insurance_start_date),
                insurance_end_date: formatDateForInput(user.insurance_end_date),
                final_premium: user.final_premium || '',
                payment_type: user.payment_type || 'Online',
                od_or_net: user.od_or_net || 'Net',
                variant: user.variant || ''
            });
        }

        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        // Reset form data to initial state instead of empty object
        setFormData({
            vehical_number: '',
            customer_name: '',
            mobile: '',
            landmark: '',
            vehicle_type: '',
            business_type: '',
            insurance_company: '',
            policy_plan: '',
            insurance_start_date: '',
            insurance_end_date: '',
            final_premium: '',
            payment_type: '',
            od_or_net: '',
            variant: ''
        });
        setFormErrors({});
        setSelectedPolicyDocument(null);
        // Clear search term to prevent auto-population
        setSearchTerm('');
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setUsers(users.filter(user => user.id !== userId));
                    // Remove from selected users if it was selected
                    setSelectedUsers(selectedUsers.filter(id => id !== userId));
                    setSnackbar({
                        open: true,
                        message: 'User deleted successfully',
                        severity: 'success'
                    });
                } else {
                    throw new Error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to delete user. Please try again.',
                    severity: 'error'
                });
            }
        }
    };

    // Handle individual user selection
    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => {
            const newSelected = prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId];

            // Update selectAll state based on current page users
            const currentPageUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
            const allCurrentPageSelected = currentPageUsers.every(user => newSelected.includes(user.id));
            setSelectAll(allCurrentPageSelected && currentPageUsers.length > 0);

            return newSelected;
        });
    };

    // Handle select all users on current page
    const handleSelectAll = () => {
        const currentPageUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        if (selectAll) {
            // Deselect all users on current page
            setSelectedUsers(prev => prev.filter(id => !currentPageUsers.some(user => user.id === id)));
            setSelectAll(false);
        } else {
            // Select all users on current page
            const currentPageIds = currentPageUsers.map(user => user.id);
            setSelectedUsers(prev => {
                const newSelected = [...prev];
                currentPageIds.forEach(id => {
                    if (!newSelected.includes(id)) {
                        newSelected.push(id);
                    }
                });
                return newSelected;
            });
            setSelectAll(true);
        }
    };

    // Handle bulk delete users
    const handleBulkDelete = async () => {
        if (selectedUsers.length === 0) {
            setSnackbar({
                open: true,
                message: 'Please select users to delete',
                severity: 'warning'
            });
            return;
        }

        const confirmMessage = `Are you sure you want to delete ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}?`;
        if (!window.confirm(confirmMessage)) {
            return;
        }

        setBulkDeleting(true);
        let successCount = 0;
        let failCount = 0;

        try {
            // Delete users one by one
            for (const userId of selectedUsers) {
                try {
                    const response = await fetch(`${API_BASE_URL}/${userId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        successCount++;
                    } else {
                        failCount++;
                        console.error(`Failed to delete user ${userId}`);
                    }
                } catch (error) {
                    failCount++;
                    console.error(`Error deleting user ${userId}:`, error);
                }
            }

            // Update users list by removing successfully deleted users
            setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));

            // Clear selection
            setSelectedUsers([]);
            setSelectAll(false);

            // Show result message
            if (successCount > 0 && failCount === 0) {
                setSnackbar({
                    open: true,
                    message: `Successfully deleted ${successCount} user${successCount > 1 ? 's' : ''}`,
                    severity: 'success'
                });
            } else if (successCount > 0 && failCount > 0) {
                setSnackbar({
                    open: true,
                    message: `Deleted ${successCount} user${successCount > 1 ? 's' : ''}, failed to delete ${failCount}`,
                    severity: 'warning'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: `Failed to delete ${failCount} user${failCount > 1 ? 's' : ''}`,
                    severity: 'error'
                });
            }

        } catch (error) {
            console.error('Bulk delete error:', error);
            setSnackbar({
                open: true,
                message: 'An error occurred during bulk delete. Please try again.',
                severity: 'error'
            });
        } finally {
            setBulkDeleting(false);
        }
    };


    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });

        if (formErrors[field]) {
            setFormErrors({ ...formErrors, [field]: '' });
        }
    };

    /**
     * COMPREHENSIVE FORM VALIDATION
     * 
     * Validates all form fields according to business rules and data requirements.
     * Provides detailed error messages for each field to guide user input.
     * 
     * Validation Rules:
     * 1. Required Fields: All fields except 'variant' are mandatory
     * 2. Mobile Number: Must be exactly 10 digits (Indian standard)
     * 3. Premium Amount: Must be a valid numeric value
     * 4. Date Logic: End date must be after start date
     * 5. Data Types: Ensures proper data types for each field
     * 
     * @returns {boolean} - True if form is valid, false otherwise
     * @sideEffects - Updates formErrors state with validation messages
     */
    const validateForm = () => {
        const errors = {};


        const requiredFields = [
            'vehical_number',
            'customer_name',
            'mobile',
            'landmark',
            'vehicle_type',
            'business_type',
            'insurance_company',
            'policy_plan',
            'insurance_start_date',
            'insurance_end_date',
            'final_premium',
            'payment_type',
            'od_or_net'
        ];


        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                errors[field] = 'This field is required';
            }
        });


        if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
            errors.mobile = 'Mobile number must be 10 digits';
        }


        if (formData.final_premium && isNaN(formData.final_premium)) {
            errors.final_premium = 'Premium must be a valid number';
        }


        if (formData.insurance_start_date && formData.insurance_end_date) {
            const startDate = new Date(formData.insurance_start_date);
            const endDate = new Date(formData.insurance_end_date);
            if (endDate <= startDate) {
                errors.insurance_end_date = 'End date must be after start date';
            }
        }


        setFormErrors(errors);


        return Object.keys(errors).length === 0;
    };






    const handleFileSelect = (event) => {
        const file = event.target.files[0];

        if (file) {

            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ];

            const allowedExtensions = ['.xlsx', '.xls'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                setSnackbar({
                    open: true,
                    message: 'Please select a valid Excel file (.xlsx or .xls)',
                    severity: 'error'
                });
                event.target.value = ''; // Clear the input
                return;
            }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                setSnackbar({
                    open: true,
                    message: 'File size must be less than 5MB',
                    severity: 'error'
                });
                event.target.value = ''; // Clear the input
                return;
            }

            setSelectedFile(file);
        }
    };

    /**
     * HANDLE EXCEL IMPORT PROCESS
     * 
     * Uploads and processes the selected Excel file through the backend API.
     * Handles file upload, validation, and provides detailed feedback to user.
     */
    const handleImportExcel = async () => {
        if (!selectedFile) {
            setSnackbar({
                open: true,
                message: 'Please select an Excel file first',
                severity: 'warning'
            });
            return;
        }

        setImporting(true);

        try {

            const formData = new FormData();
            formData.append('excelFile', selectedFile);


            const response = await fetch(`${API_BASE_URL}/import-excel`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok || response.status === 207) {

                setImportResults(result);


                if (result.summary.successfulInserts > 0) {
                    await fetchUsers();
                }


                const successMessage = `Import completed! ${result.summary.successfulInserts} users imported successfully.`;
                const warningMessage = result.summary.failedInserts > 0 || result.summary.validationErrors > 0
                    ? ` ${result.summary.failedInserts + result.summary.validationErrors} records had errors.`
                    : '';

                setSnackbar({
                    open: true,
                    message: successMessage + warningMessage,
                    severity: result.summary.failedInserts === 0 && result.summary.validationErrors === 0 ? 'success' : 'warning'
                });

            } else {
                throw new Error(result.message || 'Import failed');
            }

        } catch (error) {
            console.error('Excel import error:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to import Excel file. Please try again.',
                severity: 'error'
            });
        } finally {
            setImporting(false);
            setImportDialog(false);
            setSelectedFile(null);

            const fileInput = document.getElementById('excel-file-input');
            if (fileInput) {
                fileInput.value = '';
            }
        }
    };

    /**
     * OPEN EXCEL IMPORT DIALOG
     * 
     * Opens the import dialog and resets any previous state.
     */
    // const handleOpenImportDialog = () => {
    //     setSelectedFile(null);
    //     setImportResults(null);
    //     setImportDialog(true);
    // };

    /**
     * CLOSE EXCEL IMPORT DIALOG
     * 
     * Closes the import dialog and cleans up state.
     */
    const handleCloseImportDialog = () => {
        setImportDialog(false);
        setSelectedFile(null);
        setImportResults(null);
    };

    // ============================================================================
    // EXCEL EXPORT FUNCTIONS
    // ============================================================================

    /**
     * HANDLE EXCEL EXPORT PROCESS
     * 
     * Downloads all user data from the backend as an Excel file.
     * Excludes policy_document column for security and file size optimization.
     */
    const handleExportExcel = async () => {
        if (users.length === 0) {
            setSnackbar({
                open: true,
                message: 'No data available to export',
                severity: 'warning'
            });
            return;
        }

        setExporting(true);

        try {

            const response = await fetch(`${API_BASE_URL}/export-excel`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Export failed');
            }


            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'CRM_Users_Export.xlsx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // Convert response to blob and trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setSnackbar({
                open: true,
                message: `Excel file downloaded successfully: ${filename}`,
                severity: 'success'
            });

        } catch (error) {
            console.error('Excel export error:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to export Excel file. Please try again.',
                severity: 'error'
            });
        } finally {
            setExporting(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        if (!userData || !userData.id) {
            setSnackbar({
                open: true,
                message: 'Agent information not available. Please log in again.',
                severity: 'error'
            });
            return;
        }

        setSubmitting(true);

        try {
            const url = dialogMode === 'add' ? API_BASE_URL : `${API_BASE_URL}/${selectedUser.id}`;
            const method = dialogMode === 'add' ? 'POST' : 'PUT';

            // Create FormData for file upload
            const formDataToSend = new FormData();

            // Add all form fields to FormData
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            // Automatically assign the logged-in agent's ID
            formDataToSend.append('agent_id', userData.id);

            // Add policy document if selected
            if (selectedPolicyDocument) {
                formDataToSend.append('policyDocument', selectedPolicyDocument);
            }

            const response = await fetch(url, {
                method: method,
                body: formDataToSend, // Send FormData instead of JSON
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save user');
            }

            const result = await response.json();

            if (dialogMode === 'add') {
                // Add new user to the top of the list
                setUsers([result.data, ...users]);
                setSnackbar({
                    open: true,
                    message: 'User added successfully',
                    severity: 'success'
                });
            } else {
                // Update existing user in the list
                setUsers(users.map(user =>
                    user.id === selectedUser.id ? result.data : user
                ));
                setSnackbar({
                    open: true,
                    message: 'User updated successfully',
                    severity: 'success'
                });
            }

            // Ensure search term is cleared before closing dialog
            setSearchTerm('');
            handleCloseDialog();

        } catch (error) {
            console.error('Error saving user:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to save user. Please try again.',
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

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

        if (daysToExpiry < 30) return 'error';
        if (daysToExpiry < 90) return 'warning';
        return 'success';
    };

    // ============================================================================
    // POLICY DOCUMENT FUNCTIONS
    // ============================================================================

    /**
     * HANDLE POLICY DOCUMENT SELECTION
     * 
     * Validates and stores the selected PDF file for upload.
     * Performs basic file validation before setting state.
     */
    const handlePolicyDocumentSelect = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                setSnackbar({
                    open: true,
                    message: 'Please select a valid PDF file',
                    severity: 'error'
                });
                return;
            }

            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setSnackbar({
                    open: true,
                    message: 'File size must be less than 10MB',
                    severity: 'error'
                });
                return;
            }

            setSelectedPolicyDocument(file);
        }
    };

    /**
     * HANDLE VIEW POLICY DOCUMENT
     * 
     * Opens the policy document in a new window/tab for viewing.
     * Handles both Cloudinary and local file storage.
     */
    const handleViewPolicyDocument = async (userId) => {
        try {
            console.log('Attempting to view policy document for user:', userId);

            // Get the document information from the API
            const response = await fetch(`http://localhost:5000/api/user/${userId}/policy-document`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Policy document response:', result);

            if (result.success && result.documentUrl) {
                console.log('Opening document URL:', result.documentUrl);

                // Create a clean, professional PDF viewer modal
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.right = '0';
                modal.style.bottom = '0';
                modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
                modal.style.zIndex = '10000';
                modal.style.display = 'flex';
                modal.style.flexDirection = 'column';
                modal.style.fontFamily = 'Arial, sans-serif';

                // Header with title and close button
                const header = document.createElement('div');
                header.style.backgroundColor = '#1976d2';
                header.style.color = 'white';
                header.style.padding = '15px 20px';
                header.style.display = 'flex';
                header.style.justifyContent = 'space-between';
                header.style.alignItems = 'center';
                header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

                const title = document.createElement('h3');
                title.textContent = 'Policy Document Viewer';
                title.style.margin = '0';
                title.style.fontSize = '18px';
                title.style.fontWeight = '500';

                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '✕ Close';
                closeBtn.style.padding = '8px 16px';
                closeBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
                closeBtn.style.color = 'white';
                closeBtn.style.border = '1px solid rgba(255,255,255,0.3)';
                closeBtn.style.borderRadius = '4px';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.fontSize = '14px';
                closeBtn.style.transition = 'background-color 0.2s';
                closeBtn.onmouseover = () => closeBtn.style.backgroundColor = 'rgba(255,255,255,0.3)';
                closeBtn.onmouseout = () => closeBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
                closeBtn.onclick = () => {
                    document.body.removeChild(modal);
                    document.body.style.overflow = ''; // Restore scrolling
                };

                // PDF container
                const pdfContainer = document.createElement('div');
                pdfContainer.style.flex = '1';
                pdfContainer.style.backgroundColor = '#f5f5f5';
                pdfContainer.style.display = 'flex';
                pdfContainer.style.justifyContent = 'center';
                pdfContainer.style.alignItems = 'center';
                pdfContainer.style.padding = '20px';

                // Use Google Docs viewer for reliable PDF display
                const iframe = document.createElement('iframe');
                const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(result.documentUrl)}&embedded=true`;
                iframe.src = googleDocsUrl;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.style.backgroundColor = 'white';
                iframe.style.borderRadius = '4px';
                iframe.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

                // Loading indicator
                const loadingDiv = document.createElement('div');
                loadingDiv.style.position = 'absolute';
                loadingDiv.style.top = '50%';
                loadingDiv.style.left = '50%';
                loadingDiv.style.transform = 'translate(-50%, -50%)';
                loadingDiv.style.color = '#666';
                loadingDiv.style.fontSize = '16px';
                loadingDiv.innerHTML = '📄 Loading PDF...';

                pdfContainer.appendChild(loadingDiv);
                pdfContainer.appendChild(iframe);

                // Hide loading indicator when iframe loads
                iframe.onload = () => {
                    loadingDiv.style.display = 'none';
                };

                // Assemble modal
                header.appendChild(title);
                header.appendChild(closeBtn);
                modal.appendChild(header);
                modal.appendChild(pdfContainer);

                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
                document.body.appendChild(modal);

                // Close modal on Escape key
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        closeBtn.click();
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);

                setSnackbar({
                    open: true,
                    message: 'Policy document viewer opened',
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: result.message || 'Policy document not available',
                    severity: 'warning'
                });
            }
        } catch (error) {
            console.error('Error viewing policy document:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load policy document. Please try again.',
                severity: 'error'
            });
        }
    };

    /**
     * HANDLE DOWNLOAD POLICY DOCUMENT
     * 
     * Downloads the policy document to the user's device.
     */
    const handleDownloadPolicyDocument = async (userId, customerName) => {
        try {
            console.log('Attempting to download policy document for user:', userId);

            // Get the document information from the API
            const response = await fetch(`http://localhost:5000/api/user/${userId}/policy-document?action=download`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Check if the response is a direct file download (streaming)
            const contentType = response.headers.get('content-type');
            const contentDisposition = response.headers.get('content-disposition');

            if (contentType === 'application/pdf' || (contentDisposition && contentDisposition.includes('attachment'))) {
                console.log('Received direct PDF stream from backend');

                // Handle direct file stream from backend
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = `policy_${customerName.replace(/[^a-zA-Z0-9]/g, '_')}_${userId}.pdf`;
                link.style.display = 'none';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => window.URL.revokeObjectURL(url), 100);

                setSnackbar({
                    open: true,
                    message: 'Policy document download started',
                    severity: 'success'
                });
                return;
            }

            // Handle JSON response with URL
            const result = await response.json();
            console.log('Policy document download response:', result);

            if (result.success && result.documentUrl) {
                console.log('Initiating download from URL:', result.documentUrl);

                try {
                    // Create a clean filename
                    const cleanCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '_');
                    const fileName = `policy_${cleanCustomerName}_${userId}.pdf`;

                    // Method 1: Try direct download using fetch and blob
                    console.log('Attempting blob download...');
                    const fileResponse = await fetch(result.documentUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/pdf,*/*',
                        },
                    });

                    if (fileResponse.ok) {
                        const blob = await fileResponse.blob();

                        // Verify it's a PDF
                        if (blob.type === 'application/pdf' || blob.type === 'application/octet-stream') {
                            const url = window.URL.createObjectURL(blob);

                            // Create download link
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = fileName;
                            link.style.display = 'none';

                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            // Clean up
                            setTimeout(() => window.URL.revokeObjectURL(url), 100);

                            setSnackbar({
                                open: true,
                                message: 'Policy document download started',
                                severity: 'success'
                            });
                        } else {
                            throw new Error('Downloaded file is not a PDF');
                        }
                    } else {
                        throw new Error(`Failed to fetch: ${fileResponse.status}`);
                    }
                } catch (downloadError) {
                    console.log('Blob download failed, trying alternative methods:', downloadError);

                    // Method 2: Try using the backend streaming endpoint directly
                    try {
                        console.log('Trying backend streaming download...');
                        const streamResponse = await fetch(`http://localhost:5000/api/user/${userId}/policy-document?action=download`);

                        if (streamResponse.ok && streamResponse.headers.get('content-type') === 'application/pdf') {
                            const blob = await streamResponse.blob();
                            const url = window.URL.createObjectURL(blob);

                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `policy_${customerName.replace(/[^a-zA-Z0-9]/g, '_')}_${userId}.pdf`;
                            link.style.display = 'none';

                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            setTimeout(() => window.URL.revokeObjectURL(url), 100);

                            setSnackbar({
                                open: true,
                                message: 'Policy document download started',
                                severity: 'success'
                            });
                            return;
                        }
                    } catch (streamError) {
                        console.log('Backend streaming failed, trying direct link:', streamError);
                    }

                    // Method 3: Fallback - direct link with download attribute
                    try {
                        // Use a more reliable approach with iframe for cross-origin downloads
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = result.documentUrl;

                        document.body.appendChild(iframe);

                        // Remove iframe after a short delay
                        setTimeout(() => {
                            if (document.body.contains(iframe)) {
                                document.body.removeChild(iframe);
                            }
                        }, 3000);

                        setSnackbar({
                            open: true,
                            message: 'Policy document download initiated. If download doesn\'t start, check your browser settings.',
                            severity: 'success'
                        });
                    } catch (iframeError) {
                        console.log('Iframe download failed, opening in new tab:', iframeError);

                        // Method 4: Last resort - open in new tab
                        window.open(result.documentUrl, '_blank');
                        setSnackbar({
                            open: true,
                            message: 'Policy document opened in new tab. Please save manually (Ctrl+S or Cmd+S).',
                            severity: 'info'
                        });
                    }
                }
            } else {
                setSnackbar({
                    open: true,
                    message: result.message || 'Policy document not available for download',
                    severity: 'warning'
                });
            }
        } catch (error) {
            console.error('Error downloading policy document:', error);
            setSnackbar({
                open: true,
                message: 'Failed to download policy document. Please try again.',
                severity: 'error'
            });
        }
    };

    // ============================================================================
    // COMPONENT RENDER
    // ============================================================================

    return (
        <Box sx={{ p: 3 }}>  {/* Main container with consistent padding */}
            {/* 
             * PAGE HEADER SECTION
             * 
             * Contains the page title and action buttons for adding users and importing Excel data.
             * Uses flexbox for responsive layout with proper spacing between elements.
             */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                mb: { xs: 3, md: 4, lg: 5 },
                gap: { xs: 2, md: 0 }
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1.5, sm: 2 },
                    width: { xs: '100%', md: 'auto' },
                    alignItems: 'center'
                }}>
                    {/* Bulk Delete Button - Show only when users are selected */}
                    {selectedUsers.length > 0 && (
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={bulkDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            sx={{
                                borderRadius: { xs: 2, md: 3 },
                                px: { xs: 2, md: 3 },
                                py: { xs: 1, md: 1.5 },
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                fontWeight: 600,
                                textTransform: 'none',
                                minWidth: 140
                            }}
                        >
                            {bulkDeleting ? 'Deleting...' : `Delete ${selectedUsers.length} User${selectedUsers.length > 1 ? 's' : ''}`}
                        </Button>
                    )}
                    { }
                    <Button
                        variant="outlined"
                        startIcon={exporting ? <CircularProgress size={20} /> : <DownloadIcon />}
                        onClick={handleExportExcel}
                        disabled={exporting || users.length === 0}
                        color="success"
                        sx={{
                            borderRadius: { xs: 2, md: 3 },
                            px: { xs: 2, md: 3 },
                            py: { xs: 1, md: 1.5 },
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        {exporting ? 'Exporting...' : 'Export Excel'}
                    </Button>
                    {/* { }
                    <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={handleOpenImportDialog}
                        color="secondary"
                        sx={{
                            borderRadius: { xs: 2, md: 3 },
                            px: { xs: 2, md: 3 },
                            py: { xs: 1, md: 1.5 },
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Import Excel
                    </Button>
                    { } */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('add')}
                        sx={{
                            borderRadius: { xs: 2, md: 3 },
                            px: { xs: 2, md: 3 },
                            py: { xs: 1, md: 1.5 },
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            fontWeight: 600,
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Add New User
                    </Button>
                </Box>
            </Box>

            { }
            <Box sx={{
                mb: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TextField
                    key="search-field"
                    variant="outlined"
                    placeholder="Search by name, vehicle number, or mobile..."
                    value={searchTerm}
                    onChange={handleSearch}
                    autoComplete="off"
                    name="searchField"
                    id="user-search-field"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />  { }
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: { xs: '100%', sm: 450, md: 500 },
                        maxWidth: 500
                    }}
                />
            </Box>

            { }
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    indeterminate={selectedUsers.length > 0 && !selectAll}
                                    inputProps={{
                                        'aria-label': 'select all users on this page',
                                    }}
                                />
                            </TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Vehicle Number</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Vehicle Type</TableCell>
                            <TableCell>Insurance Company</TableCell>
                            <TableCell>Premium</TableCell>
                            <TableCell>Policy Status</TableCell>
                            <TableCell>Policy Document</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                                <TableRow
                                    key={user.id}
                                    selected={selectedUsers.includes(user.id)}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(102, 126, 234, 0.08)',
                                        },
                                        '&.Mui-selected:hover': {
                                            backgroundColor: 'rgba(102, 126, 234, 0.12)',
                                        }
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                            inputProps={{
                                                'aria-labelledby': `user-${user.id}`,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell id={`user-${user.id}`}>{user.customer_name}</TableCell>
                                    <TableCell>{user.vehical_number}</TableCell>
                                    <TableCell>{user.mobile}</TableCell>
                                    <TableCell>{user.vehicle_type}</TableCell>
                                    <TableCell>{user.insurance_company}</TableCell>
                                    <TableCell>{formatCurrency(user.final_premium)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={new Date(user.insurance_end_date) > new Date() ? 'Active' : 'Expired'}
                                            color={getStatusColor(user.insurance_end_date)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {user.policy_document ? (
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    color="primary"
                                                    startIcon={<ViewIcon />}
                                                    onClick={() => handleViewPolicyDocument(user.id)}
                                                    sx={{ minWidth: 'auto' }}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    color="secondary"
                                                    startIcon={<DownloadIcon />}
                                                    onClick={() => handleDownloadPolicyDocument(user.id, user.customer_name)}
                                                    sx={{ minWidth: 'auto' }}
                                                >
                                                    Download
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                No Document
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDialog('view', user)} color="info">
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDialog('edit', user)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            { }
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'add' && 'Add New User'}
                    {dialogMode === 'edit' && 'Edit User'}
                    {dialogMode === 'view' && 'User Details'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        { }
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Customer Name"
                                value={dialogMode === 'view' ? selectedUser?.customer_name : formData.customer_name}
                                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                                error={!!formErrors.customer_name}
                                helperText={formErrors.customer_name}
                                InputProps={{ readOnly: dialogMode === 'view' }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vehicle Number"
                                value={dialogMode === 'view' ? selectedUser?.vehical_number : formData.vehical_number}
                                onChange={(e) => handleInputChange('vehical_number', e.target.value.toUpperCase())}
                                error={!!formErrors.vehical_number}
                                helperText={formErrors.vehical_number}
                                InputProps={{ readOnly: dialogMode === 'view' }}
                                required
                            />
                        </Grid>

                        { }
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                value={dialogMode === 'view' ? selectedUser?.mobile : formData.mobile}
                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                error={!!formErrors.mobile}
                                helperText={formErrors.mobile}
                                InputProps={{ readOnly: dialogMode === 'view' }}
                                autoComplete="off"
                                name="mobile"
                                id="user-mobile-field"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!formErrors.vehicle_type}>
                                <InputLabel>Vehicle Type</InputLabel>
                                <Select
                                    value={dialogMode === 'view' ? selectedUser?.vehicle_type : formData.vehicle_type}
                                    onChange={(e) => handleInputChange('vehicle_type', e.target.value)}
                                    readOnly={dialogMode === 'view'}
                                    required
                                >
                                    <MenuItem value="Car">Car</MenuItem>
                                    <MenuItem value="Bike">Bike</MenuItem>
                                    <MenuItem value="Truck">Truck</MenuItem>
                                    <MenuItem value="Bus">Bus</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        { }
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!formErrors.business_type}>
                                <InputLabel>Business Type</InputLabel>
                                <Select
                                    value={dialogMode === 'view' ? selectedUser?.business_type : formData.business_type}
                                    onChange={(e) => handleInputChange('business_type', e.target.value)}
                                    readOnly={dialogMode === 'view'}
                                    required
                                >
                                    <MenuItem value="Private">Private</MenuItem>
                                    <MenuItem value="Commercial">Commercial</MenuItem>
                                    <MenuItem value="Renewal">Renewal</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Insurance Company"
                                value={dialogMode === 'view' ? selectedUser?.insurance_company : formData.insurance_company}
                                onChange={(e) => handleInputChange('insurance_company', e.target.value)}
                                error={!!formErrors.insurance_company}
                                helperText={formErrors.insurance_company}
                                InputProps={{ readOnly: dialogMode === 'view' }}
                                required
                            />
                        </Grid>

                        { }
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!formErrors.policy_plan}>
                                <InputLabel>Policy Plan</InputLabel>
                                <Select
                                    value={dialogMode === 'view' ? selectedUser?.policy_plan : formData.policy_plan}
                                    onChange={(e) => handleInputChange('policy_plan', e.target.value)}
                                    readOnly={dialogMode === 'view'}
                                    required
                                >
                                    <MenuItem value="Comprehensive">Comprehensive</MenuItem>
                                    <MenuItem value="Third Party">Third Party</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!formErrors.payment_type}>
                                <InputLabel>Payment Type</InputLabel>
                                <Select
                                    value={dialogMode === 'view' ? selectedUser?.payment_type : formData.payment_type}
                                    onChange={(e) => handleInputChange('payment_type', e.target.value)}
                                    readOnly={dialogMode === 'view'}
                                    required
                                >
                                    <MenuItem value="Online">Online</MenuItem>
                                    <MenuItem value="Cash">Cash</MenuItem>
                                    <MenuItem value="Card">Card</MenuItem>
                                    <MenuItem value="Cheque">Cheque</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        { }
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Insurance Start Date"
                                type="date"
                                value={dialogMode === 'view' ?
                                    (selectedUser?.insurance_start_date ? new Date(selectedUser.insurance_start_date).toISOString().split('T')[0] : '') :
                                    formData.insurance_start_date
                                }
                                onChange={(e) => handleInputChange('insurance_start_date', e.target.value)}
                                error={!!formErrors.insurance_start_date}
                                helperText={formErrors.insurance_start_date}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ readOnly: dialogMode === 'view' }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Insurance End Date"
                                type="date"
                                value={dialogMode === 'view' ?
                                    (selectedUser?.insurance_end_date ? new Date(selectedUser.insurance_end_date).toISOString().split('T')[0] : '') :
                                    formData.insurance_end_date
                                }
                                onChange={(e) => handleInputChange('insurance_end_date', e.target.value)}
                                error={!!formErrors.insurance_end_date}
                                helperText={formErrors.insurance_end_date}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ readOnly: dialogMode === 'view' }}
                                required
                            />
                        </Grid>

                        { }
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Premium Amount (₹)"
                                type="number"
                                value={dialogMode === 'view' ? selectedUser?.final_premium : formData.final_premium}
                                onChange={(e) => handleInputChange('final_premium', e.target.value)}
                                error={!!formErrors.final_premium}
                                helperText={formErrors.final_premium}
                                InputProps={{ readOnly: dialogMode === 'view' }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!formErrors.od_or_net}>
                                <InputLabel>Coverage Type</InputLabel>
                                <Select
                                    value={dialogMode === 'view' ? selectedUser?.od_or_net : formData.od_or_net}
                                    onChange={(e) => handleInputChange('od_or_net', e.target.value)}
                                    readOnly={dialogMode === 'view'}
                                    required
                                >
                                    <MenuItem value="Net">Net</MenuItem>
                                    <MenuItem value="OD">OD (Own Damage)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        { }
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vehicle Variant"
                                value={dialogMode === 'view' ? selectedUser?.variant : formData.variant}
                                onChange={(e) => handleInputChange('variant', e.target.value)}
                                error={!!formErrors.variant}
                                helperText={formErrors.variant}
                                InputProps={{ readOnly: dialogMode === 'view' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Landmark/Address"
                                value={dialogMode === 'view' ? selectedUser?.landmark : formData.landmark}
                                onChange={(e) => handleInputChange('landmark', e.target.value)}
                                error={!!formErrors.landmark}
                                helperText={formErrors.landmark}
                                InputProps={{ readOnly: dialogMode === 'view' }}
                                required
                            />
                        </Grid>

                        { }
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2, mb: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Policy Document (PDF)
                                </Typography>

                                { }
                                {dialogMode === 'view' && selectedUser?.policy_document && (
                                    <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<ViewIcon />}
                                            onClick={() => handleViewPolicyDocument(selectedUser.id)}
                                        >
                                            View Document
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="secondary"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => handleDownloadPolicyDocument(selectedUser.id, selectedUser.customer_name)}
                                        >
                                            Download PDF
                                        </Button>
                                    </Box>
                                )}

                                {dialogMode === 'edit' && selectedUser?.policy_document && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Current Document: Policy Document Available
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewPolicyDocument(selectedUser.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            View Current Document
                                        </Button>
                                    </Box>
                                )}

                                { }
                                {dialogMode !== 'view' && (
                                    <Box>
                                        <input
                                            type="file"
                                            id="policy-document-input"
                                            accept=".pdf"
                                            onChange={handlePolicyDocumentSelect}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="policy-document-input">
                                            <Button
                                                component="span"
                                                variant="outlined"
                                                startIcon={<UploadIcon />}
                                                size="small"
                                                disabled={submitting}
                                            >
                                                {selectedPolicyDocument ? 'Change Document' : 'Upload Policy Document'}
                                            </Button>
                                        </label>

                                        { }
                                        {selectedPolicyDocument && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Selected: {selectedPolicyDocument.name}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => setSelectedPolicyDocument(null)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        )}

                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                            Upload PDF policy document (Max: 10MB)
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={submitting}>
                        {dialogMode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                    {dialogMode !== 'view' && (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                        >
                            {submitting ? 'Saving...' : (dialogMode === 'add' ? 'Add User' : 'Save Changes')}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            { }
            {loading && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            )}

            { }
            <Dialog open={importDialog} onClose={handleCloseImportDialog} maxWidth="md" fullWidth>
                <DialogTitle>Import Users from Excel</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        { }
                        <Typography variant="h6" gutterBottom>
                            1. Select Excel File
                        </Typography>
                        <Box sx={{ mb: 3, p: 2, border: '2px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                            <input
                                type="file"
                                id="excel-file-input"
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="excel-file-input">
                                <Button
                                    component="span"
                                    variant="outlined"
                                    startIcon={<UploadIcon />}
                                    sx={{ mb: 1 }}
                                >
                                    Choose Excel File
                                </Button>
                            </label>
                            {selectedFile && (
                                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </Typography>
                            )}
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Supported formats: .xlsx, .xls (Max 5MB)
                            </Typography>
                        </Box>

                        { }
                        <Typography variant="h6" gutterBottom>
                            2. Excel Format Requirements
                        </Typography>
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2" paragraph>
                                Your Excel file should have the following columns (order doesn't matter):
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1 }}>
                                <Typography variant="caption">• vehical_number</Typography>
                                <Typography variant="caption">• customer_name</Typography>
                                <Typography variant="caption">• mobile</Typography>
                                <Typography variant="caption">• landmark</Typography>
                                <Typography variant="caption">• vehicle_type</Typography>
                                <Typography variant="caption">• business_type</Typography>
                                <Typography variant="caption">• insurance_company</Typography>
                                <Typography variant="caption">• policy_plan</Typography>
                                <Typography variant="caption">• insurance_start_date</Typography>
                                <Typography variant="caption">• insurance_end_date</Typography>
                                <Typography variant="caption">• final_premium</Typography>
                                <Typography variant="caption">• payment_type</Typography>
                                <Typography variant="caption">• od_or_net</Typography>
                                <Typography variant="caption">• variant (optional)</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                                Note: Column names are case-insensitive and can have variations
                                (e.g., "Vehicle Number" or "vehicle_number").
                            </Typography>
                        </Box>

                        { }
                        {importResults && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Import Results
                                </Typography>
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="body2" color="text.secondary">Total Rows:</Typography>
                                            <Typography variant="h6">{importResults.summary.totalRows}</Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="body2" color="text.secondary">Successful:</Typography>
                                            <Typography variant="h6" color="success.main">
                                                {importResults.summary.successfulInserts}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="body2" color="text.secondary">Failed:</Typography>
                                            <Typography variant="h6" color="error.main">
                                                {importResults.summary.failedInserts}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="body2" color="text.secondary">Validation Errors:</Typography>
                                            <Typography variant="h6" color="warning.main">
                                                {importResults.summary.validationErrors}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    { }
                                    {importResults.results.validationErrors.length > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle2" color="warning.main" gutterBottom>
                                                Validation Errors (First 10):
                                            </Typography>
                                            <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                                                {importResults.results.validationErrors.map((error, index) => (
                                                    <Typography key={index} variant="caption" display="block" color="error">
                                                        • {error}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImportDialog} disabled={importing}>
                        {importResults ? 'Close' : 'Cancel'}
                    </Button>
                    {!importResults && (
                        <Button
                            variant="contained"
                            onClick={handleImportExcel}
                            disabled={!selectedFile || importing}
                            startIcon={importing ? <CircularProgress size={20} /> : <UploadIcon />}
                        >
                            {importing ? 'Importing...' : 'Import Data'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            { }
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UsersPage;