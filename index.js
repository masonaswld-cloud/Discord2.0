const express = require('express');
const app = express();

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes}${ampm}`;
}

function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`;
}

// Single combined response
app.get('/api/option_date', (req, res) => {
  const now = new Date();

  res.json({
    option_date: formatDate(now),
    option_time: formatTime(now),
    option_datetime: formatDateTime(now),
    unix: Math.floor(now.getTime() / 1000)
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Timestamp API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
