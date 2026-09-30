const express = require("express");
const { DateTime } = require("luxon");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Timestamp API is running"
  });
});

app.get("/timestamp", (req, res) => {
  const input = String(req.query.date || "").trim();

  if (!input) {
    return res.status(400).json({
      error: "Missing date",
      expected: "DD/MM/YY/HH:MM"
    });
  }

  const match = input.match(
    /^(\d{2})\/(\d{2})\/(\d{2})\/(\d{2}):(\d{2})$/
  );

  if (!match) {
    return res.status(400).json({
      error: "Use DD/MM/YY/HH:MM",
      received: input
    });
  }

  const [, day, month, year, hour, minute] = match;

  const dateTime = DateTime.fromObject(
    {
      year: 2000 + Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour),
      minute: Number(minute)
    },
    {
      zone: "America/New_York"
    }
  );

  if (!dateTime.isValid) {
    return res.status(400).json({
      error: "Invalid date or time",
      details: dateTime.invalidReason
    });
  }

  return res.json({
    timestamp: Math.floor(dateTime.toSeconds())
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Timestamp API running on port ${PORT}`);
});
