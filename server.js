require("dotenv").config();
console.log("✅ MONGO_URI: ", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "https://website-seven-omega-42.vercel.app",
  })
);
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

// Serve static files
const path = require("path");
app.use(express.static(path.join(__dirname)));

// Catch-all route for serving `index.html`
app.get("*", (req, res) => {
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
