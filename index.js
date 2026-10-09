const express = require("express");
const app = express();

const PORT = process.env.PORT || 10000;
const TZ = "America/New_York";

function parseDate(input) {
  const m = String(input).match(
    /^(
\d{2})\/(\d{2})\/(\d{2})\/(\d{2}):(\d{2})$/
  );
  if (!m) return null;

  const [, d, mo, y, h, mi] = m;
  const year = 2000 + +y;

  const temp = new Date(Date.UTC(year, +mo - 1, +d, +h, +mi));

  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "shortOffset"
  }).formatToParts(temp)
    .find(x => x.type === "timeZoneName")?.value || "GMT-5";

  const hours = offset.includes("-04") ? -4 : -5;
  const date = new Date(Date.UTC(
    year, +mo - 1, +d, +h - hours, +mi
  ));

  return isNaN(date) ? null : date;
}

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Timestamp API",
    timezone: TZ,
    format: "DD/MM/YY/HH:MM"
  });
});

app.get("/timestamp", (req, res) => {
  const input = Array.isArray(req.query.date)
    ? req.query.date[0]
    : String(req.query.date || "").trim();

  const date = parseDate(input);

  if (!date || !input) {
    return res.status(200).json({
      entered_date: input,
      actual_date: "",
      timestamp: null,
      timezone: TZ,
      message: "Enter a date in DD/MM/YY/HH:MM format."
    });
  }

  const timestamp = Math.floor(date.getTime() / 1000);

  const actual = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date).replace(",", "");

  res.json({
    entered_date: input,
    actual_date: actual,
    timestamp,
    timezone: TZ,
    message: "Timestamp created successfully.",
    discord: {
      time: `<t:${timestamp}:t>`,
      date: `<t:${timestamp}:D>`,
      full: `<t:${timestamp}:F>`,
      relative: `<t:${timestamp}:R>`
    }
  });
});

app.listen(PORT, () => {
  console.log(`Timestamp API running on port ${PORT}`);
});
