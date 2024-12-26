// 全局處理未捕獲的異常和未處理的拒絕
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const COMMENTS_FILE = path.join(__dirname, "api/comments.json");

app.use(express.json());

// 初始化 comments.json
try {
  if (!fs.existsSync(COMMENTS_FILE)) {
    console.warn(`${COMMENTS_FILE} not found. Creating a new one.`);
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify([])); // 建立空文件
  }
  fs.accessSync(COMMENTS_FILE, fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
  console.error(`Error accessing ${COMMENTS_FILE}:`, err);
  process.exit(1);
}

// Fetch comments
app.get("/api/comments", (req, res) => {
  try {
    console.log("Fetching comments from", COMMENTS_FILE);
    const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf8"));
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// Post a comment
app.post("/api/comments", (req, res) => {
  const { content } = req.body;
  if (!content) {
    console.error("Error: Content is required in the request body");
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    console.log("Saving comment to", COMMENTS_FILE);
    const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf8"));
    const newComment = { id: Date.now(), content };
    comments.push(newComment);
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ message: "Failed to save comment" });
  }
});

// 啟動伺服器
const PORT = 3000;
app
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
