import React, { useState, useEffect } from "react";
import { Tabs, Tab, TextField, Box, CircularProgress, Typography } from "@mui/material";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import AllContractors from "./Contractors";
import RequestCard from "../components/Contractor/RequestCard";
import ConfirmationDialog from "../components/ConfirmationDialog"; // Import the unified dialog
import ImageModal from "../components/Contractor/Imagemodel";

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
            filteredRequests.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                tab={tab}
                handleConfirm={handleConfirm}
                handleImageClick={handleImageClick}
              />
            ))
          ) : (
            <Typography sx={{ textAlign: "center", mt: 4, color: "#777" }}>
              No requests found.
            </Typography>
          )}
        </>
      )}

      {/* Unified Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, contractorId: null })}
        onConfirm={handleApproveReject}
        title={confirmDialog.action === "approve" ? "Approve Request" : "Reject Request"}
        message={`Are you sure you want to ${confirmDialog.action} this request?`}
        confirmButtonText={confirmDialog.action === "approve" ? "Approve" : "Reject"}
        confirmButtonColor={confirmDialog.action === "approve" ? "primary" : "error"}
      />

      <ImageModal imageModal={imageModal} setImageModal={setImageModal} />
    </div>
  );
};

export default ContractorRequests;