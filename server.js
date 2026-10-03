
app.get("/timestamp", (req, res) => {
  const input = String(req.query.date || req.query.input || "").trim();

  const date = DateTime.fromFormat(
    input,
    "dd/MM/yy/HH:mm",
    { zone: "America/New_York", locale: "en-GB" }
  );

  const timestamp = date.isValid
    ? Math.floor(date.toSeconds())
    : null;

  return res.status(200).json({
    entered_date: input,
    actual_date: date.isValid
      ? date.toFormat("dd/MM/yy HH:mm")
      : input,
    timestamp: timestamp,
    timezone: "America/New_York",
    discord: date.isValid ? {
      time: `<t:${timestamp}:t>`,
      date: `<t:${timestamp}:D>`,
      full: `<t:${timestamp}:F>`,
      relative: `<t:${timestamp}:R>`
    } : null
  });
});
