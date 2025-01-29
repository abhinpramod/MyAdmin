import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import React from "react";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen">
      {/* Sticky Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        {/* Sticky Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="p-6 overflow-auto flex-1  bg-gray-100 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
