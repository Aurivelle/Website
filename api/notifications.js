const express = require("express");
const router = express.Router();

const notifications = [
  {
    message: "Welcome to Cat's Algorithm!",
    link: null,
    createdAt: new Date().toISOString(),
  },
];

router.get("/", (req, res) => {
  res.json(notifications);
});

module.exports = router;
