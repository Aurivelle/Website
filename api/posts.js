const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// 設定上傳目錄和文件命名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 將圖片存到 uploads 資料夾
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 確保文件名唯一
  },
});
const upload = multer({ storage });

const posts = [];

// 取得文章列表
router.get("/", (req, res) => {
  res.json(posts);
});

// 提交新文章
router.post("/", upload.single("image"), (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      error: "Title and content are required.",
    });
  }
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    image: req.file ? `/uploads/${req.file.filename}` : null, // 圖片網址
    date: new Date(),
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

module.exports = router;
