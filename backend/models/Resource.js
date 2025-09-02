const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["article", "video", "audio", "activity"],
    required: true
  },
  ageGroups: [{ type: String, enum: ["child", "teen", "adult", "senior"] }],
  url: { type: String, required: true }, 
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Resource", resourceSchema);