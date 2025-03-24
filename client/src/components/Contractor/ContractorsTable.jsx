import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  TablePagination,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { Block, CheckCircle } from "@mui/icons-material";

const ContractorsTable = ({
  contractors,
  loading,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleRowClick,
  handleConfirm,
  totalCount, // Add this prop

  filteredContractors,
  searchTerm,
}) => {
  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Profile</b>
                  </TableCell>
                  <TableCell>
                    <b>Company Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Contractor</b>
                  </TableCell>
                  <TableCell>
                    <b>Location</b>
                  </TableCell>
                  <TableCell>
                    <b>Phone</b>
                  </TableCell>
                  <TableCell>
                    <b>Employees</b>
                  </TableCell>
                  <TableCell>
                    <b>Job Types</b>
                  </TableCell>
                  <TableCell>
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contractors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No contractor match for <strong>{searchTerm}</strong>
                    </TableCell>
                  </TableRow>
                )}
                {contractors.map((contractor) => (
                  <TableRow
                    key={contractor._id}
                    hover
                    onClick={() => handleRowClick(contractor)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Avatar
                        src={contractor.profilePicture}
                        alt={contractor.contractorName}
                        sx={{ width: 40, height: 40 }}
                      >
                        {!contractor.profilePicture &&
                          contractor.contractorName.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{contractor.companyName}</TableCell>
                    <TableCell>{contractor.contractorName}</TableCell>
                    <TableCell>
                      {contractor.city}, {contractor.state},{" "}
                      {contractor.country}
                    </TableCell>
                    <TableCell>{contractor.phone}</TableCell>
                    <TableCell>{contractor.numberOfEmployees}</TableCell>
                    <TableCell>{contractor.jobTypes.join(", ")}</TableCell>
                    <TableCell>
                      <IconButton
                        color={!contractor.isBlocked ? "error" : "success"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirm(contractor._id, contractor.isBlocked);
                        }}
                      >
                        {contractor.isBlocked ? <CheckCircle /> : <Block />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
  rowsPerPageOptions={[5, 10, 25]}
  component="div"
  count={totalCount} // Use totalCount from backend
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
        </>
      )}
    </>
  );
};

export default ContractorsTable;