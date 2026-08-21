const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingByReference,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingControllers");
const { adminOnly } = require("../middleware/authMiddleware");

// Public — guests book and check their own booking by reference
router.post("/", createBooking);
router.get("/reference/:reference", getBookingByReference);

// Admin only — the full guest list is private
router.get("/", adminOnly, getBookings);
router.patch("/:id/status", adminOnly, updateBookingStatus);
router.delete("/:id", adminOnly, deleteBooking);

module.exports = router;
