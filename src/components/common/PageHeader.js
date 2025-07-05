import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Chip } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { NavigateNext } from '@mui/icons-material';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, breadcrumbs, actions, badge }) => {
  const location = useLocation();

  const defaultBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: title, href: location.pathname }
  ];

  const displayBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />}
          sx={{ 
            mb: 2,
            '& .MuiBreadcrumbs-separator': {
              color: 'text.secondary',
            },
          }}
        >
          {displayBreadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              component={RouterLink}
              to={crumb.href}
              color={index === displayBreadcrumbs.length - 1 ? 'text.primary' : 'text.secondary'}
              sx={{ 
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="700"
                color="text.primary"
                sx={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </Typography>
              {badge && (
                <Chip 
                  label={badge} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              )}
            </Box>
            {subtitle && (
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ maxWidth: 600 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {actions && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5,
              flexWrap: 'wrap',
            }}>
              {actions}
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PageHeader;