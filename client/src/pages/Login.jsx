import { useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/aixos";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../redux/adminSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
      toast.error("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      toast.error("Invalid email format");
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      toast.error("Password is required");
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      toast.error("Password must be at least 6 characters");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async (data) => {
    try {
      const res = await axiosInstance.post("admin/login", data);
      toast.success("Welcome back!");
      dispatch(loginAdmin({ admin: res.data })); // Store in Redux
      console.log(res.data);
      
      navigate("/admin");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-sm w-full">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;