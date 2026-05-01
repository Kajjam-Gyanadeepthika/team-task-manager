const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🔥 crash debugging
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// ❗ Railway PORT fix
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB connected");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB error:", err.message);
});