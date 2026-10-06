const express = require("express");
const { DateTime } = require("luxon");

const app = express();

const PORT = process.env.PORT || 10000;
const TIMEZONE = "America/New_York";

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Timestamp API",
    timezone: TIMEZONE,
    format: "DD/MM/YY/HH:MM"
  });
});

app.get("/timestamp", (req, res) => {
  let input = req.query.date;

  if (Array.isArray(input)) {
    input = input[0];
  }

  input = String(input || "").trim();

  if (!input || input === "{option_date}") {
    return res.status(200).json({
      entered_date: input,
      actual_date: "",
      timestamp: null,
      timezone: TIMEZONE,
      message: "Enter a date in DD/MM/YY/HH:MM format."
    });
  }

  // Accept:
  // 5/7/26/5:30
  // 05/07/26/05:30
  const match = input.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{2})\/(\d{1,2}):(\d{2})$/
  );

  if (!match) {
    return res.status(200).json({
      entered_date: input,
      actual_date: "",
      timestamp: null,
      timezone: TIMEZONE,
      message: "Use DD/MM/YY/HH:MM."
    });
  }
