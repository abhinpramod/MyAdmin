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
  IconButton,
} from "@mui/material";
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

  const handleEditAdmin = async () => {
    if (!formData.fullname.trim() || !formData.email.trim()) {
      return toast.error("Full Name and Email are required");
    }
    try {
      await axiosInstance.patch(`/admin/edit-admin/${selectedAdmin._id}`, formData);
      toast.success("Admin updated successfully!");
      setAdmins(
        admins.map((admin) =>
          admin._id === selectedAdmin._id ? { ...admin, ...formData } : admin
        )
      );
      setOpenEditAdmin(false);
    } catch (error) {
      console.error("Error editing admin:", error);
      toast.error("Failed to update admin");
    }
  };

  const handleBlockUnblockAdmin = async () => {
    if (!selectedAdmin) return;
    setLoading(true);
    try {
      const updatedStatus = !selectedAdmin.isBlocked;
      await axiosInstance.patch(`/admin/toggle-block/${selectedAdmin._id}`);
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
      setConfirmAction(null);
    }
  };

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
        <Button variant="contained" color="primary" onClick={() => setOpenAddAdmin(true)}>
          Add Admin
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin._id}</TableCell>
                  <TableCell>{admin.fullname}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setFormData(admin);
                        setOpenEditAdmin(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color={admin.isBlocked ? "success" : "warning"}
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setConfirmAction(admin.isBlocked ? "unblock" : "block");
                      }}
                    >
                      {admin.isBlocked ? <CheckCircle /> : <Block />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Admin Dialog */}
      <Dialog open={openEditAdmin} onClose={() => setOpenEditAdmin(false)}>
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" fullWidth margin="normal" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
          <TextField label="Email" fullWidth margin="normal" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditAdmin(false)} color="secondary">Cancel</Button>
          <Button onClick={handleEditAdmin} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAdmins;