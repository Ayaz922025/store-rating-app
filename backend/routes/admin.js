const express = require("express");
const bcrypt = require("bcryptjs");
const { User, Store, Rating } = require("../models");

const router = express.Router();

// ✅ Stats
router.get("/stats", async (req, res) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();
    res.json({ users, stores, ratings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "address", "role"]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all stores with owner email and average rating
router.get("/stores", async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [{ model: User, as: "owner", attributes: ["email", "name"] }],
    });

    const data = await Promise.all(
      stores.map(async (s) => {
        const ratings = await Rating.findAll({ where: { StoreId: s.id } });
        const avgRating =
          ratings.length > 0
            ? (ratings.reduce((a, r) => a + r.rating, 0) / ratings.length).toFixed(2)
            : null;

        return {
          id: s.id,
          name: s.name,
          address: s.address,
          ownerEmail: s.owner.email,
          avgRating,
        };
      })
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add a new user (admin only)
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if email exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || "user", // default role is user
    });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add a new store (admin only)
router.post("/stores", async (req, res) => {
  try {
    const { name, address, ownerId } = req.body;

    // Check owner exists
    const owner = await User.findByPk(ownerId);
    if (!owner) return res.status(400).json({ message: "Owner not found" });

    // Create store
    const store = await Store.create({
      name,
      address,
      ownerId: owner.id,
    });

    res.json({ message: "Store created successfully", store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
