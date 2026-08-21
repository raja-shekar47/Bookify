/**
 * Creates (or repairs) the super admin account.
 *
 * Usage:  npm run seed:admin
 *         SUPERADMIN_PASSWORD=mysecret npm run seed:admin
 *
 * Safe to re-run — it never overwrites an existing password unless you pass
 * --reset-password.
 */
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/user");

const NAME = process.env.SUPERADMIN_NAME || "Raja Shekar";
const EMAIL = (
  process.env.SUPERADMIN_EMAIL || "rajurajshekar2023@gmail.com"
).toLowerCase();
const PASSWORD = process.env.SUPERADMIN_PASSWORD || "Aaron@123";

const run = async () => {
  await connectDB();

  const resetPassword = process.argv.includes("--reset-password");
  let user = await User.findOne({ email: EMAIL });

  if (!user) {
    user = await User.create({
      name: NAME,
      email: EMAIL,
      password: PASSWORD,
      role: "superadmin",
    });
    console.log(`\nSuper admin created ✅`);
  } else {
    user.role = "superadmin";
    user.active = true;
    if (resetPassword) {
      user.password = PASSWORD;
      console.log(`\nSuper admin password reset 🔑`);
    } else {
      console.log(`\nSuper admin already exists — password left unchanged.`);
    }
    await user.save();
  }

  console.log(`  Email    : ${EMAIL}`);
  if (!user.lastLoginAt || resetPassword) {
    console.log(`  Password : ${PASSWORD}`);
    console.log(`\n  Sign in at http://localhost:5173/login and change this`);
    console.log(`  password from Admin → Users → Change my password.`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch(async (error) => {
  console.error("Could not seed the super admin ❌", error);
  await mongoose.connection.close();
  process.exit(1);
});
