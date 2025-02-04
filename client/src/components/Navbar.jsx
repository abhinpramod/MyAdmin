import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import Cookies from "js-cookie";
import axiosInstance from "../lib/aixos";
import { logoutAdmin } from "../redux/adminSlice";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle search action
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Handle logout action
  const handleLogout = async () => {
    try {
      // Call API to remove cookie from server
      await axiosInstance.post("/admin/logout");

      // Remove token from client-side
      // Cookies.remove("jwt", { path: "/" });

      // Dispatch logout action to reset Redux state
      dispatch(logoutAdmin());

      // Redirect to login page
      navigate("/");

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="bg-white shadow-md w-full top-0 left-64 h-16 flex items-center px-6 justify-between z-40">
      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

      {/* Right Side: Search Bar & Logout */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-64"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="text-red-600 hover:text-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
