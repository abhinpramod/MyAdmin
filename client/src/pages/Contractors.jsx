import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CardMedia,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";
import ContractorsTable from "../components/Contractor/ContractorsTable";
import ContractorProfile from "../components/Contractor/ContractorProfile";

const AllContractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: null,
    isBlocked: false,
  });
  const [profileDialog, setProfileDialog] = useState({
    open: false,
    contractor: null,
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // State for filters
  const [filters, setFilters] = useState({
    status: "",
    employeeRange: "",
    startDate: "",
    endDate: "",
  });

  // Employee range options
  const employeeRanges = [
    { value: "", label: "All" },
    { value: "1-10", label: "1-10 Employees" },
    { value: "10-20", label: "10-20 Employees" },
    { value: "20-50", label: "20-50 Employees" },
    { value: "50-100", label: "50-100 Employees" },
    { value: "100+", label: "100+ Employees" },
  ];

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Build query parameters from filters and search
  const buildQueryParams = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
    };

    if (searchTerm) params.search = searchTerm;
    if (filters.status) params.status = filters.status;
    if (filters.employeeRange) params.employeeRange = filters.employeeRange;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return params;
  };

  // Fetch Contractors with pagination, search, and filters
  useEffect(() => {
    const fetchContractors = async () => {
      setLoading(true);
      try {
        const params = buildQueryParams();
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosInstance.get(
          `/contractor/get-all-contractors?${queryString}`
        );
        setContractors(response.data.data || []);
        setTotalCount(response.data.total || 0);
      } catch (error) {
        console.error("Error fetching contractors:", error);
        toast.error("Failed to fetch contractors.");
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchContractors();
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(debounceTimer);
  }, [page, rowsPerPage, searchTerm, filters]);

  // Handle Block/Unblock Confirmation
  const handleConfirm = (id, isBlocked) => {
    setConfirmDialog({ open: true, id, isBlocked });
  };

  const handleCloseConfirmDialog = () => {
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
        // Refetch contractors after blocking/unblocking
        const params = buildQueryParams();
        const queryString = new URLSearchParams(params).toString();
        const newResponse = await axiosInstance.get(
          `/contractor/get-all-contractors?${queryString}`
        );
        setContractors(newResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error updating block status:", error);
      toast.error(
        error.response?.data?.msg || "Failed to update block status."
      );
    } finally {
      handleCloseConfirmDialog();
    }
  };

  // Handle Row Click to Open Profile Dialog
  const handleRowClick = (contractor) => {
    setProfileDialog({ open: true, contractor });
  };

  // Close Profile Dialog
  const handleCloseProfileDialog = () => {
    setProfileDialog({ open: false, contractor: null });
  };

  // Handle Project Click to Open Project Dialog
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  // Close Project Dialog
  const handleCloseProjectDialog = () => {
    setSelectedProject(null);
  };

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      status: "",
      employeeRange: "",
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Contractors
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search Contractors"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
            <MenuItem value="unblocked">Unblocked</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Employee Range</InputLabel>
          <Select
            name="employeeRange"
            value={filters.employeeRange}
            onChange={handleFilterChange}
            label="Employee Range"
          >
            {employeeRanges.map((range) => (
              <MenuItem key={range.value} value={range.value}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={handleFilterChange}
          fullWidth
        />

        <Button
          variant="outlined"
          onClick={handleResetFilters}
          sx={{ height: "56px" }}
        >
          Reset Filters
        </Button>
      </Box>

      <ContractorsTable
        contractors={contractors}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleRowClick={handleRowClick}
        handleConfirm={handleConfirm}
        totalCount={totalCount}
      />

      <ContractorProfile
        open={profileDialog.open}
        contractor={profileDialog.contractor}
        handleClose={handleCloseProfileDialog}
        handleProjectClick={handleProjectClick}
      />

      {/* Project Dialog */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={handleCloseProjectDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Project Details
          <IconButton
            onClick={handleCloseProjectDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <CardMedia
                component="img"
                height="80"
                image={selectedProject.image}
                alt="Project"
                sx={{ objectFit: "cover", borderRadius: 2, width: "100%" }}
              />

              <Typography variant="h6" fontWeight="bold">
                {selectedProject.description}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Added on:{" "}
                {new Date(selectedProject.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCloseConfirmDialog}>
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
          <Button onClick={handleCloseConfirmDialog} color="secondary">
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
