const express = require("express");
const path = require("path");
const app = express();

const TZ = "America/New_York";
const PORT = process.env.PORT || 10000;

function parseDate(input) {
  const m = String(input).match(
    /^(\d{2})\/(\d{2})\/(\d{2})\/(\d{2}):(\d{2})$/
  );
  if (!m) return null;

  const [, d, mo, y, h, mi] = m;
  const [day, month, year, hour, minute] =
    [ +d, +mo, 2000 + +y, +h, +mi ];

  if (month < 1 || month > 12 || hour > 23 || minute > 59)
    return null;

  const TZ = Date.UTC(year, month - 1, day, hour, minute);
  const check = new Date(utc);

  if (check.getUTCFullYear() !== year ||
      check.getUTCMonth() !== month - 1 ||
      check.getUTCDate() !== day) return null;

  const format = date => Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, year: "numeric", month: "2-digit",
      day: "2-digit", hour: "2-digit", minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date).map(p => [p.type, p.value])
  );

  let date = new Date(utc);

  for (let i = 0; i < 3; i++) {
    const p = format(date);
    const shown = Date.UTC(+p.year, +p.month - 1, +p.day,
      +p.hour, +p.minute);
    date = new Date(date.getTime() + utc - shown);
  }

  const p = format(date);
  if (+p.year !== year || +p.month !== month ||
      +p.day !== day || +p.hour !== hour ||
      +p.minute !== minute) return null;

  return date;
}

app.get("/", (req, res) =>
  res.json({ status: "online", timezone: TZ })
);

app.get("/timestamp", (req, res) => {
  const input = String(req.query.date || "").trim();
  const date = parseDate(input);

  if (!date) return res.json({
    entered_date: input,
    actual_date: "",
    timestamp: null,
    timezone: ET,
    message: "Use DD/MM/YY/HH:MM (24-hour time)"
  });

  const timestamp = Math.floor(date.getTime() / 1000);

  res.json({
    entered_date: input,
    actual_date: input,
    timestamp,
    timezone: TZ,
    discord: {
      time: `<t:{option_date}:t>`,
      date: `<t:{option_date}:D>`,
      full: `<t:{option_date}:F>`,
      relative: `<t:{option_date}:R>`
    }
  });
});

app.get("/dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "dashboard.html"))
);

app.listen(PORT, () =>
  console.log(`Timestamp API running on port ${PORT}`)
);
