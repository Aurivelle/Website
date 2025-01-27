const API_BASE_URL =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://website-seven-omega-42.vercel.app/api";

document.addEventListener("DOMContentLoaded", () => {
  fetchDailyChallenge();
  fetchNotifications();

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

const fetchDailyChallenge = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/daily-challenges/today`);
    if (!response.ok) {
      throw new Error("Failed to fetch daily challenge");
    }
    const challenge = await response.json();
    document.getElementById("challenge-title").innerText = challenge.title;
    document.getElementById("challenge-description").innerText =
      challenge.description;
    document.getElementById("challenge-link").href = challenge.link;
  } catch (error) {
    console.error(`Error fetching daily challenge: ${error.message}`, error);
    document.getElementById("challenge-title").innerText =
      "Daily challenge not available.";
  }
};

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
    console.error(`Error fetching notifications: ${error.message}`, error);
    const notificationsList = document.getElementById("notifications-list");
    notificationsList.innerHTML = "<li>No notifications available.</li>";
  }
};
