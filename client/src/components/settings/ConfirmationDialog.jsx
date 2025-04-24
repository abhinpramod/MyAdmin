import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const ConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmButtonText, 
  confirmButtonColor 
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color={confirmButtonColor}
          variant="contained"
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;