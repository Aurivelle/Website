// DOMContentLoaded 確保 DOM 結構完全加載後執行
document.addEventListener("DOMContentLoaded", () => {
  // 載入並顯示每日挑戰
  fetchDailyChallenge();

  // 更新最近更新的部分
  const recentUpdates = document.getElementById("recent-updates");
  if (recentUpdates) {
    const updates = [
      {
        type: "Problem", // 更新類型
        title: "Problem 11: Container with Most Water", // 更新標題
        link: "11.html", // 更新的連結
      },
    ];
    updates.forEach((update) => {
      const li = document.createElement("li"); // 創建列表項
      li.innerHTML = `<a href="${update.link}">${update.title}</a>`; // 插入 HTML
      recentUpdates.appendChild(li); // 添加到最近更新列表
    });
  }

  // 搜尋功能
  const searchInput = document.getElementById("search"); // 搜尋框
  if (searchInput) {
    const searchResults = document.createElement("ul"); // 創建搜尋結果列表
    searchResults.id = "search-results";
    searchInput.parentElement.appendChild(searchResults);

    // 當輸入內容變更時觸發
    searchInput.addEventListener("input", (e) => {
      const topics = [{ name: "LeetCode Problem 11", link: "11.html" }]; // 可搜尋的內容
      const query = e.target.value.toLowerCase(); // 將輸入轉為小寫
      const results = topics.filter((topic) =>
        topic.name.toLowerCase().includes(query)
      ); // 篩選符合條件的結果

      // 動態生成結果列表
      searchResults.innerHTML = results
        .map(
          (r) => `<li><a href="${r.link}" target="_blank">${r.name}</a></li>`
        )
        .join("");

      // 如果沒有結果
      if (results.length === 0) {
        searchResults.innerHTML = "<li>No results found</li>";
      }
    });
  }
});

// 從後端 API 獲取每日挑戰
const fetchDailyChallenge = async () => {
  try {
    const response = await fetch(
      "https://website-seven-omega-42.vercel.app/api/daily-challenges/today" // 後端 API URL
    );
    if (!response.ok) {
      throw new Error("Failed to fetch daily challenge"); // 如果響應失敗則拋出錯誤
    }
    const challenge = await response.json(); // 解析 JSON 響應
    // 更新 DOM 元素以顯示挑戰數據
    document.getElementById("challenge-title").innerText = challenge.title;
    document.getElementById("challenge-description").innerText =
      challenge.description;
    document.getElementById("challenge-link").href = challenge.link;
  } catch (error) {
    console.error("Error fetching daily challenge:", error); // 錯誤日誌
    document.getElementById("challenge-title").innerText =
      "Daily challenge not available."; // 如果獲取失敗則顯示提示
  }
};

// 在頁面加載完成時執行每日挑戰函數
document.addEventListener("DOMContentLoaded", fetchDailyChallenge);

// DOMContentLoaded 確保 DOM 加載完成後執行
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
    const response = await fetch(
      "https://website-seven-omega-42.vercel.app/api/notifications" // 後端 API URL
    );
    if (!response.ok) throw new Error("Failed to fetch notifications"); // 如果響應失敗則拋出錯誤

    const notifications = await response.json(); // 解析 JSON 響應

    // 獲取 DOM 中的通知列表元素
    const notificationsList = document.getElementById("notifications-list");

    if (notifications.length > 0) {
      notificationsList.innerHTML = ""; // 清空現有的通知列表

      notifications.forEach((notification) => {
        const li = document.createElement("li"); // 創建列表項
        li.innerHTML = `
          <p>${notification.message}</p>
          ${
            notification.link
              ? `<a href="${notification.link}" target="_blank">View more</a>`
              : ""
          }
          <small>${new Date(notification.createdAt).toLocaleString()}</small>
        `; // 插入通知內容
        notificationsList.appendChild(li); // 添加到通知列表
      });
    } else {
      // 如果沒有通知則顯示默認訊息
      notificationsList.innerHTML = "<li>No notifications available.</li>";
    }
  } catch (error) {
    console.error("Error fetching notifications:", error); // 錯誤日誌
    const notificationsList = document.getElementById("notifications-list");
    notificationsList.innerHTML = "<li>No notifications available.</li>"; // 顯示默認訊息
  }
};

// 在頁面加載完成時調用 fetchNotifications 函數
window.onload = fetchNotifications;
