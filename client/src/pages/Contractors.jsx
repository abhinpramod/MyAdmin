import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";
import { Block, CheckCircle } from "@mui/icons-material";

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
      toast.error(
        error.response?.data?.msg || "Failed to update block status."
      );
    } finally {
      handleClose();
    }
  };

  const filteredContractors = contractors.filter((contractor) =>
    [
      contractor.companyName,
      contractor.contractorName,
      contractor.email,
      contractor.phone,
      contractor.gstNumber,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Company Name</b>
                </TableCell>
                <TableCell>
                  <b>Contractor</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Phone</b>
                </TableCell>
                <TableCell>
                  <b>Employees</b>
                </TableCell>
                <TableCell>
                  <b>Job Types</b>
                </TableCell>
                <TableCell>
                  <b>GST Number</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContractors.map((contractor) => (
                <TableRow key={contractor._id}>
                  <TableCell>{contractor.companyName}</TableCell>
                  <TableCell>{contractor.contractorName}</TableCell>
                  <TableCell>{contractor.email}</TableCell>
                  <TableCell>{contractor.phone}</TableCell>
                  <TableCell>{contractor.numberOfEmployees}</TableCell>
                  <TableCell>{contractor.jobTypes.join(", ")}</TableCell>
                  <TableCell>{contractor.gstNumber}</TableCell>
                  <TableCell>
                    <IconButton
                      variant="contained"
                      color={!contractor.isBlocked ? "error" : "success"}
                      onClick={() =>
                        handleConfirm(contractor._id, contractor.isBlocked)
                      }
                    >
                      {contractor.isBlocked ? <CheckCircle /> : <Block />}{" "}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleClose}>
        <DialogTitle>
          Confirm {confirmDialog.isBlocked ? "unblock" : "block"}
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
