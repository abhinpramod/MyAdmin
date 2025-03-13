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
import { Plus, Upload, Pencil,Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/aixos';

const AddJobTypes = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [newJob, setNewJob] = useState({ name: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);


  // Fetch job types
  const fetchJobTypes = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/settings/get-all-job-types');
      setJobTypes(Array.isArray(response.data) ? response.data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching job types:', error);
      setIsLoading(false);
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
      setIsLoading(true);
      await axiosInstance.post('/settings/add-job-type', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast.success('Job type added successfully');
      setNewJob({ name: '', image: null });
      fetchJobTypes();
      setIsLoading(false);
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

  if (isloading) {
    return (
      <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
        
        
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-white shadow-lg rounded-2xl max-w-4xl border border-gray-100">
    {/* Header */}
    <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Add Job Types</h1>
  
    {/* Add New Job Type */}
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
      <div className="flex items-center gap-4">
        {/* Job Name Input */}
        <input
          type="text"
          placeholder="Job Type Name"
          value={newJob.name}
          onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
        />
        {/* Image Upload with Preview */}
        <div className="relative w-30 h-30 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-white hover:border-gray-400 transition-colors">
          {newJob.image ? (
            <img src={URL.createObjectURL(newJob.image)} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Upload className="w-9 h-9 text-gray-400" />
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setNewJob({ ...newJob, image: e.target.files[0] })}
          />
        </div>
        {/* Add Button */}
        <IconButton
          onClick={() => handleAddJobType(newJob)}
          className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-9 h-9" />
        </IconButton>
      </div>
    </div>
  
    {/* Job Types Table */}
    <div className="overflow-x-auto">
      <TableContainer component={Paper} className="shadow-sm border border-gray-200">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-bold  text-gray-900"> <strong>Job Type</strong></TableCell>
              <TableCell className="font-bold text-gray-900" align="center"> <strong>Image</strong></TableCell>
              <TableCell className="font-bold text-gray-900" align="center">  <strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(jobTypes) && jobTypes.length > 0 ? (
              jobTypes.map((job) => (
                <TableRow key={job._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="text-gray-900 font-bold">{job.name}</TableCell>
                  <TableCell align="center">
                    {job.image ? (
                      <img
                        src={job.image}
                        alt={job.name}
                        className="w-30 h-30 object-cover mx-auto border-2 border-gray-200"
                      />
                    ) : (
                      <Upload className="w-6 h-6 mx-auto text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {editingId === job._id ? (
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                          onChange={(e) => handleImageChange(job._id, e.target.files[0])}
                        />
                      </div>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => setEditingId(job._id)}
                        className="text-gray-900 hover:bg-gray-200 rounded-full p-2"
                      >
                        <Pencil className="w-7 h-7 text-gray-800" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" className="text-gray-500 py-6">
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
      <DialogTitle className="text-gray-900 font-semibold">Confirm Update</DialogTitle>
      <DialogContent>
        <p className="text-gray-700">Are you sure you want to save this image?</p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setConfirmDialogOpen(false)}
          className="text-gray-900 hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmUpdate}
          className="bg-gray-900 text-white hover:bg-gray-700"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </div>
  );
};

export default AddJobTypes;
