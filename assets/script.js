// 等待 DOM 加載完成後執行
document.addEventListener("DOMContentLoaded", () => {
  // 動態更新 Recent Updates
  const recentUpdates = document.getElementById("recent-updates");
  const updates = [
    { type: "Problem", title: "Problem 11: Container with Most Water" },
    { type: "Paper", title: "Paper: Deep Learning for NLP" },
  ];

  updates.forEach((update) => {
    const li = document.createElement("li");
    li.textContent = `${update.type}: ${update.title}`;
    recentUpdates.appendChild(li);
  });

  // 搜索功能
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-btn");
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      alert(`You searched for: ${query}`);
    } else {
      alert("Please enter a search query!");
    }
  });

  // 滾動進度條
  window.onscroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
  };

  // 動態插入進度條樣式
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div id="progress-container"><div id="progress-bar"></div></div>`
  );
});

// 添加進度條的 CSS
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
