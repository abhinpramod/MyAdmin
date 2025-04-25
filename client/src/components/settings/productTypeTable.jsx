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
  InputAdornment
} from '@mui/material';
import { Pencil, Trash2, Search, Upload } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDebounce from '../../hooks/useDebounce';

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

export default ProductTypeTable;