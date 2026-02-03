const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const supabase = require("../utils/supabaseClient");

// Auth API
router.post("/login", async (req, res) => {
  const { id, password } = req.body; // id maps to username in DB

  try {
    // 1. Find user by username (id)
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", id)
      .limit(1);

    if (error) throw error;

    if (!users || users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      message: "Login successful",
      result: {
        token,
        userName: user.name || user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/token", (req, res) => {
  res.json({ message: "Issue a new token" });
});
router.post("/refresh", (req, res) => {
  res.json({ message: "Refresh a token" });
});

module.exports = router;
