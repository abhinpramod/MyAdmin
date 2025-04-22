import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React from "react";

const AdminFilter = ({ searchTerm, setSearchTerm, filters, handleFilterChange }) => {
  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Search Admins"
          variant="outlined"
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "100%", height: "40px" }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
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
    </>
  );
};

export default AdminFilter;