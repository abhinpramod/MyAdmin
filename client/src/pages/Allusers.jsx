import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, CircularProgress, Box, IconButton, InputLabel,
  FormControl, Select, MenuItem, Typography, Alert, TablePagination
} from '@mui/material';
import { Block, CheckCircle } from '@mui/icons-material';
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

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/user/get-all-users', {
        params: {
          page: page + 1, // +1 because backend pages start at 1
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

  // Load data when page, filters, or search term changes
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

  const handleUserAction = async (user) => {
    try {
      await axiosInstance.put(`/user/block/${user._id}`, {
        isBlocked: !user.isBlocked
      });
      setUsers(prev => prev.map(u => 
        u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
      ));
    } catch (error) {
      setError('Failed to update user status');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  return (
    <div style={{ padding: '20px' }}>
      <TextField
        label="Search Users"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
                          color={user.isBlocked ? 'success' : 'error'}
                          onClick={() => handleUserAction(user)}
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
    </div>
  );
};

export default AllUsers;