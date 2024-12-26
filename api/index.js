const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const COMMENTS_FILE = path.join(__dirname, "comments.json");

app.use(express.json());

// 初始化 comments.json
if (!fs.existsSync(COMMENTS_FILE)) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify([]));
}

// 獲取評論
app.get("/comments", (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf8"));
  res.json(comments);
});

// 提交評論
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

module.exports = app;
