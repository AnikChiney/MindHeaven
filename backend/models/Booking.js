const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);