import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Tabs, Tab, CircularProgress, Typography, Box } from '@mui/material';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/aixos';

const ContractorRequests = () => {
  const [tab, setTab] = useState(0);
  const [stepOneRequests, setStepOneRequests] = useState([]);
  const [docRequests, setDocRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const endpoint = tab === 0 ? '/contractor/requests/step-one' : '/contractor/requests/documents';
        const response = await axiosInstance.get(endpoint);
        if (tab === 0) {
          setStepOneRequests(response.data || []);
        } else {
          setDocRequests(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error(error.response?.data?.msg || 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [tab]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/requests/${id}/approve`);
      if (tab === 0) {
        setStepOneRequests(stepOneRequests.filter(request => request.id !== id));
      } else {
        setDocRequests(docRequests.filter(request => request.id !== id));
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };
  
  const handleReject = async (id) => {
    try {
      await axios.post(`/api/admin/requests/${id}/reject`);
      if (tab === 0) {
        setStepOneRequests(stepOneRequests.filter(request => request.id !== id));
      } else {
        setDocRequests(docRequests.filter(request => request.id !== id));
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const renderRequests = (requests) => (
    requests.map(request => (
      <Card
        key={request.id}
        sx={{
          my: 2,
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
          backgroundColor: '#f9f9f9',
        }}
      >
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
            {request.companyName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: '#555' }}>
            <strong>Contractor:</strong> {request.contractorName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: '#555' }}>
            <strong>Email:</strong> {request.email}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: '#555' }}>
            <strong>Phone:</strong> {request.phone}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: '#555' }}>
            <strong>Number of Employees:</strong> {request.numberOfEmployees}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: '#555' }}>
            <strong>Job Types:</strong> {request.jobTypes.join(', ')}
          </Typography>
          {tab === 1 && (
            <Typography variant="body1" sx={{ mb: 2, color: '#555' }}>
              <strong>GST Number:</strong> {request.gstNumber}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleApprove(request.id)}
              sx={{ textTransform: 'none', fontWeight: 'bold', px: 3, py: 1, borderRadius: 1 }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleReject(request.id)}
              sx={{ textTransform: 'none', fontWeight: 'bold', px: 3, py: 1, borderRadius: 1 }}
            >
              Reject
            </Button>
          </Box>
        </CardContent>
      </Card>
    ))
  );

  return (
    <div className="p-4">
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': { backgroundColor: '#1976d2' },
          '& .MuiTab-root': { fontWeight: 'bold', color: '#555' },
          '& .Mui-selected': { color: '#1976d2' },
        }}
      >
        <Tab label="Step 1 Verification" />
        <Tab label="Document Verification" />
      </Tabs>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        tab === 0 ? renderRequests(stepOneRequests) : renderRequests(docRequests)
      )}
    </div>
  );
};

export default ContractorRequests;