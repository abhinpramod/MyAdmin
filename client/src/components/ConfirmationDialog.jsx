import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const ConfirmationDialog = ({
  open, // Controls whether the dialog is open
  onClose, // Function to close the dialog
  onConfirm, // Function to handle the confirmation action
  title, // Title of the dialog
  message, // Message to display in the dialog
  confirmButtonText = "Confirm", // Text for the confirm button
  cancelButtonText = "Cancel", // Text for the cancel button
  confirmButtonColor = "primary", // Color for the confirm button
  cancelButtonColor = "secondary", // Color for the cancel button
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color={cancelButtonColor}>
          {cancelButtonText}
        </Button>
        <Button onClick={onConfirm} color={confirmButtonColor} autoFocus>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;