const topics = ["LeetCode Problem 1", "Deep Learning", "NLP Paper"];
document.getElementById("search-bar").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const results = topics.filter((topic) => topic.toLowerCase().includes(query));
  document.getElementById("search-results").innerHTML = results
    .map((r) => `<li>${r}</li>`)
    .join("");
});
