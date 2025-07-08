import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  List
} from '@mui/material';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import ConfirmationDialog from '../components/settings/ConfirmationDialog';
import ExpandableSection from '../components/settings/ExpandableSection';
import JobTypeForm from '../components/settings/JobTypeForm';
import JobTypeTable from '../components/settings/JobTypeTable';
import ProductTypeForm from '../components/settings/ProductTypeForm';
import ProductTypeTable from '../components/settings/ProductTypeTable';
import TestimonialForm from '../components/settings/TestimonialForm';
import TestimonialTable from '../components/settings/TestimonialTable';

const SettingsPage = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  
  const [expandedJobTypes, setExpandedJobTypes] = useState(false);
  const [expandedProductTypes, setExpandedProductTypes] = useState(false);
  const [expandedTestimonials, setExpandedTestimonials] = useState(false);
  
  const [jobTypePage, setJobTypePage] = useState(1);
  const [productTypePage, setProductTypePage] = useState(1);
  const [testimonialPage, setTestimonialPage] = useState(1);
  const [hasMoreJobTypes, setHasMoreJobTypes] = useState(true);
  const [hasMoreProductTypes, setHasMoreProductTypes] = useState(true);
  const [hasMoreTestimonials, setHasMoreTestimonials] = useState(true);
  
  const [jobTypeSearchTerm, setJobTypeSearchTerm] = useState('');
  const [productTypeSearchTerm, setProductTypeSearchTerm] = useState('');
  const [testimonialSearchTerm, setTestimonialSearchTerm] = useState('');

  const fetchJobTypes = async (page = 1, initialLoad = false, searchTerm = '') => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/settings/get-all-job-types`,
        {
          params: {
            page,
            limit: 10,
            search: searchTerm
          }
        }
      );
      
      const newData = Array.isArray(response.data.data) ? response.data.data : [];
      
      if (initialLoad || searchTerm !== '') {
        setJobTypes(newData);
        setJobTypePage(2);
      } else {
        setJobTypes(prev => [...prev, ...newData]);
        setJobTypePage(prev => prev + 1);
      }
      
      setHasMoreJobTypes(response.data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Error fetching job types:', error);
      toast.error('Failed to fetch job types');
      setJobTypes([]);
      setHasMoreJobTypes(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductTypes = async (page = 1, initialLoad = false, searchTerm = '') => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/settings/get-all-product-types`,
        {
          params: {
            page,
            limit: 10,
            search: searchTerm
          }
        }
      );
      
      const newData = Array.isArray(response.data.data) ? response.data.data : [];
      
      if (initialLoad || searchTerm !== '') {
        setProductTypes(newData);
        setProductTypePage(2);
      } else {
        setProductTypes(prev => [...prev, ...newData]);
        setProductTypePage(prev => prev + 1);
      }
      
      setHasMoreProductTypes(response.data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Error fetching product types:', error);
      toast.error('Failed to fetch product types');
      setProductTypes([]);
      setHasMoreProductTypes(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestimonials = async (page = 1, initialLoad = false, searchTerm = '') => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/testimonials`,
        {
          params: {
            page,
            limit: 10,
            search: searchTerm
          }
        }
      );
      
      const newData = Array.isArray(response.data.data) ? response.data.data : [];
      
      if (initialLoad || searchTerm !== '') {
        setTestimonials(newData);
        setTestimonialPage(2);
      } else {
        setTestimonials(prev => [...prev, ...newData]);
        setTestimonialPage(prev => prev + 1);
      }
      
      setHasMoreTestimonials(response.data.pagination?.hasMore || false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
      setTestimonials([]);
      setHasMoreTestimonials(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreJobTypes = (page = null, initialLoad = false, searchTerm = '') => {
    if (!isLoading && (hasMoreJobTypes || initialLoad)) {
      const nextPage = page || jobTypePage;
      fetchJobTypes(nextPage, initialLoad, searchTerm);
    }
  };

  const loadMoreProductTypes = (page = null, initialLoad = false, searchTerm = '') => {
    if (!isLoading && (hasMoreProductTypes || initialLoad)) {
      const nextPage = page || productTypePage;
      fetchProductTypes(nextPage, initialLoad, searchTerm);
    }
  };

  const loadMoreTestimonials = (page = null, initialLoad = false, searchTerm = '') => {
    if (!isLoading && (hasMoreTestimonials || initialLoad)) {
      const nextPage = page || testimonialPage;
      fetchTestimonials(nextPage, initialLoad, searchTerm);
    }
  };

  const handleAddJobType = async (newJob) => {
    const formData = new FormData();
    formData.append('name', newJob.name);
    formData.append('image', newJob.image);

    try {
      setIsLoading(true);
      await axiosInstance.post('/settings/add-job-type', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Job type added successfully');
      loadMoreJobTypes(1, true, jobTypeSearchTerm);
    } catch (error) {
      console.error('Error adding job type:', error);
      toast.error('Failed to add job type');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProductType = async (newProduct) => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('image', newProduct.image);

    try {
      setIsLoading(true);
      await axiosInstance.post('/settings/add-product-type', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Product type added successfully');
      loadMoreProductTypes(1, true, productTypeSearchTerm);
    } catch (error) {
      console.error('Error adding product type:', error);
      toast.error('Failed to add product type');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTestimonial = async (newTestimonial) => {
    const formData = new FormData();
    formData.append('name', newTestimonial.name);
    formData.append('feedback', newTestimonial.feedback);
    formData.append('rating', newTestimonial.rating);
    formData.append('image', newTestimonial.image);

    try {
      setIsLoading(true);
      await axiosInstance.post('/testimonials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Testimonial added successfully');
      loadMoreTestimonials(1, true, testimonialSearchTerm);
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEntity = async (id, data) => {
    let endpoint;
    let formData = new FormData();
    
    if (expandedJobTypes) {
      endpoint = `/settings/editjobtype/${id}`;
      formData.append('name', data.name);
      if (data.image) formData.append('image', data.image.file);
    } else if (expandedProductTypes) {
      endpoint = `/settings/editproducttype/${id}`;
      formData.append('name', data.name);
      if (data.image) formData.append('image', data.image.file);
    } else if (expandedTestimonials) {
      endpoint = `/testimonials/${id}`;
      formData.append('name', data.name);
      formData.append('feedback', data.feedback);
      formData.append('rating', data.rating);
      if (data.image) formData.append('image', data.image);
    }

    try {
      setIsLoading(true);
      await axiosInstance.put(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const successMessage = expandedJobTypes 
        ? 'Job type updated successfully'
        : expandedProductTypes
          ? 'Product type updated successfully'
          : 'Testimonial updated successfully';
      
      toast.success(successMessage);
      
      if (expandedJobTypes) {
        loadMoreJobTypes(1, true, jobTypeSearchTerm);
      } else if (expandedProductTypes) {
        loadMoreProductTypes(1, true, productTypeSearchTerm);
      } else if (expandedTestimonials) {
        loadMoreTestimonials(1, true, testimonialSearchTerm);
      }
    } catch (error) {
      console.error('Error updating entity:', error);
      toast.error('Failed to update entity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntity = async (id) => {
    let endpoint;
    
    if (expandedJobTypes) {
      endpoint = `/settings/deletejobtype/${id}`;
    } else if (expandedProductTypes) {
      endpoint = `/settings/deleteproducttype/${id}`;
    } else if (expandedTestimonials) {
      endpoint = `/testimonials/${id}`;
    }

    try {
      setIsLoading(true);
      await axiosInstance.delete(endpoint);
      
      const successMessage = expandedJobTypes 
        ? 'Job type deleted successfully'
        : expandedProductTypes
          ? 'Product type deleted successfully'
          : 'Testimonial deleted successfully';
      
      toast.success(successMessage);
      
      if (expandedJobTypes) {
        loadMoreJobTypes(1, true, jobTypeSearchTerm);
      } else if (expandedProductTypes) {
        loadMoreProductTypes(1, true, productTypeSearchTerm);
      } else if (expandedTestimonials) {
        loadMoreTestimonials(1, true, testimonialSearchTerm);
      }
    } catch (error) {
      console.error('Error deleting entity:', error);
      toast.error('Failed to delete entity');
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmationDialog = (action, id, data = null) => {
    setConfirmAction(action);
    setSelectedId(id);
    setSelectedData(data);
    setConfirmDialogOpen(true);
  };

  const handleConfirmation = async () => {
    if (confirmAction === 'delete') {
      await handleDeleteEntity(selectedId);
    } else if (confirmAction === 'update' && selectedData) {
      await handleUpdateEntity(selectedId, selectedData);
    }
    setConfirmDialogOpen(false);
  };

  useEffect(() => {
    if (expandedJobTypes) {
      loadMoreJobTypes(1, true);
    }
    if (expandedProductTypes) {
      loadMoreProductTypes(1, true);
    }
    if (expandedTestimonials) {
      loadMoreTestimonials(1, true);
    }
  }, [expandedJobTypes, expandedProductTypes, expandedTestimonials]);

  if (isLoading && jobTypes.length === 0 && productTypes.length === 0 && testimonials.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Settings
      </Typography>
      
      <Paper elevation={3} sx={{ mb: 3 }}>
        <List>
          <ExpandableSection
            title="Manage Job Types"
            expanded={expandedJobTypes}
            onToggle={() => setExpandedJobTypes(!expandedJobTypes)}
          >
            <JobTypeForm onAddJobType={handleAddJobType} isLoading={isLoading} />
            <JobTypeTable
              jobTypes={jobTypes}
              onEdit={(id, name) => openConfirmationDialog('update', id, { name })}
              onDelete={(id) => openConfirmationDialog('delete', id)}
              onUpdate={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
              fetchMoreData={loadMoreJobTypes}
              hasMore={hasMoreJobTypes && jobTypeSearchTerm === ''}
              searchTerm={jobTypeSearchTerm}
              setSearchTerm={setJobTypeSearchTerm}
              isLoading={isLoading}
            />
          </ExpandableSection>

          <ExpandableSection
            title="Manage Product Types"
            expanded={expandedProductTypes}
            onToggle={() => setExpandedProductTypes(!expandedProductTypes)}
          >
            <ProductTypeForm onAddProductType={handleAddProductType} isLoading={isLoading} />
            <ProductTypeTable
              productTypes={productTypes}
              onEdit={(id, name) => openConfirmationDialog('update', id, { name })}
              onDelete={(id) => openConfirmationDialog('delete', id)}
              onUpdate={(id, name, image) => openConfirmationDialog('update', id, { name, image })}
              fetchMoreData={loadMoreProductTypes}
              hasMore={hasMoreProductTypes && productTypeSearchTerm === ''}
              searchTerm={productTypeSearchTerm}
              setSearchTerm={setProductTypeSearchTerm}
              isLoading={isLoading}
            />
          </ExpandableSection>

          <ExpandableSection
            title="Manage Testimonials"
            expanded={expandedTestimonials}
            onToggle={() => setExpandedTestimonials(!expandedTestimonials)}
          >
            <TestimonialForm onAddTestimonial={handleAddTestimonial} isLoading={isLoading} />
            <TestimonialTable
              testimonials={testimonials}
              onEdit={(testimonial) => openConfirmationDialog('update', testimonial._id, {
                name: testimonial.name,
                feedback: testimonial.feedback,
                rating: testimonial.rating,
                image: null
              })}
              onDelete={(id) => openConfirmationDialog('delete', id)}
              onUpdate={(id, data) => openConfirmationDialog('update', id, data)}
              fetchMoreData={loadMoreTestimonials}
              hasMore={hasMoreTestimonials && testimonialSearchTerm === ''}
              searchTerm={testimonialSearchTerm}
              setSearchTerm={setTestimonialSearchTerm}
              isLoading={isLoading}
            />
          </ExpandableSection>
        </List>
      </Paper>

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmation}
        title={
          confirmAction === 'delete'
            ? expandedJobTypes 
              ? 'Confirm Job Type Deletion'
              : expandedProductTypes
                ? 'Confirm Product Type Deletion'
                : 'Confirm Testimonial Deletion'
            : expandedJobTypes
              ? 'Confirm Job Type Update'
              : expandedProductTypes
                ? 'Confirm Product Type Update'
                : 'Confirm Testimonial Update'
        }
        message={
          confirmAction === 'delete'
            ? expandedJobTypes
              ? 'Are you sure you want to delete this job type?'
              : expandedProductTypes
                ? 'Are you sure you want to delete this product type?'
                : 'Are you sure you want to delete this testimonial?'
            : expandedJobTypes
              ? 'Are you sure you want to update this job type?'
              : expandedProductTypes
                ? 'Are you sure you want to update this product type?'
                : 'Are you sure you want to update this testimonial?'
        }
        confirmButtonText={confirmAction === 'delete' ? 'Delete' : 'Update'}
        confirmButtonColor={confirmAction === 'delete' ? 'error' : 'primary'}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default SettingsPage;