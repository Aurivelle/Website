// 等待 DOM 加載完成後執行
document.addEventListener("DOMContentLoaded", () => {
  // 初始化 Highlight.js（程式碼高亮）
  hljs.highlightAll();

  // DOM 元素選取
  const commentsSection = document.getElementById("comments-section");
  const commentInput = document.getElementById("comment-input");
  const submitCommentButton = document.getElementById("submit-comment");
  const recentUpdates = document.getElementById("recent-updates");
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-btn");

  // 1. 獲取評論並渲染到頁面
  const fetchComments = async () => {
    try {
      const response = await fetch("/comments");
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      }
      const comments = await response.json();
      commentsSection.innerHTML = comments
        .map(
          (comment) => `
            <div class="comment">
              <strong>${comment.username}</strong> 
              <small>${new Date(comment.timestamp).toLocaleString()}</small>
              <p>${comment.content}</p>
            </div>
          `
        )
        .join("");
    } catch (error) {
      console.error("Error fetching comments:", error);
      commentsSection.innerHTML = `<p>Error loading comments. Please try again later.</p>`;
    }
  };

  // 2. 提交評論
  submitCommentButton.addEventListener("click", async () => {
    const content = commentInput.value.trim();
    if (!content) {
      alert("Please write a comment!");
      return;
    }

    try {
      const response = await fetch("/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error(`Failed to submit comment: ${response.statusText}`);
      }
      commentInput.value = ""; // 清空輸入框
      fetchComments(); // 重新載入評論
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    }
  });

  // 初始化評論
  fetchComments();

  // 3. 顯示最近更新內容
  const updates = [
    { type: "Problem", title: "Problem 11: Container with Most Water" },
    { type: "Paper", title: "Paper: Deep Learning for NLP" },
  ];

  updates.forEach((update) => {
    const li = document.createElement("li");
    li.textContent = `${update.type}: ${update.title}`;
    recentUpdates.appendChild(li);
  });

  // 4. 搜索功能
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      alert(`You searched for: ${query}`);
    } else {
      alert("Please enter a search query!");
    }
  });
});

// 伺服器部分（Express）
const express = require("express");
const multer = require("multer");

const app = express();
const port = 3000;

// 設定檔案上傳的目錄
const upload = multer({ dest: "uploads/" });

// 5. 提交文章與程式碼
app.post("/submit", upload.single("image"), (req, res) => {
  const { article, code } = req.body;
  const image = req.file;

  console.log("Article:", article);
  console.log("Code:", code);

  if (image) {
    console.log("Image File Path:", image.path);
  }

  res.json({
    message: "Content submitted successfully!",
    data: { article, code, image: image ? image.filename : null },
  });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// 6. 提交按鈕處理邏輯
document.getElementById("submitBtn").addEventListener("click", async () => {
  const article = document.getElementById("article").value.trim();
  const code = document.getElementById("code").value.trim();

  if (!article || !code) {
    alert("Please fill all fields!");
    return;
  }

  const formData = new FormData();
  formData.append("article", article);
  formData.append("code", code);

  try {
    const response = await fetch("/submit", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to submit content.");
    }
    alert("Submitted Successfully!");
  } catch (error) {
    console.error("Error submitting content:", error);
    alert("Submission Failed!");
  }
});
