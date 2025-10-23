

import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Alert
} from '@mui/material';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';


export const KPICard = ({
    title,
    value,
    subtitle,
    color = 'primary',
    icon: Icon,
    trend = null
}) => (
    <Card sx={{
        bgcolor: `${color}.main`,
        color: 'white',
        height: '100%',
        minHeight: { xs: 120, sm: 140, md: 160 }, 
    }}>
        <CardContent sx={{
            p: { xs: 1.5, sm: 2, md: 3 }, 
            '&:last-child': { pb: { xs: 1.5, sm: 2, md: 3 } }
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                flexDirection: { xs: 'column', sm: 'row' }, 
                mb: { xs: 1, sm: 2 },
                textAlign: { xs: 'center', sm: 'left' }
            }}>
                {Icon && (
                    <Icon sx={{
                        mr: { xs: 0, sm: 2 },
                        mb: { xs: 1, sm: 0 },
                        fontSize: { xs: 28, sm: 32, md: 36 }, 
                        alignSelf: { xs: 'center', sm: 'flex-start' }
                    }} />
                )}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } 
                    }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }, 
                        lineHeight: { xs: 1.2, sm: 1.167 }
                    }}>
                        {value}
                    </Typography>
                    <Typography variant="body2" sx={{
                        opacity: 0.9,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' } 
                    }}>
                        {subtitle}
                    </Typography>
                    {trend && (
                        <Typography variant="caption" sx={{
                            opacity: 0.8,
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' } 
                        }}>
                            {trend}
                        </Typography>
                    )}
                </Box>
            </Box>
        </CardContent>
    </Card>
);


export const DashboardPieChart = ({
    title,
    data = [],
    height = 300
}) => (
    <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
            {title}
        </Typography>
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 45}, 70%, 50%)`} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    </Paper>
);


export const DashboardBarChart = ({
    title,
    data = [],
    xAxisKey = 'name',
    bars = [],
    height = 300
}) => (
    <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
            {title}
        </Typography>
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {bars.map((bar, index) => (
                    <Bar
                        key={index}
                        dataKey={bar.dataKey}
                        fill={bar.color || `hsl(${index * 60}, 70%, 50%)`}
                        name={bar.name}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    </Paper>
);


export const ActivityFeed = ({
    title = 'Recent Activities',
    activities = []
}) => (
    <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
            {title}
        </Typography>
        <List>
            {activities.map((activity, index) => (
                <ListItem key={index} sx={{
                    mb: 1,
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1
                }}>
                    {activity.icon && (
                        <ListItemIcon>
                            {activity.icon}
                        </ListItemIcon>
                    )}
                    <ListItemText
                        primary={activity.title}
                        secondary={activity.subtitle}
                    />
                </ListItem>
            ))}
        </List>
    </Paper>
);


export const StatusChip = ({ status, getStatusColor, getStatusText }) => (
    <Chip
        label={getStatusText ? getStatusText(status) : status}
        color={getStatusColor ? getStatusColor(status) : 'default'}
        size="small"
        sx={{ fontWeight: 'bold' }}
    />
);


export const NotificationAlert = ({ notification }) => (
    <Alert
        severity={notification.type || 'info'}
        sx={{ mb: 1 }}
    >
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
        }}>
            <Typography variant="body2">
                {notification.message}
            </Typography>
            {notification.date && (
                <Typography variant="caption" color="text.secondary">
                    {new Date(notification.date).toLocaleDateString()}
                </Typography>
            )}
        </Box>
    </Alert>
);


export const StatsGrid = ({ stats = [] }) => (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <KPICard {...stat} />
            </Grid>
        ))}
    </Grid>
);


export const ChartsGrid = ({ charts = [] }) => (
    <Grid container spacing={3}>
        {charts.map((chart, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
                {chart.type === 'pie' ? (
                    <DashboardPieChart {...chart} />
                ) : chart.type === 'bar' ? (
                    <DashboardBarChart {...chart} />
                ) : (
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Unsupported Chart Type</Typography>
                    </Paper>
                )}
            </Grid>
        ))}
    </Grid>
);


export const DashboardHeader = ({
    title,
    subtitle,
    userInfo
}) => (
    <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" gutterBottom sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }, 
            lineHeight: { xs: 1.2, sm: 1.167 }
        }}>
            <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
                {title}
            </Box>
            {userInfo?.customer_name && (
                <Box component="span" sx={{
                    display: { xs: 'block', sm: 'inline' },
                    mt: { xs: 0.5, sm: 0 }
                }}>
                    {` ${userInfo.customer_name}! 👋`}
                </Box>
            )}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' }, 
            maxWidth: { xs: '100%', md: '80%' }, 
            lineHeight: 1.5
        }}>
            {subtitle}
        </Typography>
    </Box>
);