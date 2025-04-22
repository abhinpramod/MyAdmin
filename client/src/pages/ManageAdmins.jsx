import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { Box, Button, TablePagination } from "@mui/material";
import AdminTable from "../components/admin/AdminTable";
import AdminForm from "../components/admin/AdminForm";
import AdminFilter from "../components/admin/AdminFilter";
import { ConfirmationDialog } from "../components/admin/AdminDialogs";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [openEditAdmin, setOpenEditAdmin] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
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
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for filters
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
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
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const updateData = {
        fullname: formData.fullname,
        ...(formData.password && { password: formData.password }),
        role: formData.role
      };

      const res = await axiosInstance.patch(
        `/admin/edit-admin/${selectedAdmin._id}`,
        updateData
      );
      
      if (res.status === 200) {
        toast.success("Admin details updated successfully!");
        setAdmins(
          admins.map((admin) =>
            admin._id === selectedAdmin._id ? { ...admin, ...updateData } : admin
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

  // Handle Delete Admin
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;
    setLoading(true);
    try {
      await axiosInstance.delete(`/admin/delete-admin/${selectedAdmin._id}`);
      toast.success("Admin deleted successfully");
      setAdmins(admins.filter(admin => admin._id !== selectedAdmin._id));
      setOpenDeleteConfirm(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete admin");
    } finally {
      setLoading(false);
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
    setPage(0);
  };

  // Slice the admins for the current page
  const paginatedAdmins = filteredAdmins.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Action handlers
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      fullname: admin.fullname,
      email: admin.email,
      password: "",
      confirmPassword: "",
      role: admin.role
    });
    setOpenEditAdmin(true);
  };

  const handleBlockClick = (admin) => {
    setSelectedAdmin(admin);
    setConfirmAction(admin.isBlocked ? "unblock" : "block");
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setOpenDeleteConfirm(true);
  };

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

      <AdminFilter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        filters={filters}
        handleFilterChange={handleFilterChange}
      />

      <AdminTable 
        loading={loading}
        admins={paginatedAdmins}
        onEdit={handleEditClick}
        onBlock={handleBlockClick}
        onDelete={handleDeleteClick}
      />

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAdmins.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AdminForm
        open={openAddAdmin}
        onClose={() => setOpenAddAdmin(false)}
        onSubmit={handleAddAdmin}
        formData={formData}
        setFormData={setFormData}
        isEdit={false}
      />

      <AdminForm
        open={openEditAdmin}
        onClose={() => setOpenEditAdmin(false)}
        onSubmit={handleEditAdmin}
        formData={formData}
        setFormData={setFormData}
        isEdit={true}
      />

      <ConfirmationDialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleBlockUnblockAdmin}
        title={`Are you sure you want to ${confirmAction === "block" ? "block" : "unblock"} ${selectedAdmin?.fullname}?`}
      />

      <ConfirmationDialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={handleDeleteAdmin}
        title={`Are you sure you want to delete ${selectedAdmin?.fullname}?`}
        content="This action cannot be undone. All data associated with this admin will be permanently removed."
        confirmText="Delete"
        confirmColor="error"
      />
    </div>
  );
};

export default ManageAdmins;