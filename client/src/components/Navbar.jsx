import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";


import { Menu, X } from "lucide-react";

const Navbar = ({ isSidebarOpen, onToggleSidebar }) => {
  
  // Handle logout confirmation dialog
  

  // Handle logout action
 

  return (
    <>
      {/* Navbar */}
      <header
        className={`bg-white shadow-md w-full fixed top-0 h-16 flex items-center px-6 justify-between z-50 transition-all duration-300 ${
          isSidebarOpen ? "left-64" : "left-20"
        }`}
      >
        {/* Toggle Button for Mobile */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

        {/* Right Side: Logout Button */}
       
      
      </header>

      {/* Logout Confirmation Dialog */}
      
    </>
  );
};

export default Navbar;