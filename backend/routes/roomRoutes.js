const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomControllers");
const { adminOnly } = require("../middleware/authMiddleware");

// Public — guests browse rooms without signing in
router.get("/", getRooms);
router.get("/:id", getRoomById);

// Admin only
router.post("/", adminOnly, createRoom);
router.put("/:id", adminOnly, updateRoom);
router.delete("/:id", adminOnly, deleteRoom);

module.exports = router;
