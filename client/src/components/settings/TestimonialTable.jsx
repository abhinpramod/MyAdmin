import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  InputAdornment,
  Rating
} from '@mui/material';
import { Pencil, Trash2, Search, Upload } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDebounce from '../../hooks/useDebounce';

const TestimonialTable = ({ 
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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      fetchMoreData(1, true, debouncedSearchTerm);
    } else if (searchTerm === '') {
      fetchMoreData(1, true, '');
    }
  }, [debouncedSearchTerm]);

  const handleEdit = (testimonial) => {
    setEditingId(testimonial._id);
    setEditingData({
      name: testimonial.name,
      feedback: testimonial.feedback,
      rating: testimonial.rating,
      image: null
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

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
              <Search size={20} />
            </InputAdornment>
          ),
        }}
        disabled={isLoading}
      />
      <InfiniteScroll
        dataLength={testimonials.length}
        next={() => {
          if (searchTerm === '') {
            fetchMoreData(null, false, '');
          }
        }}
        hasMore={hasMore && searchTerm === ''}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        }
        endMessage={
          <Typography variant="body2" align="center" sx={{ p: 2 }}>
            {testimonials.length === 0 ? 'No testimonials found' : 
             searchTerm ? 'End of search results' : 'No more testimonials to load'}
          </Typography>
        }
        height={500}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
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
                        startIcon={<Upload size={16} />}
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
                        sx={{ color: 'text.primary' }}
                        disabled={isLoading}
                      >
                        <Pencil size={20} />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(testimonial._id)}
                        sx={{ color: 'error.main' }}
                        disabled={isLoading}
                      >
                        <Trash2 size={20} />
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
};

export default TestimonialTable;