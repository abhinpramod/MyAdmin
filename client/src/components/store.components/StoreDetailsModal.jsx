import React from 'react';
import { 
  Modal,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import { 
  User,
  MapPin,
  Mail,
  Phone,
  Store,
  FileDigit,
  Calendar,
  FileText,
  AlertCircle,
  Check,
  X,
  Lock,
  Unlock
} from 'lucide-react';
import StatusChip from './StatusChip';

const StoreDetailsModal = ({ 
  open, 
  store, 
  onClose, 
  onApprove, 
  onReject, 
  onBlockUnblock,
  onViewDocument,
  loading 
}) => {
  if (!store) return null;

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
        <div className="flex justify-between items-start mb-4">
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {store.storeName}
          </Typography>
          <StatusChip 
            approvelstatus={store.approvelstatus} 
            isBlocked={store.isBlocked} 
          />
        </div>
        
        <Divider sx={{ my: 2 }} />
        
        <List dense>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <User size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Owner Name"
              secondary={store.ownerName}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <MapPin size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Address"
              secondary={`${store.address}, ${store.city}, ${store.state}, ${store.country}`}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Mail size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={store.email}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Phone size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Phone"
              secondary={store.phone}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Store size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Store Type"
              secondary={store.storeType}
            />
          </ListItem>
          
          {store.gstNumber && (
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FileDigit size={18} />
              </ListItemIcon>
              <ListItemText
                primary="GST Number"
                secondary={store.gstNumber}
              />
            </ListItem>
          )}
          
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Calendar size={18} />
            </ListItemIcon>
            <ListItemText
              primary="Registered On"
              secondary={new Date(store.createdAt).toLocaleDateString()}
            />
          </ListItem>
          
          {store.gstDocument && (
            <ListItem 
              button 
              onClick={() => onViewDocument(
                store.gstDocument, 
                `${store.storeName} - GST Document`
              )}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FileText size={18} />
              </ListItemIcon>
              <ListItemText
                primary="GST Document"
                secondary="Click to view document"
                secondaryTypographyProps={{ color: 'primary' }}
              />
            </ListItem>
          )}
          
          {store.storeLicense && (
            <ListItem 
              button 
              onClick={() => onViewDocument(
                store.storeLicense, 
                `${store.storeName} - Store License`
              )}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FileText size={18} />
              </ListItemIcon>
              <ListItemText
                primary="Store License"
                secondary="Click to view license"
                secondaryTypographyProps={{ color: 'primary' }}
              />
            </ListItem>
          )}
          
          {store.rejectionReason && (
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <AlertCircle size={18} color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Rejection Reason"
                secondary={store.rejectionReason}
                secondaryTypographyProps={{ color: 'error' }}
              />
            </ListItem>
          )}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
          {store.approvelstatus === 'Pending' && !store.isBlocked && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<Check size={18} />}
                onClick={() => onApprove(store._id)}
                sx={{ textTransform: 'none' }}
                disabled={loading}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<X size={18} />}
                onClick={onReject}
                sx={{ textTransform: 'none' }}
                disabled={loading}
              >
                Reject
              </Button>
            </>
          )}
          {(store.approvelstatus === 'Approved' || store.approvelstatus === 'Rejected' || store.isBlocked) && (
            <Button
              variant="contained"
              color={store.isBlocked ? 'success' : 'error'}
              startIcon={store.isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
              onClick={() => onBlockUnblock(store._id, store.isBlocked)}
              sx={{ textTransform: 'none' }}
              disabled={loading}
            >
              {store.isBlocked ? 'Unblock' : 'Block'}
            </Button>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default StoreDetailsModal;