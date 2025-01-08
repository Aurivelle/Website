const mongoose = require("mongoose");

const DailyChallengeSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model("DailyChallenge", DailyChallengeSchema);
