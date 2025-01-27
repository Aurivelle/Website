const express = require("express");
const router = express.Router();
const dailyChallengeRoutes = require("./dailyChallenge");
const notificationsRoutes = require("./notifications");
const postsRoutes = require("./posts");

router.use("/daily-challenges", dailyChallengeRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/posts", postsRoutes);

module.exports = router;
