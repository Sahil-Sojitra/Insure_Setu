import React, { useState, useEffect } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Alert,
    Snackbar,
    CircularProgress,
    Divider,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Payment as PaymentIcon,
    CreditCard as CreditCardIcon,
    AccountBalance as BankIcon,
    Receipt as ReceiptIcon,
    Download as DownloadIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Error as ErrorIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchPayments = async () => {
        try {
            setLoading(true);

            // Get customer data from localStorage
            const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');

            if (!customerData.mobile) {
                window.location.href = '/';
                return;
            }

            // Fetch customer details to get payment information
            const response = await fetch(`http://localhost:5000/api/customers`);
            const result = await response.json();

            if (response.ok && result.data) {
                const currentCustomer = result.data.find(customer =>
                    customer.mobile === customerData.mobile
                );

                if (currentCustomer) {
                    // Create payment entry from backend data
                    const paymentData = [{
                        id: 1,
                        transactionId: `TXN-${currentCustomer.id}-${Date.now()}`,
                        amount: currentCustomer.final_premium || 0,
                        type: 'Premium Payment',
                        method: currentCustomer.payment_type || 'Unknown',
                        status: 'Completed',
                        date: currentCustomer.insurance_start_date ?
                            new Date(currentCustomer.insurance_start_date).toLocaleDateString() : new Date().toLocaleDateString(),
                        dueDate: currentCustomer.insurance_end_date ?
                            new Date(currentCustomer.insurance_end_date).toLocaleDateString() : 'N/A',
                        description: `${currentCustomer.policy_plan || 'Insurance'} - ${currentCustomer.customer_name}`,
                        cardLast4: '****',
                        receiptUrl: null
                    }];

                    setPayments(paymentData);
                } else {
                    setPayments([]);
                }
            } else {
                throw new Error('Failed to fetch payment data');
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            setSnackbar({
                open: true,
                message: 'Error loading payment data',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Payment statistics calculation
    const paymentStats = {
        totalPaid: payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0),
        totalPending: payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0),
        scheduledAmount: payments.filter(p => p.status === 'Scheduled').reduce((sum, p) => sum + p.amount, 0),
        failedPayments: payments.filter(p => p.status === 'Failed').length
    };

    useEffect(() => {
        fetchPayments();
    }, []);



    const handleDownloadReceipt = (payment) => {
        if (payment.receiptUrl) {
            setSnackbar({
                open: true,
                message: `Downloading receipt for ${payment.transactionId}...`,
                severity: 'info'
            });
        } else {
            setSnackbar({
                open: true,
                message: 'Receipt not available for this payment',
                severity: 'warning'
            });
        }
    };

    const handleViewPayment = (payment) => {
        setSelectedPayment(payment);
        setOpenPaymentDialog(true);
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircleIcon color="success" />;
            case 'pending':
                return <PendingIcon color="warning" />;
            case 'failed':
                return <ErrorIcon color="error" />;
            case 'scheduled':
                return <ScheduleIcon color="info" />;
            default:
                return <PaymentIcon />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'error';
            case 'scheduled':
                return 'info';
            default:
                return 'default';
        }
    };

    const getPaymentMethodIcon = (method) => {
        switch (method.toLowerCase()) {
            case 'credit card':
            case 'debit card':
                return <CreditCardIcon />;
            case 'net banking':
                return <BankIcon />;
            default:
                return <PaymentIcon />;
        }
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            { }
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Payments & Billing
                </Typography>
                <Tooltip title="Refresh Payments">
                    <IconButton onClick={fetchPayments} color="primary">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            { }
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                <Typography variant="h6" color="success.main" fontWeight="bold">
                                    Total Paid
                                </Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                                ₹{paymentStats.totalPaid.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                All completed payments
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <PendingIcon color="warning" sx={{ mr: 1 }} />
                                <Typography variant="h6" color="warning.main" fontWeight="bold">
                                    Pending
                                </Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                                ₹{paymentStats.pendingAmount.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Awaiting processing
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <ScheduleIcon color="info" sx={{ mr: 1 }} />
                                <Typography variant="h6" color="info.main" fontWeight="bold">
                                    Scheduled
                                </Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                                ₹{paymentStats.scheduledAmount.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Future payments
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <ErrorIcon color="error" sx={{ mr: 1 }} />
                                <Typography variant="h6" color="error.main" fontWeight="bold">
                                    Failed
                                </Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                                {paymentStats.failedPayments}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Failed transactions
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            { }
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        placeholder="Search payments by transaction ID, type, or description..."
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
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Status Filter</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status Filter"
                            onChange={(e) => setStatusFilter(e.target.value)}
                            startAdornment={<FilterIcon sx={{ mr: 1 }} />}
                        >
                            <MenuItem value="all">All Payments</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="failed">Failed</MenuItem>
                            <MenuItem value="scheduled">Scheduled</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            { }
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Payment History
                    </Typography>

                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Transaction ID</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Method</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPayments.map((payment) => (
                                    <TableRow key={payment.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">
                                                {payment.transactionId}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" fontWeight="bold">
                                                ₹{payment.amount.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <PaymentIcon sx={{ mr: 1, fontSize: 16 }} />
                                                {payment.type}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                {getPaymentMethodIcon(payment.method)}
                                                <Typography variant="body2" sx={{ ml: 1 }}>
                                                    {payment.method}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={getStatusIcon(payment.status)}
                                                label={payment.status}
                                                color={getStatusColor(payment.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {payment.date ? new Date(payment.date).toLocaleDateString() : 'Not processed'}
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1}>
                                                <Button
                                                    size="small"
                                                    onClick={() => handleViewPayment(payment)}
                                                >
                                                    View
                                                </Button>
                                                {payment.receiptUrl && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDownloadReceipt(payment)}
                                                        color="primary"
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {filteredPayments.length === 0 && (
                        <Box textAlign="center" py={4}>
                            <PaymentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="textSecondary">
                                No payments found
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'No payment history available'}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            { }
            <Dialog
                open={openPaymentDialog}
                onClose={() => setOpenPaymentDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Payment Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedPayment && (
                        <Box>
                            <Typography variant="h6" color="primary" mb={2}>
                                {selectedPayment.transactionId}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">Amount</Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        ₹{selectedPayment.amount.toLocaleString()}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">Status</Typography>
                                    <Chip
                                        label={selectedPayment.status}
                                        color={getStatusColor(selectedPayment.status)}
                                        size="small"
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">Payment Type</Typography>
                                    <Typography variant="body1">{selectedPayment.type}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">Payment Method</Typography>
                                    <Typography variant="body1">{selectedPayment.method}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">Payment Date</Typography>
                                    <Typography variant="body1">
                                        {selectedPayment.date ? new Date(selectedPayment.date).toLocaleDateString() : 'Not processed'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">Due Date</Typography>
                                    <Typography variant="body1">
                                        {new Date(selectedPayment.dueDate).toLocaleDateString()}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">Description</Typography>
                                    <Typography variant="body1">{selectedPayment.description}</Typography>
                                </Grid>

                                {selectedPayment.cardLast4 && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="textSecondary">Card Details</Typography>
                                        <Typography variant="body1">**** **** **** {selectedPayment.cardLast4}</Typography>
                                    </Grid>
                                )}

                                {selectedPayment.bank && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="textSecondary">Bank</Typography>
                                        <Typography variant="body1">{selectedPayment.bank}</Typography>
                                    </Grid>
                                )}

                                {selectedPayment.upiId && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="textSecondary">UPI ID</Typography>
                                        <Typography variant="body1">{selectedPayment.upiId}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPaymentDialog(false)}>Close</Button>
                    {selectedPayment?.receiptUrl && (
                        <Button
                            variant="contained"
                            startIcon={<ReceiptIcon />}
                            onClick={() => handleDownloadReceipt(selectedPayment)}
                        >
                            Download Receipt
                        </Button>
                    )}
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

export default Payments;