const fs = require("fs");
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args)); // 支援 ES Module 的 `node-fetch`
const DailyChallenge = require("../models/DailyChallenge"); // 引入 DailyChallenge 模型

// 構建通知文件路徑（假設有 notifications.json 文件）
const notificationsFile = path.join(__dirname, "../../notifications.json");

// Fetch LeetCode Daily Challenge
const fetchLeetCodeChallenge = async () => {
  try {
    // GraphQL 查詢請求
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

    // 發送請求到 LeetCode 的 GraphQL API
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    // 確保成功取得資料
    const data = await response.json();
    if (!data.data.activeDailyCodingChallengeQuestion) {
      throw new Error("Failed to fetch challenge from LeetCode.");
    }

    return data.data.activeDailyCodingChallengeQuestion; // 返回每日挑戰數據
  } catch (error) {
    console.error("❌ Error fetching LeetCode challenge:", error);
    return null; // 返回 null 表示失敗
  }
};

// 更新每日挑戰至資料庫
const updateDailyChallenge = async () => {
  try {
    const challenge = await fetchLeetCodeChallenge(); // 獲取挑戰數據
    if (!challenge) return; // 若獲取失敗則跳過

    const today = challenge.date; // 確保日期準確
    const existingChallenge = await DailyChallenge.findOne({ date: today }); // 查找當天挑戰

    if (existingChallenge) {
      console.log("✅ Daily challenge already exists");
      return; // 若已存在則不更新
    }

    // 創建新的挑戰記錄
    const newChallenge = new DailyChallenge({
      date: today,
      title: challenge.question.title,
      description: `Difficulty: ${challenge.question.difficulty}`,
      link: `https://leetcode.com/problems/${challenge.question.titleSlug}/`,
    });

    await newChallenge.save(); // 保存到資料庫
    console.log("✅ New daily challenge saved!");

    // 添加通知到 JSON 文件
    const notification = {
      message: `New daily challenge: ${challenge.question.title}`,
      link: `https://leetcode.com/problems/${challenge.question.titleSlug}/`,
      createdAt: new Date().toISOString(),
    };

    let notifications = [];
    if (fs.existsSync(notificationsFile)) {
      // 若文件存在則讀取
      const data = fs.readFileSync(notificationsFile, "utf-8");
      notifications = JSON.parse(data);
    }

    notifications.push(notification); // 添加新通知
    fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2)); // 更新 JSON 文件
    console.log("✅ Notification added!");
  } catch (error) {
    console.error("❌ Error updating daily challenge:", error);
  }
};

// 路由：獲取今天的挑戰
const express = require("express");
const router = express.Router();

router.get("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // 獲取今天的日期
    const challenge = await DailyChallenge.findOne({ date: today }); // 查詢資料庫

    if (!challenge) {
      return res
        .status(404)
        .json({ message: "No daily challenge found for today" }); // 如果未找到則返回 404
    }

    res.json(challenge); // 返回挑戰數據
  } catch (error) {
    console.error("❌ Error in /today route:", error);
    res.status(500).json({ message: "Server error", error }); // 返回伺服器錯誤
  }
});

// 將路由和更新函數導出
module.exports = router;
module.exports.updateDailyChallenge = updateDailyChallenge;
