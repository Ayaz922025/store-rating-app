import React, { useEffect, useState } from "react";
import api from "../services/api";

 function StoreOwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    api.get("/owner/stores").then((res) => {
      setStores(res.data);
      if (res.data.length) setSelected(res.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selected) {
      api.get(`/stores/${selected}/ratings`).then((res) => setRatings(res.data));
    }
  }, [selected]);

  const avg =
    ratings.length > 0
      ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(2)
      : "—";

  return (
    <div>
      <h2>Store Owner Dashboard</h2>
      <div className="card">
        <select
          className="input"
          value={selected || ""}
          onChange={(e) => setSelected(e.target.value)}
        >
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3>Ratings</h3>
        <p>Average Rating: {avg}</p>
        <table className="table">
          <thead><tr><th>User</th><th>Rating</th><th>Comment</th></tr></thead>
          <tbody>
            {ratings.map((r) => (
              <tr key={r.id}>
                <td>{r.userName}</td>
                <td>{r.rating}</td>
                <td>{r.comment || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;