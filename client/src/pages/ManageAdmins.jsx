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
  MenuItem,
} from "@mui/material";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null); // For deletion
  const [openAddAdmin, setOpenAddAdmin] = useState(false); // For Add Admin modal
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // Fetch the list of admins
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

  // Handle add admin
  const handleAddAdmin = async () => {
    if (!formData.fullname.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (!formData.confirmPassword)
      return toast.error("Confirm Password is required");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");
    if (!formData.role) return toast.error("Please select a role");

    try {
      const res = await axiosInstance.post("admin/addadmin", formData);
      if (res.status === 201) {
        toast.success("Admin added successfully!");
        setAdmins([...admins, res.data]); // Update admin list instantly
        setFormData({ fullname: "", email: "", password: "", confirmPassword: "", role: "" });
        setOpenAddAdmin(false);
      }
    } catch (error) {
      console.log("Error in adding admin:", error);
      toast.error(error.response?.data?.msg || "Failed to add admin");
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    setLoading(true);
    try {
      await axiosInstance.delete(`/admin/delete-admin/${selectedAdmin._id}`);
      toast.success("Admin deleted successfully.");
      setAdmins(admins.filter((admin) => admin._id !== selectedAdmin._id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete admin.");
    } finally {
      setLoading(false);
      setSelectedAdmin(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Admins</h2>
        <Button variant="contained" color="primary" onClick={() => setOpenAddAdmin(true)}>
          Add Admin
        </Button>
      </div>

      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td className="px-4 py-2 border">{admin.id}</td>
              <td className="px-4 py-2 border">{admin.fullname}</td>
              <td className="px-4 py-2 border">{admin.email}</td>
              <td className="px-4 py-2 border">{admin.role}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => setSelectedAdmin(admin)}
                  className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Admin Modal */}
      <Dialog open={openAddAdmin} onClose={() => setOpenAddAdmin(false)}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            name="fullname"
            fullWidth
            value={formData.fullname}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Role"
            name="role"
            fullWidth
            select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            margin="normal"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="superadmin">Super Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddAdmin(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddAdmin} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete {selectedAdmin.fullname}?
            </h3>
            <div className="flex justify-end gap-4">
              <Button onClick={() => setSelectedAdmin(null)} variant="contained" color="secondary">
                Cancel
              </Button>
              <Button onClick={handleDeleteAdmin} variant="contained" color="error">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
