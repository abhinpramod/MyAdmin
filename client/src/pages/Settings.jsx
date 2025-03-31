import React, { useState, useEffect } from 'react';
import { 
  Box,
  Tab,
  Tabs,
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
  InputAdornment
} from '@mui/material';
import { Plus, Upload, Pencil, Trash2, Search } from 'lucide-react';
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const JobTypeForm = ({ onAddJobType }) => {
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
  setSearchTerm
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
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Box display="flex" gap={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEdit(job._id, job.name)}
                        sx={{ color: 'text.primary' }}
                      >
                        <Pencil size={20} />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(job._id)}
                        sx={{ color: 'error.main' }}
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

const ProductTypeForm = ({ onAddProductType }) => {
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
  setSearchTerm
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
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Box display="flex" gap={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleEdit(product._id, product.name)}
                        sx={{ color: 'text.primary' }}
                      >
                        <Pencil size={20} />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(product._id)}
                        sx={{ color: 'error.main' }}
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
  confirmButtonColor 
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color={confirmButtonColor}
          variant="contained"
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SettingsPage = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Pagination state
  const [jobTypePage, setJobTypePage] = useState(1);
  const [productTypePage, setProductTypePage] = useState(1);
  const [hasMoreJobTypes, setHasMoreJobTypes] = useState(true);
  const [hasMoreProductTypes, setHasMoreProductTypes] = useState(true);
  
  // Search state
  const [jobTypeSearchTerm, setJobTypeSearchTerm] = useState('');
  const [productTypeSearchTerm, setProductTypeSearchTerm] = useState('');

  // Add the missing handleTabChange function
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset search terms when changing tabs
    setJobTypeSearchTerm('');
    setProductTypeSearchTerm('');
  };

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

  const handleUpdateEntity = async (id, name, image) => {
    const endpoint = tabValue === 0 
      ? `/settings/editjobtype/${id}` 
      : `/settings/editproducttype/${id}`;
    
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image.file);

    try {
      setIsLoading(true);
      await axiosInstance.put(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`${tabValue === 0 ? 'Job' : 'Product'} type updated successfully`);
      tabValue === 0 
        ? loadMoreJobTypes(1, true, jobTypeSearchTerm) 
        : loadMoreProductTypes(1, true, productTypeSearchTerm);
    } catch (error) {
      console.error(`Error updating ${tabValue === 0 ? 'job' : 'product'} type:`, error);
      toast.error(`Failed to update ${tabValue === 0 ? 'job' : 'product'} type`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntity = async (id) => {
    const endpoint = tabValue === 0 
      ? `/settings/deletejobtype/${id}` 
      : `/settings/deleteproducttype/${id}`;

    try {
      setIsLoading(true);
      await axiosInstance.delete(endpoint);
      toast.success(`${tabValue === 0 ? 'Job' : 'Product'} type deleted successfully`);
      tabValue === 0 
        ? loadMoreJobTypes(1, true, jobTypeSearchTerm) 
        : loadMoreProductTypes(1, true, productTypeSearchTerm);
    } catch (error) {
      console.error(`Error deleting ${tabValue === 0 ? 'job' : 'product'} type:`, error);
      toast.error(`Failed to delete ${tabValue === 0 ? 'job' : 'product'} type`);
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
      const { name, image } = selectedData;
      await handleUpdateEntity(selectedId, name, image);
    }
    setConfirmDialogOpen(false);
  };

  useEffect(() => {
    loadMoreJobTypes(1, true);
    loadMoreProductTypes(1, true);
  }, []);

  if (isLoading && jobTypes.length === 0 && productTypes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Settings Management
        </Typography>
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="settings tabs"
            >
              <Tab label="Manage Job Types" {...a11yProps(0)} />
              <Tab label="Manage Product Types" {...a11yProps(1)} />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <JobTypeForm onAddJobType={handleAddJobType} />
            <JobTypeTable
              jobTypes={jobTypes}
              onEdit={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
              onDelete={(id) => openConfirmationDialog('delete', id)}
              onUpdate={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
              fetchMoreData={loadMoreJobTypes}
              hasMore={hasMoreJobTypes && jobTypeSearchTerm === ''}
              searchTerm={jobTypeSearchTerm}
              setSearchTerm={setJobTypeSearchTerm}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <ProductTypeForm onAddProductType={handleAddProductType} />
            <ProductTypeTable
              productTypes={productTypes}
              onEdit={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
              onDelete={(id) => openConfirmationDialog('delete', id)}
              onUpdate={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
              fetchMoreData={loadMoreProductTypes}
              hasMore={hasMoreProductTypes && productTypeSearchTerm === ''}
              searchTerm={productTypeSearchTerm}
              setSearchTerm={setProductTypeSearchTerm}
            />
          </TabPanel>
        </Box>

        <ConfirmationDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={handleConfirmation}
          title={
            confirmAction === 'delete'
              ? `Confirm ${tabValue === 0 ? 'Job' : 'Product'} Type Deletion`
              : `Confirm ${tabValue === 0 ? 'Job' : 'Product'} Type Update`
          }
          message={
            confirmAction === 'delete'
              ? `Are you sure you want to delete this ${tabValue === 0 ? 'job' : 'product'} type?`
              : `Are you sure you want to update this ${tabValue === 0 ? 'job' : 'product'} type?`
          }
          confirmButtonText={confirmAction === 'delete' ? 'Delete' : 'Update'}
          confirmButtonColor={confirmAction === 'delete' ? 'error' : 'primary'}
        />
      </Paper>
    </Container>
  );
};

export default SettingsPage;