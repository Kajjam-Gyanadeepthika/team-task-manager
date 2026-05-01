const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.send("Server running");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // stop app if DB fails
  });

// Sample route (optional)
app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

// PORT (CRITICAL FIX)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});