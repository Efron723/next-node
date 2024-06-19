// index.js 已經 import 過，這邊不會再 import 一次，
// 只會把參照丟過來，所以不會造成佔用記憶體
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("admin2 root");
});

router.get("/:p1?/:p2?", (req, res) => {
  const { p1, p2 } = req.params;
  const { url, baseUrl, originalUrl } = req;

  res.json({ url, baseUrl, originalUrl, p1, p2 });
});

export default router;
