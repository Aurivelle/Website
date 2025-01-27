const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.fetchLeetCodeChallenge = async () => {
  try {
    const query = `
        query {
          activeDailyCodingChallengeQuestion {
            date
            question {
              title
              titleSlug
              difficulty
            }
          }
        }
      `;
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data.data.activeDailyCodingChallengeQuestion;
  } catch (error) {
    console.error("❌ Error fetching challenge:", error.message);
    throw error;
  }
};
