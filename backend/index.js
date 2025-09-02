const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

dotenv.config();
const app = express();

app.use(cors({origin : "http://localhost:3000",credentials : true}));
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/resources", resourceRoutes);

app.get("/", (req, res) => res.send("MindHaven API running"));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));