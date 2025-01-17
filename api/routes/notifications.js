const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const notificationFile = path.join(__dirname, "../../notifications.json");

router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(notificationFile, "utf-8");
    const notifications = JSON.parse(data);
    res.status(200).json(notifications);
  } catch (err) {
    console.error("❌ Error reading notifications:", err);
    res.status(500).json({ message: "Failed to read notifications" });
  }
});

router.post("/", (req, res) => {
  try {
    const { message, link } = req.body;
    const newNotification = {
      message,
      link: link || null,
      createdAt: newDate().toISOString(),
    };
    const data = fs.readFileSync(notificationsFile, "utf-8");
    const notifications = JSON.parse(data);
    notifications.push(newNotification);

    fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2));
    res.status(200).json({ message: "Notification added successfully!" });
  } catch (err) {
    console.error("❌ Error adding notification:", err);
    res.status(500).json({ message: "Failed to add notification" });
  }
});
module.exports = router;
