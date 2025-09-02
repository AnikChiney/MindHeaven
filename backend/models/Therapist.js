
const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String, required: true }, 
  experience: { type: Number, required: true }, 
  languages: [{ type: String }], 
  ageGroups: [{ type: String, enum: ["child", "teen", "adult", "senior"] }],
  availableSlots: [
    {
      date: String,
      time: String,
      isBooked: { type: Boolean, default: false },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Therapist", therapistSchema);