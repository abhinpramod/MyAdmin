import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
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
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Job Type Name"
          value={newJob.name}
          onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
        />
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
        <IconButton
          onClick={handleAddJobType}
          className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-9 h-9" />
        </IconButton>
      </div>
    </div>
  );
};

export default JobTypeForm;