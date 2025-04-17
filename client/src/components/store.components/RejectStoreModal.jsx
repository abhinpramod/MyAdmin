import React from 'react';
import { 
  Modal,
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { X } from 'lucide-react';

const RejectStoreModal = ({ 
  open, 
  store, 
  onClose, 
  onConfirm, 
  rejectionReason, 
  setRejectionReason,
  loading 
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: '90%', md: '80%', lg: '60%' },
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        overflowY: 'auto',
        p: 3,
      }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
          Reject Store Application
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please provide a reason for rejecting {store?.storeName}'s application:
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          sx={{ mb: 3 }}
        />
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ textTransform: 'none' }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<X size={18} />}
            onClick={onConfirm}
            disabled={!rejectionReason.trim() || loading}
            sx={{ textTransform: 'none' }}
          >
            Confirm Reject
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RejectStoreModal;