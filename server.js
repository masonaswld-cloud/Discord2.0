const express = require("express");
const { DateTime } = require("luxon");

const app = express();
const PORT = process.env.PORT || 3000;
const TIMEZONE = "America/New_York";

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Timestamp API",
    format: "DD/MM/YY/HH:MM"
  });
});

app.get("/timestamp", (req, res) => {
  let input = req.query.date || req.query.input;

  if (Array.isArray(input)) {
    input = input[0];
  }

  if (typeof input !== "string" || !input.trim()) {
    return res.status(400).json({
      error: "Missing date",
      expected: "DD/MM/YY/HH:MM"
    });
  }

  input = input.trim();

  // Handle BotGhost accidentally sending the same date twice.
  const parts = input.split(",");
  if (parts.every(part => part.trim() === parts[0].trim())) {
    input = parts[0].trim();
  }

  const date = DateTime.fromFormat(
    input,
    "dd/MM/yy/HH:mm",
    { zone: TIMEZONE, locale: "en-GB" }
  );

  if (!date.isValid) {
    return res.status(400).json({
      error: "Invalid date",
      received: input,
      expected: "DD/MM/YY/HH:MM"
    });
  }

  return res.json({
    timestamp: Math.floor(date.toSeconds()),
    date: date.toFormat("dd/MM/yy HH:mm"),
    timezone: TIMEZONE,
    discord: {
      time: `<t:${Math.floor(date.toSeconds())}:t>`,
      date: `<t:${Math.floor(date.toSeconds())}:D>`,
      full: `<t:${Math.floor(date.toSeconds())}:F>`,
      relative: `<t:${Math.floor(date.toSeconds())}:R>`
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Timestamp API running on port ${PORT}`);
});
