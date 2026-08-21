const User = require("../models/user");
const { verifyToken } = require("../config/auth");

/** Requires a valid Bearer token; attaches req.user. */
exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Please sign in to continue." });
    }

    const decoded = verifyToken(header.slice(7));
    const user = await User.findById(decoded.id);

    if (!user || !user.active) {
      return res
        .status(401)
        .json({ message: "This account is no longer active." });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Your session has expired. Sign in again." });
  }
};

/** Allows only the listed roles. Use after protect. */
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You don't have permission to do that." });
    }
    next();
  };

exports.adminOnly = [
  exports.protect,
  exports.restrictTo("admin", "superadmin"),
];

exports.superAdminOnly = [exports.protect, exports.restrictTo("superadmin")];
