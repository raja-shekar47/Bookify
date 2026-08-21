const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = ["superadmin", "admin", "user"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never comes back on a normal query
    },
    role: {
      type: String,
      enum: ROLES,
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Hash whenever the password is set or changed.
userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchesPassword = function matchesPassword(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.isAdmin = function isAdmin() {
  return this.role === "admin" || this.role === "superadmin";
};

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
