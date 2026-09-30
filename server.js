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

  const fullYear = 2000 + Number(year);

  // Virginia = America/New_York
  const localDate = new Date(
    `${fullYear}-${month}-${day}T${hour}:${minute}:00`
  );

  // Get the Eastern Time offset automatically
  const easternFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "longOffset"
  });

  const parts = easternFormatter.formatToParts(localDate);
  const offsetPart = parts.find(
    part => part.type === "timeZoneName"
  );

  const offset = offsetPart.value
    .replace("GMT", "")
    .replace(":", "");

  const sign = offset.startsWith("-") ? -1 : 1;
  const cleanOffset = offset.replace("+", "").replace("-", "");

  const [offsetHours, offsetMinutes = "00"] = cleanOffset.split("");

  const offsetInMinutes =
    sign *
    (
      Number(cleanOffset.slice(0, 2)) * 60 +
      Number(cleanOffset.slice(2, 4) || 0)
    );

  const utcTimestamp = Math.floor(
    (
      Date.UTC(
        fullYear,
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
      ) -
      offsetInMinutes * 60 * 1000
    ) / 1000
  );

  res.json({
    timestamp: utcTimestamp
  });
});

app.listen(PORT, () => {
  console.log(`Timestamp API running on port ${PORT}`);
});
