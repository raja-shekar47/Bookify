const express = require("express");
const router = express.Router();
const {
  createTransport,
  getTransports,
  getTransportById,
  updateTransport,
  deleteTransport,
} = require("../controllers/transportControllers");
const { adminOnly } = require("../middleware/authMiddleware");

// Public
router.get("/", getTransports);
router.get("/:id", getTransportById);

// Admin only
router.post("/", adminOnly, createTransport);
router.put("/:id", adminOnly, updateTransport);
router.delete("/:id", adminOnly, deleteTransport);

module.exports = router;
