import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Alert,
    Snackbar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    IconButton,
    Tooltip,
    Paper
} from '@mui/material';
import {
    Support as SupportIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Chat as ChatIcon,
    HelpOutline as HelpIcon,
    ExpandMore as ExpandMoreIcon,
    Send as SendIcon,
    Schedule as ScheduleIcon,
    LocationOn as LocationIcon,
    WhatsApp as WhatsAppIcon,
    ContactSupport as ContactSupportIcon,
    LiveHelp as LiveHelpIcon,
    QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';

const Support = () => {
    const [openContactDialog, setOpenContactDialog] = useState(false);
    const [openTicketDialog, setOpenTicketDialog] = useState(false);
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: '',
        description: '',
        priority: 'medium'
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    
    const faqData = [
        {
            question: "How do I file a claim?",
            answer: "To file a claim, you can: 1) Call our 24/7 helpline at 1800-XXX-XXXX, 2) Use the mobile app to report and track your claim, 3) Visit the nearest branch office, or 4) Submit online through the customer portal. You'll need your policy number, incident details, and supporting documents."
        },
        {
            question: "What documents are required for claim processing?",
            answer: "Required documents include: Original policy copy, FIR copy (for theft/accident), Driving license, Vehicle registration certificate, Repair estimates/bills, Medical reports (if applicable), and any other relevant supporting documents based on claim type."
        },
        {
            question: "How can I renew my policy?",
            answer: "Policy renewal is easy! You can renew online through our website/app, visit any branch office, or call our customer service. Renewal can be done up to 90 days before expiry. Online renewal offers instant policy generation and various payment options."
        },
        {
            question: "What is No Claim Bonus (NCB)?",
            answer: "No Claim Bonus is a discount offered on your premium for not making any claims during the policy period. NCB ranges from 20% to 50% based on consecutive claim-free years. It's linked to the owner, not the vehicle, and can be transferred when buying a new vehicle."
        },
        {
            question: "How do I update my contact information?",
            answer: "You can update your contact details by: 1) Logging into your online account, 2) Calling customer service, 3) Visiting a branch office, or 4) Sending a written request with supporting documents. Changes are usually processed within 24-48 hours."
        },
        {
            question: "What is covered under Comprehensive Insurance?",
            answer: "Comprehensive insurance covers: Own damage due to accident, fire, theft, natural disasters, third-party liability as per Motor Vehicles Act, and personal accident cover for owner-driver. Additional covers like zero depreciation, engine protection, and roadside assistance can be added."
        },
        {
            question: "How do I check my claim status?",
            answer: "You can check claim status through: 1) Online customer portal using claim number, 2) Mobile app, 3) SMS by sending 'CLAIM<space>Policy Number' to XXXXX, 4) Calling customer service, or 5) Visiting the branch office where claim was filed."
        },
        {
            question: "What should I do immediately after an accident?",
            answer: "After an accident: 1) Ensure safety and call emergency services if needed, 2) Take photos of damage and accident scene, 3) Exchange details with other parties, 4) File FIR if required, 5) Inform us within 24 hours, 6) Don't admit fault or make statements, 7) Preserve evidence and get witness details."
        }
    ];

    
    const supportOptions = [
        {
            title: "24/7 Helpline",
            description: "Call us anytime for immediate assistance",
            icon: <PhoneIcon color="primary" />,
            contact: "1800-XXX-XXXX",
            available: "24 hours, 7 days a week"
        },
        {
            title: "Email Support",
            description: "Send us your queries via email",
            icon: <EmailIcon color="primary" />,
            contact: "support@insurance.com",
            available: "Response within 24 hours"
        },
        {
            title: "WhatsApp Support",
            description: "Chat with us on WhatsApp",
            icon: <WhatsAppIcon color="success" />,
            contact: "+91-XXXXX-XXXXX",
            available: "9 AM to 9 PM, Mon-Sun"
        },
        {
            title: "Live Chat",
            description: "Instant chat support on website",
            icon: <ChatIcon color="primary" />,
            contact: "Available on website",
            available: "9 AM to 6 PM, Mon-Fri"
        }
    ];

    const handleContactSupport = (method) => {
        setSnackbar({
            open: true,
            message: `Connecting you to ${method} support...`,
            severity: 'info'
        });
    };

    const handleSubmitTicket = () => {
        if (!ticketForm.subject || !ticketForm.description) {
            setSnackbar({
                open: true,
                message: 'Please fill in all required fields',
                severity: 'error'
            });
            return;
        }

        
        const ticketId = `TKT-${Date.now()}`;
        setSnackbar({
            open: true,
            message: `Support ticket ${ticketId} created successfully!`,
            severity: 'success'
        });

        setOpenTicketDialog(false);
        setTicketForm({
            subject: '',
            category: '',
            description: '',
            priority: 'medium'
        });
    };

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: '#f8fafc',
            minHeight: '100vh'
        }}>
            {}
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
                    Support & Help
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ContactSupportIcon />}
                    onClick={() => setOpenTicketDialog(true)}
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
                    Create Ticket
                </Button>
            </Box>

            {}
            <Grid container spacing={3} mb={4}>
                {supportOptions.map((option, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{
                            height: '100%',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                            }
                        }} onClick={() => handleContactSupport(option.title)}>
                            <CardContent sx={{ p: 3 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 3,
                                        '& svg': {
                                            fontSize: '2rem',
                                            color: '#667eea',
                                            mr: 2
                                        }
                                    }}
                                >
                                    {option.icon}
                                    <Typography variant="h6" fontWeight="700" color="#1e293b">
                                        {option.title}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" color="text.secondary" mb={3} sx={{ lineHeight: 1.6 }}>
                                    {option.description}
                                </Typography>
                                <Typography variant="h6" fontWeight="600" color="#667eea" mb={1}>
                                    {option.contact}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {option.available}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {}
                <Grid item xs={12} lg={8}>
                    <Card sx={{
                        backgroundColor: 'white',
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 4,
                                    '& svg': {
                                        fontSize: '2rem',
                                        color: '#667eea',
                                        mr: 2
                                    }
                                }}
                            >
                                <HelpIcon />
                                <Typography
                                    variant="h4"
                                    fontWeight="700"
                                    color="#1e293b"
                                    sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                                >
                                    Frequently Asked Questions
                                </Typography>
                            </Box>

                            {faqData.map((faq, index) => (
                                <Accordion
                                    key={index}
                                    sx={{
                                        backgroundColor: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px !important',
                                        mb: 2,
                                        boxShadow: 'none',
                                        '&:before': { display: 'none' },
                                        '&.Mui-expanded': {
                                            backgroundColor: 'white',
                                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                                        aria-controls={`faq-content-${index}`}
                                        id={`faq-header-${index}`}
                                        sx={{
                                            px: 3,
                                            py: 2,
                                            '&.Mui-expanded': {
                                                borderBottom: '1px solid #e2e8f0'
                                            }
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            fontWeight="600"
                                            color="#1e293b"
                                            sx={{ fontSize: { xs: '0.95rem', md: '1.1rem' } }}
                                        >
                                            {faq.question}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ px: 3, py: 2 }}>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.6 }}
                                        >
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {}
                <Grid item xs={12} lg={4}>
                    {}
                    <Card sx={{
                        mb: 3,
                        backgroundColor: 'white',
                        borderRadius: 3,
                        border: '2px solid #fca5a5',
                        boxShadow: '0 4px 20px rgba(248, 113, 113, 0.15)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography
                                variant="h5"
                                fontWeight="700"
                                sx={{
                                    color: '#dc2626',
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '& svg': {
                                        fontSize: '1.5rem',
                                        mr: 1
                                    }
                                }}
                            >
                                <PhoneIcon />
                                Emergency Assistance
                            </Typography>

                            <List sx={{ p: 0 }}>
                                <ListItem sx={{
                                    px: 0,
                                    py: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#fef2f2',
                                    mb: 2
                                }}>
                                    <ListItemIcon>
                                        <PhoneIcon sx={{ color: '#dc2626', fontSize: '1.5rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" fontWeight="600" color="#1e293b">
                                                Accident Helpline
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="h6" fontWeight="700" color="#dc2626">
                                                1800-XXX-EMERGENCY
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{
                                    px: 0,
                                    py: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#fef2f2'
                                }}>
                                    <ListItemIcon>
                                        <LocationIcon sx={{ color: '#dc2626', fontSize: '1.5rem' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" fontWeight="600" color="#1e293b">
                                                Roadside Assistance
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="h6" fontWeight="700" color="#dc2626">
                                                1800-XXX-ROADSIDE
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>

                            <Alert
                                severity="warning"
                                sx={{
                                    mt: 3,
                                    borderRadius: 2,
                                    backgroundColor: '#fef3c7',
                                    border: '1px solid #fbbf24',
                                    '& .MuiAlert-icon': {
                                        color: '#f59e0b'
                                    }
                                }}
                            >
                                <Typography fontWeight="600">
                                    Available 24/7 for emergencies and roadside assistance
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>

                    {}
                    <Card sx={{
                        backgroundColor: 'white',
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 3,
                                    '& svg': {
                                        fontSize: '1.5rem',
                                        color: '#667eea',
                                        mr: 2
                                    }
                                }}
                            >
                                <ScheduleIcon />
                                <Typography variant="h5" fontWeight="700" color="#1e293b">
                                    Office Hours
                                </Typography>
                            </Box>

                            <List sx={{ p: 0 }}>
                                <ListItem sx={{ px: 0, py: 2, borderBottom: '1px solid #e2e8f0' }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" fontWeight="600" color="#1e293b">
                                                Customer Service
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body1" color="#667eea" fontWeight="500">
                                                Mon-Fri: 9 AM - 6 PM
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem sx={{ px: 0, py: 2, borderBottom: '1px solid #e2e8f0' }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" fontWeight="600" color="#1e293b">
                                                Claims Department
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body1" color="#667eea" fontWeight="500">
                                                Mon-Sat: 9 AM - 7 PM
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem sx={{ px: 0, py: 2, borderBottom: '1px solid #e2e8f0' }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" fontWeight="600" color="#1e293b">
                                                Branch Offices
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body1" color="#667eea" fontWeight="500">
                                                Mon-Fri: 10 AM - 5 PM
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem sx={{ px: 0, py: 2 }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" fontWeight="600" color="#1e293b">
                                                Emergency Support
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body1" color="#10b981" fontWeight="600">
                                                24/7 Available
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>

                            <Divider sx={{ my: 3, borderColor: '#e2e8f0' }} />

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<LocationIcon />}
                                onClick={() => setOpenContactDialog(true)}
                                sx={{
                                    borderColor: '#667eea',
                                    color: '#667eea',
                                    fontWeight: 600,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: '#5a67d8',
                                        backgroundColor: 'rgba(102, 126, 234, 0.08)',
                                        color: '#5a67d8'
                                    }
                                }}
                            >
                                Find Branch Office
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {}
            <Dialog
                open={openTicketDialog}
                onClose={() => setOpenTicketDialog(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 3,
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
                    }
                }}
            >
                <DialogTitle sx={{
                    pb: 2,
                    borderBottom: '1px solid #e2e8f0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}>
                    <Typography variant="h5" fontWeight="700" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& svg': {
                            fontSize: '1.5rem',
                            mr: 2
                        }
                    }}>
                        <ContactSupportIcon />
                        Create Support Ticket
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3, backgroundColor: '#f8fafc' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Subject *"
                                value={ticketForm.subject}
                                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                margin="normal"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                        '& fieldset': {
                                            borderColor: '#e2e8f0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea'
                                        }
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Category"
                                value={ticketForm.category}
                                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                                margin="normal"
                                SelectProps={{
                                    native: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                        '& fieldset': {
                                            borderColor: '#e2e8f0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea'
                                        }
                                    }
                                }}
                            >
                                <option value="">Select Category</option>
                                <option value="claims">Claims</option>
                                <option value="policy">Policy Related</option>
                                <option value="payment">Payment Issues</option>
                                <option value="technical">Technical Support</option>
                                <option value="general">General Inquiry</option>
                                <option value="complaint">Complaint</option>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Priority"
                                value={ticketForm.priority}
                                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                                margin="normal"
                                SelectProps={{
                                    native: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                        '& fieldset': {
                                            borderColor: '#e2e8f0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea'
                                        }
                                    }
                                }}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description *"
                                multiline
                                rows={4}
                                value={ticketForm.description}
                                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                                placeholder="Please describe your issue in detail..."
                                margin="normal"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                        '& fieldset': {
                                            borderColor: '#e2e8f0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea'
                                        }
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}>
                    <Button
                        onClick={() => setOpenTicketDialog(false)}
                        sx={{
                            color: '#64748b',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#f1f5f9'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={handleSubmitTicket}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
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
                        Submit Ticket
                    </Button>
                </DialogActions>
            </Dialog>

            {}
            <Dialog
                open={openContactDialog}
                onClose={() => setOpenContactDialog(false)}
                maxWidth="md"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 3,
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
                    }
                }}
            >
                <DialogTitle sx={{
                    pb: 2,
                    borderBottom: '1px solid #e2e8f0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}>
                    <Typography variant="h5" fontWeight="700" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& svg': {
                            fontSize: '1.5rem',
                            mr: 2
                        }
                    }}>
                        <LocationIcon />
                        Branch Offices
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 4, backgroundColor: '#f8fafc' }}>
                    <Typography variant="h6" mb={3} color="#1e293b" fontWeight="600">
                        Find our branch offices near you:
                    </Typography>

                    <List sx={{
                        p: 0,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}>
                        <ListItem sx={{ py: 3, px: 3 }}>
                            <ListItemIcon>
                                <LocationIcon sx={{ color: '#667eea', fontSize: '1.5rem' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" fontWeight="700" color="#1e293b">
                                        Corporate Office - Ahmedabad
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body1" color="text.secondary">
                                        123 Business District, Ahmedabad - 380001, Gujarat
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider sx={{ mx: 3 }} />
                        <ListItem sx={{ py: 3, px: 3 }}>
                            <ListItemIcon>
                                <LocationIcon sx={{ color: '#667eea', fontSize: '1.5rem' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" fontWeight="700" color="#1e293b">
                                        Branch Office - Mumbai
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body1" color="text.secondary">
                                        456 Commercial Complex, Mumbai - 400001, Maharashtra
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider sx={{ mx: 3 }} />
                        <ListItem sx={{ py: 3, px: 3 }}>
                            <ListItemIcon>
                                <LocationIcon sx={{ color: '#667eea', fontSize: '1.5rem' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" fontWeight="700" color="#1e293b">
                                        Branch Office - Delhi
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body1" color="text.secondary">
                                        789 Corporate Tower, New Delhi - 110001
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider sx={{ mx: 3 }} />
                        <ListItem sx={{ py: 3, px: 3 }}>
                            <ListItemIcon>
                                <LocationIcon sx={{ color: '#667eea', fontSize: '1.5rem' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" fontWeight="700" color="#1e293b">
                                        Branch Office - Bangalore
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body1" color="text.secondary">
                                        321 Tech Park, Bangalore - 560001, Karnataka
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>

                    <Alert
                        severity="info"
                        sx={{
                            mt: 3,
                            borderRadius: 2,
                            backgroundColor: '#dbeafe',
                            border: '1px solid #3b82f6',
                            '& .MuiAlert-icon': {
                                color: '#2563eb'
                            }
                        }}
                    >
                        <Typography fontWeight="600">
                            For more branch locations, call our customer service at 1800-XXX-XXXX
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 3, backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}>
                    <Button
                        onClick={() => setOpenContactDialog(false)}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
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
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {}
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

export default Support;