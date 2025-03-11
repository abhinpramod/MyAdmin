import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import axiosInstance from "./lib/aixos";
import { loginAdmin, logoutAdmin } from "./redux/adminSlice";


// Components & Pages
import Layout from "./components/Layout";
import Stores from "./pages/Stores";
import Contractors from "./pages/Contractors";
import StoreRequests from "./pages/StoreRequests";
import ContractorRequests from "./pages/ContractorRequests";
import Allusers from "./pages/Allusers";
import ManageAdmins from "./pages/ManageAdmins";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
function App() {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);
  const [loading, setLoading] = useState(true); // Start with loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/admin/check");
        if (res.status === 200) {
          dispatch(loginAdmin(res.data));
        } else {
          dispatch(logoutAdmin());
        }
      } catch (error) {
        console.error("Authentication error:", error);
        dispatch(logoutAdmin());
          Navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Redirect logged-in admins away from the login page */}
          <Route
            path="/"
            element={admin ? <Navigate to="/admin/stores" /> : <Login />}
          />
          {console.log(admin)}

          {/* Protect admin routes */}
          <Route
            path="/admin"
            element={admin ? <Layout /> : <Navigate to="/" />}
          >
            <Route path="stores" element={<Stores />} />
            <Route path="contractors" element={<Contractors />} />
            <Route path="store-requests" element={<StoreRequests />} />
            <Route
              path="contractor-requests"
              element={<ContractorRequests />}
            />
            <Route path="allusers" element={<Allusers />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="manage-admins"
              element={
                admin && admin.role === "superadmin" ? (
                  <ManageAdmins />
                ) : (
                  <Navigate to="/admin/dashboard" />
                )
              }
            />

            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
