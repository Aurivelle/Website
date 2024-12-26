const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const COMMENTS_FILE = path.join(__dirname, "../comments.json");

app.use(express.json());

// Fetch comments
app.get("/comments", (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf8"));
  res.json(comments);
});

// Post a comment
app.post("/comments", (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf8"));
  comments.push({ id: Date.now(), content });
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));

  res.status(201).json({ message: "Comment added successfully" });
});

module.exports = app;
