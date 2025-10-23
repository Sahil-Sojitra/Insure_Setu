import React, { memo } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    Fade,
    Zoom
} from '@mui/material';

const FeaturesSection = memo(({ elementsVisible, features }) => {
    return (
        <Fade in={elementsVisible.features} timeout={800}>
            <Box
                id="features"
                sx={{
                    py: { xs: 6, sm: 8, md: 12, lg: 16 },
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
    );
});

FeaturesSection.displayName = 'FeaturesSection';

export default FeaturesSection;