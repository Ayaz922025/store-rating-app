import React, { useEffect, useState } from "react";
import api from "../services/api";

function StoreOwnerDashboard() {
  const [store, setStore] = useState({});
  const [ratings, setRatings] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");

  // Fetch store ratings
  useEffect(() => {
    api.get("/owner/my-store/ratings", {
      headers: { Authorization: "Bearer " + token },
    })
    .then(res => {
      setStore({ name: res.data.store, avgRating: res.data.avgRating });
      setRatings(res.data.ratings);
    })
    .catch(err => console.error(err));
  }, [token]);

  // Update password
  const handlePasswordUpdate = () => {
    api.put(
      "/owner/update-password",
      { oldPassword, newPassword },
      { headers: { Authorization: "Bearer " + token } }
    )
    .then(res => setMsg(res.data.message))
    .catch(err => setMsg(err.response?.data?.message || "Error"));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h2>Store Owner Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>{store.name}</h3>
      <p>Average Rating: {store.avgRating ?? "—"}</p>

      <h4>User Ratings</h4>
      <table>
        <thead>
          <tr><th>User</th><th>Rating</th><th>Comment</th></tr>
        </thead>
        <tbody>
          {ratings.map(r => (
            <tr key={r.id}>
              <td>{r.userName}</td>
              <td>{r.rating}</td>
              <td>{r.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Update Password</h4>
      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={handlePasswordUpdate}>Update Password</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default StoreOwnerDashboard;
