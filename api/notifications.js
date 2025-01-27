const notifications = [
  {
    message: "Welcome to Cat's Algorithm!",
    link: null,
    createdAt: new Date().toISOString(),
  },
];

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "GET") {
    res.status(200).json(notifications); // 回傳通知
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
};
