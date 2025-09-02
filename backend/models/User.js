
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    
    required : true ,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
  ageGroup: {
    type: String,
    enum: ["child", "teen", "adult", "senior"],
    required: true,
  },
  preferredLanguage: {
    type: String,
    default: "English",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);