// 加載環境變數
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const apiRoutes = require("./api/index"); // 統一的 API 路由入口

// 初始化應用
const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設置
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 加載靜態資源
app.use(express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API 路由
app.use("/api", apiRoutes);

// MongoDB 連接
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 啟動服務器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
