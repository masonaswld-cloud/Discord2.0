const express = require("express");

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
      expected: "DD/MM/YY/TT"
    });
  }

  const match = date.match(
    /^(\d{2})\/(\d{2})\/(\d{2})\/(\d{2}):(\d{2})$/
  );

  if (!match) {
    return res.status(400).json({
      error: "Use DD/MM/YY/TT"
    });
  }

  const [, day, month, year, hour, minute] = match;

  const timestamp = Math.floor(
    Date.UTC(
      2000 + Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    ) / 1000
  );

  res.json({
    timestamp
  });
});

app.listen(PORT, () => {
  console.log(`Timestamp API running on port ${PORT}`);
});
