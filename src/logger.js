
const fs = require('fs');

function loggerMiddleware(req, res, next) {
  const logEntry = `${getFormattedTimestamp()} [${req.method}] [${res.statusCode}] ${req.originalUrl}\n`;

  fs.appendFile('access_log.txt', logEntry, (err) => {
    if (err) {
      console.error(`Error al escribir en el registro: ${err}`);
    }
  });

  next();
}

function getFormattedTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

module.exports = loggerMiddleware;