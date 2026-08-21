const express = require("express");
const router = express.Router();
const { login, me, changePassword } = require("../controllers/authControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/me", protect, me);
router.patch("/password", protect, changePassword);

module.exports = router;
