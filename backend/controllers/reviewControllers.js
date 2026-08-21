const Review = require("../models/review");

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { name, email, rating, comment, room, roomTitle } = req.body;

    if (!name || !email || !rating || !comment) {
      return res
        .status(400)
        .json({ message: "Name, email, rating and comment are required." });
    }

    const review = await Review.create({
      name,
      email,
      rating: Number(rating),
      comment,
      room: room || undefined,
      roomTitle: roomTitle || "",
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Review (admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
