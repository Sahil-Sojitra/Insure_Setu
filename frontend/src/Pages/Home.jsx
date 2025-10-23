import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useTheme,
    useMediaQuery,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Avatar,
    Rating,
    Chip,
    Skeleton,
    Fade,
    Zoom,
    Tooltip,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Security as SecurityIcon,
    Speed as SpeedIcon,
    Support as SupportIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckCircleIcon,
    Star as StarIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    WhatsApp as WhatsAppIcon,
    ExpandMore as ExpandMoreIcon,
    ArrowUpward as ArrowUpwardIcon,
    Shield as ShieldIcon,
    Assignment as AssignmentIcon,
    Analytics as AnalyticsIcon,
    People as PeopleIcon,
    ArrowBackIos as ArrowBackIosIcon,
    ArrowForwardIos as ArrowForwardIosIcon
} from '@mui/icons-material';

const Home = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [heroVisible, setHeroVisible] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [elementsVisible, setElementsVisible] = useState({
        // make features visible by default to improve discoverability/UX
        features: true,
        services: false,
        testimonials: false
    });
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Memoized data arrays - prevents recreation on every render (Performance Optimization)
    const features = useMemo(() => [
        {
            icon: <SecurityIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Secure & Reliable',
            description: 'Bank-grade security with 99.9% uptime guarantee for your peace of mind'
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Lightning Fast',
            description: 'Process claims and policies in minutes, not hours with our advanced automation'
        },
        {
            icon: <SupportIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: '24/7 Support',
            description: 'Round-the-clock customer support to assist you whenever you need help'
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 48, color: '#667eea' }} />,
            title: 'Smart Analytics',
            description: 'Advanced reporting and analytics to help you make informed decisions'
        }
    ], []);

    const services = useMemo(() => [
        {
            icon: <ShieldIcon sx={{ fontSize: 40, color: '#10b981' }} />,
            title: 'Policy Management',
            description: 'Complete lifecycle management of insurance policies with automated renewals'
        },
        {
            icon: <AssignmentIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
            title: 'Claims Processing',
            description: 'Streamlined claims processing with real-time tracking and updates'
        },
        {
            icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#ef4444' }} />,
            title: 'Business Intelligence',
            description: 'Comprehensive analytics and reporting for better business insights'
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />,
            title: 'Customer Portal',
            description: 'Self-service portal for customers to manage their policies and claims'
        }
    ], []);

    const testimonials = useMemo(() => [
        {
            name: 'Sarah Johnson',
            company: 'ABC Insurance Co.',
            rating: 5,
            text: 'This CRM has transformed our operations. Policy processing time reduced by 60%!'
        },
        {
            name: 'Michael Chen',
            company: 'SecureLife Insurance',
            rating: 5,
            text: 'Outstanding customer support and intuitive interface. Highly recommended!'
        },
        {
            name: 'Emily Rodriguez',
            company: 'Guardian Insurance',
            rating: 5,
            text: 'The analytics features provide invaluable insights into our business performance.'
        },
        {
            name: 'David Thompson',
            company: 'Prime Coverage Ltd.',
            rating: 5,
            text: 'Seamless integration with our existing systems. The team was incredibly helpful during setup.'
        },
        {
            name: 'Lisa Wang',
            company: 'Unity Insurance Group',
            rating: 5,
            text: 'Best investment we\'ve made for our company. ROI was evident within the first quarter.'
        },
        {
            name: 'James Miller',
            company: 'Protect Plus Insurance',
            rating: 5,
            text: 'The automation features have saved us countless hours. Our efficiency has improved dramatically.'
        }
    ], []);

    const faqs = useMemo(() => [
        {
            question: 'How secure is the platform?',
            answer: 'We use bank-grade encryption and comply with all major security standards including SOC 2, ISO 27001, and GDPR.'
        },
        {
            question: 'Can I integrate with existing systems?',
            answer: 'Yes, our platform offers REST APIs and supports integration with over 100+ third-party applications.'
        },
        {
            question: 'What support options are available?',
            answer: 'We provide 24/7 phone, email, and chat support, along with comprehensive documentation and training resources.'
        },
        {
            question: 'Is there a mobile app available?',
            answer: 'Yes, we offer native mobile apps for both iOS and Android with full functionality.'
        }
    ], []);

    // Memoized calculations to prevent recalculation on every render
    const testimonialsStats = useMemo(() => {
        const count = testimonials.length;
        const averageRating = count > 0
            ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / count).toFixed(1)
            : 0;
        return {
            count,
            averageRating,
            totalReviews: `${count}+`
        };
    }, [testimonials]);

    // Carousel navigation functions
    // carousel removed in favor of responsive grid; no per-testimonial state needed

    // Enhanced scroll-based animations with Intersection Observer
    const observeElements = useCallback(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.id;
                    setElementsVisible(prev => ({
                        ...prev,
                        [sectionName]: true
                    }));
                }
            });
        }, observerOptions);

        // Observe sections
        const sections = ['features', 'services', 'testimonials'];
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    // no keyboard carousel navigation required for grid layout

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);

        // Enhanced loading sequence
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setHeroVisible(true), 200);
        }, 800);

        // Setup intersection observer
        const cleanupObserver = observeElements();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
            cleanupObserver();
        };
    }, [observeElements]);

    // Memoized event handlers to prevent child component re-renders
    const scrollToSection = useCallback((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setMobileMenuOpen(false);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Enhanced contact form submission with validation (memoized for performance)
    const handleContactSubmit = useCallback(() => {
        const { name, email, message } = contactForm;

        // Simple validation
        if (!name.trim() || !email.trim() || !message.trim()) {
            setSnackbarMessage('Please fill in all required fields');
            setSnackbarOpen(true);
            return;
        }

        if (!email.includes('@')) {
            setSnackbarMessage('Please enter a valid email address');
            setSnackbarOpen(true);
            return;
        }

        // Simulate form submission
        setContactDialogOpen(false);
        setContactForm({ name: '', email: '', phone: '', message: '' });
        setSnackbarMessage('Message sent successfully! We\'ll get back to you soon.');
        setSnackbarOpen(true);
    }, [contactForm]);

    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false);
    }, []);    // Enhanced Loading Screen with multiple elements
    if (isLoading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                maxWidth: '100vw',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Animation */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '20%',
                        left: '10%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'float-slow 8s ease-in-out infinite'
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '20%',
                        right: '10%',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'float-slow 8s ease-in-out infinite reverse'
                    },
                    '@keyframes float-slow': {
                        '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                        '50%': { transform: 'translateY(-20px) scale(1.05)' }
                    }
                }} />

                <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    {/* Enhanced spinner */}
                    <Box sx={{
                        position: 'relative',
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 4
                    }}>
                        <Box sx={{
                            width: '100%',
                            height: '100%',
                            border: '3px solid rgba(255,255,255,0.2)',
                            borderTop: '3px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1.2s linear infinite',
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                            }
                        }} />
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 40,
                            height: 40,
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            animation: 'pulse 2s ease-in-out infinite',
                            '@keyframes pulse': {
                                '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.7 },
                                '50%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.3 }
                            }
                        }} />
                    </Box>

                    <Typography variant="h4" sx={{
                        fontWeight: 700,
                        mb: 2,
                        background: 'linear-gradient(45deg, #ffffff 30%, rgba(255,255,255,0.8) 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        InsureCRM
                    </Typography>
                    <Typography variant="h6" sx={{
                        fontWeight: 400,
                        opacity: 0.9,
                        animation: 'fadeInOut 2s ease-in-out infinite',
                        '@keyframes fadeInOut': {
                            '0%, 100%': { opacity: 0.9 },
                            '50%': { opacity: 0.6 }
                        }
                    }}>
                        Loading your experience...
                    </Typography>

                    {/* Progress dots */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        mt: 3
                    }}>
                        {[0, 1, 2].map((index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255,255,255,0.5)',
                                    animation: `bounce 1.4s ease-in-out infinite ${index * 0.2}s`,
                                    '@keyframes bounce': {
                                        '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                                        '40%': { transform: 'scale(1.2)', opacity: 1 }
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{
            backgroundColor: '#ffffff'
        }}>
            {/* Enhanced Notification Banner */}
            <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                py: { xs: 0.75, sm: 1 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    animation: 'shimmer 3s ease-in-out infinite',
                    '@keyframes shimmer': {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(100%)' }
                    }
                }
            }}>
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: { xs: 1, sm: 2 }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            animation: 'bounce 2s ease-in-out infinite',
                            '@keyframes bounce': {
                                '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                                '40%': { transform: 'translateY(-3px)' },
                                '60%': { transform: 'translateY(-1px)' }
                            }
                        }}>
                            <Typography variant="body1" sx={{
                                fontWeight: 600,
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                🎉 <Box component="span" sx={{ color: '#ffd700' }}>NEW:</Box> Advanced Analytics Dashboard Now Available!
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{
                                display: { xs: 'none', sm: 'inline-flex' },
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: { xs: 2, sm: 3 },
                                py: { xs: 0.5, sm: 0.75 },
                                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                border: '2px solid rgba(255,255,255,0.3)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.3)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 25px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            Try it Free →
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Enhanced Header/Navigation */}
            <Box sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderBottom: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                position: 'relative'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: { xs: 2, sm: 3, md: 4 },
                        py: { xs: 1, sm: 1.25, md: 1.5 }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                                width: { xs: 36, sm: 40, md: 44 },
                                height: { xs: 36, sm: 40, md: 44 },
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                                    animation: 'logoShimmer 2s ease-in-out infinite',
                                    '@keyframes logoShimmer': {
                                        '0%': { transform: 'translateX(-100%)' },
                                        '100%': { transform: 'translateX(100%)' }
                                    }
                                }
                            }}>
                                <Typography sx={{
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    IC
                                </Typography>
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    letterSpacing: '-0.025em'
                                }}
                            >
                                InsureCRM
                            </Typography>
                        </Box>

                        {!isMobile ? (
                            <Box sx={{ display: 'flex', gap: { md: 1, lg: 2 }, alignItems: 'center' }}>
                                <Tooltip title="Learn about our core features" arrow>
                                    <Button
                                        onClick={() => scrollToSection('features')}
                                        sx={{
                                            color: '#64748b',
                                            fontSize: { md: '0.9rem', lg: '1rem' },
                                            fontWeight: 600,
                                            px: { md: 2, lg: 3 },
                                            py: 1,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                transform: 'scaleX(0)',
                                                transformOrigin: 'left',
                                                transition: 'transform 0.3s ease'
                                            },
                                            '&:hover': {
                                                color: '#667eea',
                                                backgroundColor: 'rgba(102, 126, 234, 0.08)',
                                                transform: 'translateY(-1px)',
                                                '&::before': {
                                                    transform: 'scaleX(1)'
                                                }
                                            }
                                        }}>
                                        Features
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Discover our services" arrow>
                                    <Button
                                        onClick={() => scrollToSection('services')}
                                        sx={{
                                            color: '#64748b',
                                            fontSize: { md: '0.9rem', lg: '1rem' },
                                            fontWeight: 600,
                                            px: { md: 2, lg: 3 },
                                            py: 1,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                transform: 'scaleX(0)',
                                                transformOrigin: 'left',
                                                transition: 'transform 0.3s ease'
                                            },
                                            '&:hover': {
                                                color: '#667eea',
                                                backgroundColor: 'rgba(102, 126, 234, 0.08)',
                                                transform: 'translateY(-1px)',
                                                '&::before': {
                                                    transform: 'scaleX(1)'
                                                }
                                            }
                                        }}>
                                        Services
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Read client testimonials" arrow>
                                    <Button
                                        onClick={() => scrollToSection('testimonials')}
                                        sx={{
                                            color: '#64748b',
                                            fontSize: { md: '0.9rem', lg: '1rem' },
                                            fontWeight: 600,
                                            px: { md: 2, lg: 3 },
                                            py: 1,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                transform: 'scaleX(0)',
                                                transformOrigin: 'left',
                                                transition: 'transform 0.3s ease'
                                            },
                                            '&:hover': {
                                                color: '#667eea',
                                                backgroundColor: 'rgba(102, 126, 234, 0.08)',
                                                transform: 'translateY(-1px)',
                                                '&::before': {
                                                    transform: 'scaleX(1)'
                                                }
                                            }
                                        }}>
                                        About
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Access your account" arrow>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/login')}
                                        size={isMobile ? 'small' : 'medium'}
                                        sx={{
                                            borderRadius: 4,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            px: { md: 4, lg: 5 },
                                            py: { md: 1.25, lg: 1.5 },
                                            fontSize: { md: '0.875rem', lg: '0.9375rem' },
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.35)',
                                            border: '2px solid transparent',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease'
                                            },
                                            '& > *': {
                                                position: 'relative',
                                                zIndex: 1
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                                                '&::before': {
                                                    opacity: 1
                                                }
                                            }
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Get in touch with us" arrow>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setContactDialogOpen(true)}
                                        size={isMobile ? 'small' : 'medium'}
                                        sx={{
                                            borderRadius: 4,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            px: { md: 3, lg: 4 },
                                            py: { md: 1.25, lg: 1.5 },
                                            fontSize: { md: '0.875rem', lg: '0.9375rem' },
                                            borderWidth: '2px',
                                            borderColor: '#667eea',
                                            color: '#667eea',
                                            background: 'rgba(102, 126, 234, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease'
                                            },
                                            '& > *': {
                                                position: 'relative',
                                                zIndex: 1
                                            },
                                            '&:hover': {
                                                borderColor: '#5a67d8',
                                                borderWidth: '2px',
                                                color: '#5a67d8',
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
                                                '&::before': {
                                                    opacity: 1
                                                }
                                            }
                                        }}
                                    >
                                        Contact Us
                                    </Button>
                                </Tooltip>
                            </Box>
                        ) : (
                            <IconButton
                                onClick={() => setMobileMenuOpen(true)}
                                sx={{
                                    color: '#64748b',
                                    '&:hover': {
                                        backgroundColor: '#f8fafc',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                                aria-label="Open navigation menu"
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Box>
                </Container>
            </Box>

            {/* Mobile Menu Drawer */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                PaperProps={{
                    sx: {
                        width: { xs: '85vw', sm: 320 },
                        maxWidth: 400,
                        backgroundColor: '#ffffff',
                        borderLeft: '1px solid #e2e8f0'
                    }
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                        pb: 2,
                        borderBottom: '1px solid #f1f5f9'
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent'
                            }}
                        >
                            Menu
                        </Typography>
                        <IconButton
                            onClick={() => setMobileMenuOpen(false)}
                            sx={{
                                color: '#64748b',
                                '&:hover': {
                                    backgroundColor: '#f1f5f9',
                                    color: '#667eea'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List sx={{ p: 0 }}>
                        {[
                            { name: 'Features', id: 'features' },
                            { name: 'Services', id: 'services' },
                            { name: 'About', id: 'testimonials' },
                            { name: 'Contact', action: 'contact' }
                        ].map((item) => (
                            <ListItem
                                key={item.name}
                                button
                                onClick={() => {
                                    if (item.action === 'contact') {
                                        setContactDialogOpen(true);
                                    } else {
                                        scrollToSection(item.id);
                                    }
                                    setMobileMenuOpen(false);
                                }}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    px: 2,
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: '#f8fafc',
                                        '& .MuiListItemText-primary': {
                                            color: '#667eea'
                                        }
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={item.name}
                                    primaryTypographyProps={{
                                        fontWeight: 500,
                                        fontSize: '1.1rem',
                                        color: '#1e293b'
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #f1f5f9' }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.5,
                                mb: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                                }
                            }}
                        >
                            Login
                        </Button>
                        {/* <Button
                            fullWidth
                            variant="outlined"
                            href="/user"
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.5,
                                mb: 2,
                                borderColor: '#667eea',
                                color: '#667eea',
                                '&:hover': {
                                    backgroundColor: '#f8fafc',
                                    borderColor: '#5a67d8'
                                }
                            }}
                        >
                            User Portal
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            href="/agent"
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.5,
                                borderColor: '#667eea',
                                color: '#667eea',
                                '&:hover': {
                                    backgroundColor: '#f8fafc',
                                    borderColor: '#5a67d8'
                                }
                            }}
                        >
                            Agent Portal
                        </Button> */}
                    </Box>
                </Box>
            </Drawer>

            {/* Hero Section */}
            <Box
                id="hero"
                sx={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    // pt: { xs: 8, sm: 10, md: 12, lg: 14 }, // Natural spacing without fixed header
                    pb: { xs: 6, sm: 8 },
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: { xs: 'auto', md: '90vh' },
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', lg: 'row' },
                        gap: { xs: 4, sm: 6, md: 8 },
                        alignItems: 'center'
                    }}>
                        <Box sx={{ flex: { lg: 1 }, width: '100%' }}>
                            <Box sx={{
                                textAlign: { xs: 'center', lg: 'left' },
                                opacity: heroVisible ? 1 : 0,
                                transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                                transition: 'all 0.8s ease-out'
                            }}>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#1e293b',
                                        mb: { xs: 2, sm: 3, md: 4 },
                                        fontSize: {
                                            xs: '2rem',
                                            sm: '2.5rem',
                                            md: '3.25rem',
                                            lg: '3.75rem',
                                            xl: '4rem'
                                        },
                                        lineHeight: { xs: 1.2, md: 1.1 },
                                        letterSpacing: '-0.02em',
                                        opacity: heroVisible ? 1 : 0,
                                        transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                                        transition: 'all 0.8s ease-out 0.2s'
                                    }}
                                >
                                    Modern Insurance
                                    <Box
                                        component="span"
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent',
                                            display: 'block'
                                        }}
                                    >
                                        CRM Solution
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: '#64748b',
                                        mb: { xs: 3, sm: 4, md: 5 },
                                        lineHeight: { xs: 1.5, md: 1.6 },
                                        fontSize: {
                                            xs: '1rem',
                                            sm: '1.125rem',
                                            md: '1.25rem',
                                            lg: '1.375rem'
                                        },
                                        maxWidth: { xs: '100%', lg: '90%' },
                                        fontWeight: 400
                                    }}
                                >
                                    Streamline your insurance operations with our comprehensive CRM platform.
                                    Manage policies, process claims, and delight customers with ease.
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    gap: { xs: 2, sm: 3 },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: { xs: 'center', lg: 'flex-start' },
                                    alignItems: { xs: 'stretch', sm: 'center' },
                                    mt: { xs: 1, sm: 2 }
                                }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            borderRadius: 4,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            py: { xs: 1.5, sm: 2, md: 2.5 },
                                            px: { xs: 3, sm: 4, md: 6 },
                                            fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.125rem' },
                                            minWidth: { xs: '100%', sm: 'auto' },
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
                                            }
                                        }}
                                        onClick={() => navigate('/login')}
                                    >
                                        Get Started - Login
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        href="/user"
                                        sx={{
                                            borderRadius: 4,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            py: { xs: 1.5, sm: 2, md: 2.5 },
                                            px: { xs: 3, sm: 4, md: 6 },
                                            fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.125rem' },
                                            minWidth: { xs: '100%', sm: 'auto' },
                                            borderColor: '#667eea',
                                            borderWidth: 2,
                                            color: '#667eea',
                                            '&:hover': {
                                                borderColor: '#5a67d8',
                                                backgroundColor: '#f8fafc',
                                                borderWidth: 2,
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        User Dashboard
                                    </Button>
                                </Box>

                                {/* Scroll Indicator */}
                                <Fade in={heroVisible} timeout={2000}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: { xs: 'center', lg: 'flex-start' },
                                        alignItems: 'center',
                                        gap: 2,
                                        mt: { xs: 4, sm: 5, md: 6 },
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: '#667eea',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                        onClick={() => scrollToSection('features')}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                            Discover our features
                                        </Typography>
                                        <Box sx={{
                                            animation: 'bounce 2s infinite',
                                            '@keyframes bounce': {
                                                '0%, 20%, 50%, 80%, 100%': {
                                                    transform: 'translateY(0)'
                                                },
                                                '40%': {
                                                    transform: 'translateY(-10px)'
                                                },
                                                '60%': {
                                                    transform: 'translateY(-5px)'
                                                }
                                            }
                                        }}>
                                            <ArrowUpwardIcon sx={{
                                                transform: 'rotate(180deg)',
                                                fontSize: '1.25rem'
                                            }} />
                                        </Box>
                                    </Box>
                                </Fade>
                            </Box>
                        </Box>
                        <Box sx={{ flex: { lg: 1 }, width: '100%' }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mt: { xs: 4, lg: 0 },
                                    px: { xs: 2, sm: 0 }
                                }}
                            >
                                <Card
                                    sx={{
                                        p: { xs: 3, sm: 4, md: 5 },
                                        backgroundColor: '#ffffff',
                                        borderRadius: { xs: 3, md: 4 },
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                        border: '1px solid #e2e8f0',
                                        transform: { lg: 'rotate(5deg)' },
                                        // width: '100%',
                                        maxWidth: { xs: '100%', sm: 400, lg: '100%' },
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: { lg: 'rotate(0deg) scale(1.02)' },
                                            boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.3)'
                                        }
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 600 }}>
                                        Dashboard Overview
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ color: '#0ea5e9', fontWeight: 700 }}>
                                                    1,234
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                    Active Policies
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ color: '#22c55e', fontWeight: 700 }}>
                                                    98%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                    Satisfaction
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Fade in={elementsVisible.features} timeout={800}>
                <Box
                    id="features"
                    sx={{
                        py: { xs: 6, sm: 8, md: 12, lg: 10 },
                        backgroundColor: '#ffffff',
                        position: 'relative',
                        overflow: 'hidden',
                        scrollMarginTop: '80px',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '10%',
                            right: '-5%',
                            width: '30%',
                            height: '80%',
                            background: 'radial-gradient(ellipse at center, rgba(118, 75, 162, 0.08) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '10%',
                            left: '-5%',
                            width: '30%',
                            height: '80%',
                            background: 'radial-gradient(ellipse at center, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }
                    }}>
                    <Container maxWidth="xl">
                        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
                            <Fade in={elementsVisible.features} timeout={1000}>
                                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            color: '#667eea',
                                            fontWeight: 700,
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Why Choose Us
                                    </Typography>
                                </Box>
                            </Fade>
                            <Fade in={elementsVisible.features} timeout={1200}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#1e293b',
                                        mb: { xs: 2, sm: 3, md: 4 },
                                        fontSize: {
                                            xs: '1.875rem',
                                            sm: '2.25rem',
                                            md: '2.75rem',
                                            lg: '3rem'
                                        },
                                        letterSpacing: '-0.025em',
                                        lineHeight: 1.2
                                    }}
                                >
                                    Why Choose
                                    <Box
                                        component="span"
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent'
                                        }}
                                    >
                                        InsureCRM
                                    </Box>
                                    ?
                                </Typography>
                            </Fade>
                            <Fade in={elementsVisible.features} timeout={1400}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: '#64748b',
                                        maxWidth: { xs: '100%', sm: 600, md: 800 },
                                        mx: 'auto',
                                        lineHeight: { xs: 1.5, md: 1.6 },
                                        fontSize: {
                                            xs: '1rem',
                                            sm: '1.125rem',
                                            md: '1.25rem',
                                            lg: '1.375rem'
                                        },
                                        px: { xs: 2, sm: 0 },
                                        fontWeight: 400
                                    }}
                                >
                                    Built specifically for insurance companies, our platform delivers
                                    the tools you need to succeed in today's competitive market.
                                </Typography>
                            </Fade>
                        </Box>

                        {/* Features Grid Container with Visual Enhancement */}
                        <Fade in={elementsVisible.features} timeout={1600}>
                            <Box sx={{
                                mb: 2,
                                textAlign: 'center',
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    width: { xs: 60, sm: 80 },
                                    height: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    mx: 'auto',
                                    mb: 2,
                                    borderRadius: 1
                                }
                            }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#64748b',
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    Core Features
                                </Typography>
                            </Box>
                        </Fade>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(4, 1fr)'
                            },
                            gap: { xs: 3, sm: 4, md: 5 },
                            position: 'relative',
                            zIndex: 1,
                            alignItems: 'stretch',
                            justifyContent: 'center',
                            gridAutoRows: 'minmax(280px, auto)',
                            '@media (max-width: 599px)': {
                                gridAutoRows: 'auto'
                            }
                        }}>
                            {features.map((feature, index) => (
                                <Zoom in={elementsVisible.features} timeout={800 + index * 200} key={index}>
                                    <Box sx={{ display: 'flex' }}>
                                        <Card
                                            sx={{
                                                p: { xs: 3, sm: 4, md: 5 },
                                                textAlign: 'center',
                                                width: '100%',
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: { xs: 2, md: 3 },
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                minHeight: { xs: 'auto', sm: 280, lg: 320 },
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: 4,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    transform: 'scaleX(0)',
                                                    transformOrigin: 'left',
                                                    transition: 'transform 0.3s ease-in-out'
                                                },
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                },
                                                '&:hover': {
                                                    transform: 'translateY(-12px) scale(1.02)',
                                                    boxShadow: '0 25px 50px -12px rgba(102, 126, 234, 0.25)',
                                                    borderColor: '#667eea',
                                                    '&::before': {
                                                        transform: 'scaleX(1)'
                                                    },
                                                    '&::after': {
                                                        opacity: 1
                                                    },
                                                    '& .feature-icon': {
                                                        transform: 'scale(1.15) rotate(5deg)'
                                                    }
                                                }
                                            }}
                                        >
                                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                                <Box
                                                    className="feature-icon"
                                                    sx={{
                                                        mb: { xs: 3, md: 4 },
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        width: { xs: 80, sm: 88, md: 96 },
                                                        height: { xs: 80, sm: 88, md: 96 },
                                                        mx: 'auto',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                                        border: '2px solid #e2e8f0',
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        position: 'relative',
                                                        '&::before': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            inset: -2,
                                                            borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            opacity: 0,
                                                            transition: 'opacity 0.3s ease'
                                                        },
                                                        '& svg': {
                                                            fontSize: { xs: 40, sm: 48, md: 56 },
                                                            color: '#667eea',
                                                            transition: 'all 0.3s ease-in-out',
                                                            position: 'relative',
                                                            zIndex: 1
                                                        }
                                                    }}
                                                >
                                                    {feature.icon}
                                                </Box>
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#1e293b',
                                                        mb: { xs: 2, md: 3 },
                                                        fontSize: {
                                                            xs: '1.125rem',
                                                            sm: '1.25rem',
                                                            md: '1.375rem',
                                                            lg: '1.5rem'
                                                        },
                                                        lineHeight: 1.3
                                                    }}
                                                >
                                                    {feature.title}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: '#64748b',
                                                        lineHeight: { xs: 1.5, md: 1.7 },
                                                        fontSize: {
                                                            xs: '0.9375rem',
                                                            sm: '1rem',
                                                            md: '1.0625rem'
                                                        },
                                                        fontWeight: 400
                                                    }}
                                                >
                                                    {feature.description}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Box>
                                </Zoom>
                            ))}
                        </Box>
                    </Container>
                </Box>
            </Fade>

            {/* Services Section */}
            <Box
                id="services"
                sx={{
                    py: { xs: 6, sm: 8, md: 12, lg: 16 },
                    backgroundColor: '#f8fafc',
                    position: 'relative',
                    overflow: 'hidden',
                    scrollMarginTop: '80px',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                            radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.08) 0%, transparent 50%),
                            linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)
                        `,
                        pointerEvents: 'none'
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        animation: 'float 6s ease-in-out infinite'
                    },
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
                        '50%': { transform: 'translate(-50%, -50%) scale(1.1)' }
                    }
                }}>
                <Container maxWidth="xl">
                    <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: '#667eea',
                                    fontWeight: 700,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'
                                }}
                            >
                                What We Offer
                            </Typography>
                        </Box>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                color: '#1e293b',
                                mb: { xs: 2, sm: 3, md: 4 },
                                fontSize: {
                                    xs: '1.875rem',
                                    sm: '2.25rem',
                                    md: '2.75rem',
                                    lg: '3rem'
                                },
                                letterSpacing: '-0.025em',
                                lineHeight: 1.2
                            }}
                        >
                            Our
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent'
                                }}
                            >
                                Services
                            </Box>
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#64748b',
                                maxWidth: { xs: '100%', sm: 600, md: 800 },
                                mx: 'auto',
                                lineHeight: { xs: 1.5, md: 1.6 },
                                fontSize: {
                                    xs: '1rem',
                                    sm: '1.125rem',
                                    md: '1.25rem',
                                    lg: '1.375rem'
                                },
                                px: { xs: 2, sm: 0 },
                                fontWeight: 400
                            }}
                        >
                            Comprehensive solutions designed to transform your insurance operations
                        </Typography>
                    </Box>

                    {/* Services Grid Container with Visual Enhancement */}
                    <Box sx={{
                        mb: 2,
                        textAlign: 'center',
                        '&::before': {
                            content: '""',
                            display: 'block',
                            width: { xs: 60, sm: 80 },
                            height: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            mx: 'auto',
                            mb: 2,
                            borderRadius: 1
                        }
                    }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#64748b',
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        >
                            Service Categories
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(2, 1fr)'
                        },
                        gap: { xs: 3, sm: 4, md: 5 },
                        position: 'relative',
                        zIndex: 1,
                        alignItems: 'stretch',
                        justifyContent: 'center',
                        gridAutoRows: 'minmax(240px, auto)',
                        '@media (max-width: 899px)': {
                            gridAutoRows: 'auto'
                        }
                    }}>
                        {services.map((service, index) => (
                            <Box key={index} sx={{ display: 'flex' }}>
                                <Card
                                    sx={{
                                        p: { xs: 3, sm: 4, md: 5, lg: 6 },
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: { xs: 2, md: 3, lg: 4 },
                                        width: '100%',
                                        minHeight: { xs: 'auto', sm: 200, md: 240 },
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: 4,
                                            height: '100%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            transform: 'scaleY(0)',
                                            transformOrigin: 'top',
                                            transition: 'transform 0.3s ease-in-out'
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '-50%',
                                            right: '-50%',
                                            width: '100%',
                                            height: '100%',
                                            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                            pointerEvents: 'none'
                                        },
                                        '&:hover': {
                                            boxShadow: '0 25px 50px -12px rgba(102, 126, 234, 0.25)',
                                            transform: 'translateY(-12px) scale(1.02)',
                                            borderColor: '#667eea',
                                            '&::before': {
                                                transform: 'scaleY(1)'
                                            },
                                            '&::after': {
                                                opacity: 1
                                            },
                                            '& .service-icon-box': {
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                transform: 'scale(1.1) rotate(5deg)',
                                                '& svg': {
                                                    color: '#ffffff'
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: { xs: 3, sm: 4, md: 5 },
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            textAlign: { xs: 'center', sm: 'left' }
                                        }}>
                                            <Box
                                                className="service-icon-box"
                                                sx={{
                                                    p: { xs: 3, sm: 3.5, md: 4 },
                                                    borderRadius: { xs: 2, md: 3 },
                                                    backgroundColor: '#f8fafc',
                                                    border: '2px solid #e2e8f0',
                                                    alignSelf: { xs: 'center', sm: 'flex-start' },
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minWidth: { xs: 72, sm: 80, md: 88 },
                                                    height: { xs: 72, sm: 80, md: 88 },
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        inset: -2,
                                                        borderRadius: { xs: 2, md: 3 },
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s ease'
                                                    },
                                                    '& svg': {
                                                        fontSize: { xs: 36, sm: 44, md: 48 },
                                                        color: '#667eea',
                                                        transition: 'all 0.3s ease-in-out',
                                                        position: 'relative',
                                                        zIndex: 1
                                                    }
                                                }}
                                            >
                                                {service.icon}
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#1e293b',
                                                        mb: { xs: 2, sm: 3, md: 4 },
                                                        fontSize: {
                                                            xs: '1.25rem',
                                                            sm: '1.375rem',
                                                            md: '1.5rem',
                                                            lg: '1.625rem'
                                                        },
                                                        lineHeight: 1.3
                                                    }}
                                                >
                                                    {service.title}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: '#64748b',
                                                        lineHeight: { xs: 1.6, md: 1.7 },
                                                        fontSize: {
                                                            xs: '1rem',
                                                            sm: '1.0625rem',
                                                            md: '1.125rem'
                                                        },
                                                        fontWeight: 400,
                                                        maxWidth: { sm: '100%', md: '90%' }
                                                    }}
                                                >
                                                    {service.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box
                id="testimonials"
                sx={{
                    py: { xs: 6, sm: 8, md: 12, lg: 16 },
                    backgroundColor: 'linear-gradient(135deg, #fafbff 0%, #ffffff 50%, #f8fafc 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    scrollMarginTop: '80px',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: 'linear-gradient(90deg, transparent 0%, #e2e8f0 10%, #667eea 30%, #764ba2 70%, #e2e8f0 90%, transparent 100%)',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: 'linear-gradient(90deg, transparent 0%, #e2e8f0 10%, #764ba2 30%, #667eea 70%, #e2e8f0 90%, transparent 100%)',
                    },
                    '& .testimonial-bg-shapes': {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '10%',
                            right: '3%',
                            width: { xs: '100px', md: '180px' },
                            height: { xs: '100px', md: '180px' },
                            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, rgba(102, 126, 234, 0.03) 40%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(1px)',
                            animation: 'float-enhanced 12s ease-in-out infinite'
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '15%',
                            left: '5%',
                            width: { xs: '80px', md: '140px' },
                            height: { xs: '80px', md: '140px' },
                            background: 'radial-gradient(circle, rgba(118, 75, 162, 0.12) 0%, rgba(118, 75, 162, 0.03) 40%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(1px)',
                            animation: 'float-enhanced 12s ease-in-out infinite reverse'
                        }
                    },
                    '@keyframes float-enhanced': {
                        '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 0.6 },
                        '25%': { transform: 'translate(15px, -20px) scale(1.1) rotate(2deg)', opacity: 0.8 },
                        '50%': { transform: 'translate(-5px, -10px) scale(0.9) rotate(-1deg)', opacity: 1 },
                        '75%': { transform: 'translate(-12px, 15px) scale(1.05) rotate(1deg)', opacity: 0.7 }
                    },
                    '@keyframes pulse-ring': {
                        '0%': { transform: 'scale(1)', opacity: 0.3 },
                        '50%': { transform: 'scale(1.2)', opacity: 0.1 },
                        '100%': { transform: 'scale(1)', opacity: 0.3 }
                    },
                    '@keyframes star-glow': {
                        '0%': { boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)', transform: 'scale(1)' },
                        '100%': { boxShadow: '0 4px 15px rgba(251, 191, 36, 0.6)', transform: 'scale(1.05)' }
                    },
                    '@keyframes shimmer': {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(100%)' }
                    }
                }}>
                <Box className="testimonial-bg-shapes" />
                <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                        <Box sx={{
                            width: '100%',
                            maxWidth: { lg: '83.33%', xl: '66.67%' }
                        }}>
                            <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
                                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            color: '#667eea',
                                            fontWeight: 700,
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Testimonials
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#1e293b',
                                        mb: { xs: 2, sm: 3, md: 4 },
                                        fontSize: {
                                            xs: '1.875rem',
                                            sm: '2.25rem',
                                            md: '2.75rem',
                                            lg: '3rem'
                                        },
                                        letterSpacing: '-0.025em',
                                        lineHeight: 1.2
                                    }}
                                >
                                    What Our
                                    <Box
                                        component="span"
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent'
                                        }}
                                    >
                                        Clients Say
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: '#64748b',
                                        maxWidth: { xs: '100%', sm: 600, md: 700 },
                                        mx: 'auto',
                                        lineHeight: { xs: 1.5, md: 1.6 },
                                        fontSize: {
                                            xs: '1rem',
                                            sm: '1.125rem',
                                            md: '1.25rem',
                                            lg: '1.375rem'
                                        },
                                        px: { xs: 2, sm: 0 }
                                    }}
                                >
                                    Join thousands of satisfied customers who trust our platform
                                </Typography>
                            </Box>

                            {/* Modern Grid Layout Header */}
                            <Box sx={{
                                mb: { xs: 4, md: 6 },
                                textAlign: 'center',
                                position: 'relative'
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        fontSize: { xs: '1rem', sm: '1.125rem' },
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        position: 'relative',
                                        zIndex: 2
                                    }}
                                >
                                    ✨ Client Testimonials ✨
                                </Typography>
                            </Box>
                            {/* Modern Grid Format */}
                            <Box sx={{ mb: 4 }}>
                                {/* Grid Stats Header */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2,
                                    justifyContent: 'center',
                                    mb: { xs: 4, md: 6 }
                                }}>
                                    <Box sx={{ flex: { sm: 1 }, maxWidth: { sm: '33.33%' } }}>
                                        <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)' }}>
                                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#667eea', mb: 1 }}>{testimonialsStats.count}+</Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Happy Clients</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ flex: { sm: 1 }, maxWidth: { sm: '33.33%' } }}>
                                        <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)' }}>
                                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#f59e0b', mb: 1 }}>{testimonialsStats.averageRating}★</Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Average Rating</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ flex: { sm: 1 }, maxWidth: { sm: '33.33%' } }}>
                                        <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)' }}>
                                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#764ba2', mb: 1 }}>24/7</Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Support</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Testimonials Grid (responsive) */}
                            <Box sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                                    gap: { xs: 3, sm: 4, md: 5 }
                                }} role="list" aria-label="Client testimonials">
                                    {testimonials.map((t, i) => (
                                        <Card
                                            key={i}
                                            role="listitem"
                                            tabIndex={0}
                                            aria-label={`Testimonial by ${t.name} from ${t.company}`}
                                            sx={{
                                                p: { xs: 3, sm: 4 },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                minHeight: 260,
                                                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: 3,
                                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.06)',
                                                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                                                '&:hover, &:focus': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 18px 40px rgba(102, 126, 234, 0.12)',
                                                    borderColor: '#667eea'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Avatar sx={{ bgcolor: '#667eea', width: 48, height: 48, fontWeight: 700 }}>{t.name.charAt(0)}</Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{t.name}</Typography>
                                                        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 600 }}>{t.company}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 0.3 }} aria-hidden>
                                                    {[...Array(5)].map((_, starIdx) => (
                                                        <Box key={starIdx} sx={{ color: starIdx < t.rating ? '#fbbf24' : '#e6eaf0' }}>★</Box>
                                                    ))}
                                                </Box>
                                            </Box>

                                            <Typography sx={{ color: '#475569', flex: 1, fontSize: '0.98rem', lineHeight: 1.6 }}>
                                                {t.text}
                                            </Typography>

                                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                                <Chip label="Verified" color="primary" size="small" sx={{ fontWeight: 700 }} />
                                            </Box>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* FAQ Section */}
            <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#f8fafc' }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: '#1e293b',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.75rem' }
                            }}
                        >
                            Frequently Asked Questions
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#64748b',
                                lineHeight: 1.6
                            }}
                        >
                            Find answers to common questions about our platform
                        </Typography>
                    </Box>

                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            sx={{
                                mb: 2,
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px !important',
                                '&:before': {
                                    display: 'none'
                                },
                                '&.Mui-expanded': {
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    '& .MuiAccordionSummary-content': {
                                        my: 2
                                    }
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#1e293b'
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography
                                    sx={{
                                        color: '#64748b',
                                        lineHeight: 1.6
                                    }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '2rem', md: '2.75rem' }
                        }}
                    >
                        Ready to Transform Your Insurance Business?
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 4,
                            opacity: 0.9,
                            lineHeight: 1.6
                        }}
                    >
                        Join thousands of insurance companies who have already modernized
                        their operations with InsureCRM. Start your free trial today.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button
                            variant="contained"
                            size="large"
                            href="/user"
                            sx={{
                                backgroundColor: 'white',
                                color: '#667eea',
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 2,
                                px: 4,
                                '&:hover': {
                                    backgroundColor: '#f8fafc'
                                }
                            }}
                        >
                            Get Started Now
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => setContactDialogOpen(true)}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 2,
                                px: 4,
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Contact Sales
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 6, backgroundColor: '#1e293b', color: 'white' }}>
                <Container maxWidth="lg">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 3, sm: 4, md: 5 },
                        mt: 2,
                        flexWrap: 'wrap'
                    }}>
                        <Box sx={{ flex: { md: '1 1 33.33%' }, minWidth: { xs: '100%', md: '200px' } }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent'
                                }}
                            >
                                InsureCRM
                            </Typography>
                            <Typography sx={{ color: '#94a3b8', mb: 3, lineHeight: 1.6 }}>
                                The most comprehensive insurance CRM platform designed to
                                streamline operations and enhance customer experience.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton sx={{ color: '#94a3b8' }}>
                                    <PhoneIcon />
                                </IconButton>
                                <IconButton sx={{ color: '#94a3b8' }}>
                                    <EmailIcon />
                                </IconButton>
                                <IconButton sx={{ color: '#94a3b8' }}>
                                    <WhatsAppIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box sx={{ flex: { md: '1 1 16.67%' }, minWidth: { xs: '50%', sm: '50%', md: '120px' } }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Product
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                    Features
                                </Typography>
                                <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                    Integrations
                                </Typography>
                                <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                    Pricing
                                </Typography>
                                <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                    API
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ flex: { md: '1 1 16.67%' }, minWidth: { xs: '50%', sm: '50%', md: '120px' } }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Company
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                    About
                                </Typography>
                                <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                    Careers
                                </Typography>
                                <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                    Blog
                                </Typography>
                                <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                    Press
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ flex: { md: '1 1 33.33%' }, minWidth: { xs: '100%', md: '200px' } }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Contact Info
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PhoneIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    <Typography sx={{ color: '#94a3b8' }}>
                                        +1 (555) 123-4567
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EmailIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    <Typography sx={{ color: '#94a3b8' }}>
                                        hello@insurecrm.com
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    <Typography sx={{ color: '#94a3b8' }}>
                                        123 Business Ave, Suite 100<br />
                                        New York, NY 10001
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: 6,
                            pt: 4,
                            borderTop: '1px solid #374151',
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Typography sx={{ color: '#94a3b8' }}>
                            © 2025 InsureCRM. All rights reserved.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                Privacy Policy
                            </Typography>
                            <Typography sx={{ color: '#94a3b8', cursor: 'pointer', '&:hover': { color: 'white' } }}>
                                Terms of Service
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Enhanced Contact Dialog */}
            <Dialog
                open={contactDialogOpen}
                onClose={() => setContactDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        py: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 1,
                            background: 'rgba(255, 255, 255, 0.2)'
                        }
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        💬 Let's Start a Conversation
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                        We'd love to hear from you and help with your needs
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#667eea'
                                    }
                                }
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                placeholder="your@email.com"
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#667eea'
                                        }
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                placeholder="+1 (555) 123-4567"
                                value={contactForm.phone}
                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#667eea'
                                        }
                                    }
                                }}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="Message"
                            placeholder="Tell us about your project or how we can help..."
                            multiline
                            rows={4}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#667eea'
                                    }
                                }
                            }}
                        />
                        <Box sx={{
                            p: 2,
                            backgroundColor: '#f8fafc',
                            borderRadius: 2,
                            border: '1px solid #e2e8f0'
                        }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                                📧 We typically respond within 24 hours<br />
                                🔒 Your information is secure and will never be shared
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    p: 4,
                    pt: 2,
                    backgroundColor: '#f8fafc',
                    gap: 2
                }}>
                    <Button
                        onClick={() => setContactDialogOpen(false)}
                        sx={{
                            color: '#64748b',
                            fontWeight: 500,
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: '#e2e8f0'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleContactSubmit}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 2,
                            fontWeight: 600,
                            px: 4,
                            py: 1,
                            boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.45)'
                            }
                        }}
                    >
                        Send Message 📤
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Buttons */}
            <Box sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                zIndex: 1300
            }}>
                {/* Scroll to Top FAB */}
                <Zoom in={showScrollTop}>
                    <Tooltip title="Back to top" arrow placement="left">
                        <Fab
                            color="primary"
                            size="medium"
                            onClick={scrollToTop}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                    transform: 'translateY(-2px) scale(1.05)',
                                    boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)'
                                }
                            }}
                        >
                            <ArrowUpwardIcon />
                        </Fab>
                    </Tooltip>
                </Zoom>
            </Box>

            {/* Enhanced Snackbar for User Feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ zIndex: 1400 }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarMessage.includes('success') ? 'success' : 'error'}
                    variant="filled"
                    sx={{
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        '& .MuiAlert-message': {
                            fontSize: '0.9375rem',
                            fontWeight: 500
                        }
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Wrap with React.memo to prevent unnecessary re-renders when props don't change
export default React.memo(Home);