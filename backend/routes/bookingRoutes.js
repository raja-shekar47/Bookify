const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingByReference,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingControllers");

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/reference/:reference", getBookingByReference);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

module.exports = router;
