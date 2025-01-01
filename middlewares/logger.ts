import { join } from "path";

const { createLogger, format, transports } = require("winston");
export default createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "DD-MM-YYY HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: join(__dirname, "..", "app.log") }), // Logları app.log dosyasına yaz
    new transports.Console({ format: format.combine(format.colorize()) }), // Konsola loglama
  ],
});
