const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// ENV variables (SAFE)
const PIXEL_ID = process.env.PIXEL_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// CAPI Route
app.get("/lead", async (req, res) => {

  // fallback event id
  const eventId = req.query.event_id || ('evt_' + Date.now());

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`,
      {
   data: [
  {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_id: eventId,

    event_source_url: req.headers.referer || "",

    user_data: {
      client_ip_address: req.ip,
      client_user_agent: req.headers['user-agent']
    }

    // test_event_code: "TEST12345" // optional
  }
]
      },
      {
        params: {
          access_token: ACCESS_TOKEN
        }
      }
    );

    console.log("✅ Lead Event Sent:", eventId);
    res.sendStatus(200);

  } catch (error) {
    console.log("❌ Error:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// Start server
app.listen(5000, () => {
  console.log("🔥 Server running on http://localhost:5000");
});