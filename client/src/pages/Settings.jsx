import React, { useState, useEffect } from 'react';
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
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Rating
} from '@mui/material';
import { Plus, Upload, Pencil, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/aixos';
import InfiniteScroll from 'react-infinite-scroll-component';

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const JobTypeForm = ({ onAddJobType, isLoading }) => {
  const [newJob, setNewJob] = useState({ name: '', image: null });

  const handleAddJobType = () => {
    if (!newJob.name || !newJob.image) {
      toast.error('Please provide both name and image');
      return;
    }
    onAddJobType(newJob);
    setNewJob({ name: '', image: null });
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Job Type Name"
          value={newJob.name}
          onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
          disabled={isLoading}
        />
        <Button
          variant="outlined"
          component="label"
          startIcon={<Upload size={20} />}
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
          {newJob.image ? newJob.image.name : 'Upload'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setNewJob({ ...newJob, image: e.target.files[0] })}
          />
        </Button>
        <IconButton
          onClick={handleAddJobType}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
          disabled={isLoading}
        >
          <Plus size={24} />
        </IconButton>
      </Box>
    </Paper>
  );
};

const JobTypeTable = ({ 
  jobTypes, 
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
  const [editingName, setEditingName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      fetchMoreData(1, true, debouncedSearchTerm);
    } else if (searchTerm === '') {
      fetchMoreData(1, true, '');
    }
  }, [debouncedSearchTerm]);

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleCancel = () => {
    setEditingId(null);
    setSelectedImage(null);
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <TextField
        fullWidth
        placeholder="Search job types..."
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
        dataLength={jobTypes.length}
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
            {jobTypes.length === 0 ? 'No job types found' : 
             searchTerm ? 'End of search results' : 'No more job types to load'}
          </Typography>
        }
        height={500}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Job Type</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Image</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobTypes.map((job) => (
              <TableRow key={job._id} hover>
                <TableCell>
                  {editingId === job._id ? (
                    <TextField
                      fullWidth
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      disabled={isLoading}
                    />
                  ) : (
                    <Typography fontWeight="medium">{job.name}</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {job.image && (
                      <Box
                        component="img"
                        src={job.image}
                        alt={job.name}
                        sx={{ width: 56, height: 56, objectFit: 'cover', border: '1px solid #e0e0e0' }}
                      />
                    )}
                    {editingId === job._id && (
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
                          onChange={(e) => setSelectedImage({ id: job._id, file: e.target.files[0] })}
                        />
                      </Button>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {editingId === job._id ? (
                    <Box display="flex" gap={1} justifyContent="center">
                      <Button
                        variant="contained"
                        onClick={() => {
                          onUpdate(job._id, editingName, selectedImage);
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
                        onClick={() => handleEdit(job._id, job.name)}
                        sx={{ color: 'text.primary' }}
                        disabled={isLoading}
                      >
                        <Pencil size={20} />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(job._id)}
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

const ProductTypeForm = ({ onAddProductType, isLoading }) => {
  const [newProduct, setNewProduct] = useState({ name: '', image: null });

  const handleAddProductType = () => {
    if (!newProduct.name || !newProduct.image) {
      toast.error('Please provide both name and image');
      return;
    }
    onAddProductType(newProduct);
    setNewProduct({ name: '', image: null });
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Product Type Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          disabled={isLoading}
        />
        <Button
          variant="outlined"
          component="label"
          startIcon={<Upload size={20} />}
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
          {newProduct.image ? newProduct.image.name : 'Upload'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
          />
        </Button>
        <IconButton
          onClick={handleAddProductType}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
          disabled={isLoading}
        >
          <Plus size={24} />
        </IconButton>
      </Box>
    </Paper>
  );
};

const ProductTypeTable = ({ 
  productTypes, 
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
  const [editingName, setEditingName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      fetchMoreData(1, true, debouncedSearchTerm);
    } else if (searchTerm === '') {
      fetchMoreData(1, true, '');
    }
  }, [debouncedSearchTerm]);

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleCancel = () => {
    setEditingId(null);
    setSelectedImage(null);
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <TextField
        fullWidth
        placeholder="Search product types..."
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
        dataLength={productTypes.length}
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
            {productTypes.length === 0 ? 'No product types found' : 
             searchTerm ? 'End of search results' : 'No more product types to load'}
          </Typography>
        }
        height={500}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Type</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Image</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productTypes.map((product) => (
              <TableRow key={product._id} hover>
                <TableCell>
                  {editingId === product._id ? (
                    <TextField
                      fullWidth
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      disabled={isLoading}
                    />
                  ) : (
                    <Typography fontWeight="medium">{product.name}</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {product.image && (
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{ width: 56, height: 56, objectFit: 'cover', border: '1px solid #e0e0e0' }}
                      />
                    )}
                    {editingId === product._id && (
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
                          onChange={(e) => setSelectedImage({ id: product._id, file: e.target.files[0] })}
                        />
                      </Button>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {editingId === product._id ? (
                    <Box display="flex" gap={1} justifyContent="center">
                      <Button
                        variant="contained"
                        onClick={() => {
                          onUpdate(product._id, editingName, selectedImage);
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
                        onClick={() => handleEdit(product._id, product.name)}
                        sx={{ color: 'text.primary' }}
                        disabled={isLoading}
                      >
                        <Pencil size={20} />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(product._id)}
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
    setNewTestimonial({ name: '', feedback: '', rating: 5, image: null });
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
            startIcon={<Upload size={20} />}
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
            startIcon={<Plus size={20} />}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Testimonial'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

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

const SettingsPage = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  
  // State for expanded sections
  const [expandedJobTypes, setExpandedJobTypes] = useState(false);
  const [expandedProductTypes, setExpandedProductTypes] = useState(false);
  const [expandedTestimonials, setExpandedTestimonials] = useState(false);
  
  // Pagination state
  const [jobTypePage, setJobTypePage] = useState(1);
  const [productTypePage, setProductTypePage] = useState(1);
  const [testimonialPage, setTestimonialPage] = useState(1);
  const [hasMoreJobTypes, setHasMoreJobTypes] = useState(true);
  const [hasMoreProductTypes, setHasMoreProductTypes] = useState(true);
  const [hasMoreTestimonials, setHasMoreTestimonials] = useState(true);
  
  // Search state
  const [jobTypeSearchTerm, setJobTypeSearchTerm] = useState('');
  const [productTypeSearchTerm, setProductTypeSearchTerm] = useState('');
  const [testimonialSearchTerm, setTestimonialSearchTerm] = useState('');

  // Fetch job types
  const fetchJobTypes = async (page = 1, initialLoad = false, searchTerm = '') => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/settings/get-all-job-types`,
        {
          params: {
            page,
            limit: 10,
            search: searchTerm
          }
        }
      );
      
      const newData = Array.isArray(response.data.data) ? response.data.data : [];
      
      if (initialLoad || searchTerm !== '') {
        setJobTypes(newData);
        setJobTypePage(2);
      } else {
        setJobTypes(prev => [...prev, ...newData]);
        setJobTypePage(prev => prev + 1);
      }
      
      setHasMoreJobTypes(response.data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Error fetching job types:', error);
      toast.error('Failed to fetch job types');
      setJobTypes([]);
      setHasMoreJobTypes(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch product types
  const fetchProductTypes = async (page = 1, initialLoad = false, searchTerm = '') => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/settings/get-all-product-types`,
        {
          params: {
            page,
            limit: 10,
            search: searchTerm
          }
        }
      );
      
      const newData = Array.isArray(response.data.data) ? response.data.data : [];
      
      if (initialLoad || searchTerm !== '') {
        setProductTypes(newData);
        setProductTypePage(2);
      } else {
        setProductTypes(prev => [...prev, ...newData]);
        setProductTypePage(prev => prev + 1);
      }
      
      setHasMoreProductTypes(response.data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Error fetching product types:', error);
      toast.error('Failed to fetch product types');
      setProductTypes([]);
      setHasMoreProductTypes(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch testimonials
  const fetchTestimonials = async (page = 1, initialLoad = false, searchTerm = '') => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/testimonials`,
        {
          params: {
            page,
            limit: 10,
            search: searchTerm
          }
        }
      );
      
      const newData = Array.isArray(response.data.data) ? response.data.data : [];
      
      if (initialLoad || searchTerm !== '') {
        setTestimonials(newData);
        setTestimonialPage(2);
      } else {
        setTestimonials(prev => [...prev, ...newData]);
        setTestimonialPage(prev => prev + 1);
      }
      
      setHasMoreTestimonials(response.data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
      setTestimonials([]);
      setHasMoreTestimonials(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreJobTypes = (page = null, initialLoad = false, searchTerm = '') => {
    if (!isLoading && (hasMoreJobTypes || initialLoad)) {
      const nextPage = page || jobTypePage;
      fetchJobTypes(nextPage, initialLoad, searchTerm);
    }
  };

  const loadMoreProductTypes = (page = null, initialLoad = false, searchTerm = '') => {
    if (!isLoading && (hasMoreProductTypes || initialLoad)) {
      const nextPage = page || productTypePage;
      fetchProductTypes(nextPage, initialLoad, searchTerm);
    }
  };

  const loadMoreTestimonials = (page = null, initialLoad = false, searchTerm = '') => {
    if (!isLoading && (hasMoreTestimonials || initialLoad)) {
      const nextPage = page || testimonialPage;
      fetchTestimonials(nextPage, initialLoad, searchTerm);
    }
  };

  // Add job type
  const handleAddJobType = async (newJob) => {
    const formData = new FormData();
    formData.append('name', newJob.name);
    formData.append('image', newJob.image);

    try {
      setIsLoading(true);
      await axiosInstance.post('/settings/add-job-type', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Job type added successfully');
      loadMoreJobTypes(1, true, jobTypeSearchTerm);
    } catch (error) {
      console.error('Error adding job type:', error);
      toast.error('Failed to add job type');
    } finally {
      setIsLoading(false);
    }
  };

  // Add product type
  const handleAddProductType = async (newProduct) => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('image', newProduct.image);

    try {
      setIsLoading(true);
      await axiosInstance.post('/settings/add-product-type', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Product type added successfully');
      loadMoreProductTypes(1, true, productTypeSearchTerm);
    } catch (error) {
      console.error('Error adding product type:', error);
      toast.error('Failed to add product type');
    } finally {
      setIsLoading(false);
    }
  };

  // Add testimonial
  const handleAddTestimonial = async (newTestimonial) => {
    const formData = new FormData();
    formData.append('name', newTestimonial.name);
    formData.append('feedback', newTestimonial.feedback);
    formData.append('rating', newTestimonial.rating);
    formData.append('image', newTestimonial.image);

    try {
      setIsLoading(true);
      await axiosInstance.post('/testimonials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Testimonial added successfully');
      loadMoreTestimonials(1, true, testimonialSearchTerm);
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  // Update entity
  const handleUpdateEntity = async (id, data) => {
    let endpoint;
    let formData = new FormData();
    
    if (expandedJobTypes) {
      endpoint = `/settings/editjobtype/${id}`;
      formData.append('name', data.name);
      if (data.image) formData.append('image', data.image.file);
    } else if (expandedProductTypes) {
      endpoint = `/settings/editproducttype/${id}`;
      formData.append('name', data.name);
      if (data.image) formData.append('image', data.image.file);
    } else if (expandedTestimonials) {
      endpoint = `/testimonials/${id}`;
      formData.append('name', data.name);
      formData.append('feedback', data.feedback);
      formData.append('rating', data.rating);
      if (data.image) formData.append('image', data.image);
    }

    try {
      setIsLoading(true);
      await axiosInstance.put(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const successMessage = expandedJobTypes 
        ? 'Job type updated successfully'
        : expandedProductTypes
          ? 'Product type updated successfully'
          : 'Testimonial updated successfully';
      
      toast.success(successMessage);
      
      if (expandedJobTypes) {
        loadMoreJobTypes(1, true, jobTypeSearchTerm);
      } else if (expandedProductTypes) {
        loadMoreProductTypes(1, true, productTypeSearchTerm);
      } else if (expandedTestimonials) {
        loadMoreTestimonials(1, true, testimonialSearchTerm);
      }
    } catch (error) {
      console.error('Error updating entity:', error);
      toast.error('Failed to update entity');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete entity
  const handleDeleteEntity = async (id) => {
    let endpoint;
    
    if (expandedJobTypes) {
      endpoint = `/settings/deletejobtype/${id}`;
    } else if (expandedProductTypes) {
      endpoint = `/settings/deleteproducttype/${id}`;
    } else if (expandedTestimonials) {
      endpoint = `/testimonials/${id}`;
    }

    try {
      setIsLoading(true);
      await axiosInstance.delete(endpoint);
      
      const successMessage = expandedJobTypes 
        ? 'Job type deleted successfully'
        : expandedProductTypes
          ? 'Product type deleted successfully'
          : 'Testimonial deleted successfully';
      
      toast.success(successMessage);
      
      if (expandedJobTypes) {
        loadMoreJobTypes(1, true, jobTypeSearchTerm);
      } else if (expandedProductTypes) {
        loadMoreProductTypes(1, true, productTypeSearchTerm);
      } else if (expandedTestimonials) {
        loadMoreTestimonials(1, true, testimonialSearchTerm);
      }
    } catch (error) {
      console.error('Error deleting entity:', error);
      toast.error('Failed to delete entity');
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmationDialog = (action, id, data = null) => {
    setConfirmAction(action);
    setSelectedId(id);
    setSelectedData(data);
    setConfirmDialogOpen(true);
  };

  const handleConfirmation = async () => {
    if (confirmAction === 'delete') {
      await handleDeleteEntity(selectedId);
    } else if (confirmAction === 'update' && selectedData) {
      await handleUpdateEntity(selectedId, selectedData);
    }
    setConfirmDialogOpen(false);
  };

  useEffect(() => {
    if (expandedJobTypes) {
      loadMoreJobTypes(1, true);
    }
    if (expandedProductTypes) {
      loadMoreProductTypes(1, true);
    }
    if (expandedTestimonials) {
      loadMoreTestimonials(1, true);
    }
  }, [expandedJobTypes, expandedProductTypes, expandedTestimonials]);

  if (isLoading && jobTypes.length === 0 && productTypes.length === 0 && testimonials.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Settings Management
      </Typography>
      
      <Paper elevation={3} sx={{ mb: 3 }}>
        <List>
          {/* Job Types Section */}
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setExpandedJobTypes(!expandedJobTypes)}
              sx={{ px: 3, py: 2 }}
            >
              <ListItemText 
                primary="Manage Job Types" 
                primaryTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}
              />
              {expandedJobTypes ? <ChevronUp /> : <ChevronDown />}
            </ListItemButton>
          </ListItem>
          <Collapse in={expandedJobTypes} timeout="auto" unmountOnExit>
            <Box sx={{ px: 3, pb: 3 }}>
              <JobTypeForm onAddJobType={handleAddJobType} isLoading={isLoading} />
              <JobTypeTable
                jobTypes={jobTypes}
                onEdit={(id, name) => openConfirmationDialog('update', id, { name })}
                onDelete={(id) => openConfirmationDialog('delete', id)}
                onUpdate={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
                fetchMoreData={loadMoreJobTypes}
                hasMore={hasMoreJobTypes && jobTypeSearchTerm === ''}
                searchTerm={jobTypeSearchTerm}
                setSearchTerm={setJobTypeSearchTerm}
                isLoading={isLoading}
              />
            </Box>
          </Collapse>
          
          <Divider />
          
          {/* Product Types Section */}
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setExpandedProductTypes(!expandedProductTypes)}
              sx={{ px: 3, py: 2 }}
            >
              <ListItemText 
                primary="Manage Product Types" 
                primaryTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}
              />
              {expandedProductTypes ? <ChevronUp /> : <ChevronDown />}
            </ListItemButton>
          </ListItem>
          <Collapse in={expandedProductTypes} timeout="auto" unmountOnExit>
            <Box sx={{ px: 3, pb: 3 }}>
              <ProductTypeForm onAddProductType={handleAddProductType} isLoading={isLoading} />
              <ProductTypeTable
                productTypes={productTypes}
                onEdit={(id, name) => openConfirmationDialog('update', id, { name })}
                onDelete={(id) => openConfirmationDialog('delete', id)}
                onUpdate={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
                fetchMoreData={loadMoreProductTypes}
                hasMore={hasMoreProductTypes && productTypeSearchTerm === ''}
                searchTerm={productTypeSearchTerm}
                setSearchTerm={setProductTypeSearchTerm}
                isLoading={isLoading}
              />
            </Box>
          </Collapse>

          <Divider />

          {/* Testimonials Section */}
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setExpandedTestimonials(!expandedTestimonials)}
              sx={{ px: 3, py: 2 }}
            >
              <ListItemText 
                primary="Manage Testimonials" 
                primaryTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}
              />
              {expandedTestimonials ? <ChevronUp /> : <ChevronDown />}
            </ListItemButton>
          </ListItem>
          <Collapse in={expandedTestimonials} timeout="auto" unmountOnExit>
            <Box sx={{ px: 3, pb: 3 }}>
              <TestimonialForm onAddTestimonial={handleAddTestimonial} isLoading={isLoading} />
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
                hasMore={hasMoreTestimonials && testimonialSearchTerm === ''}
                searchTerm={testimonialSearchTerm}
                setSearchTerm={setTestimonialSearchTerm}
                isLoading={isLoading}
              />
            </Box>
          </Collapse>
        </List>
      </Paper>

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmation}
        title={
          confirmAction === 'delete'
            ? expandedJobTypes 
              ? 'Confirm Job Type Deletion'
              : expandedProductTypes
                ? 'Confirm Product Type Deletion'
                : 'Confirm Testimonial Deletion'
            : expandedJobTypes
              ? 'Confirm Job Type Update'
              : expandedProductTypes
                ? 'Confirm Product Type Update'
                : 'Confirm Testimonial Update'
        }
        message={
          confirmAction === 'delete'
            ? expandedJobTypes
              ? 'Are you sure you want to delete this job type?'
              : expandedProductTypes
                ? 'Are you sure you want to delete this product type?'
                : 'Are you sure you want to delete this testimonial?'
            : expandedJobTypes
              ? 'Are you sure you want to update this job type?'
              : expandedProductTypes
                ? 'Are you sure you want to update this product type?'
                : 'Are you sure you want to update this testimonial?'
        }
        confirmButtonText={confirmAction === 'delete' ? 'Delete' : 'Update'}
        confirmButtonColor={confirmAction === 'delete' ? 'error' : 'primary'}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default SettingsPage;