import React, { useState } from 'react';
import { 
  Box,
  Paper,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { Plus, Upload } from 'lucide-react';

const ImageUploadForm = ({ 
  title, 
  onSubmit, 
  isLoading,
  initialValues,
  children 
}) => {
  const [formData, setFormData] = useState(initialValues || { name: '', image: null });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData(initialValues || { name: '', image: null });
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={`${title} Name`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            {formData.image ? formData.image.name : 'Upload'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
          </Button>
          <IconButton
            onClick={handleSubmit}
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
        
        {children && React.cloneElement(children, { 
          formData, 
          setFormData,
          isLoading 
        })}
      </Box>
    </Paper>
  );
};

export default ImageUploadForm;