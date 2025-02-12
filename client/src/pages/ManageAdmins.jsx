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
} from "@mui/material";
import { v4 as uuid } from "uuid";

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

  const handleBlockUnblockAdmin = async () => {
    if (!selectedAdmin) return;
    setLoading(true);
    try {
      const updatedStatus = !selectedAdmin.isBlocked;
      await axiosInstance.patch(`/admin/block-admin/${selectedAdmin._id}`, {
        isBlocked: updatedStatus,
      });
      toast.success(
        `Admin ${updatedStatus ? "blocked" : "unblocked"} successfully.`
      );
      setAdmins(
        admins.map((admin) =>
          admin._id === selectedAdmin._id
            ? { ...admin, isBlocked: updatedStatus }
            : admin
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

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Admins</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddAdmin(true)}
        >
          Add Admin
        </Button>
      </div>
      <TextField
        label="Search Admins"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
              {filteredAdmins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    {" "}
                    <center>No admins found..</center>
                  </TableCell>
                </TableRow>
              )}
              {filteredAdmins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.uniqueId}</TableCell>
                  <TableCell>{admin.fullname}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setConfirmAction(admin.isBlocked ? "unblock" : "block");
                      }}
                      variant="contained"
                      color={admin.isBlocked ? "success" : "warning"}
                      style={{ marginRight: "8px" }}
                    >
                      {admin.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
      >
        <DialogTitle>
          Are you sure you want to {confirmAction} {selectedAdmin?.fullname}?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmAction(null)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBlockUnblockAdmin} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAdmins;
