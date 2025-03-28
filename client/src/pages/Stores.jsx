import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Typography, 
  Modal, 
  Box, 
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Check, 
  X, 
  Eye, 
  FileText,
  Store,
  User,
  MapPin,
  Mail,
  Phone,
  FileDigit,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Download,
  X as CloseIcon,
  MoreVertical,
  Lock,
  Unlock
} from 'lucide-react';

// Mock data with image URLs
const mockStores = [
  {
    _id: '64a1b5c8e8b9d8f5c8e8b9d8',
    storeName: 'Fresh Groceries',
    ownerName: 'John Doe',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: '123 Main Street, Andheri East',
    email: 'john@freshgroceries.com',
    phone: '+919876543210',
    storeType: 'Grocery',
    gstNumber: '22ABCDE1234F1Z5',
    gstDocument: 'https://images.unsplash.com/photo-1600189261867-8e3a230a5a90?w=600&auto=format',
    storeLicense: 'https://images.unsplash.com/photo-1587202372775-e229f1723e1b?w=600&auto=format',
    approved: false,
    isBlocked: false,
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2023-05-15T10:00:00Z'
  },
  {
    _id: '64a1b5c8e8b9d8f5c8e8b9d9',
    storeName: 'Tech Gadgets',
    ownerName: 'Jane Smith',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    address: '456 Tech Park, Whitefield',
    email: 'jane@techgadgets.com',
    phone: '+919876543211',
    storeType: 'Electronics',
    gstNumber: '29XYZDE5678G2H6',
    gstDocument: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=600&auto=format',
    storeLicense: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format',
    approved: true,
    isBlocked: false,
    createdAt: '2023-05-10T09:30:00Z',
    updatedAt: '2023-05-12T14:20:00Z'
  },
  {
    _id: '64a1b5c8e8b9d8f5c8e8b9da',
    storeName: 'Fashion Hub',
    ownerName: 'Raj Patel',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    address: '789 Fashion Street, CG Road',
    email: 'raj@fashionhub.com',
    phone: '+919876543212',
    storeType: 'Clothing',
    gstNumber: '24GHIJK5678L3M9',
    gstDocument: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format',
    storeLicense: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&auto=format',
    approved: true,
    isBlocked: true,
    createdAt: '2023-05-18T11:45:00Z',
    updatedAt: '2023-05-20T09:15:00Z'
  }
];

// Modal style configuration
const modalStyle = {
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
};

// Document Viewer Component
const DocumentViewer = ({ open, onClose, documentUrl, title }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <Box>
          <IconButton 
            href={documentUrl} 
            download 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ mr: 1 }}
          >
            <Download size={20} />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden',
        p: 0
      }}>
        <img 
          src={documentUrl} 
          alt={title}
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/600x800?text=Document+Not+Found';
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

const AdminStoreApproval = () => {
  const [stores, setStores] = useState(mockStores);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('pending');
  const [notification, setNotification] = useState(null);
  const [documentViewer, setDocumentViewer] = useState({
    open: false,
    url: '',
    title: ''
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStoreForMenu, setSelectedStoreForMenu] = useState(null);

  // Filter stores based on current filter
  const filteredStores = stores.filter(store => {
    if (filter === 'pending') return !store.approved;
    if (filter === 'approved') return store.approved && !store.isBlocked;
    if (filter === 'blocked') return store.isBlocked;
    return true; // 'all'
  });

  // Approve a store
  const approveStore = (storeId) => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setStores(stores.map(store => 
        store._id === storeId ? { ...store, approved: true, isBlocked: false } : store
      ));
      setNotification({
        type: 'success',
        message: 'Store approved successfully!'
      });
      setLoading(false);
    }, 500);
  };

  // Reject a store
  const rejectStore = () => {
    if (!selectedStore) return;
    
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setStores(stores.map(store => 
        store._id === selectedStore._id ? { 
          ...store, 
          approved: false, 
          isBlocked: false,
          rejectionReason 
        } : store
      ));
      setNotification({
        type: 'success',
        message: 'Store rejected successfully!'
      });
      setRejectModalOpen(false);
      setRejectionReason('');
      setLoading(false);
    }, 500);
  };

  // Block a store
  const blockStore = (storeId) => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setStores(stores.map(store => 
        store._id === storeId ? { ...store, isBlocked: true } : store
      ));
      setNotification({
        type: 'success',
        message: 'Store blocked successfully!'
      });
      setLoading(false);
      setAnchorEl(null);
    }, 500);
  };

  // Unblock a store
  const unblockStore = (storeId) => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setStores(stores.map(store => 
        store._id === storeId ? { ...store, isBlocked: false } : store
      ));
      setNotification({
        type: 'success',
        message: 'Store unblocked successfully!'
      });
      setLoading(false);
      setAnchorEl(null);
    }, 500);
  };

  // Handle filter change
  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  // Status chip component
  const StatusChip = ({ approved, isBlocked }) => {
    if (isBlocked) {
      return (
        <Chip 
          icon={<Lock size={16} />} 
          label="Blocked" 
          color="error" 
          variant="outlined" 
          size="small" 
        />
      );
    }
    return approved ? (
      <Chip 
        icon={<ShieldCheck size={16} />} 
        label="Approved" 
        color="success" 
        variant="outlined" 
        size="small" 
      />
    ) : (
      <Chip 
        icon={<FileText size={16} />} 
        label="Pending" 
        color="warning" 
        variant="outlined" 
        size="small" 
      />
    );
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Open document viewer
  const openDocumentViewer = (url, title) => {
    setDocumentViewer({
      open: true,
      url,
      title
    });
  };

  // Handle menu open
  const handleMenuOpen = (event, store) => {
    setAnchorEl(event.currentTarget);
    setSelectedStoreForMenu(store);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStoreForMenu(null);
  };

  return (
    <div className="p-4">
      {/* Notification Alert */}
      {notification && (
        <Alert 
          severity={notification.type} 
          onClose={handleCloseNotification}
          sx={{ mb: 2 }}
          icon={notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
        >
          {notification.message}
        </Alert>
      )}

      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Store Approvals
        </Typography>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="store filter"
          size="small"
        >
          <ToggleButton value="pending" aria-label="pending">
            Pending
          </ToggleButton>
          <ToggleButton value="approved" aria-label="approved">
            Approved
          </ToggleButton>
          <ToggleButton value="blocked" aria-label="blocked">
            Blocked
          </ToggleButton>
          <ToggleButton value="all" aria-label="all">
            All
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredStores.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Store size={48} className="mb-4" />
          <Typography variant="h6">No stores found</Typography>
          <Typography variant="body2">There are no stores matching your current filter</Typography>
        </div>
      )}

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStores.map((store) => (
          <Card key={store._id} variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <div className="flex justify-between items-start mb-2">
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  {store.storeName}
                </Typography>
                <StatusChip approved={store.approved} isBlocked={store.isBlocked} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2" />
                  <span>{store.ownerName}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span>{store.city}, {store.state}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-2" />
                  <span className="truncate">{store.email}</span>
                </div>
                
                {store.gstNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FileDigit size={16} className="mr-2" />
                    <span className="truncate">GST: {store.gstNumber}</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
              <Button 
                size="small" 
                startIcon={<Eye size={18} />}
                onClick={() => setSelectedStore(store)}
                sx={{ textTransform: 'none' }}
              >
                Details
              </Button>
              
              <div className="flex space-x-2">
                {!store.approved && (
                  <>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<Check size={18} />}
                      onClick={() => approveStore(store._id)}
                      sx={{ textTransform: 'none' }}
                      disabled={loading}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<X size={18} />}
                      onClick={() => {
                        setSelectedStore(store);
                        setRejectModalOpen(true);
                      }}
                      sx={{ textTransform: 'none' }}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {store.approved && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, store)}
                    disabled={loading}
                  >
                    <MoreVertical size={18} />
                  </IconButton>
                )}
              </div>
            </CardActions>
          </Card>
        ))}
      </div>

      {/* Store Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedStoreForMenu?.isBlocked ? (
          <MenuItem 
            onClick={() => unblockStore(selectedStoreForMenu._id)}
            sx={{ color: 'success.main' }}
          >
            <ListItemIcon>
              <Unlock size={18} />
            </ListItemIcon>
            Unblock Store
          </MenuItem>
        ) : (
          <MenuItem 
            onClick={() => blockStore(selectedStoreForMenu?._id)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <Lock size={18} />
            </ListItemIcon>
            Block Store
          </MenuItem>
        )}
      </Menu>

      {/* Store Details Modal */}
      <Modal
        open={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        aria-labelledby="store-details-modal"
      >
        <Box sx={modalStyle}>
          {selectedStore && (
            <>
              <div className="flex justify-between items-start mb-4">
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  {selectedStore.storeName}
                </Typography>
                <StatusChip approved={selectedStore.approved} isBlocked={selectedStore.isBlocked} />
              </div>
              
              <Divider sx={{ my: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <User size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Owner Name"
                    secondary={selectedStore.ownerName}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <MapPin size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary={`${selectedStore.address}, ${selectedStore.city}, ${selectedStore.state}, ${selectedStore.country}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Mail size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={selectedStore.email}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Phone size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={selectedStore.phone}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Store size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Store Type"
                    secondary={selectedStore.storeType}
                  />
                </ListItem>
                
                {selectedStore.gstNumber && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <FileDigit size={18} />
                    </ListItemIcon>
                    <ListItemText
                      primary="GST Number"
                      secondary={selectedStore.gstNumber}
                    />
                  </ListItem>
                )}
                
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Calendar size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Registered On"
                    secondary={new Date(selectedStore.createdAt).toLocaleDateString()}
                  />
                </ListItem>
                
                {selectedStore.gstDocument && (
                  <ListItem 
                    button 
                    onClick={() => openDocumentViewer(
                      selectedStore.gstDocument, 
                      `${selectedStore.storeName} - GST Document`
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
                
                {selectedStore.storeLicense && (
                  <ListItem 
                    button 
                    onClick={() => openDocumentViewer(
                      selectedStore.storeLicense, 
                      `${selectedStore.storeName} - Store License`
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
                
                {selectedStore.rejectionReason && !selectedStore.approved && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <AlertCircle size={18} color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Rejection Reason"
                      secondary={selectedStore.rejectionReason}
                      secondaryTypographyProps={{ color: 'error' }}
                    />
                  </ListItem>
                )}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outlined" 
                  onClick={() => setSelectedStore(null)}
                  sx={{ textTransform: 'none' }}
                >
                  Close
                </Button>
                {!selectedStore.approved && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Check size={18} />}
                      onClick={() => approveStore(selectedStore._id)}
                      sx={{ textTransform: 'none' }}
                      disabled={loading}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<X size={18} />}
                      onClick={() => {
                        setRejectModalOpen(true);
                      }}
                      sx={{ textTransform: 'none' }}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {selectedStore.approved && (
                  <Button
                    variant="contained"
                    color={selectedStore.isBlocked ? 'success' : 'error'}
                    startIcon={selectedStore.isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
                    onClick={() => {
                      if (selectedStore.isBlocked) {
                        unblockStore(selectedStore._id);
                      } else {
                        blockStore(selectedStore._id);
                      }
                      setSelectedStore(null);
                    }}
                    sx={{ textTransform: 'none' }}
                    disabled={loading}
                  >
                    {selectedStore.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                )}
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        aria-labelledby="reject-store-modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            Reject Store Application
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please provide a reason for rejecting {selectedStore?.storeName}'s application:
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
              onClick={() => {
                setRejectModalOpen(false);
                setRejectionReason('');
              }}
              sx={{ textTransform: 'none' }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<X size={18} />}
              onClick={rejectStore}
              disabled={!rejectionReason.trim() || loading}
              sx={{ textTransform: 'none' }}
            >
              Confirm Reject
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Document Viewer Dialog */}
      <DocumentViewer
        open={documentViewer.open}
        onClose={() => setDocumentViewer({ ...documentViewer, open: false })}
        documentUrl={documentViewer.url}
        title={documentViewer.title}
      />
    </div>
  );
};

export default AdminStoreApproval;