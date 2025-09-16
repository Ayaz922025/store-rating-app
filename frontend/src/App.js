import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddUser from "./pages/AdminAddUser";
import AdminAddStore from "./pages/AdminAddStore";
import UserStores from "./pages/UserStores";
import Profile from "./pages/Profile";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Normal User Routes */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "store_owner"]}>
                <UserStores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "store_owner"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAddStore />
              </ProtectedRoute>
            }
          />

          {/* Store Owner Route */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={["store_owner"]}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
