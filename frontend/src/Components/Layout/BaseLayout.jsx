

import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 280;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    [theme.breakpoints.down('md')]: {
        width: 0,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const BaseLayout = ({
    title = 'CRM Dashboard',
    menuItems = [],
    bottomMenuItems = [],
    activeView,
    onViewChange,
    children,
    userInfo = null,
    notifications = [],
    showNotifications = true,
    showUserMenu = true
}) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };



    const handleUserMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (itemText) => {
        onViewChange && onViewChange(itemText);

        if (itemText === 'Logout') {
            handleLogout();
        }
    };

    const handleLogout = () => {
        // Direct logout without confirmation
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('customerData');
        localStorage.removeItem('sessionId');
        onViewChange && onViewChange('Logout');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    [theme.breakpoints.down('md')]: {

                        width: '100%',
                        marginLeft: 0,
                    },
                    [theme.breakpoints.up('md')]: {

                        marginLeft: open ? drawerWidth : 0,
                        width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
                        transition: (theme) => theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            display: { md: 'none' },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                                display: { xs: 'none', md: 'block' },
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {title} {activeView && `- ${activeView}`}
                    </Typography>

                    {showNotifications && (
                        <IconButton color="inherit" sx={{ mr: 1 }}>
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    )}

                    {showUserMenu && (
                        <IconButton
                            color="inherit"
                            onClick={handleUserMenuClick}
                            sx={{ ml: 1 }}
                        >
                            {userInfo?.customer_name ? (
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                                    {userInfo.customer_name.charAt(0).toUpperCase()}
                                </Avatar>
                            ) : (
                                <AccountCircleIcon />
                            )}
                        </IconButton>
                    )}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleUserMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {userInfo && (
                            <MenuItem onClick={handleUserMenuClose}>
                                <PersonIcon sx={{ mr: 1 }} />
                                {userInfo.customer_name || 'Profile'}
                            </MenuItem>
                        )}
                        <MenuItem onClick={() => { handleUserMenuClose(); handleLogout(); }}>
                            <ExitToAppIcon sx={{ mr: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            { }
            {mobileOpen && (
                <>
                    { }
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1300,
                        }}
                        onClick={handleDrawerToggle}
                    />
                    { }
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: `${drawerWidth}px`,
                            height: '100vh',
                            backgroundColor: '#fff',
                            zIndex: 1301,
                            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
                            overflowY: 'auto',
                            transform: 'translateX(0)',
                            transition: 'transform 0.3s ease-in-out',
                        }}
                    >
                        { }
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            padding: '8px',
                            minHeight: '64px',
                            borderBottom: '1px solid #e0e0e0'
                        }}>
                            <IconButton onClick={handleDrawerToggle}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </div>

                        { }
                        <div style={{ padding: 0 }}>
                            {menuItems.map((item) => (
                                <div
                                    key={item.text}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 20px',
                                        cursor: 'pointer',
                                        backgroundColor: activeView === item.text ? '#f5f5f5' : 'transparent',
                                        borderLeft: activeView === item.text ? '4px solid #1976d2' : '4px solid transparent',
                                    }}
                                    onClick={() => {
                                        handleMenuClick(item.text);
                                        handleDrawerToggle();
                                    }}
                                >
                                    <div style={{
                                        marginRight: '24px',
                                        color: activeView === item.text ? '#1976d2' : '#666',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <span style={{
                                        color: activeView === item.text ? '#1976d2' : '#333',
                                        fontSize: '16px',
                                        fontWeight: activeView === item.text ? '500' : '400'
                                    }}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        { }
                        <div style={{
                            height: '1px',
                            backgroundColor: '#e0e0e0',
                            margin: '16px 0'
                        }} />

                        { }
                        <div style={{ padding: 0 }}>
                            {bottomMenuItems.map((item) => (
                                <div
                                    key={item.text}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 20px',
                                        cursor: 'pointer',
                                        backgroundColor: 'transparent',
                                    }}
                                    onClick={() => {
                                        handleMenuClick(item.text);
                                        if (item.text !== 'Logout') handleDrawerToggle();
                                    }}
                                >
                                    <div style={{
                                        marginRight: '24px',
                                        color: item.text === 'Logout' ? '#d32f2f' : '#666',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <span style={{
                                        color: item.text === 'Logout' ? '#d32f2f' : '#333',
                                        fontSize: '16px',
                                        fontWeight: '400'
                                    }}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}



            { }
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                onClick={() => handleMenuClick(item.text)}
                                selected={activeView === item.text}
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                        '&.Mui-selected': {
                                            backgroundColor: theme.palette.action.selected,
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                            },
                                        },
                                    },
                                    open
                                        ? {
                                            justifyContent: 'initial',
                                        }
                                        : {
                                            justifyContent: 'center',
                                        },
                                ]}
                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: 'center',
                                            color: activeView === item.text ? theme.palette.primary.main : 'inherit',
                                        },
                                        open
                                            ? {
                                                mr: 3,
                                            }
                                            : {
                                                mr: 'auto',
                                            },
                                    ]}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={[
                                        {
                                            color: activeView === item.text ? theme.palette.primary.main : 'inherit',
                                        },
                                        open
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider />

                <List>
                    {bottomMenuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                onClick={() => handleMenuClick(item.text)}
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                        '&:hover': {
                                            backgroundColor: item.text === 'Logout'
                                                ? theme.palette.error.main
                                                : theme.palette.action.hover,
                                            color: item.text === 'Logout'
                                                ? theme.palette.error.contrastText
                                                : 'inherit',
                                            '& .MuiListItemIcon-root': {
                                                color: item.text === 'Logout'
                                                    ? theme.palette.error.contrastText
                                                    : 'inherit',
                                            },
                                        },
                                    },
                                    open
                                        ? {
                                            justifyContent: 'initial',
                                        }
                                        : {
                                            justifyContent: 'center',
                                        },
                                ]}
                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: 'center',
                                            color: item.text === 'Logout'
                                                ? theme.palette.error.main
                                                : 'inherit',
                                        },
                                        open
                                            ? {
                                                mr: 3,
                                            }
                                            : {
                                                mr: 'auto',
                                            },
                                    ]}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={[
                                        {
                                            color: item.text === 'Logout'
                                                ? theme.palette.error.main
                                                : 'inherit',
                                        },
                                        open
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{
                flexGrow: 1,
                p: { xs: 1, sm: 2, md: 3 },
                minHeight: '100vh',
                backgroundColor: 'background.default',
                [theme.breakpoints.down('md')]: {

                    width: '100%',
                    marginLeft: 0,
                },
                [theme.breakpoints.up('md')]: {

                    marginLeft: open ? 0 : 0,
                    width: '100%',
                }
            }}>
                <DrawerHeader />
                <Box sx={{
                    maxWidth: '100%',
                    mx: 'auto',
                    px: { xs: 0, sm: 1, md: 2 }
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default BaseLayout;