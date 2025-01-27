const express = require("express");
const router = express.Router();

const dailyChallengeRoutes = require("./dailyChallenge");
const postRoutes = require("./posts");
const notificationRoutes = require("./notifications");

// 將各路由整合
router.use("/daily-challenges", dailyChallengeRoutes);
router.use("/posts", postRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
