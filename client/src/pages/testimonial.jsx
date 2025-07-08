import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box,
  Paper,
  Typography,
  Container,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  InputAdornment,
  Rating,
  useTheme
} from '@mui/material';
import { Add as Plus, Upload, Edit as Pencil, Delete as Trash2, Search, Star, Refresh } from '@mui/icons-material';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDebounce from '../hooks/useDebounce';

const TestimonialForm = ({ onAddTestimonial, isLoading }) => {
  const [newTestimonial, setNewTestimonial] = useState({ 
    name: '', 
    feedback: '', 
    rating: 5, 
    image: null 
  });

  const handleAddTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.feedback || !newTestimonial.image) {
      toast.error('Please provide name, feedback and image');
      return;
    }
    onAddTestimonial(newTestimonial);
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Name"
            value={newTestimonial.name}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
            disabled={isLoading}
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<Upload />}
            sx={{
              p: 1.5,
              minWidth: 120,
              borderStyle: 'dashed',
              display: 'flex',
              flexDirection: 'column',
              height: 56
            }}
            disabled={isLoading}
          >
            {newTestimonial.image ? newTestimonial.image.name : 'Upload'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setNewTestimonial({ 
                ...newTestimonial, 
                image: e.target.files[0] 
              })}
            />
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Feedback"
          multiline
          rows={3}
          value={newTestimonial.feedback}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, feedback: e.target.value })}
          disabled={isLoading}
        />

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Rating
            name="simple-controlled"
            value={newTestimonial.rating}
            onChange={(event, newValue) => {
              setNewTestimonial({ ...newTestimonial, rating: newValue });
            }}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={handleAddTestimonial}
            startIcon={<Plus />}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Testimonial'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const TestimonialTable = React.memo(({ 
  testimonials, 
  onEdit, 
  onDelete, 
  onUpdate, 
  fetchMoreData, 
  hasMore,
  searchTerm,
  setSearchTerm,
  isLoading
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: '',
    feedback: '',
    rating: 5,
    image: null
  });
  const theme = useTheme();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      fetchMoreData(1, true, debouncedSearchTerm);
    } else if (searchTerm === '') {
      fetchMoreData(1, true, '');
    }
  }, [debouncedSearchTerm, fetchMoreData, searchTerm]);

  const handleEdit = useCallback((testimonial) => {
    setEditingId(testimonial._id);
    setEditingData({
      name: testimonial.name,
      feedback: testimonial.feedback,
      rating: testimonial.rating,
      image: null
    });
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <TextField
        fullWidth
        placeholder="Search testimonials..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        disabled={isLoading}
      />
      <InfiniteScroll
        dataLength={testimonials.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        }
        endMessage={
          <Typography variant="body2" align="center" sx={{ p: 2 }}>
            {testimonials.length === 0 ? 'No testimonials found' : 'No more testimonials to load'}
          </Typography>
        }
        height={500}
      >
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Feedback</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Rating</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Image</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial._id} hover>
                <TableCell>
                  {editingId === testimonial._id ? (
                    <TextField
                      fullWidth
                      value={editingData.name}
                      onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                      disabled={isLoading}
                    />
                  ) : (
                    <Typography fontWeight="medium">{testimonial.name}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === testimonial._id ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={editingData.feedback}
                      onChange={(e) => setEditingData({ ...editingData, feedback: e.target.value })}
                      disabled={isLoading}
                    />
                  ) : (
                    <Typography>{testimonial.feedback}</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {editingId === testimonial._id ? (
                    <Rating
                      value={editingData.rating}
                      onChange={(event, newValue) => {
                        setEditingData({ ...editingData, rating: newValue });
                      }}
                      disabled={isLoading}
                    />
                  ) : (
                    <Rating value={testimonial.rating} readOnly />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {testimonial.image && (
                      <Box
                        component="img"
                        src={testimonial.image}
                        alt={testimonial.name}
                        sx={{ width: 56, height: 56, objectFit: 'cover', border: '1px solid #e0e0e0' }}
                      />
                    )}
                    {editingId === testimonial._id && (
                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        startIcon={<Upload />}
                        disabled={isLoading}
                      >
                        Change
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => setEditingData({ 
                            ...editingData, 
                            image: e.target.files[0] 
                          })}
                        />
                      </Button>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {editingId === testimonial._id ? (
                    <Box display="flex" gap={1} justifyContent="center">
                      <Button
                        variant="contained"
                        onClick={() => {
                          onUpdate(testimonial._id, editingData);
                          handleCancel();
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Box display="flex" gap={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEdit(testimonial)}
                        sx={{ color: theme.palette.text.primary }}
                        disabled={isLoading}
                      >
                        <Pencil />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(testimonial._id)}
                        sx={{ color: theme.palette.error.main }}
                        disabled={isLoading}
                      >
                        <Trash2 />
                      </IconButton>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfiniteScroll>
    </TableContainer>
  );
});

const ConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmButtonText, 
  confirmButtonColor,
  isLoading
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color={confirmButtonColor}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    hasMore: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();

  const fetchTestimonials = useCallback(async (page = 1, initialLoad = false, searchTerm = '') => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/testimonials', {
        params: {
          page,
          limit: 10,
          search: searchTerm
        }
      });
      
      const newData = response.data.data || [];

      setTestimonials(prev => initialLoad ? newData : [...prev, ...newData]);
      setPagination({
        page: page + 1,
        hasMore: response.data.pagination?.hasMore || false
      });
      
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to fetch testimonials');
      toast.error('Failed to fetch testimonials');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const loadMoreTestimonials = useCallback(() => {
    if (!pagination.hasMore || isLoading || searchTerm !== '') return;
    fetchTestimonials(pagination.page, false, searchTerm);
  }, [pagination, isLoading, searchTerm, fetchTestimonials]);

  // Initial load and search term effect
  useEffect(() => {
    const controller = new AbortController();
    fetchTestimonials(1, true, searchTerm);
    return () => controller.abort();
  }, [searchTerm]);

  const handleAddTestimonial = useCallback(async (newTestimonial) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', newTestimonial.name);
      formData.append('feedback', newTestimonial.feedback);
      formData.append('rating', newTestimonial.rating);
      formData.append('image', newTestimonial.image);

      await axiosInstance.post('/testimonials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Testimonial added successfully');
      fetchTestimonials(1, true, searchTerm);
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial');
    } finally {
      setIsLoading(false);
    }
  }, [fetchTestimonials, searchTerm]);

  const handleUpdateTestimonial = useCallback(async (id, updatedData) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', updatedData.name);
      formData.append('feedback', updatedData.feedback);
      formData.append('rating', updatedData.rating);
      if (updatedData.image) formData.append('image', updatedData.image);

      await axiosInstance.put(`/testimonials/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Testimonial updated successfully');
      fetchTestimonials(1, true, searchTerm);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    } finally {
      setIsLoading(false);
    }
  }, [fetchTestimonials, searchTerm]);

  const handleDeleteTestimonial = useCallback(async (id) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/testimonials/${id}`);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials(1, true, searchTerm);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    } finally {
      setIsLoading(false);
    }
  }, [fetchTestimonials, searchTerm]);

  const openConfirmationDialog = useCallback((action, id, data = null) => {
    setConfirmAction(action);
    setSelectedId(id);
    setSelectedData(data);
    setConfirmDialogOpen(true);
  }, []);

  const handleConfirmation = useCallback(async () => {
    if (confirmAction === 'delete') {
      await handleDeleteTestimonial(selectedId);
    } else if (confirmAction === 'update' && selectedData) {
      await handleUpdateTestimonial(selectedId, selectedData);
    }
    setConfirmDialogOpen(false);
  }, [confirmAction, selectedId, selectedData, handleDeleteTestimonial, handleUpdateTestimonial]);

  const memoizedTestimonialTable = useMemo(() => (
    <TestimonialTable
      testimonials={testimonials}
      onEdit={(testimonial) => openConfirmationDialog('update', testimonial._id, {
        name: testimonial.name,
        feedback: testimonial.feedback,
        rating: testimonial.rating,
        image: null
      })}
      onDelete={(id) => openConfirmationDialog('delete', id)}
      onUpdate={(id, data) => openConfirmationDialog('update', id, data)}
      fetchMoreData={loadMoreTestimonials}
      hasMore={pagination.hasMore && searchTerm === ''}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      isLoading={isLoading}
    />
  ), [testimonials, pagination.hasMore, searchTerm, loadMoreTestimonials, openConfirmationDialog, isLoading]);

  if (isLoading && testimonials.length === 0 && !error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Testimonials Management
        </Typography>

        <TestimonialForm 
          onAddTestimonial={handleAddTestimonial} 
          isLoading={isLoading}
        />
        
        {error ? (
          <Box display="flex" flexDirection="column" alignItems="center" p={4} gap={2}>
            <Typography color="error">{error}</Typography>
            <Button 
              variant="contained" 
              onClick={() => fetchTestimonials(1, true, searchTerm)}
              startIcon={<Refresh />}
              disabled={isLoading}
            >
              {isLoading ? 'Retrying...' : 'Retry'}
            </Button>
          </Box>
        ) : (
          memoizedTestimonialTable
        )}

        <ConfirmationDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={handleConfirmation}
          title={
            confirmAction === 'delete'
              ? 'Confirm Testimonial Deletion'
              : 'Confirm Testimonial Update'
          }
          message={
            confirmAction === 'delete'
              ? 'Are you sure you want to delete this testimonial?'
              : 'Are you sure you want to update this testimonial?'
          }
          confirmButtonText={confirmAction === 'delete' ? 'Delete' : 'Update'}
          confirmButtonColor={confirmAction === 'delete' ? 'error' : 'primary'}
          isLoading={isLoading}
        />
      </Paper>
    </Container>
  );
};

export default TestimonialsPage;