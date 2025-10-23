

import * as React from 'react';
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


import MenuIcon from '@mui/icons-material/Menu';        
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';  
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; 
import DashboardIcon from '@mui/icons-material/Dashboard';       
import PeopleIcon from '@mui/icons-material/People';            
import NotificationsIcon from '@mui/icons-material/Notifications'; 
import SettingsIcon from '@mui/icons-material/Settings';        
import LogoutIcon from '@mui/icons-material/Logout';           



import DashboardPage from './DashboardPage';     
import UsersPage from './UsersPage';             
import NotificationsPage from './NotificationsPage'; 
import SettingsPage from './SettingsPage';       






const drawerWidth = 240;


const openedMixin = (theme) => ({
    width: drawerWidth,                                    
    transition: theme.transitions.create('width', {       
        easing: theme.transitions.easing.sharp,           
        duration: theme.transitions.duration.enteringScreen, 
    }),
    overflowX: 'hidden',                                  
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


export default function Dashboard() {
    
    
    

    
    const theme = useTheme();

    
    const [open, setOpen] = React.useState(false);

    
    const [activeView, setActiveView] = React.useState('Dashboard');

    
    
    

    
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    
    const handleDrawerClose = () => {
        setOpen(false);
    };

    
    
    

    
    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />     
        },
        {
            text: 'Users',
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

    
    const handleMenuClick = (itemText) => {
        setActiveView(itemText);

        if (itemText === 'Logout') {
            handleLogout();
        }
    };

    const handleLogout = () => {
        
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');

            
            
        }
    };

    
    
    

    
    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard':
                return <DashboardPage />;      
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

    
    
    

    return (
        <Box sx={{ display: 'flex' }}>  {}
            {}
            <CssBaseline />

            {}
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    {}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"    
                        onClick={handleDrawerOpen}
                        edge="start"               
                        sx={[
                            {
                                marginRight: 5,     
                            },
                            open && { display: 'none' }, 
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>

                    {}
                    <Typography variant="h6" noWrap component="div">
                        CRM Dashboard - {activeView}
                    </Typography>
                </Toolbar>
            </AppBar>
            {}
            <Drawer variant="permanent" open={open}>
                {}
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {}
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>

                {}
                <Divider />

                {}
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
                                            backgroundColor: theme.palette.error.main,
                                            color: theme.palette.error.contrastText,
                                            '& .MuiListItemIcon-root': {
                                                color: theme.palette.error.contrastText,
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
                                            color: theme.palette.error.main,
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
                                            color: theme.palette.error.main,
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
            {}
            <Box component="main" sx={{ flexGrow: 1 }}>
                {}
                <DrawerHeader />

                {}
                {renderContent()}
            </Box>
        </Box>
    );
}