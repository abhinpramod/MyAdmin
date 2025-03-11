import { NavLink } from "react-router-dom";
import {
  Store,
  Users,
  UserCheck,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../lib/aixos";
import { logoutAdmin, loginAdmin } from "../redux/adminSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const Sidebar = ({ isSidebarOpen, onToggleSidebar }) => {
  const { admin } = useSelector((state) => state.admin);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/admin/check");
        if (res.status === 200) {
          dispatch(loginAdmin(res.data));
        } else {
          dispatch(logoutAdmin());
          console.log("Not authenticated");
          navigate("/");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        dispatch(logoutAdmin());
        navigate("/");
      } finally {
        // setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!admin) return null; // Don't render sidebar if admin is null

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/admin/logout");
      dispatch(logoutAdmin());
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    } finally {
      handleClose(); // Close the dialog after logout attempt
    }
  };

  return (
    <>
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
          {isSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Navigation Links */}
        <nav className="space-y-4 mt-4 flex-1">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? "bg-gray-800" : "hover:bg-gray-800"
              }`
            }
          >
            <LayoutDashboard />{" "}
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              Dashboard
            </span>
          </NavLink>
          <NavLink
            to="allusers"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? "bg-gray-800" : "hover:bg-gray-800"
              }`
            }
          >
            <Store className="w-5 h-5" />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              All Users
            </span>
          </NavLink>
          {/*  */}
          <NavLink
            to="stores"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? "bg-gray-800" : "hover:bg-gray-800"
              }`
            }
          >
            <Store className="w-5 h-5" />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              All Stores
            </span>
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
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              Store Requests
            </span>
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
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              Manage Contractors
            </span>
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
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
                Manage Admins
              </span>
            </NavLink>
          )}
        </nav>

        {/* Logout Button at the Bottom */}
        <div className="mt-auto">
          <button
            onClick={handleOpen}
            className={`flex items-center p-3 rounded-lg transition-colors w-full hover:bg-gray-800 ${
              isSidebarOpen ? "justify-start" : "justify-center"
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose} style={{ zIndex: 9999 }}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
