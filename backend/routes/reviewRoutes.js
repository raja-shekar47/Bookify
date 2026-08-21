const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewControllers");
const { adminOnly } = require("../middleware/authMiddleware");

// Public — anyone can read reviews and leave one
router.get("/", getReviews);
router.post("/", createReview);

// Admin only
router.delete("/:id", adminOnly, deleteReview);

module.exports = router;
