import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Warning, Error, Info, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning',
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <Error sx={{ fontSize: 48, color: 'error.main' }} />;
      case 'warning':
        return <Warning sx={{ fontSize: 48, color: 'warning.main' }} />;
      case 'info':
        return <Info sx={{ fontSize: 48, color: 'info.main' }} />;
      default:
        return <Warning sx={{ fontSize: 48, color: 'warning.main' }} />;
    }
  };

  const getConfirmColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'primary';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog 
          open={open} 
          onClose={onClose} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="600">
                  {title}
                </Typography>
                <IconButton onClick={onClose} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                textAlign: 'center',
                py: 2,
              }}>
                {getIcon()}
                <DialogContentText sx={{ mt: 2, fontSize: '1rem' }}>
                  {message}
                </DialogContentText>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button 
                onClick={onClose} 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 500,
                }}
              >
                {cancelText}
              </Button>
              <Button 
                onClick={onConfirm} 
                color={getConfirmColor()} 
                variant="contained"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 500,
                  ml: 1,
                }}
              >
                {confirmText}
              </Button>
            </DialogActions>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;