import { useState } from "react";
import React from "react";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    position: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("New Admin Details:", formData);
    // Send formData to backend API
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
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Enter full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
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
            required
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
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Re-enter password"
          />
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
