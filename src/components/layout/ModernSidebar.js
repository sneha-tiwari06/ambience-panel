import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Divider,
  Collapse,
  Avatar,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  Image,
  Work,
  People,
  Assessment,
  Star,
  FormatQuote,
  PhotoLibrary,
  BusinessCenter,
  Lightbulb,
  QueryBuilder,
  Menu,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DRAWER_WIDTH = 300;
const COLLAPSED_WIDTH = 80;

const ModernSidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <Dashboard />,
      badge: null,
    },
    {
      path: '/banner-image',
      name: 'Banner Management',
      icon: <Image />,
    },
    {
      path: '/projects',
      name: 'Projects',
      icon: <Work />,
      badge: 'New',
    },
    {
      path: '/valuable-clients',
      name: 'Clients',
      icon: <People />,
    },
    {
      path: '/overview',
      name: 'Company Overview',
      icon: <Assessment />,
    },
    {
      path: '/awards',
      name: 'Awards & Certifications',
      icon: <Star />,
    },
    {
      path: '/testimonials',
      name: 'Testimonials',
      icon: <FormatQuote />,
    },
    {
      path: '/gallery',
      name: 'Project Gallery',
      icon: <PhotoLibrary />,
    },
    {
      path: '/careers',
      name: 'Career Opportunities',
      icon: <BusinessCenter />,
    },
    {
      path: '/spotlights',
      name: 'Spotlights',
      icon: <Lightbulb />,
    },
    {
      name: 'Query Management',
      icon: <QueryBuilder />,
      children: [
        {
          path: '/career-query',
          name: 'Career Applications',
          icon: <BusinessCenter />,
          badge: '12',
        },
        {
          path: '/contact-query',
          name: 'Contact Inquiries',
          icon: <QueryBuilder />,
          badge: '5',
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    if (item.children) {
      setExpandedItems(prev => ({
        ...prev,
        [item.name]: !prev[item.name]
      }));
    } else {
      navigate(item.path);
      if (isMobile) {
        setIsOpen(false);
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 80,
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                }}
              >
                A
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Ambience
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Admin Dashboard
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        <IconButton 
          onClick={toggleDrawer} 
          size="small"
          sx={{
            backgroundColor: 'grey.100',
            '&:hover': {
              backgroundColor: 'grey.200',
            },
          }}
        >
          {isOpen ? <ChevronLeft /> : <Menu />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleItemClick(item)}
                selected={item.path ? isActive(item.path) : false}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5b5bd6 0%, #7c3aed 100%)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isOpen ? 40 : 'auto',
                    justifyContent: 'center',
                    color: 'text.secondary',
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error" variant="dot">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {isOpen && (
                  <>
                    <ListItemText 
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                    {item.children && (
                      expandedItems[item.name] ? <ExpandLess /> : <ExpandMore />
                    )}
                  </>
                )}
              </ListItemButton>
            </ListItem>

            {/* Submenu */}
            {item.children && isOpen && (
              <Collapse in={expandedItems[item.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.path} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => handleItemClick(child)}
                        selected={isActive(child.path)}
                        sx={{
                          borderRadius: 2,
                          ml: 3,
                          py: 1,
                          px: 2,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                            '& .MuiListItemIcon-root': {
                              color: 'white',
                            },
                          },
                          '&:hover': {
                            backgroundColor: 'grey.100',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                          {child.badge ? (
                            <Badge badgeContent={child.badge} color="error">
                              {child.icon}
                            </Badge>
                          ) : (
                            child.icon
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={child.name}
                          primaryTypographyProps={{
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </motion.div>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* User Profile & Logout */}
      <Box sx={{ p: 2 }}>
        {isOpen && (
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              backgroundColor: 'grey.50',
              border: '1px solid #e2e8f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                }}
              >
                AD
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="600" color="text.primary">
                  Admin
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  admin@gmail.com
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            px: 2,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'white',
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
            },
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: isOpen ? 40 : 'auto', 
            justifyContent: 'center',
            color: 'error.main',
          }}>
            <Logout />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Sign Out" />}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          width: isOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { lg: `calc(100% - ${isOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ModernSidebar;