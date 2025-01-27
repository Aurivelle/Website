const { updateDailyChallenge } = require("../helpers/dailyChallengeHelper");
const DailyChallenge = require("../models/DailyChallenge");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.status(200).end();
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    try {
      const today = new Date().toISOString().split("T")[0];
      const challenge = await DailyChallenge.findOne({ date: today });
      if (!challenge) {
        return res.status(404).json({ message: "No daily challenge found." });
      }
      res.status(200).json(challenge);
    } catch (error) {
      console.error("❌ Error fetching daily challenge:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      await updateDailyChallenge();
      res
        .status(200)
        .json({ message: "Daily challenge updated successfully." });
    } catch (error) {
      console.error("❌ Error updating daily challenge:", error.message);
      res.status(500).json({
        message: "Failed to update daily challenge.",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
};
