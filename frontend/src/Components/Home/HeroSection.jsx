import React, { memo } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    Grid,
    Fade
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const HeroSection = memo(({ heroVisible, scrollToSection }) => {
    return (
        <Box
            id="hero"
            sx={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                pt: { xs: 14, sm: 16, md: 18, lg: 22 }, // Increased to account for notification banner
                pb: { xs: 6, sm: 8, md: 12, lg: 16 },
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
                                    href="/login"
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
                                    width: '100%',
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
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;