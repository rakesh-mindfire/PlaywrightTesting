// logger.js
import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Function to clear log files
export function clearLogFiles() {
  const logFiles = ['combined.log', 'error.log'];
  logFiles.forEach(file => {
    const filePath = path.join(logDir, file);
    if (fs.existsSync(filePath)) {
      fs.truncateSync(filePath, 0);
    }
  });
}

// Store browser name
let currentBrowserName = '';

// Function to set the browser name
export function setBrowserName(browserName) {
  currentBrowserName = browserName || '';
}

// Custom log format
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  const browser = currentBrowserName ? `[${currentBrowserName}]` : '';
  return `${timestamp} [${level.toUpperCase()}]${browser}: ${message}${stack ? ` - ${stack}` : ''}`;
});

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info',
      tailable: false,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      tailable: false,
    }),
  ],
});

// Export logger methods
export default {
  info: (message) => logger.info(message),
  error: (message) => logger.error(message),
  warn: (message) => logger.warn(message),
  debug: (message) => logger.debug(message),
};