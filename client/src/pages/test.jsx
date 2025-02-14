import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Pagination, Tabs, Tab, CircularProgress } from '@mui/material';
import axios from 'axios';

const ContractorRequests = () => {
  const [tab, setTab] = useState(0);
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/requests?step=${tab + 1}&page=${page}`);
        setRequests(response.data.requests || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [tab, page]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/requests/${id}/approve`);
      setRequests(requests.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/api/admin/requests/${id}/reject`);
      setRequests(requests.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <div className="p-4">
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} aria-label="contractor request tabs">
        <Tab label="Step 1 Verification" />
        <Tab label="Document Verification" />
      </Tabs>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : requests.length > 0 ? (
        requests.map(request => (
          <Card key={request.id} sx={{ my: 2, p: 2 }}>
            <CardContent>
              <h2>{request.companyName}</h2>
              <p>Contractor: {request.contractorName}</p>
              <p>Email: {request.email}</p>
              <p>Phone: {request.phone}</p>
              {tab === 1 && (
                <>
                  <p>GST Number: {request.gstNumber}</p>
                  <p>License Document: <a href={request.licenseDoc} target="_blank" rel="noopener noreferrer">View Document</a></p>
                </>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button variant="contained" color="primary" onClick={() => handleApprove(request.id)}>Approve</Button>
                <Button variant="contained" color="error" onClick={() => handleReject(request.id)}>Reject</Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No requests found.</p>
      )}
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, newPage) => setPage(newPage)}
        sx={{ mt: 2 }}
      />
    </div>
  );
};

export default ContractorRequests;



import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Tabs, Tab, CircularProgress, Typography, Box } from '@mui/material';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/aixos';

// const ContractorRequests = () => {
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
        toast.error(response?.data?.msg || 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [tab]);

  const handleApprove = async (id) => { /* approval logic */ };
  const handleReject = async (id) => { /* rejection logic */ };

  const renderRequests = (requests, tab, handleApprove, handleReject) => (
    requests.map(request => (
      <Card key={request.id} sx={{ my: 2, p: 2, boxShadow: 3, borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {request.companyName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Contractor:</strong> {request.contractorName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email:</strong> {request.email}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Phone:</strong> {request.phone}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>number of employees:</strong> {request.numberOfEmployees}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>jobtypes:</strong> {request.jobTypes}
          </Typography>
          {tab === 1 && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>GST Number:</strong> {request.gstNumber}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleApprove(request.id)}
              sx={{ textTransform: 'none', fontWeight: 'bold', px: 3, py: 1 }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleReject(request.id)}
              sx={{ textTransform: 'none', fontWeight: 'bold', px: 3, py: 1 }}
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
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
        <Tab label="Step 1 Verification" />
        <Tab label="Document Verification" />
      </Tabs>
      {loading ? <CircularProgress /> : (tab === 0 ? renderRequests(stepOneRequests) : renderRequests(docRequests))}
    </div>
  );
// };

// export default ContractorRequests;
