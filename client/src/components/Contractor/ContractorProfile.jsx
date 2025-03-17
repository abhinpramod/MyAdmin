import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Button,
} from "@mui/material";

const ContractorProfile = ({ contractor, onClose }) => {
  return (
    <Box sx={{ p: 6, mt: 5, maxWidth: "4xl", mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Profile Header */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Profile Picture */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: { xs: "100%", md: "30%" } }}>
            <Avatar
              sx={{ width: 128, height: 128, border: "4px solid #e0e0e0" }}
              src={contractor.profilePicture}
            />
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="h6" fontWeight="bold">
                {contractor.companyName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {contractor.contractorName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {contractor.description}
              </Typography>
            </Box>
          </Box>

          {/* Profile Details */}
          <Box sx={{ width: { xs: "100%", md: "70%" }, spaceY: 2 }}>
            <Typography variant="body1" color="text.secondary">
              <strong>Email:</strong> {contractor.email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>GST:</strong> {contractor.gstNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Address:</strong> {contractor.address}, {contractor.city}, {contractor.state}, {contractor.country}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Number of Employees:</strong> {contractor.numberOfEmployees}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Projects Section */}
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Projects
          </Typography>
          <Grid container spacing={3}>
            {contractor.projects?.map((project, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card sx={{ cursor: "pointer", height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={project.image}
                    alt={`Project ${index + 1}`}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Close Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ContractorProfile;