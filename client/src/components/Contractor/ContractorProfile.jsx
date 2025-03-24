import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button, // Added Button import
} from "@mui/material";
import { Close, Description } from "@mui/icons-material";

const ContractorProfile = ({
  open,
  contractor,
  handleClose,
  handleProjectClick,
}) => {
  const [documentsDialog, setDocumentsDialog] = useState(false);

  const handleDocumentsDialogOpen = () => {
    setDocumentsDialog(true);
  };

  const handleDocumentsDialogClose = () => {
    setDocumentsDialog(false);
  };

  if (!contractor) return null;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          Contractor Profile
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            {/* Profile Picture */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: { xs: "100%", md: "30%" },
              }}
            >
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
              </Box>
            </Box>

            {/* Profile Details */}
            <Box sx={{ width: { xs: "100%", md: "70%" } }}>
              <Typography variant="body1" color="text.secondary">
                <strong>Email:</strong> {contractor.email}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>GST:</strong> {contractor.gstNumber}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Address:</strong> {contractor.address},{" "}
                {contractor.city}, {contractor.state}, {contractor.country}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Phone:</strong> {contractor.phone}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>JobTypes</strong> {contractor.jobTypes.join(", ")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Number of Employees:</strong>{" "}
                {contractor.numberOfEmployees}
              </Typography>
              <Typography
                variant="body1"
                color={contractor.availability ? "success.main" : "error.main"}
              >
                {contractor.availability ? "Available" : "Not Available"}
              </Typography>
            </Box>
          </Box>

          {/* Projects Section with Documents Button */}
          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Projects
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Description />}
              onClick={handleDocumentsDialogOpen}
              sx={{ textTransform: 'none' }}
            >
              View Documents
            </Button>
          </Box>

          <Grid container spacing={3}>
            {contractor.projects?.map((project, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  onClick={() => handleProjectClick(project)}
                  sx={{
                    cursor: "pointer",
                    height: 300,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={project.image}
                    alt={`Project ${index + 1}`}
                    sx={{
                      height: 180,
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={documentsDialog} onClose={handleDocumentsDialogClose}>
        <DialogTitle>
          Documents
          <IconButton
            onClick={handleDocumentsDialogClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            <strong>Licence Document:</strong>{" "}
            <img
              src={contractor.licenseDocument}
              alt="Licence"
              style={{ width: "100%", marginTop: 8 }}
            />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>GST Document:</strong>
            <img
              src={contractor.gstDocument}
              alt="GST"
              style={{ width: "100%", marginTop: 8 }}
            />
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractorProfile;