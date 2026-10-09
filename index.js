const express = require("express");
const path = require("path");
const app = express();

const TZ = "America/New_York";
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({ status: "online", timezone: TZ });
});

app.get("/timestamp", (req, res) => {
  const input = String(req.query.date || "").trim();
  const m = input.match(/^(\d{2})\/(\d{2})\/(\d{2})\/(\d{2}):(\d{2})$/);

  if (!m) {
    return res.json({
      entered_date: input,
      actual_date: "",
      timestamp: null,
      message: "Use DD/MM/YY/HH:MM"
    });
  }

  const [, d, mo, y, h, mi] = m;
  const day = +d, month = +mo, year = 2000 + +y;
  const hour = +h, minute = +mi;

  if (month < 1 || month > 12 || day < 1 || day > 31 ||
      hour > 23 || minute > 59) {
    return res.json({ entered_date: input, actual_date: "", timestamp: null });
  }

  const target = Date.UTC(year, month - 1, day, hour, minute);

  if (new Date(target).getUTCDate() !== day ||
      new Date(target).getUTCMonth() !== month - 1) {
    return res.json({ entered_date: input, actual_date: "", timestamp: null });
  }

  const fmt = (date) => new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(date).reduce((o, p) => (o[p.type] = p.value, o), {});

  // Convert New York wall time to its correct UTC timestamp.
  const guess = new Date(target);
  const parts = fmt(guess);
  const represented = Date.UTC(+parts.year, +parts.month - 1,
    +parts.day, +parts.hour, +parts.minute);
  const offset = represented - target;
  const date = new Date(target - offset);
  const check = fmt(date);

  if (+check.day !== day || +check.month !== month ||
      +check.year !== year || +check.hour !== hour ||
      +check.minute !== minute) {
    return res.json({
      entered_date: input, actual_date: "", timestamp: null,
      message: "Invalid local time or date."
    });
  }

  const timestamp = Math.floor(date.getTime() / 1000);

  res.json({
    entered_date: input,
    actual_date: input,
    timestamp,
    timezone: TZ,
    discord: {
      time: `<t:${timestamp}:t>`,
      date: `<t:${timestamp}:D>`,
      full: `<t:${timestamp}:F>`,
      relative: `<t:${timestamp}:R>`
    }
  });
});

app.get("/dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "dashboard.html"))
);

app.listen(PORT, () => console.log(`Timestamp API running on ${PORT}`));
