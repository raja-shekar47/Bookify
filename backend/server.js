const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/rooms", require("./routes/roomRoutes"));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
