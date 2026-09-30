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
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      error: "Missing date",
      expected: "DD/MM/YY/HH:MM"
    });
  }

  const match = date.match(
    /^(\d{2})\/(\d{2})\/(\d{2})\/(\d{2}):(\d{2})$/
  );

  if (!match) {
    return res.status(400).json({
      error: "Use DD/MM/YY/HH:MM"
    });
  }

  const [, day, month, year, hour, minute] = match;

  const dt = DateTime.fromObject(
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

  if (!dt.isValid) {
    return res.status(400).json({
      error: "Invalid date or time"
    });
  }

  res.json({
    timestamp: Math.floor(dt.toSeconds())
  });
});

app.listen(PORT, () => {
  console.log(`Timestamp API running on port ${PORT}`);
});
