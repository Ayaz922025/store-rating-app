import React, { useEffect, useState } from "react";
import api from "../services/api";

function UserStores() {
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState({}); // storeId → rating

  useEffect(() => {
    api.get("/stores").then((res) => setStores(res.data));
    // fetch user's ratings
    api.get("/stores/my-ratings").then((res) => {
      const map = {};
      res.data.forEach((r) => {
        map[r.StoreId] = r.rating;
      });
      setMyRatings(map);
    });
  }, []);

  const handleRate = async (storeId, rating) => {
    try {
      const res = await api.post(`/ratings/${storeId}`, { rating });
      setMyRatings({ ...myRatings, [storeId]: res.data.rating });
    } catch (err) {
      alert("Failed to submit rating");
    }
  };

  return (
    <div>
      <h2>Stores</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Avg Rating</th>
            <th>My Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.avgRating ?? "—"}</td>
              <td>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRate(s.id, r)}
                    style={{
                      margin: "0 2px",
                      background: myRatings[s.id] === r ? "#3182ce" : "#e2e8f0",
                      color: myRatings[s.id] === r ? "white" : "black",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserStores;
