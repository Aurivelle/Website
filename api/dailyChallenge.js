const {
  updateDailyChallenge,
  fetchDailyChallenge,
} = require("../helpers/dailyChallengeHelper");
const DailyChallenge = require("../models/DailyChallenge");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const today = new Date().toISOString().split("T")[0];
      const challenge = await DailyChallenge.findOne({ date: today });
      if (!challenge) {
        return res.status(404).json({ message: "No daily challenge found." });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenge", error });
    }
  } else if (req.method === "POST") {
    try {
      await updateDailyChallenge();
      res
        .status(200)
        .json({ message: "Daily challenge updated successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error updating challenge", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
