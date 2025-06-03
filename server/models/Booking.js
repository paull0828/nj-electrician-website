const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    service: String,
    description: String,
    preferredDate: String,
    photo: String, // filename of uploaded image
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
