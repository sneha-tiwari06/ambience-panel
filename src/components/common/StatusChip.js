import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Cancel, Pending, Visibility, VisibilityOff } from '@mui/icons-material';

const StatusChip = ({ status, label, onClick, variant = 'filled' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'published':
      case 'completed':
      case 'shown':
        return {
          color: 'success',
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
          label: label || 'Active',
        };
      case 'inactive':
      case 'draft':
      case 'pending':
      case 'hidden':
        return {
          color: 'warning',
          icon: <Pending sx={{ fontSize: 16 }} />,
          label: label || 'Inactive',
        };
      case 'deleted':
      case 'cancelled':
      case 'error':
        return {
          color: 'error',
          icon: <Cancel sx={{ fontSize: 16 }} />,
          label: label || 'Error',
        };
      default:
        return {
          color: 'default',
          icon: null,
          label: label || status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant={variant}
      size="small"
      icon={config.icon}
      onClick={onClick}
      clickable={!!onClick}
      sx={{
        fontWeight: 500,
        minWidth: 90,
        height: 28,
        borderRadius: 2,
        '& .MuiChip-label': {
          px: 1,
          fontSize: '0.75rem',
        },
        '& .MuiChip-icon': {
          ml: 1,
        },
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
      }}
    />
  );
};

export default StatusChip;