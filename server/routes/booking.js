const express = require("express");
const router = express.Router();
const multer = require("multer");
const Booking = require("../models/Booking");

// Set up multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const newBooking = new Booking({
      name: req.body.name,
      phone: req.body.phone,
      service: req.body.service,
      description: req.body.description,
      preferredDate: req.body.preferredDate,
      photo: req.file ? req.file.filename : null,
    });

    await newBooking.save();
    res.json({ message: "Booking submitted successfully!" });
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

module.exports = router;
