import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Plus, Upload, Pencil, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AddJobTypes = () => {
  const [jobTypes, setJobTypes] = useState([
    { id: 1, name: 'Plumber', image: '' },
    { id: 2, name: 'Electrician', image: '' },
  ]);
  const [newJob, setNewJob] = useState({ name: '', image: null });
  const [editingId, setEditingId] = useState(null);

  const handleAddJobType = () => {
    if (!newJob.name || !newJob.image) {
      toast.error('Please provide both name and image');
      return;
    }
    const newId = jobTypes.length + 1;
    setJobTypes([...jobTypes, { id: newId, ...newJob }]);
    setNewJob({ name: '', image: null });
    toast.success('Job type added successfully');
  };

  const handleImageChange = (id, image) => {
    const updatedJobTypes = jobTypes.map((job) =>
      job.id === id ? { ...job, image } : job
    );
    setJobTypes(updatedJobTypes);
    toast.success('Image updated successfully');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Job Types</h1>

      {/* Add New Job Type */}
      <div className="mb-6 p-4 border rounded-lg shadow-lg bg-white">
        <h2 className="text-xl mb-2">New Job Type</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Job Type Name"
            value={newJob.name}
            onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
            className="border p-2 rounded-lg flex-grow"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewJob({ ...newJob, image: URL.createObjectURL(e.target.files[0]) })
            }
          />
          <Button variant="contained" color="primary" onClick={handleAddJobType}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Job Types Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Job Type</th>
              <th className="py-3 px-6 text-center">Image</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {jobTypes.map((job) => (
              <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{job.name}</td>
                <td className="py-3 px-6 text-center">
                  {job.image ? (
                    <img
                      src={job.image}
                      alt={job.name}
                      className="w-12 h-12 object-cover mx-auto rounded-full border"
                    />
                  ) : (
                    <Upload className="w-6 h-6 mx-auto text-gray-400" />
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingId === job.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(job.id, URL.createObjectURL(e.target.files[0]))}
                      />
                      <Button
                        size="small"
                        color="success"
                        onClick={() => setEditingId(null)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setEditingId(null)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button size="small" onClick={() => setEditingId(job.id)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddJobTypes;
