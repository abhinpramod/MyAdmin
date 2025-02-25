import { NavLink } from "react-router-dom";
import { Store, Users, UserCheck, Menu, X } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const Sidebar = ({ isSidebarOpen, onToggleSidebar }) => {
  const { admin } = useSelector((state) => state.admin);

  if (!admin) return null; // Don't render sidebar if admin is null

  return (
    <aside
      className={`bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col p-4 transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleSidebar}
        className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none self-end"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

     

      {/* Navigation Links */}
      <nav className="space-y-4 mt-4">
        <NavLink
          to="allusers"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Store className="w-5 h-5" />
          <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>All Users</span>
        </NavLink>
        <NavLink
          to="contractors"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>All Contractors</span>
        </NavLink>
        <NavLink
          to="stores"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Store className="w-5 h-5" />
          <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>All Stores</span>
        </NavLink>
        <NavLink
          to="store-requests"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Store className="w-5 h-5" />
          <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Store Requests</span>
        </NavLink>
        <NavLink
          to="contractor-requests"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Contractor Requests</span>
        </NavLink>

        {/* Show Manage Admins only if admin is superadmin */}
        {admin.role === "superadmin" && (
          <NavLink
            to="manage-admins"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? "bg-gray-800" : "hover:bg-gray-800"
              }`
            }
          >
            <UserCheck className="w-5 h-5" />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>Manage Admins</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;