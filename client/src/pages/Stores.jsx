import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Store, Search } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from '../lib/aixos';
import { toast } from 'react-hot-toast';

import StoreCard from '../components/store.components/StoreCard';
import StoreDetailsModal from '../components/store.components/StoreDetailsModal';
import RejectStoreModal from '../components/store.components/RejectStoreModal';
import StoreActionsMenu from '../components/store.components/StoreActionsMenu ';
import DocumentViewer from '../components/store.components/DocumentViewer';
import StatusChip from '../components/store.components/StatusChip';
import AdminStoreProfile from '../components/store.components/AdminStoreProfile ';

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
  const [profileViewStoreId, setProfileViewStoreId] = useState(null);

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
            <StoreCard
              key={store._id}
              store={store}
              onViewDetails={setProfileViewStoreId}
              onApprove={approveStore}
              onReject={(store) => {
                setSelectedStore(store);
                setRejectModalOpen(true);
              }}
              onMenuOpen={handleMenuOpen}
              loading={loading}
            />
          ))}
        </div>
      </InfiniteScroll>

      {/* Store Actions Menu */}
      <StoreActionsMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        store={selectedStoreForMenu}
        onBlock={blockStore}
        onUnblock={unblockStore}
      />

      {/* Store Details Modal */}
      <StoreDetailsModal
        open={!!selectedStore}
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onApprove={approveStore}
        onReject={() => setRejectModalOpen(true)}
        onBlockUnblock={(storeId, isBlocked) => {
          if (isBlocked) {
            unblockStore(storeId);
          } else {
            blockStore(storeId);
          }
        }}
        onViewDocument={openDocumentViewer}
        loading={loading}
      />

      {/* Reject Confirmation Modal */}
      <RejectStoreModal
        open={rejectModalOpen}
        store={selectedStore}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={rejectStore}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        loading={loading}
      />

      {/* Document Viewer Dialog */}
      <DocumentViewer
        open={documentViewer.open}
        onClose={() => setDocumentViewer({ ...documentViewer, open: false })}
        documentUrl={documentViewer.url}
        title={documentViewer.title}
      />

      {/* Store Profile View */}
      {profileViewStoreId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-start pt-10">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-y-auto">
            <AdminStoreProfile 
              storeId={profileViewStoreId} 
              onClose={() => setProfileViewStoreId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoreApproval;