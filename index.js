const express = require('express');
const app = express();

function getNewYorkParts(date) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/New_York',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const values = {};

  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  }

  return {
    day: values.day,
    month: values.month,
    year: values.year,
    hour: values.hour,
    minute: values.minute
  };
}

function getUnixNY(date) {
  return Math.floor(
    new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' })).getTime() / 1000
  );
}

app.get('/api/option_date', (req, res) => {
  const now = new Date();
  const ny = getNewYorkParts(now);

  const option_date = `${ny.day}/${ny.month}/${ny.year}/${ny.hour}:${ny.minute}`;
  const option_time = `${ny.hour}:${ny.minute}`;
  const option_datetime = `${ny.day}/${ny.month}/${ny.year} ${ny.hour}:${ny.minute}`;
  const option_date_only = `${ny.day}/${ny.month}/${ny.year}`;

  res.json({
    option_date,
    option_time,
    option_datetime,
    option_date_only,
    unix: getUnixNY(now)
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Timestamp API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
