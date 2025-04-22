import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
  } from "@mui/material";
  import AdminActions from "./AdminActions";
  
  const AdminTable = ({ loading, admins, onEdit, onBlock, onDelete }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-40">
          <CircularProgress />
        </div>
      );
    }
  
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.uniqueId}</TableCell>
                  <TableCell>{admin.fullname}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {admin.isBlocked ? (
                      <span className="text-red-500">Blocked</span>
                    ) : (
                      <span className="text-green-500">Active</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <AdminActions 
                      admin={admin} 
                      onEdit={onEdit} 
                      onBlock={onBlock} 
                      onDelete={onDelete} 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default AdminTable;