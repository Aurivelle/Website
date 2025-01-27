const DailyChallenge = require("../models/DailyChallenge");
const {
  fetchLeetCodeChallenge,
  addNotification,
} = require("../helpers/dailyChallengeHelper");

// 更新每日挑戰至資料庫
const updateDailyChallenge = async () => {
  try {
    console.log("🔄 Updating daily challenge...");
    const challenge = await fetchLeetCodeChallenge(); // 從 Helper 獲取挑戰數據
    if (!challenge) {
      console.warn("⚠️ No new challenge data fetched.");
      return;
    }

    const today = challenge.date;
    const existingChallenge = await DailyChallenge.findOne({ date: today });
    if (existingChallenge) {
      console.log("✅ Challenge for today already exists.");
      return;
    }

    const newChallenge = new DailyChallenge({
      date: today,
      title: challenge.question.title,
      description: `Difficulty: ${challenge.question.difficulty}`,
      link: `https://leetcode.com/problems/${challenge.question.titleSlug}/`,
    });

    await newChallenge.save(); // 保存到資料庫
    console.log("✅ New daily challenge saved.");

    // 使用 Helper 添加通知
    const notification = {
      message: `New challenge: ${challenge.question.title}`,
      link: newChallenge.link,
      createdAt: new Date().toISOString(),
    };
    addNotification(notification); // 添加通知到 JSON 文件
  } catch (error) {
    console.error("❌ Error updating daily challenge:", error.message);
  }
};

module.exports = {
  updateDailyChallenge,
};
