const express = require("express");
const { Rating, User } = require("../models");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Add or Update rating for a store
router.post("/:storeId", auth("user"), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const storeId = req.params.storeId;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    let userRating = await Rating.findOne({ where: { UserId: userId, StoreId: storeId } });

    if (userRating) {
      userRating.rating = rating;
      userRating.comment = comment;
      await userRating.save();
    } else {
      userRating = await Rating.create({ rating, comment, UserId: userId, StoreId: storeId });
    }

    res.json(userRating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get ratings for a store
router.get("/:storeId", async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { StoreId: req.params.storeId },
      include: [{ model: User, attributes: ["name"] }],
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
