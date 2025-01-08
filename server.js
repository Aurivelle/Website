require("dotenv").config();
console.log("✅ MONGO_URI: ", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(
  cors({
    origin: "https://website-seven-omega-42.vercel.app",
  })
);
const cron = require("node-cron");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ Error: MONGO_URI is not defined!");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
const dailyChallengeRoutes = require("./api/routes/dailyChallenge");
app.use("/api/daily-challenges", dailyChallengeRoutes);

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
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
