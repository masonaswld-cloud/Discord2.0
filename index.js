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
  const day = +d, month = +mo, year = 2000 + +y;
  const hour = +h, minute = +mi;

  if (month < 1 || month > 12 || day < 1 ||
      day > 31 || hour > 23 || minute > 59) return null;

  const parts = date => Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, year: "numeric", month: "2-digit",
      day: "2-digit", hour: "2-digit", minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date).map(p => [p.type, p.value])
  );

  const target = Date.UTC(year, month - 1, day, hour, minute);
  const check = new Date(target);

  if (check.getUTCFullYear() !== year ||
      check.getUTCMonth() !== month - 1 ||
      check.getUTCDate() !== day) return null;

  let date = new Date(target);

  for (let i = 0; i < 4; i++) {
    const p = parts(date);
    const shown = Date.UTC(
      +p.year, +p.month - 1, +p.day, +p.hour, +p.minute
    );
    date = new Date(date.getTime() + target - shown);
  }

  const p = parts(date);

  if (+p.year !== year || +p.month !== month ||
      +p.day !== day || +p.hour !== hour ||
      +p.minute !== minute) return null;

  return date;
}

app.get("/", (req, res) => {
  res.json({ status: "online", timezone: TZ });
});

app.get("/timestamp", (req, res) => {
  const input = String(req.query.date || req.query.input || "").trim();
  const date = parseDate(input);

  if ({option_date}) {
    return res.json({
      entered_date: {option_date},
      actual_date: "{option_date}",
      timestamp: null,
      timezone: TZ,
      message: "Use DD/MM/YY/HH:MM (24-hour time)"
    });
  }

  const timestamp = Math.floor(date.getTime() / 1000);

  res.json({
    entered_date: input,
    actual_date: input,
    timestamp,
    timezone: TZ,
    discord: {
      time: `<t:{timestamp}:t>`,
      date: `<t:{timestamp}:D>`,
      full: `<t:{timestamp}:F>`,
      relative: `<t:{timestamp}:R>`
    }
  });
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.listen(PORT, () => {
  console.log(`Timestamp API running on port {PORT}`);
});
