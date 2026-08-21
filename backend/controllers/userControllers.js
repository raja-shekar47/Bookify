const User = require("../models/user");
const { publicUser } = require("../config/auth");

const ASSIGNABLE_ROLES = ["admin", "user"];

// GET /api/users  (superadmin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(publicUser));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users  (superadmin) — add a person
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    if (!ASSIGNABLE_ROLES.includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be either admin or user." });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Someone already uses that email address." });
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json(publicUser(user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/users/:id/role  (superadmin) — promote to admin / demote to user
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!ASSIGNABLE_ROLES.includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be either admin or user." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res
        .status(403)
        .json({ message: "The super admin's role cannot be changed." });
    }

    user.role = role;
    await user.save();

    res.json(publicUser(user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/users/:id/active  (superadmin) — suspend / restore access
exports.updateUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res
        .status(403)
        .json({ message: "The super admin cannot be deactivated." });
    }

    user.active = Boolean(req.body.active);
    await user.save();

    res.json(publicUser(user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/users/:id/password  (superadmin) — reset someone's password
exports.resetUserPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();

    res.json({ message: `Password reset for ${user.name}.` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/users/:id  (superadmin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res
        .status(403)
        .json({ message: "The super admin account cannot be deleted." });
    }

    if (user._id.equals(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    await user.deleteOne();
    res.json({ message: "User removed", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
