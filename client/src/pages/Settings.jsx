import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Plus, Upload, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/aixos';

const AddJobTypes = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [newJob, setNewJob] = useState({ name: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  

  // Fetch job types
  const fetchJobTypes = async () => {
    try {
      const response = await axiosInstance.get('/settings/get-all-job-types');
      setJobTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching job types:', error);
      toast.error('Failed to fetch job types');
      setJobTypes([]);
    }
  };

  // Handle adding a new job type
  const handleAddJobType = async () => {
    if (!newJob.name || !newJob.image) {
      toast.error('Please provide both name and image');
      return;
    }
  
    // Create FormData and append values
    const formData = new FormData();
    formData.append('name', newJob.name);
    formData.append('image', newJob.image);
  
    // ✅ Log FormData content for debugging
    for (const pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    console.log('Adding job type:', formData);
  
    try {
      await axiosInstance.post('/settings/add-job-type', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast.success('Job type added successfully');
      setNewJob({ name: '', image: null });
      fetchJobTypes();
    } catch (error) {
      console.error('Error adding job type:', error);
      toast.error('Failed to add job type');
    }
  };
  

  // Handle image change for existing job types
  const handleImageChange = (id, file) => {
    setSelectedImage({ id, file });
    setConfirmDialogOpen(true);
  };

  // Confirm image update
  const handleConfirmUpdate = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage.file);

      try {
        // await axios.put(`/api/job-types/${selectedImage.id}/image`, formData);
       await axiosInstance.put(`/settings/editjobtype/${selectedImage.id}`, formData)
        toast.success('Image updated successfully');
        fetchJobTypes();
      } catch (error) {
        console.error('Error updating image:', error);
        toast.error('Failed to update image');
      } finally {
        setSelectedImage(null);
        setEditingId(null);
        setConfirmDialogOpen(false);
      }
    }
  };

  useEffect(() => {
    fetchJobTypes();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Add Job Types</h1>

      {/* Add New Job Type */}
      <div className="mb-6 p-4 border border-gray-300 rounded-md">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Job Type Name"
            value={newJob.name}
            onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewJob({ ...newJob, image: e.target.files[0] })}
          />
          <IconButton variant="contained" onClick={handleAddJobType}>
            <Plus className="w-7 h-7" color="oklch(0.147 0.004 49.25)" />
          </IconButton>
        </div>
      </div>

      {/* Job Types Table */}
      <div className="overflow-x-auto">
        <TableContainer component={Paper}>
          <Table className="min-w-full">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Job Type</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(jobTypes) && jobTypes.length > 0 ? (
                jobTypes.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.name}</TableCell>
                    <TableCell align="center">
                      {job.image ? (
                        <img
                          src={job.image}
                          alt={job.name}
                          className="w-12 h-12 object-cover mx-auto rounded-full border"
                        />
                      ) : (
                        <Upload className="w-6 h-6 mx-auto text-gray-500" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {editingId === job.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(job.id, e.target.files[0])}
                          />
                        </div>
                      ) : (
                        <Button size="small" onClick={() => setEditingId(job.id)}>
                          <Pencil className="w-4 h-4" color="oklch(0.147 0.004 49.25)" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No job types found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to save this image?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddJobTypes;
