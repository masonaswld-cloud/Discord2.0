
const express = require("express");
const { DateTime } = require("luxon");

const app = express();
const PORT = process.env.PORT || 3000;
const TIMEZONE = "America/New_York";

app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "Timestamp API",
    timezone: TIMEZONE,
    format: "DD/MM/YY/HH:MM"
  });
});

app.get("/timestamp", (req, res) => {
  let input = req.query.date || req.query.input || "";

  if (Array.isArray(input)) input = input[0];

  input = String(input).trim();

  const date = DateTime.fromFormat(
    input,
    "dd/MM/yy/HH:mm",
    { zone: TIMEZONE, locale: "en-GB" }
  );

  if (!date.isValid) {
    return res.status(200).json({
      entered_date: input,
      actual_date: input,
      timestamp: null,
      timezone: TIMEZONE,
      message: "Enter a date in DD/MM/YY/HH:MM format."
    });
  }

  const timestamp = Math.floor(date.toSeconds());

  return res.status(200).json({
    entered_date: input,
    actual_date: date.toFormat("dd/MM/yy HH:mm"),
    timestamp: timestamp,
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
