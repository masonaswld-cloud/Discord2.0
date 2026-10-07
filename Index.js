const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/date', (req, res) => {
  res.json({ date: new Date().toISOString().split('T')[0] });
});

app.get('/api/time', (req, res) => {
  res.json({ time: new Date().toTimeString().split(' ')[0] });
});

app.get('/api/datetime', (req, res) => {
  res.json({ datetime: new Date().toISOString() });
});

app.get('/api/timestamp', (req, res) => {
  res.json({ unix: Math.floor(Date.now() / 1000) });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
