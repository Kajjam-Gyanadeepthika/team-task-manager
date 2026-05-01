const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (VERY IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// Sample route
app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

// PORT
const PORT = process.env.PORT || 5000;

// ✅ FIX: Start server ONLY after DB connects
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
});