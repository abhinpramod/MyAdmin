import React, { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment
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
  Unlock,
  Search
} from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from '../lib/aixos';
import { toast } from 'react-hot-toast';

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
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('pending');
  const [documentViewer, setDocumentViewer] = useState({
    open: false,
    url: '',
    title: ''
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStoreForMenu, setSelectedStoreForMenu] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  // Filter stores based on current filter
  const filteredStores = stores.filter(store => {
    if (filter === 'pending') {
      return store.approvelstatus === 'Pending' && !store.isBlocked;
    }
    if (filter === 'approved') {
      return store.approvelstatus === 'Approved' && !store.isBlocked;
    }
    if (filter === 'blocked') {
      return store.isBlocked;
    }
    if (filter === 'rejected') {
      return store.approvelstatus === 'Rejected';
    }
    return true; // 'all' filter
  });

  // Fetch stores with pagination and search
  const fetchStores = useCallback(async (reset = false) => {
    if (isFetching) return;
    
    try {
      setIsFetching(true);
      setLoading(true);
      
      const currentPage = reset ? 1 : page;
      const params = {
        page: currentPage,
        limit: 10,
        search: searchQuery
      };
      
      if (filter !== 'all') {
        params.filter = filter;
      }

      const response = await axios.get('/stores', { params });
      const data = response.data;
      
      if (reset) {
        setStores(data.stores || []);
        setPage(2);
      } else {
        setStores(prev => [...prev, ...(data.stores || [])]);
        setPage(prev => prev + 1);
      }
      
      setHasMore((data.stores || []).length >= 10);
    } catch (error) {
      toast.error('Failed to load stores. Please try again.');
      console.error('Error fetching stores:', error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, [filter, page, searchQuery, isFetching]);

  // Initial load and when filter/search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchStores(true);
  }, [filter, searchQuery]);

  // Handle search input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Approve a store
  const approveStore = async (storeId) => {
    try {
      setLoading(true);
      await axios.put(`/stores/${storeId}/approve`);
      setStores(stores.map(store => 
        store._id === storeId ? { 
          ...store, 
          approvelstatus: 'Approved', 
          isBlocked: false, 
          rejectionReason: null 
        } : store
      ));
      toast.success('Store approved successfully!');
      setSelectedStore(null);
      setFilter('approved');
    } catch (error) {
      toast.error('Failed to approve store. Please try again.');
      console.error('Approval error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reject a store
  const rejectStore = async () => {
    if (!selectedStore) return;
    
    try {
      setLoading(true);
      await axios.put(`/stores/${selectedStore._id}/reject`, { rejectionReason });
      setStores(stores.map(store => 
        store._id === selectedStore._id ? { 
          ...store, 
          approvelstatus: 'Rejected',
          isBlocked: false,
          rejectionReason 
        } : store
      ));
      toast.success('Store rejected successfully!');
      setRejectModalOpen(false);
      setRejectionReason('');
      setSelectedStore(null);
      setFilter('rejected');
    } catch (error) {
      toast.error('Failed to reject store. Please try again.');
      console.error('Rejection error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Block a store
  const blockStore = async (storeId) => {
    try {
      setLoading(true);
      await axios.put(`/stores/${storeId}/block`);
      setStores(stores.map(store => 
        store._id === storeId ? { ...store, isBlocked: true } : store
      ));
      toast.success('Store blocked successfully!');
      setAnchorEl(null);
      setSelectedStoreForMenu(null);
      setSelectedStore(null);
      setFilter('blocked');
    } catch (error) {
      toast.error('Failed to block store. Please try again.');
      console.error('Block error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Unblock a store
  const unblockStore = async (storeId) => {
    try {
      setLoading(true);
      await axios.put(`/stores/${storeId}/unblock`);
      setStores(stores.map(store => 
        store._id === storeId ? { ...store, isBlocked: false } : store
      ));
      toast.success('Store unblocked successfully!');
      setAnchorEl(null);
      setSelectedStoreForMenu(null);
      setSelectedStore(null);
      setFilter('approved');
    } catch (error) {
      toast.error('Failed to unblock store. Please try again.');
      console.error('Unblock error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  // Status chip component
  const StatusChip = ({ approvelstatus, isBlocked }) => {
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
    if (approvelstatus === 'Rejected') {
      return (
        <Chip 
          icon={<X size={16} />} 
          label="Rejected" 
          color="error" 
          variant="outlined" 
          size="small" 
        />
      );
    }
    if (approvelstatus === 'Approved') {
      return (
        <Chip 
          icon={<ShieldCheck size={16} />} 
          label="Approved" 
          color="success" 
          variant="outlined" 
          size="small" 
        />
      );
    }
    return (
      <Chip 
        icon={<FileText size={16} />} 
        label="Pending" 
        color="warning" 
        variant="outlined" 
        size="small" 
      />
    );
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
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Store Approvals
        </Typography>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <TextField
            size="small"
            placeholder="Search stores..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          
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
            <ToggleButton value="rejected" aria-label="rejected">
              Rejected
            </ToggleButton>
            <ToggleButton value="all" aria-label="all">
              All Stores
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      {/* Loading State */}
      {loading && filteredStores.length === 0 && (
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

      {/* Store Cards Grid with Infinite Scroll */}
      <InfiniteScroll
        dataLength={filteredStores.length}
        next={fetchStores}
        hasMore={hasMore && !isFetching}
        loader={
          <div className="flex justify-center my-4">
            <CircularProgress size={24} />
          </div>
        }
        endMessage={
          <p className="text-center text-gray-500 my-4">
            {filteredStores.length > 0 ? "You've seen all stores" : ""}
          </p>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStores.map((store) => (
            <Card key={store._id} variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <div className="flex justify-between items-start mb-2">
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {store.storeName}
                  </Typography>
                  <StatusChip 
                    approvelstatus={store.approvelstatus} 
                    isBlocked={store.isBlocked} 
                  />
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
                  {store.approvelstatus === 'Pending' && !store.isBlocked && (
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
                  {(store.approvelstatus === 'Approved' || store.approvelstatus === 'Rejected' || store.isBlocked) && (
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
      </InfiniteScroll>

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
                <StatusChip 
                  approvelstatus={selectedStore.approvelstatus} 
                  isBlocked={selectedStore.isBlocked} 
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
                
                {selectedStore.rejectionReason && (
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
                {selectedStore.approvelstatus === 'Pending' && !selectedStore.isBlocked && (
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
                {(selectedStore.approvelstatus === 'Approved' || selectedStore.approvelstatus === 'Rejected' || selectedStore.isBlocked) && (
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