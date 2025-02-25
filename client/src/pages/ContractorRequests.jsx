import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import axiosInstance from "../lib/aixos";

const ContractorRequests = () => {
  const [tab, setTab] = useState(0);
  const [stepOneRequests, setStepOneRequests] = useState([]);
  const [docRequests, setDocRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    contractorId: null,
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const endpoint =
        tab === 0
          ? "/contractor/requests/step-one"
          : "/contractor/requests/documents";
      const response = await axiosInstance.get(endpoint);
      if (tab === 0) {
        setStepOneRequests(response.data || []);
        setFilteredRequests(response.data || []);
      } else {
        setDocRequests(response.data || []);
        setFilteredRequests(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error(error.response?.data?.msg || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [tab]);

  useEffect(() => {
    const filtered = (tab === 0 ? stepOneRequests : docRequests).filter(
      (request) =>
        request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.contractorName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.phone.includes(searchTerm)
    );
    setFilteredRequests(filtered);
  }, [searchTerm, tab, stepOneRequests, docRequests]);

  const handleConfirm = (action, id) => {
    setConfirmDialog({ open: true, action, contractorId: id });
  };

  const handleApproveReject = async () => {
    const { action, contractorId } = confirmDialog;
    if (!contractorId) return;

    try {
      const endpoint =
        action === "approve"
          ? `/contractor/requests/approve/${contractorId}`
          : `/contractor/requests/reject/${contractorId}`;

      await axiosInstance.patch(endpoint);
      toast.success(`Request ${action}d successfully!`);
      fetchRequests(); // Re-fetch data after action
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(error.response?.data?.msg || `Failed to ${action} request`);
    } finally {
      setConfirmDialog({ open: false, action: null, contractorId: null });
    }
  };

  const renderRequests = (requests) =>
    requests.map((request) => (
      <Card
        key={request._id}
        sx={{
          my: 2,
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
          // transition: "transform 0.2s",

          // "&:hover": { transform: "scale(1.02)" },
          backgroundColor: "#f9f9f9",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
          >
            {request.companyName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
            <strong>Contractor:</strong> {request.contractorName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
            <strong>Email:</strong> {request.email}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
            <strong>Phone:</strong> {request.phone}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
            <strong>Number of Employees:</strong> {request.numberOfEmployees}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
            <strong>Job Types:</strong> {request.jobTypes.join(", ")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
            <strong>location:</strong> {request.country}, {request.city}
          </Typography>
          {tab === 1 && (
            <Typography variant="body1" sx={{ mb: 2, color: "#555" }}>
              <strong>GST Number:</strong> {request.gstNumber}
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleConfirm("approve", request._id)}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                py: 1,
                borderRadius: 1,
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleConfirm("reject", request._id)}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                py: 1,
                borderRadius: 1,
              }}
            >
              Reject
            </Button>
          </Box>
        </CardContent>
      </Card>
    ));

  return (
    <div className="p-4">
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": { backgroundColor: "#1976d2" },
          "& .MuiTab-root": { fontWeight: "bold", color: "#555" },
          "& .Mui-selected": { color: "#1976d2" },
        }}
      >
        <Tab label="Step 1 Verification" />
        <Tab label="Document Verification" />
      </Tabs>

      {/* Search Input */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by Company Name, Contractor Name, Email, or Phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredRequests.length > 0 ? (
        renderRequests(filteredRequests)
      ) : (
        <Typography sx={{ textAlign: "center", mt: 4, color: "#777" }}>
          No requests found.
        </Typography>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, action: null, contractorId: null })
        }
      >
        <DialogTitle>
          {confirmDialog.action === "approve"
            ? "Approve Request"
            : "Reject Request"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to <strong>{confirmDialog.action}</strong>{" "}
            this request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({
                open: false,
                action: null,
                contractorId: null,
              })
            }
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApproveReject}
            color={confirmDialog.action === "approve" ? "primary" : "error"}
            autoFocus
          >
            {confirmDialog.action === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContractorRequests;
