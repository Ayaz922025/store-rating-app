// frontend/src/components/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/auth";

function NavBar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
  };

  return (
    <nav className="nav">
      <div style={{ fontWeight: "bold" }}>
        <Link to="/" style={{ color: "#111", textDecoration: "none" }}>StoreRatings</Link>
      </div>

      <div>
        <Link to="/stores">Stores</Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            {user.role === "store_owner" && <Link to="/owner">Owner</Link>}
            <button className="btn" onClick={onLogout} style={{ marginLeft: 8 }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
