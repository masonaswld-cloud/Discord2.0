
const express = require("express");
const { DateTime } = require("luxon");

const app = express();
const PORT = process.env.PORT || 3000;
const TIMEZONE = "America/New_York";

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Timestamp API",
    timezone: TIMEZONE,
    format: "DD/MM/YY/HH:MM"
  });
});

app.get("/timestamp", (req, res) => {
  let input = req.query.date || req.query.input;

  if (Array.isArray(input)) input = input[0];

  if (typeof input !== "string" || !input.trim()) {
    return res.json({
      error: "Please enter a date in DD/MM/YY/HH:MM format."
    });
  }

  const date = DateTime.fromFormat(
    input.trim(),
    "dd/MM/yy/HH:mm",
    { zone: TIMEZONE, locale: "en-GB" }
  );

  if (!date.isValid) {
    return res.json({
      error: "Invalid date. Use DD/MM/YY/HH:MM."
    });
  }

  const timestamp = Math.floor(date.toSeconds());

  return res.json({
    timestamp,
    date: date.toFormat("dd/MM/yy HH:mm"),
    timezone: TIMEZONE,
    discord: {
      time: `<t:${timestamp}:t>`,
      date: `<t:${timestamp}:D>`,
      full: `<t:${timestamp}:F>`,
      relative: `<t:${timestamp}:R>`
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Timestamp API running on port ${PORT}`);
});
