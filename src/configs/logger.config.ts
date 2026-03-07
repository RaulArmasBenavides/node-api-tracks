import path from 'path';
// import { createLogger, format, transports }  from 'winston';

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const configPathLogs = {
  fileSucces: `${path.join(__dirname, '../logs/logs_success.log')}`,
  fileError: `${path.join(__dirname, '../logs/logs_error.log')}`,
  fileRejection: `${path.join(__dirname, '../logs/logs_access.log')}`,
};

// export const logger = createLogger({
//     levels: logLevels,
//     format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()),
//     transports: [new transports.File({ filename: configPathLogs.fileSucces })],
//     exceptionHandlers: [new transports.File({ filename: configPathLogs.fileError })],
//     rejectionHandlers: [new transports.File({ filename: configPathLogs.fileRejection })],
// });
