const multer = require("multer");
const path = require("path");

const posts = [];

// 上傳檔案的配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "GET") {
    res.json(posts); // 回傳所有文章
  } else if (req.method === "POST") {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title and content are required." });
      }
      const newPost = {
        id: posts.length + 1,
        title,
        content,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        date: new Date(),
      };
      posts.push(newPost);
      res.status(201).json(newPost); // 成功新增
    } catch (error) {
      console.error("❌ Error handling post:", error.message);
      res.status(500).json({ message: "Server error.", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
};
