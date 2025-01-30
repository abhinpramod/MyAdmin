import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Stores from "./pages/Stores";
import Contractors from "./pages/Contractors";
import StoreRequests from "./pages/StoreRequests";
import ContractorRequests from "./pages/ContractorRequests";
import AddAdmin from "./pages/AddAdmin";
import ManageAdmins from "./pages/ManageAdmins";
import React from "react";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Layout />}>
          <Route path="stores" element={<Stores />} />
          <Route path="contractors" element={<Contractors />} />
          <Route path="store-requests" element={<StoreRequests />} />
          <Route path="contractor-requests" element={<ContractorRequests />} />
          <Route path="add-admin" element={<AddAdmin />} />
          <Route path="manage-admins" element={<ManageAdmins />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
