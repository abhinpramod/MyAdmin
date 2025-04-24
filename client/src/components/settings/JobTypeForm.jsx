import React, { useState } from 'react';
import { 
  Box,
  Paper,
  IconButton,
  Button,
  TextField
} from '@mui/material';
import { Plus, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

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

export default JobTypeForm;