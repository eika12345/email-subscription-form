require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const BREVO_KEY = process.env.BREVO_API_KEY;

app.use(bodyParser.json());

// allow requests from anywhere
app.use(cors());

// health check
app.get("/", (req, res) => {
  res.send("Server is running. Use POST /api/subscribe to add contacts.");
});

// subscribe route
app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email,
        listIds: [your_list_id_here], // replace with your actual list ID
        updateEnabled: true
      })
    });

    // try to parse JSON safely
    let data;
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    }

    if (!response.ok) {
      // check if email already exists
      if (response.status === 400 && data?.code === "duplicate_parameter" || data?.message?.includes("already exists")) {
        return res.status(400).json({ error: "This email is already subscribed." });
      }

      return res.status(response.status).json({ error: data || "Unknown error from Brevo" });
    }

    // success 
    res.json({ success: true, data });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message || error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

