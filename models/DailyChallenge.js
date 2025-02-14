const mongoose = require("mongoose");

const DailyChallengeSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true }, // 日期
    title: { type: String, required: true }, // 標題
    description: { type: String, required: true }, // 描述
    link: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v); // 驗證 URL 格式
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"], // 固定難度範圍
      required: false,
    },
    tags: [{ type: String }], // 類別標籤（可選）
  },
  { timestamps: true }, // 自動生成 createdAt 和 updatedAt
);

module.exports = mongoose.model("DailyChallenge", DailyChallengeSchema);
