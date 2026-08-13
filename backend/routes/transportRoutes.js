const express = require("express");
const router = express.Router();
const {
  createTransport,
  getTransports,
  getTransportById,
  updateTransport,
  deleteTransport,
} = require("../controllers/transportControllers");

router.post("/", createTransport);
router.get("/", getTransports);
router.get("/:id", getTransportById);
router.put("/:id", updateTransport);
router.delete("/:id", deleteTransport);

module.exports = router;
