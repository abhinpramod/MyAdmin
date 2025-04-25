import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Rating
} from '@mui/material';
import { Plus, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

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

export default TestimonialForm;