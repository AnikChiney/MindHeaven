const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");
const Therapist = require("../models/Therapist");

const router = express.Router();


// ✅ 1. Create a new booking
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { therapist, date, time, notes } = req.body;

    // Check if therapist exists
    const therapistExists = await Therapist.findById(therapist);
    if (!therapistExists) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    // Create booking
    const newBooking = new Booking({
      user: req.user.id,
      therapist,
      date,
      time,
      notes,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking request submitted successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ 2. Get all bookings for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("therapist", "name specialization email contact")
      .sort({ date: 1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ 3. Cancel a booking
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ 4. (Optional) Admin: Get all bookings
router.get("/all", async (req, res) => {
  try {
    const allBookings = await Booking.find()
      .populate("user", "name email")
      .populate("therapist", "name specialization email")
      .sort({ date: 1 });

    res.json(allBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;