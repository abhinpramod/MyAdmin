import React from "react";
import { Card, CardContent, Typography, Box, Button, Grid } from "@mui/material";

const RequestCard = ({ request, tab, handleConfirm, handleImageClick }) => {
  return (
    <Card
      sx={{
        my: 2,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Grid container spacing={2}>
        {/* Left Side: Request Details */}
        <Grid item xs={12} md={7}>
          <CardContent>
            <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
              {request.companyName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
              <strong>Contractor:</strong> {request.contractorName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
              <strong>Email:</strong> {request.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
              <strong>Phone:</strong> {request.phone}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
              <strong>Number of Employees:</strong> {request.numberOfEmployees}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
              <strong>Job Types:</strong> {request.jobTypes.join(", ")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, color: "#555" }}>
              <strong>Location:</strong> {request.country}, {request.state}, {request.city}
            </Typography>
            {tab === 2 && (
              <Typography variant="body1" sx={{ mb: 2, color: "#555" }}>
                <strong>GST Number:</strong> {request.gstNumber}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleConfirm("approve", request._id)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleConfirm("reject", request._id)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                Reject
              </Button>
            </Box>
          </CardContent>
        </Grid>

        {/* Right Side: Document Images */}
        {tab === 2 && (
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 6 }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                  License Document:
                </Typography>
                <img
                  src={request.licenseDocument}
                  alt="License Document"
                  style={{ width: "300px", height: "200px", borderRadius: "8px", cursor: "pointer" }}
                  onClick={() => handleImageClick(request.licenseDocument)}
                />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                  GST Document:
                </Typography>
                <img
                  src={request.gstDocument}
                  alt="GST Document"
                  style={{ width: "300px", height: "200px", borderRadius: "8px", cursor: "pointer" }}
                  onClick={() => handleImageClick(request.gstDocument)}
                />
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default RequestCard;