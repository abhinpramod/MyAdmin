import { NavLink } from "react-router-dom";
import { Store, Users, UserCheck } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { admin } = useSelector((state) => state.admin);

  if (!admin) return null; // Don't render sidebar if admin is null

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col p-4">
      <h2 className="text-xl font-bold text-red-500 mb-6">LocalFinder Admin</h2>
      <nav className="space-y-4">
        <NavLink
          to="allusers"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Store className="w-5 h-5 mr-3" /> All Users
        </NavLink>
        <NavLink
          to="contractors"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Users className="w-5 h-5 mr-3" /> All Contractors
        </NavLink>
        <NavLink
          to="stores"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Store className="w-5 h-5 mr-3" /> All Stores
        </NavLink>
        <NavLink
          to="store-requests"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Store className="w-5 h-5 mr-3" /> Store Requests
        </NavLink>
        <NavLink
          to="contractor-requests"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <Users className="w-5 h-5 mr-3" /> Contractor Requests
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
            <UserCheck className="w-5 h-5 mr-3" /> Manage Admins
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
