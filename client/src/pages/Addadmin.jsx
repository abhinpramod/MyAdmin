import { useState } from "react";
import React from "react";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.role) newErrors.role = "Please select a role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("New Admin Details:", formData);
      alert("Admin added successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      setErrors({});
    }
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Enter full name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Enter email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-gray-700">Position</label>
          <select
            name="position"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Select position</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
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
