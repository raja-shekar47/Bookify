const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

app.use(cors());
app.use(express.json());

// Uploaded / local property photos are served from backend/public
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Aaron Stays API" });
});

app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/transport", require("./routes/transportRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// 404 for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: `No API route for ${req.originalUrl}` });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Aaron Stays server running on port ${PORT} 🏔️`);
});
