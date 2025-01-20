const fs = require("fs");
const path = require("path");
const notificationsFile = path.join(__dirname, "../../notifications.json");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const DailyChallenge = require("../models/DailyChallenge");

// Fetch LeetCode Daily Challenge
const fetchLeetCodeChallenge = async () => {
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
  return response.json();
};

// Update Daily Challenge in Database
const updateDailyChallenge = async () => {
  const challenge = await fetchLeetCodeChallenge();
  const today = new Date().toISOString().split("T")[0];
  const existingChallenge = await DailyChallenge.findOne({ date: today });
  if (!existingChallenge) {
    const newChallenge = new DailyChallenge({
      date: today,
      title: challenge.question.title,
      description: `Difficulty: ${challenge.question.difficulty}`,
      link: `https://leetcode.com/problems/${challenge.question.titleSlug}/`,
    });
    await newChallenge.save();
  }
};

// Route to get today's challenge
const express = require("express");
const router = express.Router();

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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
module.exports.updateDailyChallenge = updateDailyChallenge;
