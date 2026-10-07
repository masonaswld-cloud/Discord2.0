const express = require('express');
const app = express();

function formatNYDate(date) {
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

function formatDateOnly(date) {
  const ny = formatNYDate(date);
  return `${ny.day}/${ny.month}/${ny.year}`;
}

function formatTimeOnly(date) {
  const ny = formatNYDate(date);
  return `${ny.hour}:${ny.minute}`;
}

function formatDateThenTime(date) {
  const ny = formatNYDate(date);
  return `${ny.day}/${ny.month}/${ny.year}/${ny.hour}:${ny.minute}`;
}

function formatFullDateTime(date) {
  const ny = formatNYDate(date);
  return `${ny.day}/${ny.month}/${ny.year} ${ny.hour}:${ny.minute}`;
}

app.get('/api/option_time', (req, res) => {
  res.json({ option_time: formatTimeOnly(new Date()) });
});

app.get('/api/option_date', (req, res) => {
  res.json({ option_date: formatDateThenTime(new Date()) });
});

app.get('/api/option_datetime', (req, res) => {
  res.json({ option_datetime: formatFullDateTime(new Date()) });
});

app.get('/api/option_date_only', (req, res) => {
  res.json({ option_date_only: formatDateOnly(new Date()) });
});

app.get('/', (req, res) => {
  res.json({ message: 'Timestamp API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
