import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, trend, trendValue, color = 'primary', index = 0 }) => {
  const isPositiveTrend = trend === 'up';

  const gradients = {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    secondary: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            transform: 'translateY(-4px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                color="text.secondary" 
                gutterBottom 
                variant="body2"
                sx={{ 
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight="bold"
                color="text.primary"
                sx={{ mb: 1 }}
              >
                {value}
              </Typography>
              {trendValue && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      backgroundColor: isPositiveTrend ? 'success.light' : 'error.light',
                      color: isPositiveTrend ? 'success.dark' : 'error.dark',
                    }}
                  >
                    {isPositiveTrend ? (
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                    )}
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {trendValue}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1, fontSize: '0.75rem' }}
                  >
                    vs last month
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                background: gradients[color] || gradients.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: `0 8px 16px ${color === 'primary' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: 28 } })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;