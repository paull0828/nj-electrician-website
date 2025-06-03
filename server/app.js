const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const path = require("path");

const adminRoutes = require("./routes/admin");
const bookingRoutes = require("./routes/booking");

dotenv.config();

const app = express();

// Session middleware FIRST
app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
      sameSite: "lax",
      secure: false,
    },
  })
);

// CORS middleware AFTER session
app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"], // When you serve HTML via express
    credentials: true,
  })
);

// Built-in body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
