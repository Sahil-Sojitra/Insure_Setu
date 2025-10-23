

import React, { useState, useEffect } from 'react';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { useAuth } from '../../Hooks/useAuth';


import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';


import DashboardPage from './DashboardPage';
import UsersPage from './UsersPage';
import NotificationsPage from './NotificationsPage';
import SettingsPage from './SettingsPage';


const AgentLayout = () => {
    const { userData, logout } = useAuth();
    const [activeView, setActiveView] = React.useState('Dashboard');
    const [agentInfo, setAgentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    // Fetch agent data on component mount
    useEffect(() => {
        const initializeAgentData = () => {
            try {
                // Use userData from auth context
                if (!userData || !userData.email) {
                    console.log('No valid agent session found.');
                    return;
                }

                // Set agent info from auth context
                setAgentInfo({
                    customer_name: userData.customer_name || 'Agent',
                    email: userData.email,
                    mobile: userData.mobile,
                    role: userData.role || 'Insurance Agent',
                    id: userData.id || 'AGT001',
                    agent_code: userData.agent_code || 'CRM-AGT-001',
                    department: userData.department || 'Customer Relations',
                    joining_date: userData.joining_date
                });

                // Generate dynamic notifications for agent
                const agentNotifications = [
                    { id: 1, message: 'New customer registration pending approval', type: 'info', date: new Date().toISOString().split('T')[0] },
                    { id: 2, message: 'Monthly report is ready for review', type: 'success', date: new Date().toISOString().split('T')[0] },
                    { id: 3, message: '5 policies expiring this month', type: 'warning', date: new Date().toISOString().split('T')[0] },
                    { id: 4, message: `Welcome back, ${userData.customer_name}!`, type: 'info', date: new Date().toISOString().split('T')[0] }
                ];

                setNotifications(agentNotifications);

            } catch (error) {
                console.error('Error initializing agent data:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAgentData();
    }, [userData]);




    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />
        },
        {
            text: 'Customers',
            icon: <PeopleIcon />
        },
        {
            text: 'Notifications',
            icon: <NotificationsIcon />
        },
        {
            text: 'Settings',
            icon: <SettingsIcon />
        }
    ];


    const bottomMenuItems = [
        {
            text: 'Logout',
            icon: <LogoutIcon />
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
                return <DashboardPage />;
            case 'Customers':
            case 'Users':
                return <UsersPage />;
            case 'Notifications':
                return <NotificationsPage />;
            case 'Settings':
                return <SettingsPage />;
            default:
                return <DashboardPage />;
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
                Loading agent dashboard...
            </div>
        );
    }

    // Don't render if no agent info (will redirect to login)
    if (!agentInfo) {
        return null;
    }

    return (
        <BaseLayout
            title="Agent CRM Dashboard"
            menuItems={menuItems}
            bottomMenuItems={bottomMenuItems}
            activeView={activeView}
            onViewChange={handleViewChange}
            userInfo={agentInfo}
            notifications={notifications}
            showNotifications={true}
            showUserMenu={true}
            // disableContentPadding={false}
        >
            {renderContent()}
        </BaseLayout>
    );
};

export default AgentLayout;