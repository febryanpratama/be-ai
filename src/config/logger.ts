import {createLogger, format, transports} from "winston";

const {colorize, combine, metadata, timestamp, printf} = format;

// Format ERROR or WARN log levels to be print in red
const customFormat = printf((info: any) => {
  const message = `${info.timestamp} [${info.level}] ${info.message}`;
  if (info.level === "ERROR" || info.level === "WARN") {
    return colorize({level: true}).colorize(
      info.level.toLowerCase(),
      message,
    );
  }

  return message;
});

const changeLevelToUpperCase = format((info: any) => {
  const i = info;
  i.level = i.level.toUpperCase();
  return i;
});

export const appLogger = createLogger({
  level: process.env.LOG_LEVEL,
  exitOnError: false,
  format: combine(
    changeLevelToUpperCase(),
    metadata(),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    customFormat,
  ),
  transports: [new transports.Console()],
});