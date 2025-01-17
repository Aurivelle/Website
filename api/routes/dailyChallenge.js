const fs = require("fs");
const path = require("path");
const notificationsFile = path.join(__dirname, "../../notifications.json");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const DailyChallenge = require("../models/DailyChallenge");

// Fetch LeetCode Daily Challenge
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
      throw new Error("No challenge data from LeetCode.");
    }

    return data.data.activeDailyCodingChallengeQuestion;
  } catch (error) {
    console.error("❌ Error fetching LeetCode challenge:", error);
    return null;
  }
};

// Update Daily Challenge in Database
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
    console.log("✅ New daily challenge saved!");
    const notification = {
      message: `New daily challenge: ${question.title}`,
      link: `https://leetcode.com/problems/${question.titleSlug}/`,
      createdAt: new Date().toISOString(),
    };
    const data = fs.readFileSync(notificationsFile, "utf-8");
    const notifications = JSON.parse(data);
    notifications.push(notification);
    fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2));

    console.log("✅ Notification added!");
  } catch (error) {
    console.error("❌ Error updating daily challenge:", error);
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
