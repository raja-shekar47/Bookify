const User = require("../models/user");
const { signToken, publicUser } = require("../config/auth");

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // password has select:false, so ask for it explicitly
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user || !(await user.matchesPassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    if (!user.active) {
      return res
        .status(403)
        .json({ message: "This account has been deactivated." });
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me — used by the client to restore a session
exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

// PATCH /api/auth/password — change your own password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both the current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchesPassword(currentPassword))) {
      return res
        .status(401)
        .json({ message: "Your current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
