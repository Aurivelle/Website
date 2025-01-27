const fs = require("fs");
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 構建通知文件路徑
const notificationsFile = path.join(__dirname, "../../notifications.json");

/**
 * Fetch the LeetCode daily challenge using their GraphQL API
 * @returns {Promise<Object|null>} The daily challenge data or null if failed
 */
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
      throw new Error("No challenge data available from LeetCode.");
    }

    return data.data.activeDailyCodingChallengeQuestion;
  } catch (error) {
    console.error("❌ Error fetching LeetCode challenge:", error.message);
    return null; // 返回 null 表示失敗
  }
};

/**
 * Add a notification to the notifications.json file
 * @param {Object} notification The notification object to add
 */
const addNotification = (notification) => {
  try {
    let notifications = [];
    if (fs.existsSync(notificationsFile)) {
      const data = fs.readFileSync(notificationsFile, "utf-8");
      notifications = JSON.parse(data);
    }

    notifications.push(notification); // 添加新通知
    fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2)); // 寫入 JSON 文件
    console.log("✅ Notification added.");
  } catch (error) {
    console.error("❌ Error adding notification:", error.message);
  }
};

module.exports = {
  fetchLeetCodeChallenge,
  addNotification,
};
