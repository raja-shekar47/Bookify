const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRooms,
  getRoomById,
} = require("../controllers/roomControllers");

router.post("/", createRoom);
router.get("/", getRooms);

router.get("/:id", getRoomById);

module.exports = router;
