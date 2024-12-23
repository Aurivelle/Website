const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

const PORT = 3000;
const COMMENTS_FILE = path.join(__dirname, "comments.json");

// 靜態文件服務
app.use(express.static("."));
app.use(express.json());

// 初始化評論檔案
if (!fs.existsSync(COMMENTS_FILE)) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify([]));
}

// 处理文件上传请求
app.post("/submit", upload.single("image"), (req, res) => {
  console.log("Received Data:", req.body);
  console.log("Uploaded File:", req.file);
  res.send("Content Submitted");
});

// 获取评论
app.get("/comments", (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf8"));
  res.json(comments);
});

// 提交评论
app.post("/comments", (req, res) => {
  const { username, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const newComment = {
    id: Date.now(),
    username: username || "Anonymous",
    content,
    time: new Date().toISOString(),
  };

  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf8"));
  comments.push(newComment);
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));

  res.status(201).json(newComment);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
