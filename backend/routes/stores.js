const express = require("express");
const { body, validationResult } = require("express-validator");
const { Store, Rating, User } = require("../models");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Get all stores with average rating
router.get("/", async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [{ model: Rating, attributes: ["rating"] }],
    });

    const data = stores.map((s) => {
      const avg =
        s.Ratings.length > 0
          ? (
              s.Ratings.reduce((a, b) => a + b.rating, 0) / s.Ratings.length
            ).toFixed(2)
          : null;
      return { id: s.id, name: s.name, address: s.address, avgRating: avg };
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stores" });
  }
});

// ✅ Submit or update rating
router.post(
  "/:id/ratings",
  auth("user"),
  [body("rating").isInt({ min: 1, max: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      const store = await Store.findByPk(id);
      if (!store) return res.status(404).json({ message: "Store not found" });

      let rate = await Rating.findOne({ where: { UserId: req.user.id, StoreId: id } });
      if (rate) {
        rate.rating = rating;
        rate.comment = comment;
        await rate.save();
      } else {
        rate = await Rating.create({
          rating,
          comment,
          UserId: req.user.id,
          StoreId: id,
        });
      }

      res.json(rate);
    } catch (err) {
      res.status(500).json({ message: "Error saving rating" });
    }
  }
);

// ✅ Get ratings for a store
router.get("/:id/ratings", auth(), async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { StoreId: req.params.id },
      include: [{ model: User, attributes: ["name"] }],
    });

    res.json(
      ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        userName: r.User.name,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Error fetching ratings" });
  }
});

module.exports = router;
