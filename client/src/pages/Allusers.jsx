import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, CircularProgress, Box, IconButton, InputLabel,
  FormControl, Select, MenuItem, Typography, Alert, TablePagination,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { Block, CheckCircle, Edit, Add } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import axiosInstance from '../lib/aixos';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/user/get-all-users', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          ...filters
        }
      });

      setUsers(response.data.data || []);
      setTotalUsers(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || 'Failed to fetch users');
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, rowsPerPage, searchTerm, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add User Functions
  const handleAddUser = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setOpenAddDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      confirmPassword: ''
    });
    setOpenEditDialog(true);
  };

  const handleBlockClick = (user) => {
    setSelectedUser(user);
    setOpenBlockDialog(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (openAddDialog && !formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (openAddDialog && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }

    if (openAddDialog && (!formData.password || formData.password.length < 6)) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const submitAddUser = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/user/create', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      setUsers(prev => [response.data, ...prev]);
      setOpenAddDialog(false);
      setError(null);
      toast.success('User added successfully!');
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmBlockAction = async () => {
    if (!selectedUser) return;
    
    try {
      setIsLoading(true);
      await axiosInstance.put(`/user/block/${selectedUser._id}`, {
        isBlocked: !selectedUser.isBlocked
      });
      
      setUsers(prev => prev.map(u => 
        u._id === selectedUser._id ? { ...u, isBlocked: !u.isBlocked } : u
      ));
      
      toast.success(`User ${selectedUser.isBlocked ? 'unblocked' : 'blocked'} successfully`);
      setOpenBlockDialog(false);
    } catch (error) {
      setError('Failed to update user status');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSaveChanges = async () => {
    if (!validateForm() || !selectedUser) return;

    try {
      setIsLoading(true);
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        ...(formData.password && { password: formData.password })
      };

      await axiosInstance.put(`/user/update/${selectedUser._id}`, updateData);
      
      setUsers(prev => prev.map(u => 
        u._id === selectedUser._id ? { ...u, ...updateData } : u
      ));
      
      toast.success('User updated successfully!');
      setOpenEditDialog(false);
      setOpenSaveDialog(false);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Users"
          sx={{ width: '50%' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={handleFilterChange}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map(user => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{
                          bgcolor: user.isBlocked ? 'error.main' : 'success.main',
                          color: 'white',
                          px: 1,
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color={user.isBlocked ? 'success' : 'error'}
                          onClick={() => handleBlockClick(user)}
                        >
                          {user.isBlocked ? <CheckCircle /> : <Block />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </>
      )}

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleFormChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleFormChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={submitAddUser} variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="New Password (leave blank to keep current)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleFormChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => setOpenSaveDialog(true)} 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog 
        open={openBlockDialog} 
        onClose={() => setOpenBlockDialog(false)}
      >
        <DialogTitle>
          Confirm {selectedUser?.isBlocked ? 'Unblock' : 'Block'} User
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedUser?.isBlocked ? 'unblock' : 'block'} {selectedUser?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmBlockAction} 
            color={selectedUser?.isBlocked ? 'success' : 'error'} 
            variant="contained"
          >
            {selectedUser?.isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Changes Confirmation Dialog */}
      <Dialog 
        open={openSaveDialog} 
        onClose={() => setOpenSaveDialog(false)}
      >
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save these changes to {selectedUser?.name}'s profile?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmSaveChanges} 
            color="primary" 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllUsers;