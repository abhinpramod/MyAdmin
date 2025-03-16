import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TablePagination, 
} from "@mui/material";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";
import { Block, CheckCircle } from "@mui/icons-material";
import { Loader } from "lucide-react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isloading,setIsloading]=useState(false)

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // State for filters
  const [filters, setFilters] = useState({
    status: "", // 'blocked' or 'active'
    startDate: "", // Start date for filtering
    endDate: "", // End date for filtering
  });

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsloading(true)
        const response = await axiosInstance.get("/user/get-all-users");
        setUsers(response.data);
        setFilteredUsers(response.data);
        setIsloading(false)
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error(error)
        setIsloading(false)
      }
    };

    fetchUsers();
  }, []);

  // Handle Search and Filters
  useEffect(() => {
    const results = users.filter((user) => {
      // Search by name, email, or phone
      const matchesSearchTerm = [user.name, user.email, user.phone]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus =
        filters.status === "" ||
        (filters.status === "blocked" && user.isBlocked) ||
        (filters.status === "active" && !user.isBlocked);

      // Filter by date range
      const userDate = new Date(user.createdAt);
      const matchesStartDate =
        !filters.startDate || userDate >= new Date(filters.startDate);
      const matchesEndDate =
        !filters.endDate || userDate <= new Date(filters.endDate);

      return matchesSearchTerm && matchesStatus && matchesStartDate && matchesEndDate;
    });

    setFilteredUsers(results);
  }, [searchTerm, users, filters]);

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Open Dialog
  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  // Handle Close Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  // Handle Confirm Action (Block/Unblock)
  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    const { _id, isBlocked } = selectedUser;

    try {
      await axiosInstance.put(`/user/block/${_id}`, { isBlocked: !isBlocked });
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === _id ? { ...user, isBlocked: !isBlocked } : user
        )
      );
    } catch (error) {
      console.error("Error updating block status:", error);
      toast.error(error.response?.data?.msg || "Failed to update user status");
    } finally {
      handleCloseDialog();
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Slice the users for the current page
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if(isloading){

    return (   <div className="flex items-center justify-center h-screen">
                    <Loader className="size-10 animate-spin" />
            
            
          </div>)
  } else{
  return (
    <>
      {/* Search Bar */}
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        margin="normal"
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

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users match for <strong>{searchTerm}</strong>
                </TableCell>
              </TableRow>
            )}
            {paginatedUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "N/A"}</TableCell>
                <TableCell>
                  <span
                    style={{
                      backgroundColor: user.isBlocked ? "#EF4444" : "#22C55E",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      display: "inline-block",
                      fontSize: "12px",
                    }}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton
                    variant="contained"
                    color={user.isBlocked ? "success" : "error"}
                    onClick={() => handleOpenDialog(user)}
                  >
                    {user.isBlocked ? <CheckCircle /> : <Block />}
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
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Confirm {selectedUser?.isBlocked ? "unblock" : "block"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {selectedUser?.isBlocked ? "unblock" : "block"} this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
}

export default AllUsers;