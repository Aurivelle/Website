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
    if (!response.ok) throw new Error("Failed to fetch daily challenge");

    const challenge = await response.json();
    document.getElementById("challenge-title").innerText = challenge.title;
    document.getElementById("challenge-description").innerText =
      challenge.description;
    document.getElementById("challenge-link").href = challenge.link;
    document.getElementById("challenge-link").innerText = "Go to Challenge";
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    document.getElementById("challenge-title").innerText =
      "Daily challenge not available.";
  }
};
