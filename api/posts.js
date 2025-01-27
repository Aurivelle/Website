const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const posts = [];

module.exports = async (req, res) => {
  if (req.method === "GET") {
    res.json(posts);
  } else if (req.method === "POST") {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }
    const newPost = { id: posts.length + 1, title, content, date: new Date() };
    posts.push(newPost);
    res.status(201).json(newPost);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
