import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import React, { useState } from "react";
import Navbar from "./Navbar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sticky Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        {/* Sticky Navbar */}
        <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

        {/* Dynamic Page Content */}
        <main
          className={`p-6 overflow-auto flex-1 bg-gray-100 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
          style={{ paddingTop: "4rem" }} // Add padding-top to account for Navbar height
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;