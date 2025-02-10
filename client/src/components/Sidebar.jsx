import { Link } from "react-router-dom";
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
        <Link to="allusers" className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
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

        {/* Show Manage Admins only if admin is superadmin */}
        {admin.role === "superadmin" && (
          <Link to="manage-admins" className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
            <UserCheck className="w-5 h-5 mr-3" /> Manage Admins
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
