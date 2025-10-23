

import React, { useState, useEffect } from 'react';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { useAuth } from '../../Hooks/useAuth';


import DashboardIcon from '@mui/icons-material/Dashboard';
import CommuteIcon from '@mui/icons-material/Commute';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LogoutIcon from '@mui/icons-material/Logout';


import UserDashboard from './UserDashboard';
import MyPolicy from './MyPolicy';
import Documents from './Documents';
import Payments from './Payments';
import Support from './Support';


const UserLayout = () => {
    const { userData, logout } = useAuth();
    const [activeView, setActiveView] = React.useState('Dashboard');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Use userData from auth context
                if (!userData || !userData.mobile) {
                    console.log('No valid user session found.');
                    return;
                }

                // Fetch full customer details from API
                const response = await fetch('http://localhost:5000/api/customers');
                const result = await response.json();

                if (response.ok && result.data) {
                    const currentUser = result.data.find(customer =>
                        customer.mobile === userData.mobile
                    );

                    if (currentUser) {
                        setUserInfo({
                            customer_name: currentUser.customer_name,
                            vehical_number: currentUser.vehical_number,
                            id: currentUser.id,
                            mobile: currentUser.mobile,
                            email: currentUser.email,
                            landmark: currentUser.landmark,
                            policy_document: currentUser.policy_document,
                            policy_expiry_date: currentUser.policy_expiry_date,
                            premium_amount: currentUser.premium_amount,
                            payment_status: currentUser.payment_status
                        });

                        // Generate dynamic notifications based on user data
                        const newNotifications = [];

                        // Check if policy is expiring soon (within 30 days)
                        if (currentUser.policy_expiry_date) {
                            const expiryDate = new Date(currentUser.policy_expiry_date);
                            const today = new Date();
                            const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

                            if (daysDiff <= 30 && daysDiff > 0) {
                                newNotifications.push({
                                    id: 1,
                                    message: `Policy renewal due in ${daysDiff} days`,
                                    type: 'warning',
                                    date: new Date().toISOString().split('T')[0]
                                });
                            } else if (daysDiff <= 0) {
                                newNotifications.push({
                                    id: 1,
                                    message: 'Policy has expired - Please renew immediately',
                                    type: 'error',
                                    date: new Date().toISOString().split('T')[0]
                                });
                            }
                        }

                        // Check payment status
                        if (currentUser.payment_status === 'pending') {
                            newNotifications.push({
                                id: 2,
                                message: 'Premium payment pending - Please complete payment',
                                type: 'warning',
                                date: new Date().toISOString().split('T')[0]
                            });
                        } else if (currentUser.payment_status === 'paid') {
                            newNotifications.push({
                                id: 2,
                                message: 'Premium payment successful',
                                type: 'success',
                                date: new Date().toISOString().split('T')[0]
                            });
                        }

                        // Check if policy document is missing
                        if (!currentUser.policy_document) {
                            newNotifications.push({
                                id: 3,
                                message: 'Policy document not uploaded - Please contact support',
                                type: 'info',
                                date: new Date().toISOString().split('T')[0]
                            });
                        }

                        setNotifications(newNotifications);
                    } else {
                        // User not found, redirect to login
                        localStorage.removeItem('customerData');
                        window.location.href = '/login';
                    }
                } else {
                    console.error('Failed to fetch user data:', result.message);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userData]);




    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />
        },
        {
            text: 'My Policy',
            icon: <CommuteIcon />
        },
        // {
        //     text: 'Documents',
        //     icon: <DescriptionIcon />
        // },
        // {
        //     text: 'Payments',
        //     icon: <PaymentIcon />
        // },
        {
            text: 'Support',
            icon: <ContactSupportIcon />
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
                return <UserDashboard />;
            case 'My Policy':
                return <MyPolicy />;
            // case 'Documents':
            //     return <Documents />;
            // case 'Payments':
            //     return <Payments />;
            case 'Support':
                return <Support />;
            default:
                return <UserDashboard />;
        }
    };

    // Show loading state while fetching user data
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading user data...
            </div>
        );
    }

    // Don't render if no user info (will redirect to login)
    if (!userInfo) {
        return null;
    }

    return (
        <BaseLayout
            title="My Insurance Portal"
            menuItems={menuItems}
            bottomMenuItems={bottomMenuItems}
            activeView={activeView}
            onViewChange={handleViewChange}
            userInfo={userInfo}
            notifications={notifications}
            showNotifications={true}
            showUserMenu={true}
        >
            {renderContent()}
        </BaseLayout>
    );
};

export default UserLayout;