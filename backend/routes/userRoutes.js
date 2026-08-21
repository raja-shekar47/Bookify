const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUserRole,
  updateUserActive,
  resetUserPassword,
  deleteUser,
} = require("../controllers/userControllers");
const { superAdminOnly } = require("../middleware/authMiddleware");

// Managing people is the super admin's job alone.
router.use(superAdminOnly);

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/active", updateUserActive);
router.patch("/:id/password", resetUserPassword);
router.delete("/:id", deleteUser);

module.exports = router;
