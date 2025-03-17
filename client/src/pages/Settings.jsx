import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/aixos';
import JobTypeForm from '../components/settings/JobTypeForm';
import JobTypeTable from '../components/settings/JobTypeTable';
import ConfirmationDialog from '../components/ConfirmationDialog';

const AddJobTypes = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobData, setSelectedJobData] = useState(null); // For edit action

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

  const handleAddJobType = async (newJob) => {
    const formData = new FormData();
    formData.append('name', newJob.name);
    formData.append('image', newJob.image);

    try {
      setIsLoading(true);
      await axiosInstance.post('/settings/add-job-type', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Job type added successfully');
      fetchJobTypes();
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding job type:', error);
      toast.error('Failed to add job type');
      setIsLoading(false);
    }
  };

  const handleEditJobType = async (id, name, image) => {
    const formData = new FormData();
    if (name) formData.append('name', name);
    if (image) formData.append('image', image.file);

    try {
      setIsLoading(true);
      await axiosInstance.put(`/settings/editjobtype/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Job type updated successfully');
      fetchJobTypes();
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating job type:', error);
      toast.error('Failed to update job type');
      setIsLoading(false);
    }
  };

  const handleDeleteJobType = async (id) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/settings/deletejobtype/${id}`);
      toast.success('Job type deleted successfully');
      fetchJobTypes();
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting job type:', error);
      toast.error('Failed to delete job type');
      setIsLoading(false);
    }
  };

  const openConfirmationDialog = (action, id, data = null) => {
    setConfirmAction(action);
    setSelectedJobId(id);
    setSelectedJobData(data); // For edit action
    setConfirmDialogOpen(true);
  };

  const handleConfirmation = async () => {
    if (confirmAction === 'delete') {
      await handleDeleteJobType(selectedJobId);
    } else if (confirmAction === 'update' && selectedJobData) {
      const { name, image } = selectedJobData;
      await handleEditJobType(selectedJobId, name, image);
    }
    setConfirmDialogOpen(false);
    setConfirmAction(null);
    setSelectedJobId(null);
    setSelectedJobData(null);
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
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Add Job Types</h1>
      <JobTypeForm onAddJobType={handleAddJobType} />
      <JobTypeTable
        jobTypes={jobTypes}
        onEdit={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
        onDelete={(id) => openConfirmationDialog('delete', id)}
        onUpdate={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
      />

      {/* Reusable Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmation}
        title={
          confirmAction === 'delete'
            ? 'Confirm Deletion'
            : 'Confirm Update'
        }
        message={
          confirmAction === 'delete'
            ? 'Are you sure you want to delete this job type?'
            : 'Are you sure you want to update this job type?'
        }
        confirmButtonText={
          confirmAction === 'delete' ? 'Delete' : 'Update'
        }
        confirmButtonColor={
          confirmAction === 'delete' ? 'error' : 'primary'
        }
      />
    </div>
  );
};

export default AddJobTypes;