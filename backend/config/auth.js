const jwt = require("jsonwebtoken");

// In production set JWT_SECRET in the environment. The fallback keeps local
// development working out of the box.
const JWT_SECRET =
  process.env.JWT_SECRET || "aaron-stays-dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

exports.signToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

exports.verifyToken = (token) => jwt.verify(token, JWT_SECRET);

/** Shape sent to the client — never includes the password hash. */
exports.publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});
