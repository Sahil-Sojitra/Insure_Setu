import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredType }) => {
    const { isAuthenticated, userType, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="text.secondary">
                    Loading...
                </Typography>
            </Box>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated but wrong user type, redirect to appropriate dashboard or login
    if (requiredType && userType !== requiredType) {
        if (userType === 'user') {
            return <Navigate to="/user" replace />;
        } else if (userType === 'agent') {
            return <Navigate to="/agent" replace />;
        } else if (userType === 'admin') {
            return <Navigate to="/admin" replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    }

    // User is authenticated and has correct permissions
    return children;
};

export default ProtectedRoute;