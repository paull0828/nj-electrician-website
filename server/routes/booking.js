const express = require("express");
const router = express.Router();
const multer = require("multer");
const Booking = require("../models/Booking");

// Multer config for photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

// POST /api/bookings
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { service, description, preferredDate, name, phone } = req.body;
    const photo = req.file ? req.file.filename : null;

    const booking = new Booking({
      service,
      description,
      preferredDate,
      name,
      phone,
      photo,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking successful",
      photo: photo,
    });
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

module.exports = router;
