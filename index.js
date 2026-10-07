const express = require('express');
const app = express();

function getNewYorkDate(date) {
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

app.get('/api/option_date', (req, res) => {
  const now = new Date();
  const ny = getNewYorkDate(now);

  const optionDate = `${ny.day}/${ny.month}/${ny.year}/${ny.hour}:${ny.minute}`;

  res.json({
    option_date: optionDate
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Timestamp API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
