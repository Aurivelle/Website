const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const DailyChallenge = require("../models/DailyChallenge");

// ✅ Fetch LeetCode Daily Challenge
const fetchLeetCodeChallenge = async () => {
  try {
    const query = `
      query {
        activeDailyCodingChallengeQuestion {
          date
          question {
            title
            titleSlug
            difficulty
          }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (!data.data.activeDailyCodingChallengeQuestion) {
      throw new Error("Failed to fetch challenge from LeetCode.");
    }

    return data.data.activeDailyCodingChallengeQuestion;
  } catch (error) {
    console.error("❌ Error fetching LeetCode challenge:", error);
    return null;
  }
};

// ✅ Update Daily Challenge
const updateDailyChallenge = async () => {
  try {
    const challenge = await fetchLeetCodeChallenge();
    if (!challenge) return;

    const { date, question } = challenge;

    const existingChallenge = await DailyChallenge.findOne({ date });
    if (existingChallenge) {
      console.log("✅ Daily challenge already exists");
      return;
    }

    const newChallenge = new DailyChallenge({
      date,
      title: question.title,
      description: `Difficulty: ${question.difficulty}`,
      link: `https://leetcode.com/problems/${question.titleSlug}/`,
    });

    await newChallenge.save();
    console.log("✅ Daily challenge updated!");
  } catch (err) {
    console.error("❌ Error updating daily challenge:", err);
  }
};

// ✅ Route to Get Today's Challenge
router.get("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const challenge = await DailyChallenge.findOne({ date: today });

    if (!challenge) {
      return res
        .status(404)
        .json({ message: "No daily challenge found for today" });
    }

    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ Export router and update function
module.exports = router;
module.exports.updateDailyChallenge = updateDailyChallenge;
