const express = require("express");
const bcrypt = require("bcryptjs");
const { Store, Rating, User } = require("../models");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Get ratings for logged-in store owner
router.get("/my-store/ratings", auth("store_owner"), async (req, res) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const ratings = await Rating.findAll({
      where: { StoreId: store.id },
      include: [{ model: User, attributes: ["name"] }],
    });

    res.json({
      store: store.name,
      avgRating:
        ratings.length > 0
          ? (ratings.reduce((a, r) => a + r.rating, 0) / ratings.length).toFixed(2)
          : null,
      ratings: ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        userName: r.User.name,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update password
router.put("/update-password", auth("store_owner"), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
