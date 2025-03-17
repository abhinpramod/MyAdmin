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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Avatar,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";
import {
  Block,
  CheckCircle,
  Camera,
  MoreVert,
  Close,
} from "@mui/icons-material";
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
  const [profileDialog, setProfileDialog] = useState({
    open: false,
    contractor: null,
  });
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null); // State for profile dropdown menu
  const [documentsDialog, setDocumentsDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({
    status: "", // 'blocked' or 'unblocked'
    minEmployees: "", // Minimum number of employees
    maxEmployees: "", // Maximum number of employees
    startDate: "", // Start date for filtering
    endDate: "", // End date for filtering
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // Fetch Contractors
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

  // Handle Profile Menu Open
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  // Handle Profile Menu Close
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  // Handle Documents Dialog Open
  const handleDocumentsDialogOpen = () => {
    setDocumentsDialog(true);
    handleProfileMenuClose();
  };

  // Handle Documents Dialog Close
  const handleDocumentsDialogClose = () => {
    setDocumentsDialog(false);
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

  // Filter Contractors
  const filteredContractors = contractors.filter((contractor) => {
    const matchesSearchTerm = [
      contractor.companyName,
      contractor.contractorName,
      contractor.email,
      contractor.phone,
      contractor.gstNumber,
      contractor.city,
      contractor.state,
      contractor.country,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filters.status
      ? contractor.isBlocked === (filters.status === "blocked")
      : true;

    const matchesEmployees =
      (!filters.minEmployees ||
        contractor.numberOfEmployees >= parseInt(filters.minEmployees)) &&
      (!filters.maxEmployees ||
        contractor.numberOfEmployees <= parseInt(filters.maxEmployees));

    const matchesDate =
      !filters.startDate ||
      new Date(contractor.createdAt) >= new Date(filters.startDate);

    return (
      matchesSearchTerm && matchesStatus && matchesEmployees && matchesDate
    );
  });

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Slice the contractors for the current page
  const paginatedContractors = filteredContractors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {/* Status Filter */}
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

        {/* Min Employees Filter */}
        <TextField
          name="minEmployees"
          label="Min Employees"
          type="number"
          value={filters.minEmployees}
          onChange={handleFilterChange}
          fullWidth
        />

        {/* Max Employees Filter */}
        <TextField
          name="maxEmployees"
          label="Max Employees"
          type="number"
          value={filters.maxEmployees}
          onChange={handleFilterChange}
          fullWidth
        />

        {/* Start Date Filter */}
        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={handleFilterChange}
          fullWidth
        />
      </Box>

      {/* Loading Spinner */}
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Profile</b>
                  </TableCell>
                  <TableCell>
                    <b>Company Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Contractor</b>
                  </TableCell>
                  <TableCell>
                    <b>Location</b>
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
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedContractors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No contractor match for <strong>{searchTerm}</strong>
                    </TableCell>
                  </TableRow>
                )}
                {paginatedContractors.map((contractor) => (
                  <TableRow
                    key={contractor._id}
                    hover
                    onClick={() => handleRowClick(contractor)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Avatar
                        src={contractor.profilePicture}
                        alt={contractor.contractorName}
                        sx={{ width: 40, height: 40 }}
                      >
                        {!contractor.profilePicture &&
                          contractor.contractorName.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{contractor.companyName}</TableCell>
                    <TableCell>{contractor.contractorName}</TableCell>
                    <TableCell>
                      {contractor.city}, {contractor.state},{" "}
                      {contractor.country}
                    </TableCell>
                    <TableCell>{contractor.phone}</TableCell>
                    <TableCell>{contractor.numberOfEmployees}</TableCell>
                    <TableCell>{contractor.jobTypes.join(", ")}</TableCell>
                    <TableCell>
                      <IconButton
                        color={!contractor.isBlocked ? "error" : "success"}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleConfirm(contractor._id, contractor.isBlocked);
                        }}
                      >
                        {contractor.isBlocked ? <CheckCircle /> : <Block />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredContractors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Contractor Profile Dialog */}
      <Dialog
        open={profileDialog.open}
        onClose={handleCloseProfileDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Contractor Profile
          <IconButton
            onClick={handleCloseProfileDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {profileDialog.contractor && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
              }}
            >
              {/* Profile Picture */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: { xs: "100%", md: "30%" },
                }}
              >
                <Avatar
                  sx={{ width: 128, height: 128, border: "4px solid #e0e0e0" }}
                  src={profileDialog.contractor.profilePicture}
                />
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {profileDialog.contractor.companyName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {profileDialog.contractor.contractorName}
                  </Typography>
                </Box>
              </Box>

              {/* Profile Details */}
              <Box sx={{ width: { xs: "100%", md: "70%" } }}>
                <Typography variant="body1" color="text.secondary">
                  <strong>Email:</strong> {profileDialog.contractor.email}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>GST:</strong> {profileDialog.contractor.gstNumber}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Address:</strong> {profileDialog.contractor.address},{" "}
                  {profileDialog.contractor.city}, {profileDialog.contractor.state},{" "}
                  {profileDialog.contractor.country}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Number of Employees:</strong>{" "}
                  {profileDialog.contractor.numberOfEmployees}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Projects Section */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Projects
          </Typography>
          <Grid container spacing={3}>
            {profileDialog.contractor?.projects?.map((project, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  onClick={() => handleProjectClick(project)}
                  sx={{
                    cursor: "pointer",
                    height: 300,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={project.image}
                    alt={`Project ${index + 1}`}
                    sx={{
                      height: 180,
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

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
              {/* Image */}
              <CardMedia
                component="img"
                height="80"
                image={selectedProject.image}
                alt="Project"
                sx={{ objectFit: "cover", borderRadius: 2, width: "100%" }}
              />

              {/* Project Description */}
              <Typography variant="h6" fontWeight="bold">
                {selectedProject.description}
              </Typography>

              {/* Project Creation Date */}
              <Typography variant="body2" color="text.secondary">
                Added on:{" "}
                {new Date(selectedProject.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={documentsDialog} onClose={handleDocumentsDialogClose}>
        <DialogTitle>
          Documents
          <IconButton
            onClick={handleDocumentsDialogClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            <strong>Licence Document:</strong>{" "}
            <img
              src={profileDialog.contractor?.licenseDocument}
              alt="Licence"
              style={{ width: "100%", marginTop: 8 }}
            />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>GST Document:</strong>
            <img
              src={profileDialog.contractor?.gstDocument}
              alt="GST"
              style={{ width: "100%", marginTop: 8 }}
            />
          </Typography>
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