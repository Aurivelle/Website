document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display the daily challenge
  fetchDailyChallenge();

  // Update Recent Updates section
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

  // Search functionality
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
  }
});

// Fetch daily challenge from the backend API
const fetchDailyChallenge = async () => {
  try {
    const response = await fetch("/api/daily-challenges/today");
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

// Fetch the challenge on page load
document.addEventListener("DOMContentLoaded", fetchDailyChallenge);

// DOMContentLoaded 確保 DOM 已加載完成後執行
document.addEventListener("DOMContentLoaded", () => {
  const notificationsList = document.getElementById("notifications-list"); // 獲取通知列表
  const clearButton = document.getElementById("clear-notifications"); // 獲取清除按鈕

  // 初始化時載入通知
  fetchNotifications();

  // 綁定清除通知按鈕的點擊事件
  clearButton.addEventListener("click", () => {
    notificationsList.innerHTML = ""; // 清空通知列表
    alert("Notifications cleared!"); // 彈出提示
  });
});

// 從後端 API 獲取通知
const fetchNotifications = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/notifications"); // 後端 API
    if (!response.ok) throw new Error("Failed to fetch notifications"); // 確認 API 響應成功

    const notifications = await response.json(); // 獲取通知數據

    if (notifications.length > 0) {
      notificationList.innerHTML = "";
      notifications.forEach((notification) => {
        const li = document.createElement("li");
        li.innerHTML = `<p>${notification.message}</p>
          ${
            notification.link
              ? `<a href="${notification.link}" target="_blank">View more</a>`
              : ""
          }
          <small>${new Date(notification.createdAt).toLocaleString()}</small>
        `;
        notificationList.appendChild(li);
      });
    } else {
      notificationList.innerHTML = "<li>No notifications available.</li>";
    }
  } catch (error) {
    console.error("Error fetching notifications:", error); // 控制台打印錯誤
    const notificationsList = document.getElementById("notifications-list");
    notificationsList.innerHTML = "<li>No notifications available.</li>"; // 顯示默認信息
  }
};
window.onload = fetchNotifications;
