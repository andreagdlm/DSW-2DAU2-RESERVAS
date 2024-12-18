const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ["single", "double", "suite"] },
  pricePerNight: Number,
  features: [String],
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model("Room", RoomSchema);
