import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

const ActionButton = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  icon,
  children,
  tooltip,
  iconOnly = false,
  animate = true,
  ...props
}) => {
  const ButtonComponent = iconOnly ? IconButton : Button;
  
  const buttonProps = {
    variant: iconOnly ? undefined : variant,
    color,
    size,
    startIcon: !iconOnly ? icon : undefined,
    sx: {
      borderRadius: iconOnly ? 2 : 2,
      fontWeight: 500,
      textTransform: 'none',
      boxShadow: variant === 'contained' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: variant === 'contained' ? '0 4px 8px rgba(0,0,0,0.15)' : 'none',
      },
      transition: 'all 0.2s ease-in-out',
      ...props.sx,
    },
    ...props,
  };

  const button = (
    <ButtonComponent {...buttonProps}>
      {iconOnly ? icon : children}
    </ButtonComponent>
  );

  const wrappedButton = animate ? (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {button}
    </motion.div>
  ) : button;

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow>
        {wrappedButton}
      </Tooltip>
    );
  }

  return wrappedButton;
};

export default ActionButton;