import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";

const AllContractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: null,
    isBlocked: false,
  });

  useEffect(() => {
    const fetchContractors = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          "/contractor/get-all-contractors"
        );
        setContractors(response.data || []);
      } catch (error) {
        console.error("Error fetching contractors:", error);
        toast.error("Failed to fetch contractors.");
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  const handleConfirm = (id, isBlocked) => {
    setConfirmDialog({ open: true, id, isBlocked });
  };

  const handleClose = () => {
    setConfirmDialog({ open: false, id: null, isBlocked: false });
  };

  const toggleBlock = async () => {
    const { id, isBlocked } = confirmDialog;
    try {
      const endpoint = `/contractor/${isBlocked ? "unblock" : "block"}/${id}`;
      const response = await axiosInstance.put(endpoint);

      if (response.status === 200) {
        toast.success(
          `Contractor ${isBlocked ? "unblocked" : "blocked"} successfully.`
        );
        setContractors((prev) =>
          prev.map((contractor) =>
            contractor._id === id
              ? { ...contractor, isBlocked: !isBlocked }
              : contractor
          )
        );
      }
    } catch (error) {
      console.error("Error updating block status:", error);
      toast.error("Failed to update block status.");
    } finally {
      handleClose();
    }
  };

  // Updated search functionality to filter contractors by multiple fields
  const filteredContractors = contractors.filter((contractor) =>
    [contractor.companyName, contractor.contractorName, contractor.email, contractor.phone, contractor.gstNumber]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Contractors
      </Typography>
      <TextField
        label="Search Contractors"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredContractors.map((contractor) => (
            <Grid item xs={12} sm={6} md={4} key={contractor._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {contractor.companyName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Contractor: {contractor.contractorName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Email: {contractor.email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Phone: {contractor.phone}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Employees: {contractor.numberOfEmployees}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Job Types: {contractor.jobTypes.join(", ")}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    GST Number: {contractor.gstNumber}
                  </Typography>
                  <Button
                    variant="contained"
                    color={!contractor.isBlocked ? "error" : "success"}
                    onClick={() =>
                      handleConfirm(contractor._id, contractor.isBlocked)
                    }
                    sx={{ width: "100%", mt: 2 }}
                  >
                    {!contractor.isBlocked ? "Block" : "Unblock"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleClose}>
        <DialogTitle>
          Confirm {confirmDialog.isBlocked ? "unblock" : "block"}{" "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {confirmDialog.isBlocked ? "unblock" : "block"} this contractor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={toggleBlock} color="primary" autoFocus>
            {confirmDialog.isBlocked ? "Unblock" : "Block"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllContractors;
