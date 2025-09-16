// server.js (✅ Fixed CommonJS style)

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./config/db");

// routes
const authRoutes = require("./routes/auth");
const storeRoutes = require("./routes/stores");
const adminRoutes = require("./routes/admin");
const ownerRoutes = require("./routes/owner");
const ratingRoutes = require("./routes/ratings"); // 🔹 changed import → require

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/ratings", ratingRoutes); // 🔹 now works

// test route
app.get("/", (req, res) => {
  res.send("✅ Store Rating API is running 🚀");
});

// start server
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err.message);
  });
