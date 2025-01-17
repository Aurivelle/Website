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

// Fetch notifications from the backend API
const fetchNotifications = async () => {
  try {
    const response = await fetch(
      "https://website-seven-omega-42.vercel.app/api/notifications" // API URL
    );
    if (!response.ok) throw new Error("Failed to fetch notifications");

    const notifications = await response.json(); // Parse the JSON response

    // Get the notifications list element from the DOM
    const notificationsList = document.getElementById("notifications-list");

    if (notifications.length > 0) {
      // Clear the list before appending new notifications
      notificationsList.innerHTML = "";

      notifications.forEach((notification) => {
        // Create a list item for each notification
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
        notificationsList.appendChild(li); // Append the notification to the list
      });
    } else {
      // If no notifications are available
      notificationsList.innerHTML = "<li>No notifications available.</li>";
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);

    // Show an error message in the notifications list
    const notificationsList = document.getElementById("notifications-list");
    notificationsList.innerHTML = "<li>No notifications available.</li>";
  }
};

// Call the fetchNotifications function on page load
window.onload = fetchNotifications;
