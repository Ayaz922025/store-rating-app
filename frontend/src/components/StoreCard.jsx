// frontend/src/components/StoreCard.jsx
import React, { useState } from "react";
import api from "../services/api";

function StoreCard({ store, userRating, onRatingUpdated }) {
  const [rating, setRating] = useState(userRating || 0);
  const stars = [1, 2, 3, 4, 5];

  async function submitRating(val) {
    try {
      await api.post(`/stores/${store.id}/ratings`, { rating: val });
      setRating(val);
      if (onRatingUpdated) onRatingUpdated();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit rating");
    }
  }

  return (
    <div className="card">
      <h3>{store.name}</h3>
      <div className="small">{store.address}</div>
      <div><strong>Average:</strong> {store.avgRating ?? "—"}</div>
      <div className="rating">
        {stars.map((s) => (
          <button
            key={s}
            style={{ border: "none", background: "transparent", cursor: "pointer", opacity: s <= rating ? 1 : 0.3 }}
            onClick={() => submitRating(s)}
            aria-label={`Rate ${s} star`}
          >
            <span className="star">★</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StoreCard;
