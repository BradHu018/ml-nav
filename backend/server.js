// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const buildRoutes = require("./routes/buildRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/builds", buildRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("ML Navigator backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});