import { useState, useEffect } from "react";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";
import React from "react";
import {
  Button,
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
  Menu,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import { v4 as uuid } from "uuid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const openMenu = Boolean(anchorEl);

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
        setFormData({ fullname: "", email: "", password: "", confirmPassword: "", uniqueId: "", role: "" });
        setOpenAddAdmin(false);
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error(error.response?.data?.msg || "Failed to add admin");
    }
  };

  const handleBlockUnblockAdmin = async () => {
    if (!selectedAdmin) return;
    setLoading(true);
    try {
      const updatedStatus = !selectedAdmin.isBlocked;
      const endpoint = updatedStatus ? `/admin/block-admin/${selectedAdmin._id}` : `/admin/unblock-admin/${selectedAdmin._id}`;
      await axiosInstance.patch(endpoint, { adminId: selectedAdmin._id });
      toast.success(`Admin ${updatedStatus ? "blocked" : "unblocked"} successfully`);
      setAdmins(admins.map((admin) => (admin._id === selectedAdmin._id ? { ...admin, isBlocked: updatedStatus } : admin)));
    } catch (error) {
      console.error(error);
      toast.error("Failed to update admin status.");
    } finally {
      setLoading(false);
      setSelectedAdmin(null);
      setConfirmAction(null);
    }
  };

  const handleEditAdmin = (admin) => {
    // Implement edit functionality here
    toast.success(`Edit admin: ${admin.fullname}`);
    setAnchorEl(null); // Close the menu
  };

  const handleMenuClick = (event, admin) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(admin);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAdmin(null);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.uniqueId.includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Admins</h2>
        <TextField
          label="Search Admins"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "8px" }}
        />
        <Button variant="contained" color="primary" onClick={() => setOpenAddAdmin(true)}>Add Admin</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin._id} className="hover:bg-gray-50">
                  <TableCell>{admin.uniqueId}</TableCell>
                  <TableCell>{admin.fullname}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      className={`inline-block px-2 py-1 rounded-full text-sm ${
                        admin.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {admin.isBlocked ? "Blocked" : "Active"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleMenuClick(e, admin)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Admin Dialog */}
      <Dialog open={openAddAdmin} onClose={() => setOpenAddAdmin(false)}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" fullWidth margin="normal" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
          <TextField label="Email" fullWidth margin="normal" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <TextField label="Confirm Password" type="password" fullWidth margin="normal" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddAdmin(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddAdmin} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog open={Boolean(confirmAction)} onClose={() => setConfirmAction(null)}>
        <DialogTitle>
          Are you sure you want to {confirmAction === "block" ? "block" : "unblock"} {selectedAdmin?.fullname}?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmAction(null)} color="secondary">Cancel</Button>
          <Button onClick={handleBlockUnblockAdmin} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Actions Dropdown Menu */}
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={openMenu}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditAdmin(selectedAdmin)}>Edit</MenuItem>
        <MenuItem
          onClick={() => {
            setConfirmAction(selectedAdmin.isBlocked ? "unblock" : "block");
            handleMenuClose();
          }}
        >
          {selectedAdmin?.isBlocked ? "Unblock" : "Block"}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ManageAdmins;