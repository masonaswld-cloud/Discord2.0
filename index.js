const express = require('express');
const app = express();

// Endpoint 1: Get current date
app.get('/api/date', (req, res) => {
  res.json({
    date: new Date().toISOString().split('T')[0]
  });
});

// Endpoint 2: Get current time
app.get('/api/time', (req, res) => {
  res.json({
    time: new Date().toTimeString().split(' ')[0]
  });
});

// Endpoint 3: Get date and time
app.get('/api/datetime', (req, res) => {
  res.json({
    dateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
  });
});

// Endpoint 4: Get Unix timestamp
app.get('/api/timestamp', (req, res) => {
  res.json({
    unix: Math.floor(Date.now() / 1000)
  });
});

// Endpoint 5: Convert Unix to DateTime
app.get('/api/convert/unix/:unix', (req, res) => {
  const unix = parseInt(req.params.unix);
  if (isNaN(unix)) {
    return res.status(400).json({ error: 'Invalid Unix timestamp' });
  }
  res.json({
    unix: unix,
    dateTime: new Date(unix * 1000).toISOString()
  });
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Timestamp API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
