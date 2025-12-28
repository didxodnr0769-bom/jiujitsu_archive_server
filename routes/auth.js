const express = require("express");
const router = express.Router();

// Auth API
router.post("/login", (req, res) => {
  // 여기서 로그인 로직 처리
  const { id, password } = req.body;

  // Mock Login
  if (id === "user" && password === "pass") {
    res.json({
      message: "Login successful",
      result: { token: "mock-jwt-token", userName: "admin" },
    });
  } else {
    res.status(404).json({ message: "Invalid credentials" });
  }
});
router.post("/token", (req, res) => {
  res.json({ message: "Issue a new token" });
});
router.post("/refresh", (req, res) => {
  res.json({ message: "Refresh a token" });
});

module.exports = router;
