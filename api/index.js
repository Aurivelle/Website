process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const COMMENTS_FILE = path.join(__dirname, "../comments.json");

app.use(express.json());

// Fetch comments
app.get("/comments", (req, res) => {
  try {
    const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf8"));
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// Post a comment
app.post("/comments", (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf8"));
    comments.push({ id: Date.now(), content });
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ message: "Failed to save comment" });
  }
});

// 啟動伺服器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
