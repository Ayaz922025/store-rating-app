// frontend/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    // redirect based on role
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "store_owner") return <Navigate to="/owner" replace />;
    return <Navigate to="/stores" replace />;
  }

  return children;
}

export default ProtectedRoute;
