document.addEventListener("DOMContentLoaded", () => {
  // 更新最近更新的部分
  const recentUpdates = document.getElementById("recent-updates");
  if (recentUpdates) {
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
  }

  // 搜尋功能
  const searchInput = document.getElementById("search");
  if (searchInput) {
    const searchResults = document.createElement("ul");
    searchResults.id = "search-results";
    searchInput.parentElement.appendChild(searchResults);

    searchInput.addEventListener("input", (e) => {
      const topics = [{ name: "LeetCode Problem 11", link: "11.html" }];
      const query = e.target.value.toLowerCase();
      const results = topics.filter((topic) =>
        topic.name.toLowerCase().includes(query)
      );

      searchResults.innerHTML = results
        .map(
          (r) => `<li><a href="${r.link}" target="_blank">${r.name}</a></li>`
        )
        .join("");

      if (results.length === 0) {
        searchResults.innerHTML = "<li>No results found</li>";
      }
    });

    const searchButton = document.getElementById("search-btn");
    if (searchButton) {
      searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        const result = [{ name: "LeetCode Problem 11", link: "11.html" }].find(
          (topic) => topic.name.toLowerCase().includes(query)
        );

        if (result) {
          window.location.href = result.link;
        } else {
          alert("No matching result found.");
        }
      });
    }
  }

  // 頁面滾動進度條
  window.onscroll = () => {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = progress + "%";
    }
  };

  // 建立滾動進度條的 HTML 和樣式
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div id="progress-container" style="position: fixed; top: 0; left: 0; width: 100%; height: 4px; background: #f3f3f3;">
      <div id="progress-bar" style="height: 100%; width: 0; background: #007bff; transition: width 0.1s;"></div>
    </div>
  `
  );

  // 提交評論
  const submitCommentButton = document.getElementById("submit-comment");
  if (submitCommentButton) {
    const commentInput = document.getElementById("comment-input");
    const commentsList = document.getElementById("comments-list");

    submitCommentButton.addEventListener("click", () => {
      if (commentInput && commentsList) {
        const comment = commentInput.value.trim();
        if (!comment) {
          alert("Please write a comment!");
          return;
        }

        const now = new Date();
        const formattedTime = now.toLocaleString();

        const newComment = document.createElement("div");
        newComment.innerHTML = `
          <p>${comment}</p>
          <small style="color: #666;">Posted at: ${formattedTime}</small>
        `;
        newComment.style.marginBottom = "10px";
        commentsList.appendChild(newComment);

        commentInput.value = "";
      }
    });
  }

  // 加載每日挑戰
  fetchDailyChallenge();
});

// 從後端 API 抓取每日挑戰
const fetchDailyChallenge = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/daily-challenges/today"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch daily challenge");
    }

    const challenge = await response.json();
    const titleElement = document.getElementById("challenge-title");
    const descriptionElement = document.getElementById("challenge-description");
    const linkElement = document.getElementById("challenge-link");

    if (titleElement && descriptionElement && linkElement) {
      titleElement.innerText = challenge.title;
      descriptionElement.innerText = challenge.description;
      linkElement.href = challenge.link;
      linkElement.innerText = "Go to Challenge";
    }
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    const titleElement = document.getElementById("challenge-title");
    if (titleElement) {
      titleElement.innerText = "Daily challenge not available.";
    }
  }
};
