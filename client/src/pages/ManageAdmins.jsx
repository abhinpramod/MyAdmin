import { useState, useEffect } from "react";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TablePagination, // Add TablePagination
} from "@mui/material";
import { v4 as uuid } from "uuid";
import { Edit, Block, CheckCircle } from "@mui/icons-material";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [openEditAdmin, setOpenEditAdmin] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // State for filters
  const [filters, setFilters] = useState({
    status: "", // 'blocked' or 'active'
    startDate: "", // Start date for filtering
    endDate: "", // End date for filtering
  });

  // Fetch Admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-all-admins");
        setAdmins(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch admins.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Handle Add Admin
  const handleAddAdmin = async () => {
    if (!formData.fullname.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    const uniqueId = uuid().slice(2, 8);
    const finalData = { ...formData, uniqueId };

    try {
      const res = await axiosInstance.post("/admin/addadmin", finalData);
      if (res.status === 201) {
        toast.success("Admin added successfully!");
        setAdmins([...admins, res.data]);
        setOpenAddAdmin(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error(error.response?.data?.msg || "Failed to add admin");
    }
  };

  // Handle Edit Admin
  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;
    try {
      const res = await axiosInstance.patch(`/admin/edit-admin/${selectedAdmin._id}`, formData);
      if (res.status === 200) {
        toast.success("Admin details updated successfully!");
        setAdmins(
          admins.map((admin) =>
            admin._id === selectedAdmin._id ? { ...admin, ...formData } : admin
          )
        );
        setOpenEditAdmin(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("Failed to update admin.");
    }
  };

  // Handle Block/Unblock Admin
  const handleBlockUnblockAdmin = async () => {
    if (!selectedAdmin) return;
    setLoading(true);
    try {
      const updatedStatus = !selectedAdmin.isBlocked;
      const endpoint = updatedStatus
        ? `/admin/block-admin/${selectedAdmin._id}`
        : `/admin/unblock-admin/${selectedAdmin._id}`;
      await axiosInstance.patch(endpoint, { adminId: selectedAdmin._id });
      toast.success(`Admin ${updatedStatus ? "blocked" : "unblocked"} successfully`);
      setAdmins(
        admins.map((admin) =>
          admin._id === selectedAdmin._id ? { ...admin, isBlocked: updatedStatus } : admin
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update admin status.");
    } finally {
      setLoading(false);
      setSelectedAdmin(null);
      setConfirmAction(null);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({ fullname: "", email: "", password: "", confirmPassword: "", role: "" });
  };

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filter Admins
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearchTerm =
      admin.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.uniqueId.includes(searchTerm);

    const matchesStatus =
      filters.status === "" ||
      (filters.status === "blocked" && admin.isBlocked) ||
      (filters.status === "active" && !admin.isBlocked);

    const matchesDate =
      (!filters.startDate || new Date(admin.createdAt) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(admin.createdAt) <= new Date(filters.endDate));

    return matchesSearchTerm && matchesStatus && matchesDate;
  });

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Slice the admins for the current page
  const paginatedAdmins = filteredAdmins.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Admins</h2>
        <Button variant="contained" color="primary" onClick={() => setOpenAddAdmin(true)}>
          Add Admin
        </Button>
      </div>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Search Admins"
          variant="outlined"
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "100%", height: "40px" }}
        />
      </Box>

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
            sx={{ width: "20%" }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
            <MenuItem value="active">Active</MenuItem>
          </Select>
        </FormControl>

        {/* Start Date Filter */}
        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={handleFilterChange}
          sx={{ width: "20%" }}
        />
      </Box>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAdmins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No admin match for <strong>{searchTerm}</strong>
                    </TableCell>
                  </TableRow>
                )}
                {paginatedAdmins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell>{admin.uniqueId}</TableCell>
                    <TableCell>{admin.fullname}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setFormData(admin);
                            setOpenEditAdmin(true);
                          }}
                          variant="contained"
                          color="primary"
                          style={{ marginRight: "8px" }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={admin.isBlocked ? "Unblock" : "Block"}>
                        <IconButton
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setConfirmAction(admin.isBlocked ? "unblock" : "block");
                          }}
                          variant="contained"
                          color={admin.isBlocked ? "success" : "warning"}
                        >
                          {admin.isBlocked ? <CheckCircle /> : <Block />}
                        </IconButton>
                      </Tooltip>
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
            count={filteredAdmins.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={Boolean(confirmAction)} onClose={() => setConfirmAction(null)}>
        <DialogTitle>
          Are you sure you want to {confirmAction === "block" ? "block" : "unblock"} {selectedAdmin?.fullname}?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmAction(null)} color="secondary">Cancel</Button>
          <Button onClick={handleBlockUnblockAdmin} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={openEditAdmin} onClose={() => setOpenEditAdmin(false)}>
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" fullWidth margin="normal" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
          <TextField label="Email" fullWidth margin="normal" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditAdmin(false)} color="secondary">Cancel</Button>
          <Button onClick={handleEditAdmin} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog open={openAddAdmin} onClose={() => setOpenAddAdmin(false)}>
        <DialogTitle>Add Admin</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" fullWidth margin="normal" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
          <TextField label="Email" fullWidth margin="normal" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextField label="Password" fullWidth margin="normal" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <TextField label="Confirm Password" fullWidth margin="normal" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddAdmin(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddAdmin} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAdmins;