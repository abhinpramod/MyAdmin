import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import React from "react";

export const ConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  content,
  confirmText = "Confirm",
  confirmColor = "primary"
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      {content && <DialogContent>{content}</DialogContent>}
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={onConfirm} color={confirmColor}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
};