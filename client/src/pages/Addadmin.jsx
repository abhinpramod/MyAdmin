import { useState } from "react";
import React from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/aixos";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addAdmin = async (data) => {
    console.log("Sending data to server:", data); // Debugging log
    
    try {
      const res = await axiosInstance.post("admin/addadmin", data);
      if (res.status === 201) {
        toast.success("Admin added successfully!");
        setFormData({
          fullname: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
        });
      }
    } catch (error) {
      console.log("Error in adding admin:", error);
      toast.error(error.response?.data?.msg || "Failed to add admin");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // **Validation**
    if (!formData.fullname.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (!formData.confirmPassword)
      return toast.error("Confirm Password is required");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");
    if (!formData.role) return toast.error("Please select a role");

    // **Generate uniqueId before sending the request**
    const uniqueId = uuid().slice(0, 8);
    console.log("Generated Unique ID:", uniqueId); // Debugging log
    
    const finalData = { ...formData, uniqueId };
    
    console.log("Final data before sending:", finalData); // Debugging log
    addAdmin(finalData);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Enter full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email Address</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Enter email"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Enter password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Re-enter password"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-gray-700">Position</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Select position</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Add Admin
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;
