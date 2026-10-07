// Get current timestamp (milliseconds since Jan 1, 1970)
function getCurrentTimestamp() {
  return Date.now();
}

// Get only the date (YYYY-MM-DD)
function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

// Get only the time (HH:MM:SS)
function getCurrentTime() {
  const date = new Date();
  return date.toTimeString().split(' ')[0];
}

// Get date and time together
function getCurrentDateTime() {
  const date = new Date();
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

// Convert Unix timestamp to readable date-time
function unixToDateTime(unix) {
  return new Date(unix * 1000).toISOString();
}

// Convert date/time string to Unix timestamp
function dateTimeToUnix(dateTime) {
  return Math.floor(new Date(dateTime).getTime() / 1000);
}

module.exports = {
  getCurrentTimestamp,
  getCurrentDate,
  getCurrentTime,
  getCurrentDateTime,
  unixToDateTime,
  dateTimeToUnix
};
