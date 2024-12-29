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
