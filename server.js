const express = require("express");
const { DateTime } = require("luxon");

const app = express();

const PORT = process.env.PORT || 10000;
const TIMEZONE = "America/New_York";

// ===============================
// HOME
// ===============================
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Timestamp API",
    timezone: TIMEZONE,
    format: "DD/MM/YY/HH:MM"
  });
});

// ===============================
// TIMESTAMP API
// ===============================
app.get("/timestamp", (req, res) => {

  // Value sent by BotGhost:
  // ?date={option_date}
  let input = req.query.date;

  // If something unusual sends multiple values,
  // use the first one.
  if (Array.isArray(input)) {
    input = input[0];
  }

  // Convert to string safely
  input = String(input || "").trim();

  // ===============================
  // MISSING DATE
  // ===============================
  if (!input || input === "{option_date}") {
    return res.status(200).json({
      entered_date: input,
      actual_date: "",
      timestamp: null,
      timezone: TIMEZONE,
      message: "Enter a date in DD/MM/YY/HH:MM format."
    });
  }

  // ===============================
  // CHECK FORMAT
  // DD/MM/YY/HH:MM
  // ===============================
  const formatCheck =
    /^(\d{2})\/(\d{2})\/(\d{2})\/(\d{2}):(\d{2})$/;

  if (!formatCheck.test(input)) {
    return res.status(200).json({
      entered_date: input,
      actual_date: "",
      timestamp: null,
      timezone: TIMEZONE,
      message: "Invalid format. Use DD/MM/YY/HH:MM."
    });
  }

  // ===============================
  // CONVERT TO VIRGINIA TIME
  // ===============================
  const date = DateTime.fromFormat(
    input,
    "dd/MM/yy/HH:mm",
    {
      zone: TIMEZONE
    }
  );

  // ===============================
  // INVALID DATE
  // ===============================
  if (!date.isValid) {
    return res.status(200).json({
      entered_date: input,
      actual_date: "",
      timestamp: null,
      timezone: TIMEZONE,
      message: "Invalid date or time."
    });
  }

  // ===============================
  // UNIX TIMESTAMP
  // ===============================
  const timestamp = Math.floor(date.toSeconds());

  // ===============================
  // RESPONSE
  // ===============================
  return res.status(200).json({
    entered_date: input,

    actual_date: date.toFormat("dd/MM/yy/HH:mm"),

    timestamp: timestamp,

    timezone: TIMEZONE,

    message: "Timestamp created successfully.",

    discord: {
      time: `<t:${timestamp}:t>`,
      date: `<t:${timestamp}:D>`,
      full: `<t:${timestamp}:F>`,
      relative: `<t:${timestamp}:R>`
    }
  });
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`Timestamp API running on port ${PORT}`);
  console.log(`Timezone: ${TIMEZONE}`);
  console.log(`Format: DD/MM/YY/HH:MM`);
});

 Render "package.json" still has both "express" and "luxon" installed.
