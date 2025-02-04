import { useState, useEffect } from "react";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";
import React from "react";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null); // Admin selected for deletion

  // Fetch the list of admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-all-admins");
        setAdmins(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch admins.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Handle delete admin
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    setLoading(true);
    try {
      await axiosInstance.delete(`/admin/delete-admin/${selectedAdmin._id}`);
      toast.success("Admin deleted successfully.");
      setAdmins(admins.filter((admin) => admin._id !== selectedAdmin._id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete admin.");
    } finally {
      setLoading(false);
      setSelectedAdmin(null); // Close modal after deletion
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>
      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td className="px-4 py-2 border">{admin.id}</td>
              <td className="px-4 py-2 border">{admin.fullname}</td>
              <td className="px-4 py-2 border">{admin.email}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => setSelectedAdmin(admin)}
                  className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete {selectedAdmin.fullname}?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedAdmin(null)}
                className="bg-gray-300 text-black py-1 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAdmin}
                className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
