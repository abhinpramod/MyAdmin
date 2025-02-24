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
} from "@mui/material";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";
import {  Block, CheckCircle } from "@mui/icons-material";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/user/get-all-users");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter((user) =>
      [user.name, user.email, user.phone]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

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

  return (
    <>
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.isBlocked ? "Blocked" : "Active"}</TableCell>
                <TableCell>
                  <IconButton
                    variant="contained"
                    color={user.isBlocked ? "success" : "error"}
                    onClick={() => handleOpenDialog(user)}
                  >
                      {user.isBlocked ? <CheckCircle /> : <Block />}{" "}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Confirm {selectedUser?.isBlocked ? "unblock" : "block"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedUser?.isBlocked ? "unblock" : "block"} this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllUsers;
