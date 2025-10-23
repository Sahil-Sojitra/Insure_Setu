import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Alert,
    Snackbar,
    CircularProgress,
    Divider,
    TextField,
    InputAdornment,
    Tooltip,
    Paper
} from '@mui/material';
import {
    Description as DocumentIcon,
    Download as DownloadIcon,
    Visibility as ViewIcon,
    Upload as UploadIcon,
    Search as SearchIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    CloudUpload as CloudUploadIcon,
    PictureAsPdf as PdfIcon,
    Image as ImageIcon,
    InsertDriveFile as FileIcon
} from '@mui/icons-material';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);

            // Get customer data from localStorage
            const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');

            if (!customerData.mobile) {
                window.location.href = '/';
                return;
            }

            // Fetch customer details from backend
            const response = await fetch(`http://localhost:5000/api/customers`);
            const result = await response.json();

            if (response.ok && result.data) {
                const currentCustomer = result.data.find(customer =>
                    customer.mobile === customerData.mobile
                );

                if (currentCustomer && currentCustomer.policy_document) {
                    // Create document entry from backend data
                    const documents = [{
                        id: currentCustomer.id,
                        name: `Policy Document - ${currentCustomer.customer_name}`,
                        type: 'Policy Document',
                        fileType: 'pdf',
                        uploadDate: currentCustomer.insurance_start_date ?
                            new Date(currentCustomer.insurance_start_date).toLocaleDateString() : 'Unknown',
                        size: 'Unknown',
                        url: `http://localhost:5000/${currentCustomer.policy_document}`,
                        status: 'Active'
                    }];

                    setDocuments(documents);
                } else {
                    // No documents found
                    setDocuments([]);
                }
            } else {
                throw new Error('Failed to fetch customer data');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            setSnackbar({
                open: true,
                message: 'Error fetching documents',
                severity: 'error'
            });
            setLoading(false);
        }
    }, []);



    const handleUploadDocument = async () => {
        if (!uploadFile) return;

        try {
            // Get customer data from localStorage
            const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');

            if (!customerData.mobile) {
                setSnackbar({
                    open: true,
                    message: 'Please login again',
                    severity: 'error'
                });
                return;
            }

            const formData = new FormData();
            formData.append('policyDocument', uploadFile);

            // Upload document to backend
            const response = await fetch(`http://localhost:5000/api/customers/${customerData.customer_id || 'unknown'}/policy-document`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Refresh documents list
                await fetchDocuments();
                setSnackbar({
                    open: true,
                    message: 'Document uploaded successfully',
                    severity: 'success'
                });
            } else {
                throw new Error('Failed to upload document');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setSnackbar({
                open: true,
                message: 'Failed to upload document. Please try again.',
                severity: 'error'
            });
            setOpenUploadDialog(false);
            setUploadFile(null);
        }
    };

    const handleDownloadDocument = (document) => {
        setSnackbar({
            open: true,
            message: `Downloading ${document.name}...`,
            severity: 'info'
        });
    };

    const handleViewDocument = (document) => {
        setSelectedDocument(document);
        setOpenViewDialog(true);
    };

    const handleDeleteDocument = (documentId) => {
        setDocuments(documents.filter(doc => doc.id !== documentId));
        setSnackbar({
            open: true,
            message: 'Document deleted successfully',
            severity: 'success'
        });
    };

    const getFileIcon = (fileType) => {
        switch (fileType.toLowerCase()) {
            case 'pdf':
                return <PdfIcon color="error" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <ImageIcon color="primary" />;
            default:
                return <FileIcon color="action" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: '#f8fafc',
            minHeight: '100vh'
        }}>
            { }
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                mb: { xs: 3, md: 4 },
                gap: { xs: 2, sm: 0 }
            }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
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
                    My Documents
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Tooltip title="Refresh Documents">
                        <IconButton
                            onClick={fetchDocuments}
                            sx={{
                                backgroundColor: '#f1f5f9',
                                color: '#667eea',
                                '&:hover': {
                                    backgroundColor: '#e2e8f0'
                                }
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => setOpenUploadDialog(true)}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
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
                        Upload Document
                    </Button>
                </Box>
            </Box>

            { }
            <Box mb={3}>
                <TextField
                    fullWidth
                    placeholder="Search documents..."
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
            </Box>

            { }
            <Grid container spacing={3}>
                {filteredDocuments.map((document) => (
                    <Grid item xs={12} md={6} lg={4} key={document.id}>
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
                                <Box display="flex" alignItems="center" mb={2}>
                                    {getFileIcon(document.fileType)}
                                    <Box ml={2} flexGrow={1}>
                                        <Typography variant="h6" fontWeight="bold" noWrap>
                                            {document.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {document.type}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={document.status}
                                        color={getStatusColor(document.status)}
                                        size="small"
                                    />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary">
                                        Upload Date: {new Date(document.uploadDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Size: {document.size}
                                    </Typography>
                                </Box>

                                <Box display="flex" gap={1}>
                                    <Button
                                        size="small"
                                        startIcon={<ViewIcon />}
                                        onClick={() => handleViewDocument(document)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<DownloadIcon />}
                                        onClick={() => handleDownloadDocument(document)}
                                    >
                                        Download
                                    </Button>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteDocument(document.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filteredDocuments.length === 0 && (
                <Paper elevation={1} sx={{ p: 4, textAlign: 'center', mt: 3 }}>
                    <DocumentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                        No documents found
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
                    </Typography>
                    {!searchTerm && (
                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={() => setOpenUploadDialog(true)}
                        >
                            Upload Document
                        </Button>
                    )}
                </Paper>
            )}

            { }
            <Dialog
                open={openUploadDialog}
                onClose={() => setOpenUploadDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Upload Document
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            borderRadius: 1,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                        onClick={() => document.getElementById('file-upload').click()}
                    >
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" mb={1}>
                            Click to upload or drag and drop
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            PDF, JPG, PNG files up to 10MB
                        </Typography>
                        <input
                            id="file-upload"
                            type="file"
                            hidden
                            accept=".pdf,.jpg,.jpeg,.png,.gif"
                            onChange={(e) => setUploadFile(e.target.files[0])}
                        />
                    </Box>

                    {uploadFile && (
                        <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
                            <Typography variant="body2" fontWeight="bold">
                                Selected File:
                            </Typography>
                            <Typography variant="body2">
                                {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUploadDocument}
                        disabled={!uploadFile}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            { }
            <Dialog
                open={openViewDialog}
                onClose={() => setOpenViewDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        {selectedDocument?.name}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedDocument && (
                        <Box>
                            <Typography variant="body1" mb={2}>
                                <strong>Type:</strong> {selectedDocument.type}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Status:</strong>
                                <Chip
                                    label={selectedDocument.status}
                                    color={getStatusColor(selectedDocument.status)}
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>Upload Date:</strong> {new Date(selectedDocument.uploadDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                <strong>File Size:</strong> {selectedDocument.size}
                            </Typography>

                            <Box
                                sx={{
                                    mt: 3,
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    borderRadius: 1,
                                    textAlign: 'center'
                                }}
                            >
                                {getFileIcon(selectedDocument.fileType)}
                                <Typography variant="body2" mt={1}>
                                    Document preview not available
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadDocument(selectedDocument)}
                    >
                        Download
                    </Button>
                </DialogActions>
            </Dialog>

            { }
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

export default Documents;