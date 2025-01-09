require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
const dailyChallengeRoutes = require("./api/routes/dailyChallenge");
app.use("/api/daily-challenges", dailyChallengeRoutes);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Only serve `index.html` for non-API requests
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Cron Job for Daily Challenge Update
const { updateDailyChallenge } = require("./api/routes/dailyChallenge");
cron.schedule("0 5 * * *", async () => {
  console.log("🔄 Running daily challenge update...");
  try {
    await updateDailyChallenge();
    console.log("✅ Daily challenge updated!");
  } catch (error) {
    console.error("❌ Error updating daily challenge:", error);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
