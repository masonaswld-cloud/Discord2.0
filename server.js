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
  try {
    let date = req.query.date;

    if (!date) {
      return res.status(400).json({
        error: "Missing date",
        expected: "DD/MM/YY/HH:MM"
      });
    }

    date = String(date).trim();

    const match = date.match(
      /^(\d{2})\/(\d{2})\/(\d{2})\/(\d{2}):(\d{2})$/
    );

    if (!match) {
      return res.status(400).json({
        error: "Use DD/MM/YY/HH:MM",
        received: date
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

    res.json({
      timestamp: Math.floor(dateTime.toSeconds())
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Timestamp API running on port ${PORT}`);
});
