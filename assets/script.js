const API_BASE_URL = "https://website-seven-omega-42.vercel.app/api"; // API 基本路徑

// 從後端 API 獲取每日挑戰
const fetchDailyChallenge = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/daily-challenges/today`); // 從正確的 API 獲取數據
    if (!response.ok) {
      throw new Error("Failed to fetch daily challenge");
    }
    const challenge = await response.json();
    document.getElementById("challenge-title").innerText = challenge.title;
    document.getElementById("challenge-description").innerText =
      challenge.description;
    document.getElementById("challenge-link").href = challenge.link;
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    document.getElementById("challenge-title").innerText =
      "Daily challenge not available.";
  }
};

// 從後端 API 獲取通知
const fetchNotifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`);
    if (!response.ok) throw new Error("Failed to fetch notifications");
    const notifications = await response.json();

    const notificationsList = document.getElementById("notifications-list");
    if (notifications.length > 0) {
      notificationsList.innerHTML = "";
      notifications.forEach((notification) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <p>${notification.message}</p>
          ${
            notification.link
              ? `<a href="${notification.link}" target="_blank">View more</a>`
              : ""
          }
          <small>${new Date(notification.createdAt).toLocaleString()}</small>
        `;
        notificationsList.appendChild(li);
      });
    } else {
      notificationsList.innerHTML = "<li>No notifications available.</li>";
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    const notificationsList = document.getElementById("notifications-list");
    notificationsList.innerHTML = "<li>No notifications available.</li>";
  }
};

// 在頁面加載完成時執行每日挑戰和通知
document.addEventListener("DOMContentLoaded", () => {
  fetchDailyChallenge();
  fetchNotifications();
});
