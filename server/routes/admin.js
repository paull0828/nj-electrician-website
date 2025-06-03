const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Demo admin credentials — for production, store in .env or database
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123";

/**
 * POST /api/admin/login
 * Logs in admin with hardcoded credentials and sets session
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    return res.json({ message: "✅ Login successful" });
  } else {
    return res.status(401).json({ message: "❌ Invalid credentials" });
  }
});

/**
 * GET /api/admin/logout
 * Logs out admin by destroying session
 */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    return res.json({ message: "👋 Logged out successfully" });
  });
});

/**
 * Middleware: Checks if admin is logged in
 */
function requireAuth(req, res, next) {
  if (req.session?.loggedIn) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized. Please log in." });
  }
}

/**
 * GET /api/admin
 * Protected route to fetch all bookings
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Server error while fetching bookings" });
  }
});

module.exports = router;
