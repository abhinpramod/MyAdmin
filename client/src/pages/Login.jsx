import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper, Box, Grid, Link } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { loginAdmin } from "../redux/adminSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email){tempErrors.email = "Email is required"}else{
      tempErrors.email = /.+@.+\..+/.test(formData.email) ? "" : "Invalid email format";

    }
    tempErrors.password = formData.password ? "" : "Password is required";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const login = async (data) => {
    try {
      const res = await axiosInstance.post("admin/login", data);
      toast.success("Welcome back!");
      dispatch(loginAdmin({ admin: res.data })); // Store in Redux
      console.log(res.data);

      navigate("/admin/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Login failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      login(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 10, marginTop: 15 }}>
        <Grid container spacing={2}>
          {/* Left Side Image (Only visible on large screens) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center" }}>
         <img src="/login.png" alt="image" style={{ maxWidth: "80%" }} />

          </Grid>

          {/* Right Side Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" align="center" gutterBottom>
              Admin Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
              />
              <Box textAlign="center" marginTop={2}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Login
                </Button>
              </Box>
              <Box textAlign="center" marginTop={2}>
                <Typography variant="body2">
                  Don't have an account? <Link href="/admin/register">Sign up</Link>
                </Typography>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;