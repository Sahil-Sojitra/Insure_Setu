import React, { useState, useEffect } from 'react';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { useAuth } from '../../Hooks/useAuth';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Logout as LogoutIcon,
    Analytics as AnalyticsIcon,
    SupervisorAccount as SupervisorAccountIcon,
    Security as SecurityIcon,
    NotificationsActive as NotificationsActiveIcon,
    AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';
import AdminDashboard from './AdminDashboard';
import AgentManagement from './AgentManagement';
import AdminSettings from './AdminSettings';
import AdminNotifications from './AdminNotifications';

const AdminLayout = () => {
    const { userData, logout } = useAuth();
    const [activeView, setActiveView] = useState('Dashboard');
    const [adminInfo, setAdminInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    // Fetch admin data on component mount
    useEffect(() => {
        const initializeAdminData = () => {
            try {
                // For admin, we can use a default admin profile or check if user is admin
                const adminProfile = {
                    customer_name: 'System Administrator',
                    email: 'admin@crm.com',
                    mobile: '+1-800-ADMIN',
                    role: 'System Administrator',
                    id: 'ADMIN001',
                    agent_code: 'CRM-ADM-001',
                    department: 'System Management',
                    joining_date: '2024-01-01'
                };

                setAdminInfo(adminProfile);

                // Generate dynamic notifications for admin
                const adminNotifications = [
                    { id: 1, message: '5 new agent registrations pending approval', type: 'warning', date: new Date().toISOString().split('T')[0] },
                    { id: 2, message: '15 policies expiring this month - review required', type: 'info', date: new Date().toISOString().split('T')[0] },
                    { id: 3, message: 'System backup completed successfully', type: 'success', date: new Date().toISOString().split('T')[0] },
                    { id: 4, message: 'Monthly performance report is ready', type: 'info', date: new Date().toISOString().split('T')[0] },
                    { id: 5, message: 'Security alert: Multiple failed login attempts detected', type: 'warning', date: new Date().toISOString().split('T')[0] }
                ];

                setNotifications(adminNotifications);

            } catch (error) {
                console.error('Error initializing admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAdminData();
    }, [userData]);

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <AnalyticsIcon />,
            description: 'System overview and analytics',
            badge: null
        },
        {
            text: 'Agent Management',
            icon: <SupervisorAccountIcon />,
            description: 'Manage agents and permissions',
            badge: notifications?.filter(n => n.type === 'warning').length || null
        },
        {
            text: 'Notifications',
            icon: <NotificationsActiveIcon />,
            description: 'System alerts and updates',
            badge: notifications?.length || null
        },
        {
            text: 'Settings',
            icon: <AdminPanelSettingsIcon />,
            description: 'System configuration',
            badge: null
        }
    ];

    const bottomMenuItems = [
        {
            text: 'Logout',
            icon: <LogoutIcon />,
            description: 'Sign out from admin panel',
            badge: null
        }
    ];

    const handleViewChange = (view) => {
        setActiveView(view);

        // Handle logout using auth context
        if (view === 'Logout') {
            logout();
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard':
                return <AdminDashboard />;
            case 'Agent Management':
                return <AgentManagement />;
            case 'Notifications':
                return <AdminNotifications />;
            case 'Settings':
                return <AdminSettings />;
            default:
                return <AdminDashboard />;
        }
    };

    // Show loading state while initializing
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading admin dashboard...
            </div>
        );
    }

    // Don't render if no admin info (will redirect to login)
    if (!adminInfo) {
        return null;
    }

    return (
        <BaseLayout
            title="Admin CRM Dashboard"
            menuItems={menuItems}
            bottomMenuItems={bottomMenuItems}
            activeView={activeView}
            onViewChange={handleViewChange}
            userInfo={adminInfo}
            notifications={notifications}
            showNotifications={true}
            showUserMenu={true}
        >
            {renderContent()}
        </BaseLayout>
    );
};

export default AdminLayout;