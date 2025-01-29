import { Link } from "react-router-dom";
import { Store, Users, UserPlus, UserCheck } from "lucide-react";
import React from "react";
const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col p-4">
      {/* Logo / App Name */}
      <h2 className="text-xl font-bold text-red-500 mb-6">LocalFinder Admin</h2>

      {/* Navigation Links */}
      <nav className="space-y-4">
        <Link to="stores" className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
          <Store className="w-5 h-5 mr-3" /> All Users
        </Link>
        <Link to="contractors" className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
          <Users className="w-5 h-5 mr-3" /> All Contractors
        </Link>
        <Link to="stores" className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
          <Store className="w-5 h-5 mr-3" /> All Stores
        </Link>
        <Link to="store-requests" className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
          <Store className="w-5 h-5 mr-3" /> Store Requests
        </Link>
        <Link to="contractor-requests" className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
          <Users className="w-5 h-5 mr-3" /> Contractor Requests
        </Link>

        {/* Super Admin Options */}
        <Link to="add-admin" className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
          <UserPlus className="w-5 h-5 mr-3" /> Add Admin
        </Link>
        <Link to="manage-admins" className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
          <UserCheck className="w-5 h-5 mr-3" /> Manage Admins
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
