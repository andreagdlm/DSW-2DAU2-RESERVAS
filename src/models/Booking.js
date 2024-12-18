const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  startDate: Date,
  endDate: Date,
  nights: Number,
  totalPrice: Number,
  status: { type: String, enum: ["pending", "confirmed", "cancelled"] },
});

module.exports = mongoose.model("Booking", BookingSchema);
