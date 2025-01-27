const express = require("express");
const router = express.Router();
const dailyChallengeHelper = require("../helpers/dailyChallengeHelper");

// 路由：獲取今天的挑戰
router.get("/today", async (req, res) => {
  try {
    const challenge = await dailyChallengeHelper.getTodayChallenge();
    if (!challenge) {
      return res.status(404).json({ message: "No daily challenge found." });
    }
    res.json(challenge);
  } catch (error) {
    console.error("Error fetching today's challenge:", error.message);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
