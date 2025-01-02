document.addEventListener("DOMContentLoaded", () => {
  const recentUpdates = document.getElementById("recent-updates");
  const updates = [
    {
      type: "Problem",
      title: "Problem 11: Container with Most Water",
      link: "11.html",
    },
  ];
  updates.forEach((update) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${update.link}">${update.title}</a>`;
    recentUpdates.appendChild(li);
  });

  const topics = [{ name: "LeetCode Problem 11", link: "11.html" }];
  const searchInput = document.getElementById("search");
  const searchResults = document.createElement("ul");
  searchResults.id = "search-results";
  searchInput.parentElement.appendChild(searchResults);

  // 輸入框的即時篩選功能
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const results = topics.filter(
      (topic) => topic.name.toLowerCase().includes(query) // 使用 topic.name
    );

    // 生成搜尋結果
    searchResults.innerHTML = results
      .map((r) => `<li><a href="${r.link}" target="_blank">${r.name}</a></li>`) // 顯示超連結
      .join("");

    if (results.length === 0) {
      searchResults.innerHTML = "<li>No results found</li>";
    }
  });

  // 搜尋按鈕的跳轉功能
  const searchButton = document.getElementById("search-btn");
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    const result = topics.find((topic) =>
      topic.name.toLowerCase().includes(query)
    );

    if (result) {
      window.location.href = result.link; // 跳轉到匹配的頁面
    } else {
      alert("No matching result found.");
    }
  });

  window.onscroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
  };

  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div id="progress-container" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: #f3f3f3;">
      <div id="progress-bar" style="
      height: 100%;
      width: 0;
      background: #007bff;
      transition: width 0.1s;"></div>
    </div>`
  );
});

const style = document.createElement("style");
style.innerHTML = `
  #progress-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: #f3f3f3;
  }
  #progress-bar {
    height: 100%;
    width: 0;
    background: #007bff;
    transition: width 0.1s;
  }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
  const commentsList = document.getElementById("comments-list");
  const commentInput = document.getElementById("comment-input");
  const submitCommentButton = document.getElementById("submit-comment");

  // 提交評論
  submitCommentButton.addEventListener("click", () => {
    const comment = commentInput.value.trim();
    if (!comment) {
      alert("Please write a comment!");
      return;
    }

    // 獲取當前時間
    const now = new Date();
    const formattedTime = now.toLocaleString(); // 格式化為本地時間

    // 添加評論到列表
    const newComment = document.createElement("div");
    newComment.innerHTML = `
          <p>${comment}</p>
          <small style="color: #666;">Posted at: ${formattedTime}</small>
      `;
    newComment.style.marginBottom = "10px";
    commentsList.appendChild(newComment);

    // 清空輸入框
    commentInput.value = "";
  });
});
document.getElementById("add-paper-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("paper-title").value;
  const url = document.getElementById("paper-url").value;

  const paperLink = document.createElement("a");
  paperLink.href = url;
  paperLink.textContent = title;
  paperLink.target = "_blank";
  paperLink.style.display = "block";
  paperLink.style.marginBottom = "10px";

  document.getElementById("arxiv-feed").appendChild(paperLink);

  // 清空表單
  e.target.reset();
});
document.addEventListener("DOMContentLoaded", () => {
  const feedUrl =
    "https://api.allorigins.win/get?url=" +
    encodeURIComponent("https://rss.arxiv.org/rss/cs.AI");

  // 抓取 RSS Feed
  fetch(feedUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json(); // 代理返回 JSON 格式
    })
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const items = xmlDoc.querySelectorAll("item");

      const feedContainer = document.getElementById("arxiv-feed");
      feedContainer.innerHTML = ""; // 清除 "Loading latest papers..." 文字

      if (items.length === 0) {
        feedContainer.innerHTML = "<p>No recent papers available.</p>";
        return;
      }

      items.forEach((item, index) => {
        if (index < 5) {
          // 顯示前 5 篇論文
          const title = item.querySelector("title").textContent;
          const link = item.querySelector("link").textContent;

          const paperLink = document.createElement("a");
          paperLink.href = link;
          paperLink.textContent = title;
          paperLink.target = "_blank";
          paperLink.style.display = "block";
          paperLink.style.marginBottom = "10px";

          feedContainer.appendChild(paperLink);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching ArXiv RSS Feed:", error);
      const feedContainer = document.getElementById("arxiv-feed");
      feedContainer.innerHTML =
        "<p>Error loading RSS feed. Please try again later.</p>";
    });
});

document.addEventListener("DOMContentLoaded", () => {
  // 表單和列表的 DOM 元素
  const form = document.getElementById("add-paper-form");
  const paperList = document.getElementById("paper-list");

  // 表單提交事件處理
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // 阻止表單默認提交行為

    // 獲取表單輸入值
    const title = document.getElementById("paper-title").value.trim();
    const url = document.getElementById("paper-url").value.trim();

    // 驗證表單輸入
    if (!title || !url) {
      alert("Please fill in both the title and URL fields.");
      return; // 如果驗證失敗，停止執行後續代碼
    }

    // 添加項目到列表
    addPaperToList(title, url);

    // 清空表單輸入框
    form.reset();
  });

  // 添加新論文到列表的函數
  function addPaperToList(title, url) {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${url}" target="_blank">${title}</a>`;
    paperList.appendChild(li);
  }

  // 初始化 RSS Feed 加載（如果需要）
  loadRSSFeed();
});

// 可選：RSS Feed 加載邏輯
function loadRSSFeed() {
  const feedUrl =
    "https://api.allorigins.win/get?url=" +
    encodeURIComponent("https://rss.arxiv.org/rss/cs.AI");

  fetch(feedUrl)
    .then((response) => response.json())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const items = xmlDoc.querySelectorAll("item");

      const feedContainer = document.getElementById("arxiv-feed");
      feedContainer.innerHTML = ""; // 清空 "Loading latest papers..." 文字

      items.forEach((item, index) => {
        if (index < 5) {
          const title = item.querySelector("title").textContent;
          const link = item.querySelector("link").textContent;

          const paperLink = document.createElement("a");
          paperLink.href = link;
          paperLink.textContent = title;
          paperLink.target = "_blank";
          paperLink.style.display = "block";
          paperLink.style.marginBottom = "10px";

          feedContainer.appendChild(paperLink);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching RSS Feed:", error);
      const feedContainer = document.getElementById("arxiv-feed");
      feedContainer.innerHTML =
        "<p>Error loading RSS feed. Please try again later.</p>";
    });
}
