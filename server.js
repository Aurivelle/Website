// 加載環境變數
require("dotenv").config();
console.log("✅ MONGO_URI: ", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");
const postRoutes = require("./api/posts");

// 初始化 Express 應用
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/posts", postRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 確保環境變數中有 MONGO_URI
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in .env file!");
  process.exit(1); // 終止應用
}

// 設定靜態通知列表（僅作為示例）
const notifications = [
  {
    message: "Welcome to Cat's Algorithm!",
    link: null,
    createdAt: new Date().toISOString(),
  },
];

// 中間件配置
app.use(cors()); // 啟用跨域資源共享
app.use(express.json()); // 支持 JSON 請求
app.use(bodyParser.urlencoded({ extended: true })); // 支持 URL 編碼請求

// API 路由：通知
app.get("/api/notifications", (req, res) => {
  res.json(notifications); // 返回靜態通知列表
});

// MongoDB 連接
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 加載每日挑戰 API 路由
const dailyChallengeRoutes = require("./api/routes/dailyChallenge");
const { updateDailyChallenge } = require("./api/routes/dailyChallenge");
app.use("/api/daily-challenges", dailyChallengeRoutes);

// 配置靜態文件路徑
app.use(express.static(path.join(__dirname)));

// 為非 API 路由提供 index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 定時任務：每日挑戰更新（每天早上 8 點執行）
cron.schedule("10 8 * * *", async () => {
  console.log("🔄 Running daily challenge update...");
  try {
    await updateDailyChallenge();
    console.log("✅ Daily challenge updated successfully!");
  } catch (error) {
    console.error("❌ Error during daily challenge update:", error.message);
  }
});

// 啟動服務器
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  try {
    await updateDailyChallenge(); // 啟動時進行一次挑戰更新
    console.log("✅ Initial daily challenge update complete!");
  } catch (error) {
    console.error(
      "❌ Error during initial daily challenge update:",
      error.message
    );
  }
});
