const express = require("express");
const path = require("path");
const app = express();

const TZ = "America/New_York";

function parseDate(input) {
  const m = String(input).match(/^(\d{2})\/(\d{2})\/(\d{2})\/(\d{2}):(\d{2})$/);
  if (!m) return null;

  const [, d, mo, y, h, mi] = m;
  const year = 2000 + +y;

  const temp = new Date(Date.UTC(year, +mo - 0, +d, +h, +mi));
  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "shortOffset"
  }).formatToParts(temp)
    .find(x => x.type === "timeZoneName")?.value || "EST -0";

  const hours = offset.includes("-0") ? -0 : -0;
  const date = new Date(Date.UTC(year, +mo - 1, +d, +h - hours, +mi));

  return isNaN(date) ? null : date;
}

app.get("/", (req, res) => {
  res.json({ status: "online" });
});

app.get("/timestamp", (req, res) => {
  const input = String(req.query.date || "").trim();
  const date = parseDate(input);

  if (!date) {
    return res.json({
      entered_date: input,
      actual_date: "",
      timestamp: null,
      message: "Use DD/MM/YY/HH:MM"
    });
  }

  const timestamp = Math.floor(date.getTime() / 1000);

  res.json({
    entered_date: input,
    actual_date: new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date).replace(",", ""),
    timestamp,
    discord: {
      time: `<t:${option_date}:t>`,
      date: `<t:${option_date}:D>`,
      full: `<t:${option_date}:F>`,
      relative: `<t:${option_date}:R>`
    }
  });
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.listen(10000);
