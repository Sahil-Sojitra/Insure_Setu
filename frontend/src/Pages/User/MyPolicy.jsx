import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Snackbar,
    CircularProgress,
    Divider,
    IconButton,
    Tooltip,
    Collapse,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Policy as PolicyIcon,
    CalendarToday as CalendarIcon,
    Money as MoneyIcon,
    Person as PersonIcon,
    DirectionsCar as CarIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    Security as SecurityIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Commute as CommuteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';

const MyPolicy = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [userInfo, setUserInfo] = useState(null);
    const [selectedPolicy, setSelectedPolicy] = useState(0); // Index of selected policy
    const [expandedPolicy, setExpandedPolicy] = useState(null); // For mobile FAQ-style expansion
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchPolicyData = useCallback(async () => {
        try {
            setLoading(true);

            // Get customer data from localStorage (set during login)
            const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');

            if (!customerData.mobile) {
                // Redirect to login if no customer data
                window.location.href = '/';
                return;
            }

            // Fetch all customer policies from backend for this mobile number
            const response = await fetch(`http://localhost:5000/api/customers`);
            const result = await response.json();

            if (response.ok && result.data) {
                // Find all policies for the current customer
                const customerPolicies = result.data.filter(customer =>
                    customer.mobile === customerData.mobile
                );

                if (customerPolicies.length > 0) {
                    // Transform all policies data
                    const allPolicies = customerPolicies.map(customer => ({
                        id: customer.id,
                        policyNumber: `POL-${customer.customer_id || customer.id || 'UNKNOWN'}`,
                        policyType: customer.policy_plan || 'Insurance Policy',
                        status: 'Active',
                        startDate: customer.insurance_start_date ?
                            new Date(customer.insurance_start_date).toLocaleDateString() : 'N/A',
                        endDate: customer.insurance_end_date ?
                            new Date(customer.insurance_end_date).toLocaleDateString() : 'N/A',
                        premium: customer.final_premium || 0,
                        coverageAmount: "------",
                        vehicle: {
                            make: 'Vehicle',
                            model: customer.vehicle_type || 'Unknown',
                            year: new Date().getFullYear(),
                            registrationNumber: customer.vehical_number || 'N/A'
                        },
                        policyholder: {
                            name: customer.customer_name || 'Unknown',
                            phone: customer.mobile || 'N/A',
                            email: 'N/A',
                            address: customer.landmark || 'N/A'
                        },
                        coverageDetails: [
                            { type: 'Own Damage', amount: `₹${(customer.final_premium || 0).toLocaleString()}`, status: 'Active' },
                            { type: 'Third Party Liability', amount: 'Unlimited', status: 'Active' },
                            { type: 'Business Type', amount: customer.business_type || 'N/A', status: 'Active' },
                            { type: 'Payment Type', amount: customer.payment_type || 'N/A', status: 'Active' }
                        ],
                        insuranceCompany: customer.insurance_company || 'N/A',
                        policyDocument: customer.policy_document
                    }));

                    setUserInfo({ policies: allPolicies, totalPolicies: allPolicies.length });
                } else {
                    throw new Error('No policies found');
                }
            } else {
                throw new Error('Failed to fetch customer data');
            }
        } catch (error) {
            console.error('Error fetching policy data:', error);
            setSnackbar({
                open: true,
                message: 'Error loading policy data. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPolicyData();
    }, [fetchPolicyData]);

    // ============================================================================
    // POLICY DOCUMENT FUNCTIONS (Same as Agent Dashboard)
    // ============================================================================

    const handleViewPolicyDocument = async (policyIndex = null) => {
        try {
            const targetPolicy = policyIndex !== null ? policyIndex : selectedPolicy;
            console.log('Attempting to view policy document for policy:', targetPolicy);

            if (!userInfo || !userInfo.policies || !userInfo.policies[targetPolicy]) {
                setSnackbar({
                    open: true,
                    message: 'No policy selected',
                    severity: 'warning'
                });
                return;
            }

            const policyData = userInfo.policies[targetPolicy];
            const userId = policyData.id;

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

    const handleDownloadPolicy = async (policyIndex = null) => {
        try {
            const targetPolicy = policyIndex !== null ? policyIndex : selectedPolicy;
            console.log('Attempting to download policy document for policy:', targetPolicy);

            if (!userInfo || !userInfo.policies || !userInfo.policies[targetPolicy]) {
                setSnackbar({
                    open: true,
                    message: 'No policy selected',
                    severity: 'warning'
                });
                return;
            }

            const policyData = userInfo.policies[targetPolicy];
            const userId = policyData.id;
            const customerName = policyData.policyholder.name;

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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    // Handle policy expansion for mobile FAQ-style interaction
    const handlePolicyToggle = (policyIndex) => {
        if (isMobile) {
            setExpandedPolicy(expandedPolicy === policyIndex ? null : policyIndex);
        } else {
            setSelectedPolicy(policyIndex);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    // Mobile FAQ-style layout
    if (isMobile) {
        return (
            <Box sx={{
                p: { xs: 1, sm: 2 },
                backgroundColor: '#f8fafc',
                minHeight: '100vh'
            }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    px: 1
                }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            color: '#1e293b',
                            fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                    >
                        My Policy
                    </Typography>
                    <IconButton
                        onClick={fetchPolicyData}
                        sx={{
                            backgroundColor: '#f1f5f9',
                            color: '#667eea',
                            '&:hover': { backgroundColor: '#e2e8f0' }
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>

                {/* Mobile Policy Cards - FAQ Style */}
                {userInfo && userInfo.policies && userInfo.policies.map((policy, index) => (
                    <Card
                        key={policy.id}
                        sx={{
                            mb: 2,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Policy Header - Always Visible */}
                        <CardContent
                            onClick={() => handlePolicyToggle(index)}
                            sx={{
                                p: 3,
                                cursor: 'pointer',
                                backgroundColor: expandedPolicy === index ? '#f8fafc' : 'white',
                                borderBottom: expandedPolicy === index ? '1px solid #e2e8f0' : 'none',
                                '&:hover': {
                                    backgroundColor: '#f8fafc'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#1e293b' }}>
                                        {policy.vehicle.registrationNumber}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5, color: '#64748b' }}>
                                        {policy.policyNumber}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1, color: '#64748b' }}>
                                        {policy.insuranceCompany}
                                    </Typography>
                                    <Chip
                                        label={policy.status}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#dcfce7',
                                            color: '#166534',
                                            fontWeight: 500
                                        }}
                                    />
                                </Box>
                                <IconButton sx={{ color: '#667eea' }}>
                                    {expandedPolicy === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                        </CardContent>

                        {/* Expandable Content */}
                        <Collapse in={expandedPolicy === index} timeout="auto" unmountOnExit>
                            <CardContent sx={{ p: 0, backgroundColor: '#fafbfc' }}>
                                {/* Policy Overview Section */}
                                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            color: '#1e293b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: 600
                                        }}
                                    >
                                        <PolicyIcon sx={{ mr: 1, color: '#667eea' }} />
                                        Policy Overview
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                                Policy Number
                                            </Typography>
                                            <Typography variant="body1" fontWeight="600">
                                                {policy.policyNumber}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                                Policy Period
                                            </Typography>
                                            <Typography variant="body1" fontWeight="600">
                                                {policy.startDate} to {policy.endDate}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                                Annual Premium
                                            </Typography>
                                            <Typography variant="body1" fontWeight="600" color="success.main">
                                                ₹{policy.premium.toLocaleString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                                Insurance Company
                                            </Typography>
                                            <Typography variant="body1" fontWeight="600">
                                                {policy.insuranceCompany}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ViewIcon />}
                                            onClick={() => {
                                                setSelectedPolicy(index);
                                                handleViewPolicyDocument(index);
                                            }}
                                            sx={{
                                                flex: 1,
                                                borderColor: '#1976d2',
                                                color: '#1976d2',
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd',
                                                    borderColor: '#1565c0'
                                                }
                                            }}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => {
                                                setSelectedPolicy(index);
                                                handleDownloadPolicy(index);
                                            }}
                                            sx={{
                                                flex: 1,
                                                borderColor: '#667eea',
                                                color: '#667eea',
                                                '&:hover': {
                                                    borderColor: '#5a67d8',
                                                    backgroundColor: 'rgba(102, 126, 234, 0.08)'
                                                }
                                            }}
                                        >
                                            Download Policy
                                        </Button>
                                    </Box>
                                </Box>

                                {/* Quick Info Section */}
                                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            color: '#1e293b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: 600
                                        }}
                                    >
                                        <PersonIcon sx={{ mr: 1, color: '#667eea' }} />
                                        Quick Info
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                                            <CommuteIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                            Vehicle
                                        </Typography>
                                        <Typography variant="body1" fontWeight="600">
                                            {policy.vehicle.year} {policy.vehicle.make} {policy.vehicle.model}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {policy.vehicle.registrationNumber}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                                            <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                            Policy Holder
                                        </Typography>
                                        <Typography variant="body1" fontWeight="600">
                                            {policy.policyholder.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {policy.policyholder.phone}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Coverage Details Section */}
                                <Box sx={{ p: 3 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            color: '#1e293b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: 600
                                        }}
                                    >
                                        <SecurityIcon sx={{ mr: 1, color: '#667eea' }} />
                                        Coverage Details
                                    </Typography>

                                    {policy.coverageDetails.map((coverage, coverageIndex) => (
                                        <Box
                                            key={coverageIndex}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                py: 1.5,
                                                borderBottom: coverageIndex < policy.coverageDetails.length - 1 ? '1px solid #f1f5f9' : 'none'
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" fontWeight="500">
                                                    {coverage.type}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {coverage.amount}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={coverage.status}
                                                size="small"
                                                color={coverage.status === 'Active' ? 'success' : 'default'}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Collapse>
                    </Card>
                ))}

                {/* Snackbar for mobile */}
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
    }

    // Desktop Layout - Three Column Layout
    return (
        <Box sx={{
            p: 0,
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <Box sx={{
                p: 3,
                backgroundColor: 'white',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: { md: '2rem', lg: '2.25rem' }
                    }}
                >
                    My Policy
                </Typography>
                <IconButton
                    onClick={fetchPolicyData}
                    sx={{
                        backgroundColor: '#f1f5f9',
                        color: '#667eea',
                        '&:hover': { backgroundColor: '#e2e8f0' }
                    }}
                >
                    <RefreshIcon />
                </IconButton>
            </Box>

            {/* Main Content */}
            <Box sx={{ display: 'flex', flex: 1 }}>
                {/* Left Sidebar - Policy List */}
                <Box sx={{
                    width: { md: 300, lg: 350 },
                    borderRight: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    overflow: 'auto'
                }}>
                    {userInfo && userInfo.policies && userInfo.policies.map((policy, index) => (
                        <Card
                            key={policy.id}
                            onClick={() => setSelectedPolicy(index)}
                            sx={{
                                m: 2,
                                cursor: 'pointer',
                                backgroundColor: selectedPolicy === index ? '#667eea' : 'white',
                                color: selectedPolicy === index ? 'white' : '#1e293b',
                                border: selectedPolicy === index ? '2px solid #667eea' : '1px solid #e2e8f0',
                                borderRadius: 2,
                                boxShadow: selectedPolicy === index ? '0 4px 20px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: selectedPolicy === index ? '0 6px 25px rgba(102, 126, 234, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.15)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2.5 }}>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 1, fontSize: '1.1rem' }}>
                                    {policy.vehicle.registrationNumber}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.8 }}>
                                    {policy.policyNumber}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
                                    {policy.insuranceCompany}
                                </Typography>
                                <Chip
                                    label={policy.status}
                                    size="small"
                                    sx={{
                                        backgroundColor: selectedPolicy === index ? 'rgba(255,255,255,0.2)' : '#dcfce7',
                                        color: selectedPolicy === index ? 'white' : '#166534',
                                        fontWeight: 500
                                    }}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Center Content - Policy Overview & Coverage Details */}
                <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                    {userInfo && userInfo.policies && (
                        <>
                            {/* Policy Overview Card */}
                            <Card sx={{
                                mb: 3,
                                borderRadius: 3,
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            mb: 3,
                                            color: '#1e293b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: 600
                                        }}
                                    >
                                        <PolicyIcon sx={{ mr: 2, color: '#667eea' }} />
                                        Policy Overview ({selectedPolicy + 1} of {userInfo.totalPolicies})
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                                Policy Number
                                            </Typography>
                                            <Typography variant="body1" fontWeight="600">
                                                {userInfo.policies[selectedPolicy].policyNumber}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                                                <CalendarIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                                Policy Period
                                            </Typography>
                                            <Typography variant="body1" fontWeight="600">
                                                {userInfo.policies[selectedPolicy].startDate} to {userInfo.policies[selectedPolicy].endDate}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                                                <MoneyIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                                Annual Premium
                                            </Typography>
                                            <Typography variant="h6" fontWeight="700" color="success.main">
                                                ₹{userInfo.policies[selectedPolicy].premium.toLocaleString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                                Insurance Company
                                            </Typography>
                                            <Typography variant="body1" fontWeight="600">
                                                {userInfo.policies[selectedPolicy].insuranceCompany}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ViewIcon />}
                                            onClick={() => handleViewPolicyDocument(selectedPolicy)}
                                            sx={{
                                                flex: 1,
                                                borderColor: '#1976d2',
                                                color: '#1976d2',
                                                fontWeight: 600,
                                                px: 3,
                                                py: 1.5,
                                                borderRadius: 2,
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd',
                                                    borderColor: '#1565c0'
                                                }
                                            }}
                                        >
                                            View Policy
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => handleDownloadPolicy(selectedPolicy)}
                                            sx={{
                                                flex: 1,
                                                borderColor: '#667eea',
                                                color: '#667eea',
                                                fontWeight: 600,
                                                px: 3,
                                                py: 1.5,
                                                borderRadius: 2,
                                                '&:hover': {
                                                    borderColor: '#5a67d8',
                                                    backgroundColor: 'rgba(102, 126, 234, 0.08)'
                                                }
                                            }}
                                        >
                                            Download Policy
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Coverage Details Card */}
                            <Card sx={{
                                borderRadius: 3,
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            mb: 3,
                                            color: '#1e293b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: 600
                                        }}
                                    >
                                        <SecurityIcon sx={{ mr: 2, color: '#667eea' }} />
                                        Coverage Details
                                    </Typography>

                                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f1f5f9' }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Coverage Type</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Amount</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {userInfo.policies[selectedPolicy].coverageDetails.map((coverage, index) => (
                                                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                                                        <TableCell sx={{ fontWeight: 500 }}>{coverage.type}</TableCell>
                                                        <TableCell sx={{ fontWeight: 600, color: '#059669' }}>{coverage.amount}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={coverage.status}
                                                                color={coverage.status === 'Active' ? 'success' : 'default'}
                                                                size="small"
                                                                sx={{ fontWeight: 500 }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </Box>

                {/* Right Sidebar - Quick Info */}
                <Box sx={{
                    width: { md: 280, lg: 320 },
                    borderLeft: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    p: 3
                }}>
                    {userInfo && userInfo.policies && (
                        <Card sx={{
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 3,
                                        color: '#1e293b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontWeight: 600
                                    }}
                                >
                                    <PersonIcon sx={{ mr: 1, color: '#667eea' }} />
                                    Quick Info
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <CommuteIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                        Vehicle
                                    </Typography>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                                        {userInfo.policies[selectedPolicy].vehicle.year} Vehicle {userInfo.policies[selectedPolicy].vehicle.model}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="600" color="primary.main">
                                        {userInfo.policies[selectedPolicy].vehicle.registrationNumber}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                        Policy Holder
                                    </Typography>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                                        {userInfo.policies[selectedPolicy].policyholder.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PhoneIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                                        {userInfo.policies[selectedPolicy].policyholder.phone}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </Box>

            {/* Snackbar for desktop */}
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

export default MyPolicy;