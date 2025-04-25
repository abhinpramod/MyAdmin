import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { Plus, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

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

export default ProductTypeForm;