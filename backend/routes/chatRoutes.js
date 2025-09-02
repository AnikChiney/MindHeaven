const express = require("express");
const axios = require("axios");
const router = express.Router();

// ✅ Using free OpenRouter (Smart API) model
const SMART_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const SMART_API_KEY = process.env.SMART_API_KEY || "free"; // Optional

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      SMART_API_URL,
      {
        model: "openai/gpt-3.5-turbo", // Free-tier available via OpenRouter
        messages: [
          {
            role: "system",
            content:
              "You are Anik, a supportive mental health assistant. Be kind, empathetic, and encourage professional help if needed.",
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SMART_API_KEY}`,
        },
      }
    );

    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Smart API Error:", error.response?.data || error.message);
    res.status(500).json({
      reply:
        "⚠ Anik is unavailable at the moment. Please try again later or reach out to a helpline if you need urgent help.",
    });
  }
});

module.exports = router;