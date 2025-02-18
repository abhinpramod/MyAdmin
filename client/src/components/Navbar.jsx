import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../lib/aixos";
import { logoutAdmin } from "../redux/adminSlice";
import { toast } from "react-hot-toast";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle logout confirmation dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle logout action
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/admin/logout");

      dispatch(logoutAdmin());
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    } finally {
      handleClose(); // Close the dialog after logout attempt
    }
  };

  return (
    <>
      <header className="bg-white shadow-md w-full top-0 left-64 h-16 flex items-center px-6 justify-between z-40">
        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

        {/* Right Side: Logout Button */}
        <div className="flex items-center space-x-4">
          <Button variant="outlined" color="error" onClick={handleOpen}>
            Logout
          </Button>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">Logout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
