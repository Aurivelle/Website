const fetch = require("node-fetch");

const fetchDailyChallenge = async () => {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
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
        `,
      }),
    });
    const data = await response.json();
    if (!data.data.activeDailyCodingChallengeQuestion) {
      throw new Error("No challenge data available.");
    }
    return data.data.activeDailyCodingChallengeQuestion;
  } catch (error) {
    console.error("Error fetching challenge:", error.message);
    return null;
  }
};

const getTodayChallenge = async () => {
  const challenge = await fetchDailyChallenge();
  if (!challenge) return null;
  return {
    title: challenge.question.title,
    description: `Difficulty: ${challenge.question.difficulty}`,
    link: `https://leetcode.com/problems/${challenge.question.titleSlug}/`,
  };
};

module.exports = {
  fetchDailyChallenge,
  getTodayChallenge,
};
