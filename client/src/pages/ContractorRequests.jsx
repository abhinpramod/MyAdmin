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
  Modal,
  Grid,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import axiosInstance from "../lib/aixos";
import { X } from "lucide-react";
import AllContractors from "./Contractors";

// Placeholder component for the Contractors tab
const ContractorsList = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Contractors List
      </Typography>
      <Typography variant="body1">
        This is the list of all contractors. You can add more details or components here.
      </Typography>
    </Box>
  );
};

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
  const [imageModal, setImageModal] = useState({
    open: false,
    src: "",
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const endpoint =
        tab === 1
          ? "/contractor/requests/step-one"
          : "/contractor/requests/step-two";
      const response = await axiosInstance.get(endpoint);
      if (tab === 1) {
        setStepOneRequests(response.data || []);
      } else {
        setDocRequests(response.data || []);
      }
      setFilteredRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error(error.response?.data?.msg || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== 0) {
      fetchRequests();
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== 0) {
      const requests = tab === 1 ? stepOneRequests : docRequests;
      const filtered = requests.filter(
        (request) =>
          request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.phone.includes(searchTerm)
      );
      setFilteredRequests(filtered);
    }
  }, [searchTerm, tab, stepOneRequests, docRequests]);

  const handleConfirm = (action, id) => {
    setConfirmDialog({ open: true, action, contractorId: id });
  };

  const handleApproveReject = async () => {
    const { action, contractorId } = confirmDialog;
    if (!contractorId) return;

    try {
      const endpoint =
        tab === 1
          ? action === "approve"
            ? `/contractor/requests/step-one/approve/${contractorId}`
            : `/contractor/requests/step-one/reject/${contractorId}`
          : action === "approve"
          ? `/contractor/requests/step-two/approve/${contractorId}`
          : `/contractor/requests/step-two/reject/${contractorId}`;

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

  const handleImageClick = (src) => {
    setImageModal({ open: true, src });
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
          backgroundColor: "#f9f9f9",
        }}
      >
        <Grid container spacing={2}>
          {/* Left Side: Request Details */}
          <Grid item xs={12} md={7}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
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
                <strong>Location:</strong> {request.country}, {request.state}, {request.city}
              </Typography>
              {tab === 2 && (
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
          </Grid>

          {/* Right Side: Document Images */}
          {tab === 2 && (
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                    License Document:
                  </Typography>
                  <img
                    src={request.licenseDocument}
                    alt="License Document"
                    style={{ width: "300px", height: "200px", borderRadius: "8px", cursor: "pointer" }}
                    onClick={() => handleImageClick(request.licenseDocument)}
                  />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                    GST Document:
                  </Typography>
                  <img
                    src={request.gstDocument}
                    alt="GST Document"
                    style={{ width: "300px", height: "200px", borderRadius: "8px", cursor: "pointer" }}
                    onClick={() => handleImageClick(request.gstDocument)}
                  />
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
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
        <Tab label="Contractors" />
        <Tab label="Step 1 verification requests" />
        <Tab label="Document Verification" />
      </Tabs>

      {tab === 0 ? (
        <AllContractors />
      ) : (
        <>
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
        </>
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

      {/* Image Enlargement Modal */}
      <Modal
        open={imageModal.open}
        onClose={() => setImageModal({ open: false, src: "" })}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ outline: "none" }}>
          <img
            src={imageModal.src}
            alt="Enlarged Document"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "8px" }}
          />
          <IconButton
            onClick={() => setImageModal({ open: false, src: "" })}
            sx={{ mt: 2, display: "block", mx: "auto" }}
            variant="contained"
            color=""
          >
            <X />
          </IconButton>
        </Box>
      </Modal>
    </div>
  );
};

export default ContractorRequests;