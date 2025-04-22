import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import React from "react";

const AdminForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  isEdit = false 
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? "Edit Admin" : "Add Admin"}</DialogTitle>
      <DialogContent>
        <TextField 
          label="Full Name" 
          fullWidth 
          margin="normal" 
          value={formData.fullname} 
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} 
        />
        
        <TextField 
          label="Email" 
          fullWidth 
          margin="normal" 
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          InputProps={{
            readOnly: isEdit,
          }}
        />
        
        <TextField 
          label={isEdit ? "New Password (leave blank to keep current)" : "Password"} 
          fullWidth 
          margin="normal" 
          type="password" 
          value={formData.password} 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
        />
        
        <TextField 
          label={isEdit ? "Confirm New Password" : "Confirm Password"} 
          fullWidth 
          margin="normal" 
          type="password" 
          value={formData.confirmPassword} 
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={onSubmit} color="primary">
          {isEdit ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminForm;