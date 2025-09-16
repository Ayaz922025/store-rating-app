import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Stats and users
    api.get("/admin/stats").then((res) => setStats(res.data));
    api.get("/admin/users").then((res) => setUsers(res.data));

    // Stores list for admin
    api.get("/admin/stores").then((res) => setStores(res.data));
  }, []);

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.address, u.role].join(" ").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: 12 }}>
        <div className="card"><h3>Users</h3>{stats.users}</div>
        <div className="card"><h3>Stores</h3>{stats.stores}</div>
        <div className="card"><h3>Ratings</h3>{stats.ratings}</div>
      </div>

      {/* Add Buttons */}
      <div style={{ margin: "12px 0" }}>
        <Link to="/admin/users/new" className="btn">+ Add User</Link>
        <Link to="/admin/stores/new" className="btn" style={{ marginLeft: 8 }}>+ Add Store</Link>
      </div>

      {/* Stores Table */}
      <div className="card">
        <h3>Stores</h3>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Owner Email</th><th>Address</th><th>Avg Rating</th></tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.ownerEmail || "—"}</td>
                <td>{s.address}</td>
                <td>{s.avgRating ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Table */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3>Users</h3>
        <input
          className="input"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
